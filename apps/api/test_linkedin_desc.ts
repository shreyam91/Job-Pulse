import * as cheerio from 'cheerio';

async function test() {
    try {
        const url = 'https://in.linkedin.com/jobs/view/frontend-developer-at-alike-4383814464?position=1&pageNum=0&refId=K%2FZT%2BVRcwIk%2FqNUyirl%2BSw%3D%3D&trackingId=SNA4yh1alEog9InEw9iRbQ%3D%3D';
        const match = url.match(/-(\d+)\?/);
        if (!match) return;
        const jobId = match[1];

        const res = await fetch(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const text = await res.text();
        const $ = cheerio.load(text);
        const description = $('.show-more-less-html__markup').text().trim();
        console.log(description.substring(0, 500));
    } catch (e: any) {
        console.error(e.message);
    }
}
test();
