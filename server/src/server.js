import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { startStockReleaseJob, stopStockReleaseJob } from './jobs/stockRelease.job.js';
import logger from './lib/logger.js';
import mongoose from 'mongoose';

async function bootstrap() {
  await connectDB();

  startStockReleaseJob();

  const server = app.listen(env.PORT, () => {
    logger.info(`✨ House of Virasat API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    stopStockReleaseJob();
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
