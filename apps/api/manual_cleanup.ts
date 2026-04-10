import { connectDatabase } from './src/shared/database';
import { JobModel } from './src/modules/jobs/jobs.model';
import { JobAnalysisModel } from './src/modules/jobs/jobAnalysis.model';
import logger from './src/shared/logger';

async function run() {
    try {
        await connectDatabase();
        
        const now = new Date();
        const cutoff = new Date();
        cutoff.setDate(now.getDate() - 3);

        console.log(`Current time: ${now.toISOString()}`);
        console.log(`Cutoff time (3 days ago): ${cutoff.toISOString()}`);

        const totalJobs = await JobModel.countDocuments();
        const oldJobsCount = await JobModel.countDocuments({ postedAt: { $lt: cutoff } });

        console.log(`Total jobs in DB: ${totalJobs}`);
        console.log(`Jobs older than 3 days: ${oldJobsCount}`);

        if (oldJobsCount > 0) {
            console.log('Cleaning up old jobs...');
            const result = await JobModel.deleteMany({ postedAt: { $lt: cutoff } });
            console.log(`Successfully deleted ${result.deletedCount} old jobs.`);
            
            // Also clean up orphan analyses
            const orphanAnalyses = await JobAnalysisModel.deleteMany({
                jobId: { $nin: (await JobModel.find().select('_id')).map(j => String(j._id)) }
            });
            console.log(`Deleted ${orphanAnalyses.deletedCount} orphaned analyses.`);
        } else {
            console.log('No old jobs found to delete.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

run();
