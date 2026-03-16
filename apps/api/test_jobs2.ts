import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { JobModel } from './src/modules/jobs/jobs.model';
dotenv.config();

async function count() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Total jobs:', await JobModel.countDocuments({}));
  console.log('Expired jobs:', await JobModel.countDocuments({ isExpired: true }));
  console.log('Missing skills array:', await JobModel.countDocuments({ skills: { $exists: false } }));
  process.exit(0);
}
count();
