export function calculateFinalScore(categoryScores: any) {
  let total = 0;

  Object.values(categoryScores).forEach((c: any) => {
    total += (c.score / 100) * c.weight;
  });

  return Math.round(total);
}