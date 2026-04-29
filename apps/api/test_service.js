require('dotenv').config();
const { ResumeOptimizerService } = require('./dist/services/resume-optimizer/service');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const service = new ResumeOptimizerService();
  const res = await service.optimizeResume({
    resume: "John Doe. Software Engineer with 5 years of React experience.",
    jobDescription: "Looking for a Senior Software Engineer with Node.js, Express, and React experience. Must know Agile."
  });
  console.log(JSON.stringify(res, null, 2));
}

test().catch(console.error);
