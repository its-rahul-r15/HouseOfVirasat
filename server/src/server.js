import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startStockReleaseJob, stopStockReleaseJob } from './jobs/stockRelease.job.js';
import { startTempCleanupJob, stopTempCleanupJob } from './jobs/tempCleanup.job.js';
import { initUploadDirs } from './services/image.service.js';
import logger from './lib/logger.js';
import mongoose from 'mongoose';

async function bootstrap() {
  await connectDB();

  // Ensure uploads/temp/ (and all top-level subdirs) exist before first request
  await initUploadDirs();

  startStockReleaseJob();
  startTempCleanupJob();

  const server = app.listen(env.PORT, () => {
    logger.info(`✨ House of Virasat API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    stopStockReleaseJob();
    stopTempCleanupJob();
    server.close(async () => {
      logger.info('HTTP server closed');
      await mongoose.connection.close(false);
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Bootstrap failed:', err);
  process.exit(1);
});
