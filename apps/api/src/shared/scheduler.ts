import cron from 'node-cron';
import logger from './logger';
import { jobsService } from '../modules/jobs/jobs.service';
import { scraperService } from '../modules/scraper/scraper.service';
import { aiMatchService } from '../modules/ai/aiMatch.service';
import { resumeService } from '../modules/resume/resume.service';

class JobScheduler {
  private isRunning = false;
  private tasks: cron.ScheduledTask[] = [];

  /**
   * Initialize all scheduled tasks
   */
  start() {
    logger.info('[Scheduler] Starting job scraping scheduler...');

    // Schedule job scraping every 6 hours (4 times per day)
    const scrapingTask = cron.schedule('0 */6 * * *', async () => {
      await this.executeJobScraping();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    // Schedule cleanup of old jobs once daily at 2 AM IST
    const cleanupTask = cron.schedule('0 2 * * *', async () => {
      await this.executeCleanup();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    // Schedule duplicate removal once daily at 3 AM IST
    const duplicateCleanupTask = cron.schedule('0 3 * * *', async () => {
      await this.executeDuplicateCleanup();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    // Schedule freshness score update every 4 hours
    const freshnessTask = cron.schedule('0 */4 * * *', async () => {
      await this.executeFreshnessUpdate();
    }, {
      scheduled: false,
      timezone: 'Asia/Kolkata'
    });

    this.tasks = [scrapingTask, cleanupTask, duplicateCleanupTask, freshnessTask];

    // Start all tasks
    this.tasks.forEach(task => task.start());

    logger.info('[Scheduler] All scheduled tasks started');
    logger.info('[Scheduler] Job scraping: Every 6 hours (IST)');
    logger.info('[Scheduler] Old job cleanup: Daily at 2 AM IST');
    logger.info('[Scheduler] Duplicate cleanup: Daily at 3 AM IST');
    logger.info('[Scheduler] Freshness update: Every 4 hours (IST)');

    // Run initial scraping after 30 seconds to give the app time to fully start
    setTimeout(async () => {
      await this.executeJobScraping();
    }, 30000);
  }

  /**
   * Stop all scheduled tasks
   */
  stop() {
    logger.info('[Scheduler] Stopping all scheduled tasks...');
    this.tasks.forEach(task => task.stop());
    this.tasks = [];
    logger.info('[Scheduler] All scheduled tasks stopped');
  }

  /**
   * Execute job scraping with deduplication
   */
  private async executeJobScraping() {
    if (this.isRunning) {
      logger.info('[Scheduler] Job scraping already in progress, skipping...');
      return;
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      logger.info('[Scheduler] Starting automatic job scraping...');
      let stored = 0;
      let skipped = 0;

      const rawJobs = await scraperService.scrapeAll();
      logger.info(`[Scheduler] Scraped ${rawJobs.length} raw jobs`);

      for (const rawJob of rawJobs) {
        try {
          const saved = await jobsService.upsertJob({
            title: rawJob.title,
            company: rawJob.company,
            location: rawJob.location,
            workMode: rawJob.workMode,
            skills: rawJob.skills,
            tags: rawJob.tags,
            description: rawJob.description,
            source: rawJob.source,
            sourceUrl: rawJob.sourceUrl,
            postedAt: rawJob.postedAt,
            hasFunding: rawJob.hasFunding,
            employeeCount: rawJob.employeeCount,
            salary: rawJob.salary,
            experienceYears: rawJob.experienceYears,
          });
          if (saved) {
            stored++;
          } else {
            skipped++;
          }
        } catch (err: any) {
          if (err.code === 11000) {
            skipped++; // Duplicate key error
          } else {
            logger.warn(`[Scheduler] Failed to store job: ${err.message}`);
          }
        }
      }

      await scraperService.closeBrowser();

      // Trigger AI analysis for all unanalysed jobs if a resume exists
      const userId = 'default-user'; // System user for scheduled tasks
      const resume = await resumeService.getActiveResume(userId);
      
      if (resume) {
        try {
          const allJobs = await jobsService.getJobs({ page: 1, limit: 50 });
          let analysed = 0;
          
          for (const job of allJobs.jobs) {
            const existing = await jobsService.getAnalysis(job._id!.toString(), resume._id!.toString());
            if (!existing) {
              try {
                const analysis = await aiMatchService.buildFullAnalysis(
                  job._id!.toString(),
                  resume._id!.toString(),
                  job,
                  resume.parsedData
                );
                await jobsService.upsertAnalysis(analysis);
                analysed++;
              } catch (err: any) {
                logger.warn(`[Scheduler] AI analysis failed for job ${job._id}: ${err.message}`);
              }
            }
          }
          logger.info(`[Scheduler] AI analysis completed for ${analysed} new jobs`);
        } catch (err: any) {
          logger.warn('[Scheduler] AI analysis pass failed:', err.message);
        }
      }

      const duration = Date.now() - startTime;
      logger.info(`[Scheduler] Scraping completed in ${duration}ms. Stored: ${stored}, Skipped: ${skipped}`);
      
    } catch (error: any) {
      logger.error('[Scheduler] Automatic scraping failed:', error.message);
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Execute cleanup of old jobs
   */
  private async executeCleanup() {
    try {
      logger.info('[Scheduler] Starting old job cleanup...');
      const deleted = await jobsService.expireOldJobs(3); // Remove jobs older than 3 days
      logger.info(`[Scheduler] Cleanup completed. Removed ${deleted} old jobs`);
    } catch (error: any) {
      logger.error('[Scheduler] Cleanup failed:', error.message);
    }
  }

  /**
   * Execute duplicate removal
   */
  private async executeDuplicateCleanup() {
    try {
      logger.info('[Scheduler] Starting duplicate cleanup...');
      const removed = await jobsService.removeDuplicates();
      logger.info(`[Scheduler] Duplicate cleanup completed. Removed ${removed} duplicates`);
    } catch (error: any) {
      logger.error('[Scheduler] Duplicate cleanup failed:', error.message);
    }
  }

  /**
   * Execute freshness score update
   */
  private async executeFreshnessUpdate() {
    try {
      logger.info('[Scheduler] Starting freshness score update...');
      await jobsService.updateFreshnessScores();
      logger.info('[Scheduler] Freshness scores updated successfully');
    } catch (error: any) {
      logger.error('[Scheduler] Freshness update failed:', error.message);
    }
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeTasks: this.tasks.length
    };
  }
}

export const jobScheduler = new JobScheduler();
