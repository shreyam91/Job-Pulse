import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { JobModel } from './src/modules/jobs/jobs.model';
dotenv.config();

async function check() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("Total:", await JobModel.countDocuments({}));
  console.log("Not expired:", await JobModel.countDocuments({ isExpired: false }));
  process.exit(0);
}
check();
