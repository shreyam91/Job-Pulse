import cron from 'node-cron';
import { prisma } from '../lib/prisma'; // Assuming prisma is exported from here

export function initCleanupWorker() {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[CleanupWorker] Running job cleanup...');
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = await prisma.job.deleteMany({
        where: {
          createdAt: {
            lt: threeDaysAgo
          }
        }
      });

      console.log(`[CleanupWorker] Successfully removed ${result.count} old jobs.`);
    } catch (error) {
      console.error('[CleanupWorker] Error during job cleanup:', error);
    }
  });

  console.log('[CleanupWorker] Scheduled to run daily at midnight.');
}
