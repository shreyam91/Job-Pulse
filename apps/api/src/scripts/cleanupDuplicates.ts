import { connectDatabase, disconnectDatabase } from '../shared/database';
import { JobModel } from '../modules/jobs/jobs.model';
import { normalizeUrl, hashUrl } from '../shared/utils';
import logger from '../shared/logger';

/**
 * Script to clean up existing duplicate jobs in the database
 * This should be run once to clean up historical duplicates
 */
async function cleanupDuplicates() {
    try {
        await connectDatabase();
        logger.info('Connected to database');

        // Find all jobs
        const allJobs = await JobModel.find({}).lean();
        logger.info(`Found ${allJobs.length} total jobs in database`);

        // Group jobs by normalized URL hash
        const jobGroups = new Map<string, any[]>();
        
        for (const job of allJobs) {
            const normalizedUrl = normalizeUrl(job.sourceUrl);
            const urlHash = hashUrl(normalizedUrl);
            
            if (!jobGroups.has(urlHash)) {
                jobGroups.set(urlHash, []);
            }
            jobGroups.get(urlHash)!.push(job);
        }

        // Find duplicates
        const duplicates = Array.from(jobGroups.entries()).filter(([_, jobs]) => jobs.length > 1);
        logger.info(`Found ${duplicates.length} groups of duplicate jobs`);

        let totalRemoved = 0;

        for (const [urlHash, jobs] of duplicates) {
            // Sort by scrapedAt date (newest first) and postedAt date (newest first)
            jobs.sort((a, b) => {
                const dateA = new Date(a.scrapedAt).getTime();
                const dateB = new Date(b.scrapedAt).getTime();
                if (dateA !== dateB) {
                    return dateB - dateA; // Newest scrapedAt first
                }
                // If same scrapedAt, use postedAt
                return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
            });

            // Keep the first (newest) job, remove the rest
            const toKeep = jobs[0];
            const toRemove = jobs.slice(1);

            if (toRemove.length > 0) {
                logger.info(`Removing ${toRemove.length} duplicates for job: ${toKeep.title} at ${toKeep.company}`);
                
                const result = await JobModel.deleteMany({
                    _id: { $in: toRemove.map(job => job._id) }
                });
                
                totalRemoved += result.deletedCount;
            }
        }

        logger.info(`Cleanup completed. Removed ${totalRemoved} duplicate jobs`);
        
        // Update remaining jobs to ensure they have correct sourceUrlHash
        const remainingJobs = await JobModel.find({});
        let updated = 0;
        
        for (const job of remainingJobs) {
            const normalizedUrl = normalizeUrl(job.sourceUrl);
            const correctHash = hashUrl(normalizedUrl);
            
            if (job.sourceUrlHash !== correctHash) {
                await JobModel.updateOne(
                    { _id: job._id },
                    { 
                        $set: { 
                            sourceUrl: normalizedUrl,
                            sourceUrlHash: correctHash 
                        } 
                    }
                );
                updated++;
            }
        }
        
        logger.info(`Updated ${updated} jobs with correct sourceUrlHash`);

    } catch (error) {
        logger.error('Cleanup failed:', error);
    } finally {
        await disconnectDatabase();
        logger.info('Disconnected from database');
    }
}

// Run the cleanup script
if (require.main === module) {
    cleanupDuplicates().then(() => {
        logger.info('Cleanup script completed');
        process.exit(0);
    }).catch((error) => {
        logger.error('Cleanup script failed:', error);
        process.exit(1);
    });
}

export { cleanupDuplicates };
