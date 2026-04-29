const fetch = require('node-fetch');

async function test() {
  try {
    const res = await fetch('http://localhost:5001/api/resume/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume: "John Doe. Software Engineer with 5 years of React experience.",
        jobDescription: "Looking for a Senior Software Engineer with Node.js, Express, and React experience. Must know Agile."
      })
    });
    const data = await res.text(); // Use text to catch server errors
    console.log(data);
  } catch (e) {
    console.error(e);
  }
}
test();
