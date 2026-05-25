import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';
import authRoutes from './services/auth/routes/authRoutes';
import userRoutes from './services/auth/routes/userRoutes';
import orderRoutes from './services/order/routes/orderRoutes';
import productRoutes from './services/inventory/routes/productRoutes';
import inventoryLogRoutes from './services/inventory/routes/inventoryLogRoutes';
import paymentRoutes from './services/payment/routes/paymentRoutes';
import reportRoutes from './services/reporting/routes/reportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet());
app.use(cors());
app.use(mongoSanitize());
app.use(apiLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes — all under /api/v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/inventory-logs', inventoryLogRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reports', reportRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'restaurant-pos-api', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

// Start
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 POS API Server running on port ${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/health`);
  });
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
  process.exit(1);
});

export default app;
