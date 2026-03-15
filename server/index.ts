import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getDb } from './db/database';
import authRoutes from './routes/auth';
import deliveryRoutes from './routes/deliveries';
import adminRoutes from './routes/admin';
import profileRoutes from './routes/profile';
import driverRoutes from './routes/drivers';

dotenv.config({ path: '.env.local' });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map(url => url.trim());
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const PORT = process.env.PORT || 4000;

// Parse multiple CORS origins
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map(url => url.trim());

// Middleware
app.use(express.json());

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-business', (businessId: string) => {
    socket.join(`business-${businessId}`);
    console.log(`Client ${socket.id} joined business room: ${businessId}`);
  });
  
  socket.on('join-admin', () => {
    socket.join('admin');
    console.log(`Client ${socket.id} joined admin room`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in routes
export { io };

// Init DB on startup
getDb();

// Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/deliveries', deliveryRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/profile', profileRoutes);
app.use('/v1/drivers', driverRoutes);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

server.listen(PORT, () => {
  console.log(`\n🚀 Nitro API with WebSocket running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});