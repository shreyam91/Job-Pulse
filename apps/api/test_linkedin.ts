import * as cheerio from 'cheerio';

async function test() {
  try {
    const res = await fetch('https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Frontend&location=Worldwide&f_TPR=r86400&start=0', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const text = await res.text();

    // Check if we hit the authwall
    if (text.includes('authwall')) {
      console.log('Hit LinkedIn authwall. Scraping blocked.');
      return;
    }

    const $ = cheerio.load(text);
    const jobs: any[] = [];
    $('li').each((i, el) => {
      const title = $(el).find('.base-search-card__title').text().trim();
      const company = $(el).find('.base-search-card__subtitle').text().trim();
      const location = $(el).find('.job-search-card__location').text().trim();
      let url = $(el).find('.base-card__full-link').attr('href');
      let time = $(el).find('time').attr('datetime');
      if (title) {
        jobs.push({ title, company, location, url, time });
      }
    });
    console.log(`Found ${jobs.length} jobs.`);
    if (jobs.length > 0) console.log(jobs[0]);
  } catch (e: any) {
    console.error(e.message);
  }
}
test();
