import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDb } from './db/database';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/deliveries';
import adminRoutes from './routes/admin';
import profileRoutes from './routes/profile';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Init DB on startup
getDb();

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/deliveries', deliveryRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/profile', profileRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`\n🚀 Nitro API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});
