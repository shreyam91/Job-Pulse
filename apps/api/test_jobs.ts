import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { JobModel } from './src/modules/jobs/jobs.model';
dotenv.config();

async function count() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log(await JobModel.countDocuments({}));
  process.exit(0);
}
count();
