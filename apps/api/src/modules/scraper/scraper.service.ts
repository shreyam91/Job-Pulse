import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { Browser, Page } from 'puppeteer';
import logger from '../../shared/logger';
import { sleep } from '../../shared/utils';

puppeteer.use(StealthPlugin());

export interface RawJob {
    title: string;
    company: string;
    location: string;
    workMode: 'remote' | 'hybrid' | 'onsite';
    skills: string[];
    tags: string[];
    description: string;
    sourceUrl: string;
    source: 'wellfound' | 'ycombinator' | 'greenhouse' | 'lever';
    postedAt: Date;
    salary?: { min?: number; max?: number; currency?: string };
    experienceYears?: { min?: number; max?: number };
    hasFunding?: boolean;
    employeeCount?: number;
}

export class ScraperService {
    private browser: Browser | null = null;

    async getBrowser(): Promise<Browser> {
        if (!this.browser || !this.browser.connected) {
            this.browser = await (puppeteer as any).launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu',
                ],
            });
        }
        return this.browser;
    }

    async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async newPage(): Promise<Page> {
        const browser = await this.getBrowser();
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        );
        await page.setViewport({ width: 1280, height: 800 });
        await page.setRequestInterception(true);

        page.on('request', (req) => {
            const resourceType = req.resourceType();
            if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                req.abort();
            } else {
                req.continue();
            }
        });

        return page;
    }

    /**
     * Scrape Y Combinator Jobs (jobs.ycombinator.com)
     */
    async scrapeYCombinator(): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        let page: Page | null = null;

        try {
            page = await this.newPage();
            logger.info('Scraping YCombinator jobs...');

            await page.goto('https://www.ycombinator.com/jobs', {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });

            await sleep(2000);

            const jobCards = await page.$$eval('.job', (cards) =>
                cards.slice(0, 30).map((card) => {
                    const title = card.querySelector('.job-name')?.textContent?.trim() || '';
                    const company = card.querySelector('.company-name')?.textContent?.trim() || '';
                    const location = card.querySelector('.job-location')?.textContent?.trim() || 'Remote';
                    const url = (card as HTMLAnchorElement).href || card.querySelector('a')?.href || '';
                    const tags = Array.from(card.querySelectorAll('.tag')).map((t) => t.textContent?.trim() || '');

                    return { title, company, location, url, tags };
                })
            );

            for (const card of jobCards) {
                if (!card.title || !card.url) continue;

                const workMode = this.inferWorkMode(card.location);

                jobs.push({
                    title: card.title,
                    company: card.company || 'Unknown',
                    location: card.location,
                    workMode,
                    skills: card.tags,
                    tags: card.tags,
                    description: `${card.title} position at ${card.company}. Location: ${card.location}. Apply via Y Combinator.`,
                    sourceUrl: card.url,
                    source: 'ycombinator',
                    postedAt: new Date(),
                    hasFunding: true,
                });
            }

            logger.info(`YCombinator: scraped ${jobs.length} jobs`);
        } catch (error) {
            logger.error('YCombinator scrape failed:', error);
        } finally {
            if (page) await page.close();
        }

        return jobs;
    }

    /**
     * Scrape Wellfound (formerly AngelList Talent)
     */
    async scrapeWellfound(): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        let page: Page | null = null;

        try {
            page = await this.newPage();
            logger.info('Scraping Wellfound jobs...');

            await page.goto('https://wellfound.com/jobs', {
                waitUntil: 'networkidle2',
                timeout: 30000,
            });

            await sleep(3000);

            // Scroll to load more
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await sleep(2000);

            const jobData = await page.$$eval('[data-test="StartupResult"]', (cards) =>
                cards.slice(0, 25).map((card) => {
                    const title = card.querySelector('a[data-test="job-title"]')?.textContent?.trim() || '';
                    const company = card.querySelector('[data-test="startup-name"]')?.textContent?.trim() || '';
                    const location = card.querySelector('[data-test="location"]')?.textContent?.trim() || 'Remote';
                    const url = card.querySelector('a[data-test="job-title"]')
                        ? `https://wellfound.com${card.querySelector('a[data-test="job-title"]')?.getAttribute('href') || ''}` : '';
                    const skills = Array.from(card.querySelectorAll('[data-test="skill"]')).map((s) => s.textContent?.trim() || '');
                    const compensation = card.querySelector('[data-test="comp"]')?.textContent?.trim() || '';

                    return { title, company, location, url, skills, compensation };
                })
            );

            for (const item of jobData) {
                if (!item.title || !item.url) continue;

                jobs.push({
                    title: item.title,
                    company: item.company,
                    location: item.location,
                    workMode: this.inferWorkMode(item.location),
                    skills: item.skills,
                    tags: item.skills,
                    description: `${item.title} at ${item.company}. ${item.compensation}. Apply via Wellfound.`,
                    sourceUrl: item.url,
                    source: 'wellfound',
                    postedAt: new Date(),
                    hasFunding: true,
                });
            }

            logger.info(`Wellfound: scraped ${jobs.length} jobs`);
        } catch (error) {
            logger.error('Wellfound scrape failed:', error);
        } finally {
            if (page) await page.close();
        }

        return jobs;
    }

    /**
     * Scrape a Greenhouse board
     */
    async scrapeGreenhouseBoard(companySlug: string): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        let page: Page | null = null;

        try {
            page = await this.newPage();
            const url = `https://boards.greenhouse.io/${companySlug}`;
            logger.info(`Scraping Greenhouse board: ${companySlug}`);

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await sleep(2000);

            const jobItems = await page.$$eval('.opening', (items) =>
                items.slice(0, 20).map((item) => {
                    const anchor = item.querySelector('a');
                    const title = anchor?.textContent?.trim() || '';
                    const dept = item.closest('section')?.querySelector('.department')?.textContent?.trim() || '';
                    const location = item.querySelector('.location')?.textContent?.trim() || '';
                    const href = anchor?.href || '';
                    return { title, dept, location, href };
                })
            );

            for (const item of jobItems) {
                if (!item.title || !item.href) continue;

                jobs.push({
                    title: item.title,
                    company: companySlug,
                    location: item.location || 'Remote',
                    workMode: this.inferWorkMode(item.location),
                    skills: [],
                    tags: [item.dept].filter(Boolean),
                    description: `${item.title} opening at ${companySlug} (${item.dept}). Apply via Greenhouse.`,
                    sourceUrl: item.href,
                    source: 'greenhouse',
                    postedAt: new Date(),
                });
            }

            logger.info(`Greenhouse ${companySlug}: scraped ${jobs.length} jobs`);
        } catch (error) {
            logger.error(`Greenhouse ${companySlug} scrape failed:`, error);
        } finally {
            if (page) await page.close();
        }

        return jobs;
    }

    /**
     * Scrape a Lever board
     */
    async scrapeLeverBoard(companySlug: string): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        let page: Page | null = null;

        try {
            page = await this.newPage();
            const url = `https://jobs.lever.co/${companySlug}`;
            logger.info(`Scraping Lever board: ${companySlug}`);

            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await sleep(2000);

            const jobItems = await page.$$eval('.posting', (items) =>
                items.slice(0, 20).map((item) => {
                    const anchor = item.querySelector('a.posting-title');
                    const title = item.querySelector('h5')?.textContent?.trim() || '';
                    const location = item.querySelector('.posting-categories .sort-by-location')?.textContent?.trim() || '';
                    const team = item.querySelector('.posting-categories .sort-by-team')?.textContent?.trim() || '';
                    const href = anchor?.href || '';
                    return { title, location, team, href };
                })
            );

            for (const item of jobItems) {
                if (!item.title || !item.href) continue;

                jobs.push({
                    title: item.title,
                    company: companySlug,
                    location: item.location || 'Remote',
                    workMode: this.inferWorkMode(item.location),
                    skills: [],
                    tags: [item.team].filter(Boolean),
                    description: `${item.title} at ${companySlug} (${item.team}). Apply via Lever.`,
                    sourceUrl: item.href,
                    source: 'lever',
                    postedAt: new Date(),
                });
            }

            logger.info(`Lever ${companySlug}: scraped ${jobs.length} jobs`);
        } catch (error) {
            logger.error(`Lever ${companySlug} scrape failed:`, error);
        } finally {
            if (page) await page.close();
        }

        return jobs;
    }

    /**
     * Infer work mode from location string
     */
    private inferWorkMode(location: string): 'remote' | 'hybrid' | 'onsite' {
        const lower = location.toLowerCase();
        if (lower.includes('remote')) return 'remote';
        if (lower.includes('hybrid')) return 'hybrid';
        return 'onsite';
    }

    /**
     * Run all scrapers and return combined results
     */
    async scrapeAll(): Promise<RawJob[]> {
        const GREENHOUSE_COMPANIES = ['stripe', 'figma', 'notion', 'airtable', 'vercel'];
        const LEVER_COMPANIES = ['linear', 'loom', 'retool', 'runway'];

        const [ycJobs, wfJobs, ghJobs, lvJobs] = await Promise.allSettled([
            this.scrapeYCombinator(),
            this.scrapeWellfound(),
            Promise.all(GREENHOUSE_COMPANIES.map((slug) => this.scrapeGreenhouseBoard(slug))).then((r) => r.flat()),
            Promise.all(LEVER_COMPANIES.map((slug) => this.scrapeLeverBoard(slug))).then((r) => r.flat()),
        ]);

        const all: RawJob[] = [];
        if (ycJobs.status === 'fulfilled') all.push(...ycJobs.value);
        if (wfJobs.status === 'fulfilled') all.push(...wfJobs.value);
        if (ghJobs.status === 'fulfilled') all.push(...ghJobs.value);
        if (lvJobs.status === 'fulfilled') all.push(...lvJobs.value);

        logger.info(`Total scraped: ${all.length} jobs from all sources`);
        return all;
    }
}

export const scraperService = new ScraperService();
