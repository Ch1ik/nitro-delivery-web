import { Router, Request, Response } from 'express';
import { getDb } from '../db/database';
import { requireAuth } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

// GET /profile
router.get('/', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(req.user!.userId) as any;
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.role === 'business') {
    const biz = db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(user.id) as any;
    return res.json({ ...user, ...biz });
  }
  return res.json(user);
});

// PATCH /profile
router.patch('/', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const { name, phone, photoUrl, email } = req.body;

  if (req.user!.role === 'business') {
    db.prepare('UPDATE businesses SET name = COALESCE(?, name), phone = COALESCE(?, phone), photo_url = COALESCE(?, photo_url) WHERE user_id = ?')
      .run(name || null, phone || null, photoUrl || null, req.user!.userId);
  }

  if (req.user!.role === 'admin' && email && typeof email === 'string' && email.trim()) {
    const emailTrim = String(email).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(emailTrim, req.user!.userId);
    if (existing) return res.status(409).json({ error: 'Email already in use' });
    db.prepare('UPDATE users SET email = ? WHERE id = ?').run(emailTrim, req.user!.userId);
  }

  const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(req.user!.userId) as any;
  const biz = req.user!.role === 'business'
    ? db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(req.user!.userId)
    : null;

  return res.json({ ...user, ...biz });
});

// PATCH /profile/password
router.patch('/password', requireAuth, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.userId) as any;
  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashed, req.user!.userId);
  return res.json({ success: true });
});

export default router;
