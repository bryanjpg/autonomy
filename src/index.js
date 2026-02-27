/**
 * AUTONOMY - AI Co-Founder
 * Backend API (Cloudflare Workers)
 * 
 * Discovers, builds, launches, and manages revenue-generating businesses
 */

import { findOpportunities } from "./opportunity-discovery.js";
import { scoreOpportunities } from "./scoring.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/health" && request.method === "GET") {
      return json({ status: "ok", timestamp: new Date().toISOString() });
    }

    // Main endpoint: Discover opportunities
    if (url.pathname === "/api/opportunities" && request.method === "POST") {
      return handleFindOpportunities(request, env);
    }

    // Get business templates
    if (url.pathname === "/api/templates" && request.method === "GET") {
      return handleGetTemplates();
    }

    return json({ error: "Not Found" }, 404);
  },
};

async function handleFindOpportunities(request, env) {
  try {
    const { goal, interests, riskTolerance, timeframe } = await request.json();

    if (!goal) {
      return json(
        {
          error:
            'Missing required field: goal (e.g., "Make me $10K/month passive income")',
        },
        400
      );
    }

    // Find opportunities using AI analysis
    const opportunities = await findOpportunities(
      {
        goal,
        interests: interests || [],
        riskTolerance: riskTolerance || "medium",
        timeframe: timeframe || "3-6 months",
      },
      env
    );

    // Score and rank them
    const scored = await scoreOpportunities(opportunities, {
      goal,
      riskTolerance,
    });

    // Return top 3
    const topThree = scored.sort((a, b) => b.score - a.score).slice(0, 3);

    return json({
      success: true,
      userGoal: goal,
      opportunities: topThree.map((opp) => ({
        id: opp.id,
        name: opp.name,
        description: opp.description,
        type: opp.type,
        estimatedEffort: opp.effort,
        estimatedROI: opp.roi,
        revenueProjection: opp.revenueProjection,
        score: opp.score,
        whyThisWorks: opp.whyThisWorks,
        buildTime: opp.buildTime,
      })),
      nextStep: "Choose one opportunity and we'll build it for you",
    });
  } catch (error) {
    console.error("Error finding opportunities:", error);
    return json(
      { error: error.message || "Failed to find opportunities" },
      500
    );
  }
}

function handleGetTemplates() {
  const templates = [
    {
      id: "token",
      name: "Token Launch (Clanker)",
      description: "Create and launch a crypto token on Base chain",
      effort: "Very Low (30 min)",
      roi: "High (but volatile)",
      buildTime: "2 hours",
      category: "Crypto",
    },
    {
      id: "saas",
      name: "Niche SaaS Tool",
      description: "Build a specific AI tool for one use case",
      effort: "Medium (3-5 days)",
      roi: "Medium-High ($2-10K MRR)",
      buildTime: "3-5 days",
      category: "SaaS",
    },
    {
      id: "affiliate",
      name: "Affiliate Marketing Network",
      description: "Promote high-commission products via Twitter/email",
      effort: "Low (1 day setup)",
      roi: "Medium ($500-2K MRR)",
      buildTime: "1 day",
      category: "Marketing",
    },
    {
      id: "content",
      name: "Monetized Content Creator",
      description:
        "Build Twitter presence, newsletter, or YouTube channel with multiple revenue streams",
      effort: "Medium (2-4 weeks)",
      roi: "Medium ($1-5K MRR)",
      buildTime: "2-4 weeks",
      category: "Content",
    },
    {
      id: "service",
      name: "Automated Service Business",
      description:
        "Offer automated services (consulting, copywriting, design) with AI handling delivery",
      effort: "Low-Medium (1-2 days)",
      roi: "High ($500-5K MRR)",
      buildTime: "1-2 days",
      category: "Services",
    },
    {
      id: "ecommerce",
      name: "AI-Powered Ecommerce",
      description:
        "Dropshipping or print-on-demand store with AI product discovery and marketing",
      effort: "Low-Medium (2-3 days)",
      roi: "Medium ($1-3K MRR)",
      buildTime: "2-3 days",
      category: "Ecommerce",
    },
    {
      id: "trading",
      name: "Crypto Trading Bot",
      description: "Automated trading bot with AI-driven strategy",
      effort: "High (1-2 weeks)",
      roi: "High but risky",
      buildTime: "1-2 weeks",
      category: "Crypto",
    },
  ];

  return json({
    success: true,
    templates,
    count: templates.length,
  });
}

// Helper
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
