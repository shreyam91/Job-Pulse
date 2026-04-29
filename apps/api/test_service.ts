import { resumeOptimizerService } from './src/services/resume-optimizer/service';

async function test() {
  const res = await resumeOptimizerService.optimizeResume({
    resume: "John Doe. Software Engineer with 5 years of React experience.",
    jobDescription: "Looking for a Senior Software Engineer with Node.js, Express, and React experience. Must know Agile."
  });
  console.log(JSON.stringify(res, null, 2));
}

test().catch(console.error);
