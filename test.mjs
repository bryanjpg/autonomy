import { findOpportunities } from "./src/opportunity-discovery.js";

const opportunities = await findOpportunities({
  goal: "Make me $10K/month",
  interests: ["crypto", "automation"],
  riskTolerance: "medium",
  timeframe: "3 months",
});

console.log("📊 Opportunity Discovery Test\n");
console.log(`Found ${opportunities.length} opportunities\n`);

// Sort by score and show top 3
const topThree = opportunities.sort((a, b) => b.score - a.score).slice(0, 3);

topThree.forEach((opp, i) => {
  console.log(`${i + 1}. ${opp.name}`);
  console.log(`   Score: ${opp.score}/100`);
  console.log(`   Type: ${opp.type}`);
  console.log(`   Build Time: ${opp.buildTime}`);
  console.log(`   Revenue: ${opp.revenueProjection}`);
  console.log(`   Why: ${opp.whyThisWorks}`);
  console.log("");
});
