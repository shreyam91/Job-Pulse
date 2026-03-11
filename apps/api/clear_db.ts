import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

async function clear() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('Connected.');
  await mongoose.connection.collection('jobs').deleteMany({});
  await mongoose.connection.collection('jobanalyses').deleteMany({});
  console.log('Cleared jobs and analyses.');
  process.exit(0);
}
clear();
