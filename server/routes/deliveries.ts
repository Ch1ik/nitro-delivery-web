import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// Haversine distance in km
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Delivery price by distance (DA): 1–5 km 250, 5–7 km 300, 7–9 km 350, 9–10 km 400, 10–15 km 500
function getDeliveryPriceByDistanceKm(km: number): number {
  if (km <= 5) return 250;
  if (km <= 7) return 300;
  if (km <= 9) return 350;
  if (km <= 10) return 400;
  if (km <= 15) return 500;
  return 500;
}

// GET /deliveries/stats  — MUST be before /:id
router.get('/stats', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  if (req.user!.role === 'admin') {
    const total      = (db.prepare('SELECT COUNT(*) as c FROM deliveries').get() as any).c;
    const delivered  = (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE status='delivered'").get() as any).c;
    const pending    = (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE status='pending'").get() as any).c;
    const in_progress= (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE status='in_progress'").get() as any).c;
    const revenue    = (db.prepare("SELECT COALESCE(SUM(price),0) as t FROM deliveries WHERE status='delivered'").get() as any).t;
    const businesses = (db.prepare("SELECT COUNT(*) as c FROM businesses WHERE status='approved'").get() as any).c;
    return res.json({ total, delivered, pending, in_progress, revenue, businesses });
  } else {
    const bizId = req.user!.businessId;
    const total     = (db.prepare('SELECT COUNT(*) as c FROM deliveries WHERE business_id=?').get(bizId) as any).c;
    const delivered = (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE business_id=? AND status='delivered'").get(bizId) as any).c;
    const pending   = (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE business_id=? AND status='pending'").get(bizId) as any).c;
    const denied    = (db.prepare("SELECT COUNT(*) as c FROM deliveries WHERE business_id=? AND status='denied'").get(bizId) as any).c;
    const refusalRate = total > 0 ? Math.round((denied / total) * 100) : 0;
    return res.json({ total, delivered, pending, denied, refusalRate });
  }
});

// GET /deliveries — list with stops
router.get('/', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  let deliveries: any[];
  if (req.user!.role === 'admin') {
    deliveries = db.prepare(`
      SELECT d.*, b.name as business_name
      FROM deliveries d LEFT JOIN businesses b ON d.business_id = b.id
      ORDER BY d.created_at DESC
    `).all();
  } else {
    deliveries = db.prepare('SELECT * FROM deliveries WHERE business_id=? ORDER BY created_at DESC').all(req.user!.businessId);
  }
  const getStops = db.prepare('SELECT * FROM delivery_stops WHERE delivery_id=? ORDER BY position');
  return res.json(deliveries.map(d => ({ ...d, stops: getStops.all(d.id) })));
});

// GET /deliveries/:id — full detail
router.get('/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const delivery = db.prepare(`
    SELECT d.*, b.name as business_name, b.phone as business_phone,
           b.photo_url as business_photo, u.email as business_email
    FROM deliveries d
    LEFT JOIN businesses b ON d.business_id = b.id
    LEFT JOIN users u ON b.user_id = u.id
    WHERE d.id=?
  `).get(req.params.id) as any;
  if (!delivery) return res.status(404).json({ error: 'Delivery not found' });
  if (req.user!.role === 'business' && delivery.business_id !== req.user!.businessId)
    return res.status(403).json({ error: 'Access denied' });
  const stops = db.prepare('SELECT * FROM delivery_stops WHERE delivery_id=? ORDER BY position').all(req.params.id);
  return res.json({ ...delivery, stops });
});

// POST /deliveries
router.post('/', requireAuth, (req: Request, res: Response) => {
  if (req.user!.role !== 'business') return res.status(403).json({ error: 'Only businesses can create deliveries' });
  const { clientName, clientPhone, pickupLocation, pickupLat, pickupLng, noDestination, notes, stops, packagePrice } = req.body;
  if (!clientName || !clientPhone || !pickupLocation) return res.status(400).json({ error: 'clientName, clientPhone, and pickupLocation are required' });
  if (!noDestination && (!stops || stops.length === 0)) return res.status(400).json({ error: 'At least one dropoff stop is required' });

  let price: number;
  const hasDropOff = !noDestination && stops?.length > 0;
  const pickupLatNum = pickupLat != null ? Number(pickupLat) : null;
  const pickupLngNum = pickupLng != null ? Number(pickupLng) : null;
  const firstStopWithCoords = hasDropOff && Array.isArray(stops)
    ? stops.find((s: any) => s.lat != null && s.lng != null)
    : null;

  if (!hasDropOff || !firstStopWithCoords || pickupLatNum == null || pickupLngNum == null) {
    price = -1; // unknown
  } else {
    const km = haversineKm(pickupLatNum, pickupLngNum, Number(firstStopWithCoords.lat), Number(firstStopWithCoords.lng));
    price = getDeliveryPriceByDistanceKm(km);
  }

  const id = 'NIT-' + String(Math.floor(1000 + Math.random() * 9000));
  const now = Math.floor(Date.now() / 1000);
  const pkgPrice = packagePrice != null ? Number(packagePrice) : null;
  db.prepare(`INSERT INTO deliveries (id,business_id,client_name,client_phone,pickup_location,pickup_lat,pickup_lng,no_destination,price,package_price,notes,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, req.user!.businessId, clientName, clientPhone, pickupLocation, pickupLat ?? null, pickupLng ?? null, noDestination ? 1 : 0, price, pkgPrice, notes ?? null, now, now);

  if (stops?.length > 0) {
    const ins = db.prepare('INSERT INTO delivery_stops (id,delivery_id,position,address,lat,lng,client_name,client_phone) VALUES (?,?,?,?,?,?,?,?)');
    stops.forEach((s: any, i: number) => ins.run(randomUUID(), id, i, s.address, s.lat ?? null, s.lng ?? null, s.clientName ?? clientName, s.clientPhone ?? clientPhone));
  }

  const delivery = db.prepare('SELECT * FROM deliveries WHERE id=?').get(id) as any;
  const deliveryStops = db.prepare('SELECT * FROM delivery_stops WHERE delivery_id=? ORDER BY position').all(id);
  return res.status(201).json({ ...delivery, stops: deliveryStops });
});

// PATCH /deliveries/:id/status — admin
router.patch('/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  const valid = ['pending','confirmed','in_progress','delivered','denied'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  const db = getDb();
  if (!db.prepare('SELECT id FROM deliveries WHERE id=?').get(req.params.id))
    return res.status(404).json({ error: 'Delivery not found' });

  const now = Math.floor(Date.now() / 1000);
  db.prepare('UPDATE deliveries SET status=?, updated_at=? WHERE id=?').run(status, now, req.params.id);
  if (status === 'delivered')
    db.prepare("UPDATE delivery_stops SET status='delivered' WHERE delivery_id=?").run(req.params.id);

  const updated = db.prepare('SELECT * FROM deliveries WHERE id=?').get(req.params.id) as any;
  const stops = db.prepare('SELECT * FROM delivery_stops WHERE delivery_id=? ORDER BY position').all(req.params.id);
  return res.json({ ...updated, stops });
});

// PATCH /deliveries/:id/stops/:stopId — update stop status (admin)
router.patch('/:id/stops/:stopId', requireAdmin, (req: Request, res: Response) => {
  const { status } = req.body;
  if (!['pending','delivered','failed'].includes(status)) return res.status(400).json({ error: 'Invalid stop status' });
  const db = getDb();
  db.prepare('UPDATE delivery_stops SET status=? WHERE id=? AND delivery_id=?').run(status, req.params.stopId, req.params.id);
  return res.json({ success: true });
});

export default router;
