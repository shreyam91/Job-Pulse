import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { jobsService } from './src/modules/jobs/jobs.service';
dotenv.config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  try {
    const res = await jobsService.getAnalyticsSummary();
    console.log(res);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
test();
