import {
  generateTokenNarrative,
  buildTokenCommunity,
  createTokenLaunchPlan,
  estimateTokenROI,
  analyzeTokenMarket,
} from "./src/token-launcher.js";

console.log("🪙 AUTONOMY TOKEN LAUNCHER - FULL TEST\n");
console.log("=".repeat(50) + "\n");

// Step 1: Generate narratives
console.log("STEP 1: Generate Token Narratives");
console.log("-".repeat(50));
const narratives = await generateTokenNarrative(
  "Make me $20K/month",
  ["crypto"]
);
narratives.forEach((n, i) => {
  console.log(`\n${i + 1}. ${n.name}`);
  console.log(`   Angle: ${n.angle}`);
  console.log(`   Expected ROI: ${n.expectedROI}`);
});

// Step 2: Pick one and build community
console.log("\n" + "=".repeat(50));
console.log("\nSTEP 2: Build Community Setup");
console.log("-".repeat(50));
const selectedNarrative = narratives[0]; // Pick "Builder Token"
const community = await buildTokenCommunity(selectedNarrative);
console.log(`\nCommunity Setup for: ${selectedNarrative.name}`);
console.log(
  `Discord channels: ${community.discordServer.channels.map((c) => c.name).join(", ")}`
);
console.log(
  `Twitter content days: ${Object.keys(community.twitterContent).join(", ")}`
);

// Step 3: Get market analysis
console.log("\n" + "=".repeat(50));
console.log("\nSTEP 3: Market Analysis");
console.log("-".repeat(50));
const market = await analyzeTokenMarket();
console.log(`Market Condition: ${market.marketCondition}`);
console.log(`Recommendation: ${market.recommendation}`);

// Step 4: Full launch plan
console.log("\n" + "=".repeat(50));
console.log("\nSTEP 4: Launch Plan");
console.log("-".repeat(50));
const launchPlan = createTokenLaunchPlan(selectedNarrative);
console.log(`\nPhase 1 (${launchPlan.phase1_preparation.duration}):`);
launchPlan.phase1_preparation.tasks.forEach((t) => console.log(`  • ${t}`));
console.log(`\nPhase 2 (${launchPlan.phase2_launch.duration}):`);
launchPlan.phase2_launch.tasks.forEach((t) => console.log(`  • ${t}`));

// Step 5: ROI estimates
console.log("\n" + "=".repeat(50));
console.log("\nSTEP 5: ROI Estimates");
console.log("-".repeat(50));
const roi = estimateTokenROI(500);
console.log("\nInvestment: $500\n");
roi.scenarios.slice(0, 4).forEach((s) => {
  console.log(`${s.outcome}: ${s.multiplier} = $${s.profit} (${s.probability})`);
});
console.log(`\nPortfolio Strategy:`);
console.log(
  `Launch 10 tokens = Expected profit: $${roi.portfolioApproach.launch10Tokens.expectedAvgProfit}`
);
console.log(
  `ROI: ${roi.portfolioApproach.launch10Tokens.roi}`
);

console.log("\n" + "=".repeat(50));
console.log("\n✅ Token Launcher Ready!");
console.log("Next: Launch tweet and hype for 7 days 🚀\n");
