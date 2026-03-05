import https from 'https';
import logger from '../../shared/logger';

export interface RawJob {
    title: string;
    company: string;
    location: string;
    workMode: 'remote' | 'hybrid' | 'onsite';
    skills: string[];
    tags: string[];
    description: string;
    sourceUrl: string;
    source: 'greenhouse' | 'lever';
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
    return html
        .replace(/<[^>]+>/g, ' ')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 2000);
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
            'python', 'typescript', 'javascript', 'react', 'node', 'go', 'rust', 'java',
            'c++', 'kotlin', 'swift', 'sql', 'nosql', 'postgres', 'mongodb', 'redis',
            'aws', 'gcp', 'azure', 'kubernetes', 'docker', 'terraform', 'ml', 'ai',
            'llm', 'pytorch', 'tensorflow', 'spark', 'kafka', 'graphql', 'rest',
        ];
        const lower = text.toLowerCase();
        return techKeywords.filter((kw) => lower.includes(kw));
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
            ['deepmind', 'DeepMind'],
            ['brex', 'Brex'],
            ['plaid', 'Plaid'],
        ];

        // Companies on Lever with working public boards
        const LEVER_COMPANIES: Array<[string, string]> = [
            ['vercel', 'Vercel'],
            ['scale', 'Scale AI'],
            ['huggingface', 'HuggingFace'],
            ['cohere', 'Cohere'],
            ['mistral', 'Mistral AI'],
        ];

        logger.info('[Scraper] Starting API-based job collection...');

        const greenhouseResults = await Promise.allSettled(
            GREENHOUSE_COMPANIES.map(([slug, name]) => this.scrapeGreenhouseCompany(slug, name))
        );

        const leverResults = await Promise.allSettled(
            LEVER_COMPANIES.map(([slug, name]) => this.scrapeLeverCompany(slug, name))
        );

        const all: RawJob[] = [];

        for (const r of [...greenhouseResults, ...leverResults]) {
            if (r.status === 'fulfilled') all.push(...r.value);
        }

        logger.info(`[Scraper] Total scraped: ${all.length} jobs from all sources`);
        return all;
    }

    // Keep for backwards compat (no-op now)
    async closeBrowser(): Promise<void> { }
}

export const scraperService = new ScraperService();
