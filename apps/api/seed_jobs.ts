import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { scraperService } from './src/modules/scraper/scraper.service';
import { jobsService } from './src/modules/jobs/jobs.service';
dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected.');
    try {
        const rawJobs = await scraperService.scrapeAll();
        console.log(`Scraped ${rawJobs.length} raw jobs`);

        let stored = 0;
        let skipped = 0;

        for (const rawJob of rawJobs) {
            try {
                await jobsService.upsertJob({
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
                stored++;
            } catch (err: any) {
                if (err.code === 11000) skipped++;
                else console.warn(`Failed to store job:`, err.message);
            }
        }
        console.log(`Stored ${stored}, Skipped ${skipped}`);
    } catch (e: any) {
        console.error(e);
    }
    process.exit(0);
}
run();
