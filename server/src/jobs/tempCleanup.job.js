import { cleanTempDir } from '../services/image.service.js';
import logger from '../lib/logger.js';

let _cleanupInterval = null;

// Run temp cleanup every hour
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

export function startTempCleanupJob() {
  if (_cleanupInterval) return; // Already running

  // Run immediately on start, then every hour
  cleanTempDir().catch((err) => logger.warn('Temp cleanup error:', err));

  _cleanupInterval = setInterval(async () => {
    try {
      await cleanTempDir();
    } catch (err) {
      logger.warn('Temp cleanup error:', err);
    }
  }, CLEANUP_INTERVAL_MS);

  // Allow the process to exit even if this timer is active
  _cleanupInterval.unref();

  logger.info('🗑️  Temp cleanup job started (runs every hour)');
}

export function stopTempCleanupJob() {
  if (_cleanupInterval) {
    clearInterval(_cleanupInterval);
    _cleanupInterval = null;
    logger.info('Temp cleanup job stopped');
  }
}
