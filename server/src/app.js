import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

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
import newsletterRoutes from './modules/newsletter/newsletter.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configure dynamic CORS origin handler to support credentials with wildcard or custom origins
const getAllowedOrigins = () => {
  if (!env.CORS_ORIGIN || env.CORS_ORIGIN === '*' || env.CORS_ORIGIN === 'true') {
    return '*';
  }
  return env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // If wildcard is enabled, reflect the request origin back (not literal '*')
    // because browsers block Access-Control-Allow-Origin: * with credentials: 'include'
    if (allowedOrigins === '*' || allowedOrigins.includes('*')) {
      return callback(null, origin);
    }

    // Direct match
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Subdomain / hostname match
    try {
      const originHost = new URL(origin).hostname;
      const isMatched = allowedOrigins.some((allowed) => {
        try {
          const allowedHost = allowed.startsWith('http') ? new URL(allowed).hostname : allowed;
          return originHost === allowedHost || originHost.endsWith(`.${allowedHost}`);
        } catch {
          return allowed === origin;
        }
      });
      if (isMatched) return callback(null, true);
    } catch {
      // In case of invalid URL
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
};

// Security & performance middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors(corsOptions));

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

// NOTE: /uploads static serving removed — product images are now served from Cloudflare R2 CDN.
app.use(express.static(path.join(__dirname, '../public')));

// Comprehensive Health Check Endpoints (for Coolify, Docker, and Load Balancers)
const getHealthStatus = () => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const dbState = mongoose.connection.readyState;
  const isHealthy = dbState === 1;

  return {
    status: isHealthy ? 'ok' : 'degraded',
    service: 'House of Virasat API',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    database: {
      status: dbStates[dbState] || 'unknown',
      connected: isHealthy,
    },
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    },
  };
};

app.get(['/', '/health', '/api/health', '/api/v1/health'], (req, res) => {
  const health = getHealthStatus();
  res.status(200).json(health);
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
app.use('/api/v1/newsletter', newsletterRoutes);

// 404 handler
app.use((req, res, next) => {
  next(ApiError.notFound(`Route not found: ${req.originalUrl}`));
});

// Centralized error handler
app.use(errorHandler);

export default app;
