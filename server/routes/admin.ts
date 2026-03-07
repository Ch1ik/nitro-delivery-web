import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { requireAdmin } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const router = Router();

// GET /admin/businesses
router.get('/businesses', requireAdmin, (_req: Request, res: Response) => {
  const db = getDb();
  const businesses = db.prepare(`
    SELECT b.*, u.email,
      (SELECT COUNT(*) FROM deliveries d WHERE d.business_id = b.id) as total_deliveries,
      (SELECT COUNT(*) FROM deliveries d WHERE d.business_id = b.id AND d.status = 'delivered') as delivered_count
    FROM businesses b LEFT JOIN users u ON b.user_id = u.id
    WHERE b.status = 'approved' ORDER BY b.name
  `).all();
  return res.json(businesses);
});

// PATCH /admin/businesses/:id/price
router.patch('/businesses/:id/price', requireAdmin, (req: Request, res: Response) => {
  const { fixedPrice } = req.body;
  const db = getDb();
  const biz = db.prepare('SELECT id FROM businesses WHERE id = ?').get(req.params.id);
  if (!biz) return res.status(404).json({ error: 'Business not found' });
  db.prepare('UPDATE businesses SET fixed_price = ? WHERE id = ?').run(fixedPrice ?? null, req.params.id);
  return res.json({ success: true });
});

// PATCH /admin/businesses/:id/password — set business user's password
router.patch('/businesses/:id/password', requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || String(newPassword).length < 6) return res.status(400).json({ error: 'New password must be at least 6 characters' });
  const db = getDb();
  const biz = db.prepare('SELECT id, user_id FROM businesses WHERE id = ?').get(req.params.id) as any;
  if (!biz) return res.status(404).json({ error: 'Business not found' });
  const hashed = bcrypt.hashSync(String(newPassword), 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, biz.user_id);
  return res.json({ success: true });
});

// DELETE /admin/businesses/:id — delete business and its user account
router.delete('/businesses/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const biz = db.prepare('SELECT id, user_id FROM businesses WHERE id = ?').get(req.params.id) as any;
  if (!biz) return res.status(404).json({ error: 'Business not found' });
  db.prepare('DELETE FROM users WHERE id = ?').run(biz.user_id);
  return res.json({ success: true });
});

// GET /admin/signup-requests — with full details
router.get('/signup-requests', requireAdmin, (_req: Request, res: Response) => {
  const db = getDb();
  const requests = db.prepare('SELECT * FROM signup_requests ORDER BY created_at DESC').all();
  return res.json(requests);
});

// GET /admin/signup-requests/:id — full detail for review modal
router.get('/signup-requests/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const request = db.prepare('SELECT * FROM signup_requests WHERE id = ?').get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  return res.json(request);
});

// PATCH /admin/signup-requests/:id — approve or reject; optional password override for approve
router.patch('/signup-requests/:id', requireAdmin, (req: Request, res: Response) => {
  const { action, password: adminPassword } = req.body;
  if (!['approve', 'reject'].includes(action)) return res.status(400).json({ error: 'Action must be approve or reject' });

  const db = getDb();
  const request = db.prepare('SELECT * FROM signup_requests WHERE id = ?').get(req.params.id) as any;
  if (!request) return res.status(404).json({ error: 'Request not found' });

  const newStatus = action === 'approve' ? 'approved' : 'rejected';
  const finalPassword = action === 'approve'
    ? (adminPassword && String(adminPassword).length >= 6 ? String(adminPassword) : (request.password || 'password123'))
    : null;
  if (action === 'approve' && adminPassword !== undefined && String(adminPassword).length >= 6) {
    db.prepare('UPDATE signup_requests SET password = ? WHERE id = ?').run(finalPassword, req.params.id);
  }
  db.prepare('UPDATE signup_requests SET status = ? WHERE id = ?').run(newStatus, req.params.id);

  if (action === 'approve') {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(request.email) as any;
    if (!existingUser) {
      const userId = randomUUID();
      const bizId = randomUUID();
      const hashedPassword = bcrypt.hashSync(finalPassword!, 10);
      db.prepare("INSERT INTO users (id, email, password, role) VALUES (?, ?, ?, 'business')").run(userId, request.email, hashedPassword);
      db.prepare("INSERT INTO businesses (id, user_id, name, phone, status) VALUES (?, ?, ?, ?, 'approved')").run(bizId, userId, request.business_name, request.phone);
    }
  }

  return res.json({ success: true, status: newStatus });
});

// GET /admin/settings
router.get('/settings', requireAdmin, (_req: Request, res: Response) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM settings').all() as any[];
  const settings: Record<string, string> = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  return res.json(settings);
});

// PATCH /admin/settings
router.patch('/settings', requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const upsert = db.prepare('INSERT INTO settings (key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value');
  for (const [key, value] of Object.entries(req.body)) upsert.run(key, String(value));
  return res.json({ success: true });
});

export default router;
