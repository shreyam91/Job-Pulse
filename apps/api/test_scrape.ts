import { scraperService } from './src/modules/scraper/scraper.service';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('connected');
    const jobs = await scraperService.scrapeAll();
    console.log(`Scraped ${jobs.length} jobs.`);
    if (jobs.length > 0) {
        console.log(JSON.stringify(jobs[0], null, 2));
        const reactJobs = jobs.filter(j => j.skills.includes('react'));
        const aiJobs = jobs.filter(j => j.skills.includes('ai'));
        console.log(`React jobs: ${reactJobs.length}, AI jobs: ${aiJobs.length}`);
    }
    process.exit();
}
run();
