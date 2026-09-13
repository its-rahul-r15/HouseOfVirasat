import { releaseExpiredHolds } from '../modules/order/order.service.js';
import logger from '../lib/logger.js';

let intervalId = null;

export function startStockReleaseJob(intervalMs = 60 * 1000) {
  if (intervalId) return;

  logger.info('Starting Stock Release background job (interval: 60s)');

  intervalId = setInterval(async () => {
    try {
      const releasedCount = await releaseExpiredHolds();
      if (releasedCount > 0) {
        logger.info(`Stock Release job cleaned up ${releasedCount} expired order hold(s)`);
      }
    } catch (err) {
      logger.error('Error in Stock Release job:', err.message);
    }
  }, intervalMs);
}

export function stopStockReleaseJob() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    logger.info('Stopped Stock Release background job');
  }
}
