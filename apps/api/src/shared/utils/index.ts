import crypto from 'crypto';

/**
 * Generate a stable hash for a URL to detect duplicates
 */
export function hashUrl(url: string): string {
    return crypto.createHash('sha256').update(url.trim().toLowerCase()).digest('hex');
}

/**
 * Normalize a URL by removing tracking params
 */
export function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        // Remove common tracking params
        ['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'referral'].forEach((param) => {
            parsed.searchParams.delete(param);
        });
        return parsed.toString();
    } catch {
        return url;
    }
}

/**
 * Calculate job freshness score (0-100) based on posting date
 */
export function calculateFreshness(postedAt: Date): number {
    const now = new Date();
    const diffMs = now.getTime() - postedAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= 1) return 100;
    if (diffDays <= 3) return 90;
    if (diffDays <= 7) return 75;
    if (diffDays <= 14) return 55;
    if (diffDays <= 30) return 30;
    return 10;
}

/**
 * Calculate estimated company quality score (0-100) based on available signals
 */
export function calculateCompanyScore(signals: {
    hasFunding?: boolean;
    employeeCount?: number;
    isRemote?: boolean;
}): number {
    let score = 50; // baseline

    if (signals.hasFunding) score += 20;
    if (signals.employeeCount) {
        if (signals.employeeCount > 1000) score += 20;
        else if (signals.employeeCount > 100) score += 10;
        else if (signals.employeeCount > 10) score += 5;
    }
    if (signals.isRemote) score += 10;

    return Math.min(100, score);
}

/**
 * Compute final ranking score
 */
export function computeFinalScore(params: {
    matchScore: number;
    freshness: number;
    companyQuality: number;
}): number {
    const { matchScore, freshness, companyQuality } = params;
    return Math.round(
        matchScore * 0.6 + freshness * 0.25 + companyQuality * 0.15
    );
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Chunk an array into smaller arrays
 */
export function chunk<T>(arr: T[], size: number): T[][] {
    return arr.reduce<T[][]>((chunks, item, i) => {
        if (i % size === 0) chunks.push([]);
        chunks[chunks.length - 1].push(item);
        return chunks;
    }, []);
}

/**
 * Extract unique items from array
 */
export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

/**
 * Parse relative time strings like "3 days ago"
 */
export function parseRelativeTime(text: string): Date | null {
    const now = new Date();
    const patterns = [
        { regex: /(\d+)\s*second/i, ms: 1000 },
        { regex: /(\d+)\s*minute/i, ms: 60 * 1000 },
        { regex: /(\d+)\s*hour/i, ms: 60 * 60 * 1000 },
        { regex: /(\d+)\s*day/i, ms: 24 * 60 * 60 * 1000 },
        { regex: /(\d+)\s*week/i, ms: 7 * 24 * 60 * 60 * 1000 },
        { regex: /(\d+)\s*month/i, ms: 30 * 24 * 60 * 60 * 1000 },
    ];

    for (const { regex, ms } of patterns) {
        const match = text.match(regex);
        if (match) {
            const amount = parseInt(match[1], 10);
            return new Date(now.getTime() - amount * ms);
        }
    }

    if (/today|just now/i.test(text)) return now;
    if (/yesterday/i.test(text)) return new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return null;
}
