import https from 'https';
import * as cheerio from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import he from 'he';

// Basic logger mock if Winston isn't used
const logger = {
    info: (msg: string) => console.log(msg),
    warn: (msg: string) => console.warn(msg),
    error: (msg: string) => console.error(msg),
};

export interface RawJob {
    title: string;
    company: string;
    location: string;
    workMode: 'remote' | 'hybrid' | 'onsite';
    skills: string[];
    tags: string[];
    description: string;
    sourceUrl: string;
    source: 'greenhouse' | 'lever' | 'linkedin' | 'remotive';
    postedAt: Date;
    salary?: { min?: number; max?: number; currency?: string };
    experienceYears?: { min?: number; max?: number };
    hasFunding?: boolean;
    employeeCount?: number;
}

// ─── HTTP helpers ─────────────────────────────────────────────────────────────
function fetchJson<T = any>(url: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                Accept: 'application/json',
            },
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data) as T);
                } catch {
                    reject(new Error(`Failed to parse JSON from ${url}`));
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(20000, () => {
            req.destroy();
            reject(new Error(`Request timeout: ${url}`));
        });
    });
}

function stripHtml(html: string): string {
    if (!html) return '';
    const decoded = he.decode(html);

    // Sanitize to keep basic formatting tags but remove scripts/styles/attributes
    const sanitized = sanitizeHtml(decoded, {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div'],
        allowedAttributes: {
            'a': ['href']
        }
    });

    // Limit the raw input strings if they are too massive
    return sanitized.substring(0, 15000);
}

function normalizeUrl(urlStr: string): string {
    try {
        const u = new URL(urlStr);
        // Remove tracking params
        u.searchParams.delete('utm_source');
        u.searchParams.delete('utm_medium');
        u.searchParams.delete('utm_campaign');
        u.searchParams.delete('ref');
        
        // Remove trailing slash
        let clean = u.toString();
        if (clean.endsWith('/')) {
            clean = clean.slice(0, -1);
        }
        return clean;
    } catch {
        return urlStr;
    }
}

export class ScraperService {

    private inferWorkMode(location: string): 'remote' | 'hybrid' | 'onsite' {
        const lower = (location || '').toLowerCase();
        if (lower.includes('remote')) return 'remote';
        if (lower.includes('hybrid')) return 'hybrid';
        return 'onsite';
    }

    private extractTechSkills(text: string): string[] {
        const techKeywords = [
            'Python', 'TypeScript', 'JavaScript', 'React', 'Node.js', 'Go', 'Rust', 'Java',
            'C++', 'Kotlin', 'Swift', 'SQL', 'NoSQL', 'PostgreSQL', 'MongoDB', 'Redis',
            'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Machine Learning', 'AI', 'ML',
            'LLM', 'PyTorch', 'TensorFlow', 'Spark', 'Kafka', 'GraphQL', 'REST', 'Frontend', 'Backend', 'Fullstack',
            'Vue', 'Angular', 'Next.js', 'Spring', 'Django', 'Flask', 'FastAPI'
        ];

        const extracted = new Set<string>();
        for (const kw of techKeywords) {
            const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regex = new RegExp(`(^|\\s|\\W)${escaped}(\\s|\\W|$)`, 'i');
            if (regex.test(text)) {
                extracted.add(kw);
            }
        }
        return Array.from(extracted);
    }

    // ─── Greenhouse API ────────────────────────────────────────────────────────
    async scrapeGreenhouseCompany(slug: string, displayName?: string): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        const company = displayName || slug;

        try {
            logger.info(`[Greenhouse] Fetching ${slug}...`);
            const data = await fetchJson<{ jobs: any[]; meta: { total: number } }>(
                `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`
            );

            const jobList = Array.isArray(data.jobs) ? data.jobs : [];
            for (const j of jobList.slice(0, 40)) {
                const description = stripHtml(j.content || j.title || '');
                const location = j.location?.name || 'Unknown';

                jobs.push({
                    title: (j.title || '').trim(),
                    company,
                    location,
                    workMode: this.inferWorkMode(location),
                    skills: this.extractTechSkills(description),
                    tags: (j.departments || []).map((d: any) => d.name).filter(Boolean),
                    description: description || `${j.title} at ${company}. Apply via Greenhouse.`,
                    sourceUrl: j.absolute_url || `https://boards.greenhouse.io/${slug}`,
                    source: 'greenhouse',
                    postedAt: j.updated_at ? new Date(j.updated_at) : new Date(),
                });
            }

            logger.info(`[Greenhouse] ${slug}: ${jobs.length} jobs fetched`);
        } catch (err: any) {
            logger.error(`[Greenhouse] ${slug} failed: ${err.message}`);
        }

        return jobs;
    }

    // ─── Lever API ────────────────────────────────────────────────────────────
    async scrapeLeverCompany(slug: string, displayName?: string): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        const company = displayName || slug;

        try {
            logger.info(`[Lever] Fetching ${slug}...`);
            const data = await fetchJson<any[]>(
                `https://api.lever.co/v0/postings/${slug}?mode=json&limit=50`
            );

            if (!Array.isArray(data)) return jobs;

            for (const j of data.slice(0, 30)) {
                const description = stripHtml(
                    (j.descriptionPlain || j.description || j.additional || j.text || '')
                );
                const location =
                    j.categories?.location || j.workplaceType || 'Unknown';

                jobs.push({
                    title: (j.text || '').trim(),
                    company,
                    location,
                    workMode: this.inferWorkMode(location),
                    skills: this.extractTechSkills(description),
                    tags: [j.categories?.team, j.categories?.department].filter(Boolean) as string[],
                    description: description || `${j.text} at ${company}. Apply via Lever.`,
                    sourceUrl: j.hostedUrl || j.applyUrl || `https://jobs.lever.co/${slug}`,
                    source: 'lever',
                    postedAt: j.createdAt ? new Date(j.createdAt) : new Date(),
                });
            }

            logger.info(`[Lever] ${slug}: ${jobs.length} jobs fetched`);
        } catch (err: any) {
            logger.error(`[Lever] ${slug} failed: ${err.message}`);
        }

        return jobs;
    }


    // ─── Remotive API ────────────────────────────────────────────────────────────
    async scrapeRemotive(): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        try {
            logger.info(`[Remotive] Fetching frontend/fullstack jobs...`);

            const queries = [
                'https://remotive.com/api/remote-jobs?search=react&limit=40',
                'https://remotive.com/api/remote-jobs?search=frontend&limit=40',
                'https://remotive.com/api/remote-jobs?search=full+stack&limit=40',
                'https://remotive.com/api/remote-jobs?category=software-dev&limit=40'
            ];

            const results = await Promise.allSettled(queries.map(q => fetchJson<{ jobs: any[] }>(q)));
            const seenUrls = new Set<string>();

            for (const r of results) {
                if (r.status === 'fulfilled') {
                    const jobList = Array.isArray(r.value.jobs) ? r.value.jobs : [];
                    for (const j of jobList) {
                        if (seenUrls.has(j.url)) continue;
                        seenUrls.add(j.url);

                        const description = stripHtml(j.description || '');
                        const location = j.candidate_required_location || 'Remote';

                        jobs.push({
                            title: (j.title || '').trim(),
                            company: j.company_name || 'Remotive Job',
                            location,
                            workMode: 'remote',
                            skills: this.extractTechSkills(description),
                            tags: j.tags || [],
                            description: description || `${j.title} at ${j.company_name}.`,
                            sourceUrl: j.url,
                            source: 'remotive',
                            postedAt: j.publication_date ? new Date(j.publication_date) : new Date(),
                        });
                    }
                }
            }
            logger.info(`[Remotive] ${jobs.length} jobs fetched across queries`);
        } catch (err: any) {
            logger.error(`[Remotive] failed: ${err.message}`);
        }
        return jobs;
    }

    // ─── LinkedIn Public RSS/API ────────────────────────────────────────────────────────────
    async scrapeLinkedIn(): Promise<RawJob[]> {
        const jobs: RawJob[] = [];
        try {
            logger.info(`[LinkedIn] Fetching software jobs...`);
            const queries = [
                'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Frontend&location=Worldwide&f_TPR=r86400&start=0',
                'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=React&location=India&f_TPR=r86400&start=0',
                'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=Full%20Stack&location=India&f_TPR=r86400&start=0'
            ];

            const seenUrls = new Set<string>();

            for (const q of queries) {
                try {
                    const res = await fetch(q, {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Accept-Language': 'en-US,en;q=0.9',
                        }
                    });
                    const text = await res.text();
                    if (text.includes('authwall')) {
                        logger.warn('[LinkedIn] Hit authwall, skipping query.');
                        continue;
                    }

                    const $ = cheerio.load(text);
                    const jobElements = $('li').toArray();

                    // Process up to 10 jobs per query to avoid excessive requests, fetch exact details
                    for (const el of jobElements.slice(0, 10)) {
                        const title = $(el).find('.base-search-card__title').text().trim();
                        const company = $(el).find('.base-search-card__subtitle').text().trim();
                        const location = $(el).find('.job-search-card__location').text().trim();
                        const url = $(el).find('.base-card__full-link').attr('href');
                        const time = $(el).find('time').attr('datetime');

                        if (!title || !url || seenUrls.has(url)) continue;
                        seenUrls.add(url);

                        const match = url.match(/-(\d+)\?/);
                        if (!match) continue;
                        const jobId = match[1];

                        // Fetch job description page
                        try {
                            const descRes = await fetch(`https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`, {
                                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
                            });
                            const descText = await descRes.text();
                            const desc$ = cheerio.load(descText);
                            const descriptionHtml = desc$('.show-more-less-html__markup').html() || '';
                            const cleanDesc = stripHtml(descriptionHtml || title);

                            jobs.push({
                                title,
                                company,
                                location,
                                workMode: this.inferWorkMode(location) === 'remote' ? 'remote' : (title.toLowerCase().includes('remote') ? 'remote' : 'onsite'),
                                skills: this.extractTechSkills(cleanDesc),
                                tags: ['LinkedIn'],
                                description: cleanDesc,
                                sourceUrl: url.split('?')[0],
                                source: 'linkedin',
                                postedAt: time ? new Date(time) : new Date(),
                            });
                        } catch (err) {
                            // Ignored specific job details error
                        }
                    }
                } catch (err: any) {
                    logger.warn(`[LinkedIn] Query failed: ${err.message}`);
                }
            }
            logger.info(`[LinkedIn] ${jobs.length} jobs fetched across queries`);
        } catch (err: any) {
            logger.error(`[LinkedIn] failed: ${err.message}`);
        }
        return jobs;
    }

    /**
     * Run all scrapers and return combined results
     */
    async scrapeAll(): Promise<RawJob[]> {
        // Companies on Greenhouse with working public boards
        const GREENHOUSE_COMPANIES: Array<[string, string]> = [
            ['stripe', 'Stripe'],
            ['figma', 'Figma'],
            ['airtable', 'Airtable'],
            ['vercel', 'Vercel'],
            ['anthropic', 'Anthropic'],
            ['databricks', 'Databricks'],
            ['plaid', 'Plaid'],
        ];

        // Companies on Lever with working public boards (excluding duplicates)
        const LEVER_COMPANIES: Array<[string, string]> = [
            ['scale', 'Scale AI'],
        ];

        logger.info('[Scraper] Starting API-based job collection...');

        const [greenhouseResults, leverResults, remotiveResults, linkedinResults] = await Promise.all([
            Promise.allSettled(
                GREENHOUSE_COMPANIES.map(([slug, name]) => this.scrapeGreenhouseCompany(slug, name))
            ),
            Promise.allSettled(
                LEVER_COMPANIES.map(([slug, name]) => this.scrapeLeverCompany(slug, name))
            ),
            this.scrapeRemotive(),
            this.scrapeLinkedIn()
        ]);

        const all: RawJob[] = [...remotiveResults, ...linkedinResults];

        for (const r of [...greenhouseResults, ...leverResults]) {
            if (r.status === 'fulfilled') all.push(...r.value);
        }

        // Deduplicate jobs based on normalized URL
        const seenUrls = new Set<string>();
        const uniqueJobs = all.filter(job => {
            const normalizedUrl = normalizeUrl(job.sourceUrl);
            if (seenUrls.has(normalizedUrl)) {
                return false; // Skip duplicate
            }
            seenUrls.add(normalizedUrl);
            return true;
        });

        logger.info(`[Scraper] Total scraped: ${all.length} jobs from all sources`);
        logger.info(`[Scraper] After deduplication: ${uniqueJobs.length} unique jobs`);
        return uniqueJobs;
    }
}

export const scraperService = new ScraperService();
