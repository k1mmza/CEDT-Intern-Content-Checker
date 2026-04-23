"use client";

import { influencers } from "@/mock/influencers";
import { useUserStore } from "@/store/useUserStore";
import { useMemo, useState } from "react";

type Objective = "Awareness" | "Engagement" | "Conversion";

const objectiveWeights: Record<Objective, { engagement: number; performance: number; cost: number }> = {
  Awareness: { engagement: 0.35, performance: 0.45, cost: 0.2 },
  Engagement: { engagement: 0.55, performance: 0.3, cost: 0.15 },
  Conversion: { engagement: 0.25, performance: 0.4, cost: 0.35 }
};

const objectiveContentIdeas: Record<Objective, string[]> = {
  Awareness: [
    "Creator-led brand introduction with strong hook in first 3 seconds",
    "Lifestyle integration showcasing daily product usage",
    "Behind-the-scenes story to humanize the brand"
  ],
  Engagement: [
    "Comment-driven challenge with a simple participation mechanic",
    "Duet/stitch/react format to trigger social interaction",
    "Community Q&A round-up answering audience objections"
  ],
  Conversion: [
    "Problem-solution demo with clear value proof and CTA",
    "Offer-led short video with urgency trigger and link mention",
    "Testimonial-style script with before/after format"
  ]
};

function formatCurrencyTHB(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0
  }).format(value);
}

export default function SmartAdvisorPage() {
  const { role } = useUserStore();
  const [objective, setObjective] = useState<Objective>("Awareness");
  const [budget, setBudget] = useState(250000);
  const [campaignWeeks, setCampaignWeeks] = useState(4);
  const [prompt, setPrompt] = useState(
    "Need a conversion campaign for skincare in Thailand with budget 300000 THB over 6 weeks. Focus on TikTok and Instagram."
  );
  const [focusCategory, setFocusCategory] = useState<string | null>(null);
  const [preferredPlatforms, setPreferredPlatforms] = useState<string[]>([]);

  const applyPrompt = () => {
    const normalized = prompt.toLowerCase();
    if (!normalized.trim()) return;

    if (normalized.includes("conversion") || normalized.includes("sales") || normalized.includes("roi")) {
      setObjective("Conversion");
    } else if (normalized.includes("engagement") || normalized.includes("interaction")) {
      setObjective("Engagement");
    } else if (normalized.includes("awareness") || normalized.includes("reach")) {
      setObjective("Awareness");
    }

    const budgetMatch =
      normalized.match(/(?:budget|งบ)\s*(?:of|around|about|=|is)?\s*([\d,]+)/) ??
      normalized.match(/([\d,]+)\s*(?:thb|baht)/);
    if (budgetMatch?.[1]) {
      const parsedBudget = Number(budgetMatch[1].replace(/,/g, ""));
      if (!Number.isNaN(parsedBudget)) {
        setBudget(Math.max(50000, parsedBudget));
      }
    }

    const weekMatch = normalized.match(/(\d+)\s*(?:weeks|week|w)/);
    if (weekMatch?.[1]) {
      const parsedWeeks = Number(weekMatch[1]);
      if (!Number.isNaN(parsedWeeks)) {
        setCampaignWeeks(Math.max(2, Math.min(12, parsedWeeks)));
      }
    }

    const categories = ["beauty", "fashion", "fitness", "food", "travel", "tech", "lifestyle"];
    const matchedCategory = categories.find((item) => normalized.includes(item));
    setFocusCategory(matchedCategory ? matchedCategory[0].toUpperCase() + matchedCategory.slice(1) : null);

    const detectedPlatforms: string[] = [];
    if (normalized.includes("tiktok")) detectedPlatforms.push("TikTok");
    if (normalized.includes("instagram") || normalized.includes("ig")) detectedPlatforms.push("Instagram");
    if (normalized.includes("youtube")) detectedPlatforms.push("YouTube");
    setPreferredPlatforms(detectedPlatforms);
  };

  const insights = useMemo(() => {
    const weights = objectiveWeights[objective];

    const scored = influencers
      .map((creator) => {
        const categoryBoost =
          focusCategory && creator.category.toLowerCase() === focusCategory.toLowerCase() ? 0.08 : 0;
        const platformBoost =
          preferredPlatforms.length > 0 &&
          preferredPlatforms.some((platform) => creator.platforms.includes(platform))
            ? 0.08
            : 0;
        const normalizedEngagement = Math.min(creator.engagementRate / 10, 1);
        const normalizedPerformance = Math.min(creator.performanceScore / 100, 1);
        const normalizedCostEfficiency = Math.max(1 - creator.ratePerPost / 20000, 0);

        const fitScore =
          normalizedEngagement * weights.engagement +
          normalizedPerformance * weights.performance +
          normalizedCostEfficiency * weights.cost +
          categoryBoost +
          platformBoost;

        const estimatedViews = Math.round(creator.followers * 0.16 + creator.performanceScore * 120);
        const estimatedEngagementRate = Number((creator.engagementRate * (0.9 + fitScore * 0.3)).toFixed(2));
        const predictedConversions =
          objective === "Conversion"
            ? Math.round(estimatedViews * (estimatedEngagementRate / 100) * 0.08)
            : Math.round(estimatedViews * (estimatedEngagementRate / 100) * 0.03);

        return {
          creator,
          fitScore: Math.round(fitScore * 100),
          estimatedViews,
          estimatedEngagementRate,
          predictedConversions
        };
      })
      .sort((a, b) => b.fitScore - a.fitScore);

    const topCreators = scored.slice(0, 4);
    const totalFit = topCreators.reduce((sum, item) => sum + item.fitScore, 0);

    const creatorBudgetPlan = topCreators.map((item) => {
      const share = totalFit > 0 ? item.fitScore / totalFit : 0.25;
      const allocated = Math.round(budget * share);
      return {
        ...item,
        allocatedBudget: allocated
      };
    });

    const split = {
      creators: Math.round(budget * 0.65),
      paidBoost: Math.round(budget * 0.2),
      production: Math.round(budget * 0.1),
      contingency: Math.round(budget * 0.05)
    };

    const platformMix = [
      { platform: "TikTok", percentage: objective === "Awareness" ? 45 : objective === "Engagement" ? 35 : 30 },
      { platform: "Instagram", percentage: objective === "Awareness" ? 30 : objective === "Engagement" ? 40 : 35 },
      { platform: "YouTube", percentage: objective === "Awareness" ? 25 : objective === "Engagement" ? 25 : 35 }
    ];

    const campaignStructure = [
      `Week 1: Briefing + creator onboarding (${Math.max(1, Math.round(campaignWeeks * 0.25))} week)`,
      `Week 2-${Math.max(2, Math.round(campaignWeeks * 0.75))}: Content production + staged publishing`,
      `Final week: Boost top performers + optimize CTA based on results`
    ];

    return {
      creatorBudgetPlan,
      split,
      platformMix,
      campaignStructure,
      ideas: objectiveContentIdeas[objective]
    };
  }, [budget, campaignWeeks, focusCategory, objective, preferredPlatforms]);

  if (role === "influencer") {
    return (
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Smart Advisor</h1>
        <p className="mt-2 text-sm text-slate-600">
          This feature is available for agency and brand workspaces. Switch role to continue.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-sm">
        <h1 className="text-3xl font-bold">Smart Advisor</h1>
        <p className="mt-2 text-sm text-indigo-100">
          Private AI advisor for matchmaking, performance prediction, and campaign strategy.
        </p>
      </div>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Campaign brief prompt</label>
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          placeholder="Describe your campaign goals, budget, timeline, category, and platforms..."
          className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={applyPrompt}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Analyze Prompt
          </button>
          <span className="text-xs text-slate-500">Smart Advisor uses this prompt to drive recommendations.</span>
        </div>
      </article>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">AI-powered matchmaking</h2>
        <p className="mt-1 text-sm text-slate-600">Best-fit creators, predicted outcomes, and budget allocation.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {insights.creatorBudgetPlan.map((item) => (
            <div key={item.creator.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.creator.name}</h3>
                  <p className="text-xs text-slate-500">{item.creator.category}</p>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700">
                  Fit {item.fitScore}%
                </span>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-slate-600">
                <li>Predicted views: {item.estimatedViews.toLocaleString()}</li>
                <li>Predicted ER: {item.estimatedEngagementRate}%</li>
                <li>Predicted conversions: {item.predictedConversions.toLocaleString()}</li>
                <li>Suggested budget: {formatCurrencyTHB(item.allocatedBudget)}</li>
              </ul>
            </div>
          ))}
        </div>
      </article>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Strategy-first budget split</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>Creator fees: {formatCurrencyTHB(insights.split.creators)}</li>
            <li>Paid boosts: {formatCurrencyTHB(insights.split.paidBoost)}</li>
            <li>Production and editing: {formatCurrencyTHB(insights.split.production)}</li>
            <li>Contingency reserve: {formatCurrencyTHB(insights.split.contingency)}</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Suggested platform mix</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {insights.platformMix.map((entry) => (
              <li key={entry.platform} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{entry.platform}</span>
                <span className="font-semibold text-slate-900">{entry.percentage}%</span>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Campaign structure plan</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            {insights.campaignStructure.map((phase) => (
              <li key={phase}>{phase}</li>
            ))}
          </ol>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">AI content ideas</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            {insights.ideas.map((idea) => (
              <li key={idea}>{idea}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
