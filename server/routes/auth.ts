import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/database';
import { requireAuth, JWT_SECRET } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();

// POST /auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const emailTrim = String(email).trim().toLowerCase();

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailTrim) as any;
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  let businessId: string | undefined;
  if (user.role === 'business') {
    const biz = db.prepare('SELECT id, status FROM businesses WHERE user_id = ?').get(user.id) as any;
    if (!biz || biz.status !== 'approved') {
      return res.status(403).json({ error: 'Your account is pending admin approval' });
    }
    businessId = biz.id;
  }

  const payload = { userId: user.id, role: user.role, businessId };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, role: user.role, businessId });
});

// GET /auth/me
router.get('/me', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, role FROM users WHERE id = ?').get(req.user!.userId) as any;
  if (!user) return res.status(404).json({ error: 'User not found' });
  let profile = null;
  if (user.role === 'business') profile = db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(user.id);
  return res.json({ ...user, profile });
});

// POST /auth/signup — business submits registration request with full details + password
router.post('/signup', (req: Request, res: Response) => {
  const { businessName, email, phone, address, description, website, password } = req.body;
  if (!businessName || !email || !phone) {
    return res.status(400).json({ error: 'Business name, email, and phone are required' });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ error: 'Password is required and must be at least 6 characters' });
  }
  const emailTrim = String(email).trim().toLowerCase();

  const db = getDb();
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(emailTrim);
  if (existingUser) return res.status(409).json({ error: 'An account with this email already exists' });

  const existingReq = db.prepare("SELECT id FROM signup_requests WHERE email = ? AND status = 'pending'").get(emailTrim);
  if (existingReq) return res.status(409).json({ error: 'A pending request with this email already exists' });

  const id = randomUUID();
  db.prepare('INSERT INTO signup_requests (id, business_name, email, phone, address, description, website, password) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, businessName, emailTrim, phone, address ?? null, description ?? null, website ?? null, String(password));

  return res.status(201).json({ message: 'Request submitted. You will be notified once approved.' });
});

export default router;
