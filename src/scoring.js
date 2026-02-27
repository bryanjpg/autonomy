/**
 * Opportunity Scoring Algorithm
 * Ranks opportunities based on user preferences and market factors
 */

export async function scoreOpportunities(opportunities, userPrefs) {
  const { goal, riskTolerance } = userPrefs;

  return opportunities.map((opp) => {
    let score = opp.score || 50;

    // Effort penalty (prefer faster builds)
    if (opp.buildDays <= 1) score += 25;
    else if (opp.buildDays <= 7) score += 15;
    else if (opp.buildDays <= 30) score += 5;
    else score -= 10;

    // Risk alignment
    if (riskTolerance === "low" && opp.riskLevel === "low") score += 20;
    else if (riskTolerance === "medium" && opp.riskLevel === "medium") score += 20;
    else if (riskTolerance === "high" && opp.riskLevel !== "low") score += 15;

    // Consistency (prefer consistent vs volatile)
    if (opp.type === "token" || opp.type === "trading") score -= 10; // Volatile
    if (opp.type === "saas" || opp.type === "service") score += 10; // Consistent

    // Cap score at 100
    score = Math.min(100, score);

    return { ...opp, score };
  });
}
