export interface CategoryScore {
    category: string;
    score: number;
    weight: number;
}

export interface ScoringResult {
    totalScore: number;
    categories: CategoryScore[];
    missingKeywords: string[];
}

export function calculateMatchScore(resumeText: string, jobText: string): ScoringResult {
    const resumeLower = resumeText.toLowerCase();
    const jobLower = jobText.toLowerCase();

    // 1. Keyword Match (Weight: 40%)
    const words = jobLower.replace(/[^\w\s]/g, '').split(/\s+/);
    const keywords = Array.from(new Set(words.filter(w => w.length > 4)));
    
    let matchCount = 0;
    const missingKeywords: string[] = [];

    keywords.forEach(keyword => {
        if (resumeLower.includes(keyword)) {
            matchCount++;
        } else {
            missingKeywords.push(keyword);
        }
    });

    const keywordScore = keywords.length > 0 ? Math.round((matchCount / keywords.length) * 100) : 0;

    // 2. Action Verbs Match (Weight: 30%)
    const actionVerbs = ['developed', 'managed', 'led', 'created', 'designed', 'optimized', 'increased', 'reduced', 'implemented'];
    let verbMatchCount = 0;
    actionVerbs.forEach(verb => {
        if (resumeLower.includes(verb)) {
            verbMatchCount++;
        }
    });
    const verbScore = Math.round((verbMatchCount / actionVerbs.length) * 100);

    // 3. Length / Detail Depth (Weight: 30%)
    // Assuming a good resume has around 300+ words
    const resumeWords = resumeLower.split(/\s+/).length;
    let lengthScore = Math.round((resumeWords / 300) * 100);
    if (lengthScore > 100) lengthScore = 100;

    const totalScore = Math.round((keywordScore * 0.4) + (verbScore * 0.3) + (lengthScore * 0.3));

    return {
        totalScore,
        categories: [
            { category: 'Keyword Match', score: keywordScore, weight: 40 },
            { category: 'Action Verbs', score: verbScore, weight: 30 },
            { category: 'Content Depth', score: lengthScore, weight: 30 }
        ],
        missingKeywords: missingKeywords.slice(0, 10)
    };
}
