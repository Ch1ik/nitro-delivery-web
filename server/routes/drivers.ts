import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { randomUUID } from 'crypto';
import { io } from '../index';

const router = Router();

// GET /drivers - List all drivers (admin only)
router.get('/', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const drivers = db.prepare(`
    SELECT d.*, 
           COUNT(da.id) as active_assignments,
           COUNT(CASE WHEN da.status = 'completed' THEN 1 END) as completed_deliveries
    FROM drivers d
    LEFT JOIN driver_assignments da ON d.id = da.driver_id
    WHERE d.is_active = 1
    GROUP BY d.id
    ORDER BY d.created_at DESC
  `).all() as any[];
  
  res.json(drivers);
});

// GET /drivers/:id - Get driver details (admin only)
router.get('/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id) as any;
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  
  // Get active assignments
  const assignments = db.prepare(`
    SELECT da.*, d.id as delivery_id, d.client_name, d.pickup_location, d.status as delivery_status
    FROM driver_assignments da
    JOIN deliveries d ON da.delivery_id = d.id
    WHERE da.driver_id = ? AND da.status IN ('assigned', 'accepted')
    ORDER BY da.assigned_at DESC
  `).all(req.params.id) as any[];
  
  res.json({ ...driver, assignments });
});

// POST /drivers - Create new driver (admin only)
router.post('/', requireAdmin, (req: Request, res: Response) => {
  const { name, phone, email, vehicleType, licensePlate } = req.body;
  
  if (!name || !phone || !vehicleType) {
    return res.status(400).json({ error: 'Name, phone, and vehicle type are required' });
  }
  
  const validVehicles = ['motorcycle', 'car', 'van', 'bicycle'];
  if (!validVehicles.includes(vehicleType)) {
    return res.status(400).json({ error: 'Invalid vehicle type' });
  }
  
  const db = getDb();
  const id = 'driver-' + randomUUID();
  
  try {
    db.prepare(`
      INSERT INTO drivers (id, name, phone, email, vehicle_type, license_plate)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, name, phone, email || null, vehicleType, licensePlate || null);
    
    const driver = db.prepare('SELECT * FROM drivers WHERE id = ?').get(id) as any;
    res.status(201).json(driver);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    throw error;
  }
});

// PATCH /drivers/:id - Update driver (admin only)
router.patch('/:id', requireAdmin, (req: Request, res: Response) => {
  const { name, phone, email, vehicleType, licensePlate, isActive } = req.body;
  const db = getDb();
  
  const existing = db.prepare('SELECT id FROM drivers WHERE id = ?').get(req.params.id) as any;
  if (!existing) return res.status(404).json({ error: 'Driver not found' });
  
  const updates: string[] = [];
  const values: any[] = [];
  
  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
  if (email !== undefined) { updates.push('email = ?'); values.push(email); }
  if (vehicleType !== undefined) { updates.push('vehicle_type = ?'); values.push(vehicleType); }
  if (licensePlate !== undefined) { updates.push('license_plate = ?'); values.push(licensePlate); }
  if (isActive !== undefined) { updates.push('is_active = ?'); values.push(isActive ? 1 : 0); }
  
  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  try {
    values.push(req.params.id);
    db.prepare(`UPDATE drivers SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    const updated = db.prepare('SELECT * FROM drivers WHERE id = ?').get(req.params.id) as any;
    res.json(updated);
  } catch (error: any) {
    if (error.message?.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }
    throw error;
  }
});

// DELETE /drivers/:id - Delete driver (admin only)
router.delete('/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  
  const existing = db.prepare('SELECT id FROM drivers WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Driver not found' });
  
  // Check for active assignments
  const activeAssignments = db.prepare(`
    SELECT COUNT(*) as count FROM driver_assignments 
    WHERE driver_id = ? AND status IN ('assigned', 'accepted')
  `).get(req.params.id) as any;
  
  if (activeAssignments.count > 0) {
    return res.status(400).json({ error: 'Cannot delete driver with active assignments' });
  }
  
  db.prepare('DELETE FROM drivers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// POST /drivers/:id/assign - Assign driver to delivery (admin only)
router.post('/:id/assign', requireAdmin, (req: Request, res: Response) => {
  const { deliveryId } = req.body;
  
  if (!deliveryId) {
    return res.status(400).json({ error: 'Delivery ID is required' });
  }
  
  const db = getDb();
  
  // Check if driver exists and is active
  const driver = db.prepare('SELECT * FROM drivers WHERE id = ? AND is_active = 1').get(req.params.id);
  if (!driver) return res.status(404).json({ error: 'Driver not found or inactive' });
  
  // Check if delivery exists and is in appropriate status
  const delivery = db.prepare('SELECT * FROM deliveries WHERE id = ?').get(deliveryId) as any;
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
  
  if (!['confirmed', 'in_progress'].includes(delivery.status)) {
    return res.status(400).json({ error: 'Delivery must be confirmed or in progress' });
  }
  
  // Check if delivery already has an active assignment
  const existingAssignment = db.prepare(`
    SELECT id FROM driver_assignments 
    WHERE delivery_id = ? AND status IN ('assigned', 'accepted')
  `).get(deliveryId);
  
  if (existingAssignment) {
    return res.status(400).json({ error: 'Delivery already has an active assignment' });
  }
  
  const assignmentId = randomUUID();
  const now = Math.floor(Date.now() / 1000);
  
  db.prepare(`
    INSERT INTO driver_assignments (id, delivery_id, driver_id, assigned_at, status)
    VALUES (?, ?, ?, ?, 'assigned')
  `).run(assignmentId, deliveryId, req.params.id, now);
  
  // Update delivery status to in_progress
  db.prepare('UPDATE deliveries SET status = ?, updated_at = ? WHERE id = ?')
    .run('in_progress', now, deliveryId);
  
  const assignment = db.prepare(`
    SELECT da.*, d.name as driver_name, d.phone as driver_phone, d.vehicle_type
    FROM driver_assignments da
    JOIN drivers d ON da.driver_id = d.id
    WHERE da.id = ?
  `).get(assignmentId);
  
  // Emit real-time updates
  io.to(`business-${delivery.business_id}`).emit('driver-assigned', { 
    deliveryId, 
    driverId: req.params.id, 
    assignment 
  });
  io.to('admin').emit('driver-assigned', { 
    deliveryId, 
    driverId: req.params.id, 
    assignment 
  });
  
  res.status(201).json(assignment);
});

// PATCH /drivers/assignments/:id - Update assignment status (driver endpoint)
router.patch('/assignments/:id', requireAuth, (req: Request, res: Response) => {
  const { status, notes } = req.body;
  const validStatuses = ['accepted', 'rejected', 'completed'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  const db = getDb();
  
  // Get assignment and verify it belongs to the requesting driver
  const assignment = db.prepare(`
    SELECT da.*, d.business_id
    FROM driver_assignments da
    JOIN deliveries d ON da.delivery_id = d.id
    WHERE da.id = ?
  `).get(req.params.id) as any;
  
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
  
  // For now, we'll allow any authenticated user to update assignments
  // In a real app, you'd have driver authentication
  const now = Math.floor(Date.now() / 1000);
  
  db.prepare(`
    UPDATE driver_assignments SET status = ?, notes = ?
    WHERE id = ?
  `).run(status, notes || null, req.params.id);
  
  // If assignment is completed, update delivery status
  if (status === 'completed') {
    db.prepare('UPDATE deliveries SET status = ?, updated_at = ? WHERE id = ?')
      .run('delivered', now, (assignment as any).delivery_id);
  }
  
  const updatedAssignment = db.prepare(`
    SELECT da.*, d.name as driver_name, d.phone as driver_phone
    FROM driver_assignments da
    JOIN drivers d ON da.driver_id = d.id
    WHERE da.id = ?
  `).get(req.params.id);
  
  // Emit real-time updates
  io.to(`business-${(assignment as any).business_id}`).emit('assignment-updated', updatedAssignment);
  io.to('admin').emit('assignment-updated', updatedAssignment);
  
  res.json(updatedAssignment);
});

// GET /drivers/assignments - Get assignments for a driver
router.get('/assignments', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  
  // For now, get all assignments (in real app, filter by driver_id)
  const assignments = db.prepare(`
    SELECT da.*, d.client_name, d.pickup_location, d.status as delivery_status,
           b.name as business_name
    FROM driver_assignments da
    JOIN deliveries d ON da.delivery_id = d.id
    JOIN businesses b ON d.business_id = b.id
    ORDER BY da.assigned_at DESC
  `).all();
  
  res.json(assignments);
});

export default router;
