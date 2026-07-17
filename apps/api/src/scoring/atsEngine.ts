export interface ScoringInputs {
    skillMatch: number; // 0-100
    semanticSimilarity: number; // 0-100
    experienceMatch: number; // 0-100
    keywordCoverage: number; // 0-100
    formattingScore: number; // 0-100
    educationScore: number; // 0-100
}

export interface ScoringWeights {
    skillMatch: 0.35;
    semanticSimilarity: 0.25;
    experienceMatch: 0.15;
    keywordCoverage: 0.10;
    formattingScore: 0.10;
    educationScore: 0.05;
}

/**
 * Calculates the overall ATS score strictly based on the deterministic formula.
 * NEVER uses an LLM for the actual score computation to ensure consistency and explainability.
 * 
 * Formula:
 * score = skillMatch * 0.35 + semanticSimilarity * 0.25 + experienceMatch * 0.15 + 
 *         keywordCoverage * 0.10 + formattingScore * 0.10 + educationScore * 0.05
 */
export function calculateAtsScore(inputs: ScoringInputs): number {
    const score = 
        (inputs.skillMatch * 0.35) +
        (inputs.semanticSimilarity * 0.25) +
        (inputs.experienceMatch * 0.15) +
        (inputs.keywordCoverage * 0.10) +
        (inputs.formattingScore * 0.10) +
        (inputs.educationScore * 0.05);
        
    return Math.min(Math.max(score, 0), 100); // Clamp between 0 and 100
}

/**
 * Utility to calculate basic skill match percentage.
 */
export function calculateSkillMatch(resumeSkills: string[], jobSkills: string[]): number {
    if (!jobSkills.length) return 100; // If no required skills, default to 100%
    
    // Normalize case for comparison
    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
    const jobSet = new Set(jobSkills.map(s => s.toLowerCase()));
    
    let matchCount = 0;
    for (const jobSkill of jobSet) {
        if (resumeSet.has(jobSkill)) {
            matchCount++;
        }
    }
    
    return (matchCount / jobSet.size) * 100;
}
