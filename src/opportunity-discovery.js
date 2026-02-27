/**
 * Opportunity Discovery Engine
 * Analyzes user goals and recommends business opportunities
 */

export async function findOpportunities(userInput, env) {
  const { goal, interests, riskTolerance, timeframe } = userInput;

  // Parse the goal to extract target revenue
  const revenueTarget = parseRevenueGoal(goal);

  // Base opportunity set
  const allOpportunities = getBaseOpportunities();

  // Score based on user preferences
  const scoredOpps = allOpportunities.map((opp) => {
    let score = 50; // Base score

    // Revenue potential
    if (revenueTarget <= 1000 && opp.minRevenueTarget <= 1000) score += 20;
    if (
      revenueTarget > 1000 &&
      revenueTarget <= 5000 &&
      opp.minRevenueTarget <= 5000
    )
      score += 20;
    if (revenueTarget > 5000 && opp.minRevenueTarget > 5000) score += 20;

    // Build speed
    if (timeframe.includes("week") && opp.buildDays <= 7) score += 15;
    if (timeframe.includes("month") && opp.buildDays <= 30) score += 15;

    // Risk tolerance
    if (riskTolerance === "low" && opp.riskLevel === "low") score += 15;
    if (riskTolerance === "medium" && opp.riskLevel !== "extreme") score += 10;
    if (riskTolerance === "high") score += 10; // Adventurous gets bonus

    // Interest match
    if (interests.length > 0) {
      const intersect = interests.filter((i) =>
        opp.categories.some((c) => c.toLowerCase().includes(i.toLowerCase()))
      );
      score += intersect.length * 10;
    }

    return { ...opp, score };
  });

  return scoredOpps;
}

function parseRevenueGoal(goal) {
  // Extract number from goal like "Make me $10K/month"
  const match = goal.match(/\$?(\d+[KMB]?)/i);
  if (!match) return 5000; // Default to $5K

  const num = parseInt(match[1]);
  if (match[1].toUpperCase().includes("K")) return num * 1000;
  if (match[1].toUpperCase().includes("M")) return num * 1000000;
  return num;
}

function getBaseOpportunities() {
  return [
    {
      id: "token-launch",
      name: "Crypto Token Launch",
      description:
        "Create and launch a meme/utility token on Base chain using Clanker",
      type: "token",
      categories: ["Crypto", "Quick Money"],
      buildDays: 0.5,
      minRevenueTarget: 500,
      maxRevenueTarget: 100000,
      effort: "Very Low",
      riskLevel: "high",
      roi: "500-10000x (but volatile)",
      revenueProjection: "$500-$50K per launch (highly variable)",
      buildTime: "2 hours to launch",
      whyThisWorks:
        "Clanker automates token creation. Community hype drives initial volume. Potential for quick wins.",
      pros: [
        "Fastest to money",
        "Zero technical knowledge needed",
        "High upside if hype catches",
      ],
      cons: [
        "High failure rate",
        "Volatile",
        "Regulatory uncertainty",
        "Requires marketing skill",
      ],
    },
    {
      id: "niche-saas",
      name: "Niche AI SaaS Tool",
      description: "Build a highly specific SaaS tool (e.g., AI email writer)",
      type: "saas",
      categories: ["SaaS", "Sustainable"],
      buildDays: 5,
      minRevenueTarget: 1000,
      maxRevenueTarget: 50000,
      effort: "Medium",
      riskLevel: "medium",
      roi: "2-5x per customer (recurring)",
      revenueProjection: "$2-10K MRR with 20-50 customers",
      buildTime: "3-5 days to MVP",
      whyThisWorks:
        "SaaS has predictable revenue. Niche focus means less competition. People pay for tools that save time.",
      pros: [
        "Recurring revenue",
        "Scalable",
        "Less competition in niches",
        "Predictable income",
      ],
      cons: ["Takes longer to build", "Needs customer acquisition", "Support required"],
    },
    {
      id: "affiliate-network",
      name: "Affiliate Marketing Network",
      description:
        "Promote high-commission products (Stripe, HubSpot, Semrush) via Twitter",
      type: "affiliate",
      categories: ["Marketing", "Quick Money"],
      buildDays: 1,
      minRevenueTarget: 100,
      maxRevenueTarget: 10000,
      effort: "Low",
      riskLevel: "low",
      roi: "10-30% commission per sale",
      revenueProjection: "$500-$2K MRR with consistent promotion",
      buildTime: "1 day setup",
      whyThisWorks:
        "Zero product build. Leverage existing products. High-value B2B commissions.",
      pros: [
        "No product to build",
        "Fast setup",
        "Low effort",
        "Passive if audience grows",
      ],
      cons: [
        "Needs audience",
        "Low conversion",
        "Requires constant promotion",
        "Limited upside",
      ],
    },
    {
      id: "content-monetization",
      name: "Monetized Content Creator",
      description:
        "Build Twitter presence + newsletter with sponsorships, ads, courses",
      type: "content",
      categories: ["Content", "Long-term"],
      buildDays: 30,
      minRevenueTarget: 500,
      maxRevenueTarget: 50000,
      effort: "Medium-High",
      riskLevel: "low",
      roi: "1-5x per month as audience grows",
      revenueProjection: "$1-5K MRR at 10-50K followers",
      buildTime: "4+ weeks to meaningful revenue",
      whyThisWorks:
        "Multiple monetization layers (sponsors, ads, courses, tips). Compound growth as audience builds.",
      pros: [
        "Multiple income streams",
        "Compound growth",
        "Brand value",
        "Long-term asset",
      ],
      cons: [
        "Slow to start",
        "Requires consistent posting",
        "Audience building is hard",
        "Volatile sponsorship deals",
      ],
    },
    {
      id: "automated-service",
      name: "Automated Service Business",
      description:
        "Offer services (copywriting, design, consulting) with AI handling delivery",
      type: "service",
      categories: ["Services", "Quick Money"],
      buildDays: 2,
      minRevenueTarget: 500,
      maxRevenueTarget: 20000,
      effort: "Low-Medium",
      riskLevel: "low",
      roi: "50-200% markup on AI costs",
      revenueProjection: "$1-5K MRR with 10-20 clients",
      buildTime: "1-2 days setup",
      whyThisWorks:
        "High margins. AI does the work. Customers pay premium for quality.",
      pros: [
        "Fast setup",
        "High margins",
        "Recurring if retainer model",
        "Low overhead",
      ],
      cons: [
        "Customer acquisition needed",
        "Support required",
        "Scaling is limited by time",
      ],
    },
    {
      id: "ecommerce-ai",
      name: "AI-Powered Ecommerce Store",
      description:
        "Dropshipping/POD store with AI product discovery and marketing",
      type: "ecommerce",
      categories: ["Ecommerce", "Quick Money"],
      buildDays: 3,
      minRevenueTarget: 500,
      maxRevenueTarget: 30000,
      effort: "Low-Medium",
      riskLevel: "medium",
      roi: "20-50% per sale",
      revenueProjection: "$1-3K MRR with consistent traffic",
      buildTime: "2-3 days to store launch",
      whyThisWorks:
        "AI finds winning products. Automation handles fulfillment. No inventory needed.",
      pros: [
        "No inventory",
        "Automated fulfillment",
        "Scalable",
        "Profitable products",
      ],
      cons: [
        "Shipping delays",
        "Customer service",
        "Competitive",
        "Needs consistent marketing",
      ],
    },
    {
      id: "trading-bot",
      name: "Crypto Trading Bot",
      description: "Automated trading bot with AI-driven strategy",
      type: "trading",
      categories: ["Crypto", "Advanced"],
      buildDays: 14,
      minRevenueTarget: 5000,
      maxRevenueTarget: 1000000,
      effort: "High",
      riskLevel: "extreme",
      roi: "Variable (highly dependent on market)",
      revenueProjection: "Unknown (market dependent)",
      buildTime: "1-2 weeks build + testing",
      whyThisWorks:
        "Algorithmic trading exploits market inefficiencies. Passive once running.",
      pros: [
        "Passive if successful",
        "High upside",
        "Scalable",
        "Always trading",
      ],
      cons: [
        "High risk",
        "Requires deep crypto knowledge",
        "Regulatory issues",
        "Market risk",
      ],
    },
  ];
}
