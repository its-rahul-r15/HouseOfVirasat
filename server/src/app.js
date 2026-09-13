import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { ApiError } from './lib/ApiError.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import productRoutes from './modules/product/product.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import mtoRoutes from './modules/mto/mto.routes.js';
import bespokeRoutes from './modules/bespoke/bespoke.routes.js';
import couponRoutes from './modules/coupon/coupon.routes.js';
import categoryRoutes from './modules/category/category.routes.js';
import settingsRoutes from './modules/settings/settings.routes.js';
import contentRoutes from './modules/content/content.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import webhookRoutes from './modules/order/webhook.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & performance middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: env.CORS_ORIGIN || true,
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());

// Capture raw body for webhook verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },
  limit: '10mb',
}));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads and sitemap
const uploadsPath = path.resolve(env.UPLOADS_DIR);
app.use('/uploads', express.static(uploadsPath));
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/mto', mtoRoutes);
app.use('/api/v1/bespoke', bespokeRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/content', contentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/webhooks', webhookRoutes);

// 404 handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

export default app;
