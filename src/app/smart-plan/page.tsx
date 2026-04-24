"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

type StepId = "requirement" | "strategy" | "concept" | "brief" | "influencer" | "message" | "tracking";

type RequirementData = {
  campaignName: string;
  objective: string;
  productInfo: string;
  targetAudience: string;
  brandTone: string;
  budget: string;
  timeline: string;
  kpi: string;
  doDont: string;
};

type Campaign = {
  id: string;
  name: string;
  status: string;
  budget: string;
  timeRange: string;
  result: string;
};

type InfluencerItem = {
  id: string;
  name: string;
  niche: string;
  followers: string;
};

const stepBar: { id: StepId; label: string }[] = [
  { id: "requirement", label: "Requirement" },
  { id: "strategy", label: "Strategy" },
  { id: "concept", label: "Concept" },
  { id: "brief", label: "Brief" },
  { id: "influencer", label: "Influencer" },
  { id: "message", label: "Message" },
  { id: "tracking", label: "Tracking" },
];

const requirementFields: { key: keyof RequirementData; label: string }[] = [
  { key: "campaignName", label: "Campaign Name" },
  { key: "objective", label: "Objective" },
  { key: "productInfo", label: "Product Info" },
  { key: "targetAudience", label: "Target Audience" },
  { key: "brandTone", label: "Brand Identity/Tone" },
  { key: "budget", label: "Budget" },
  { key: "timeline", label: "Timeline" },
  { key: "kpi", label: "KPI" },
  { key: "doDont", label: "Do & Dont" },
];

const sectionAlias: Record<string, StepId> = {
  requirement: "requirement",
  strategy: "strategy",
  concept: "concept",
  brief: "brief",
  influencer: "influencer",
  message: "message",
  messages: "message",
  tracking: "tracking",
};

const seedInfluencers: InfluencerItem[] = [
  { id: "inf-1", name: "Nina BeautyLab", niche: "Beauty", followers: "420K" },
  { id: "inf-2", name: "FitFocus Max", niche: "Fitness", followers: "280K" },
  { id: "inf-3", name: "Chef Tasty Home", niche: "Food", followers: "150K" },
];

const myCampaignSeed: Campaign[] = [
  { id: "cmp-1", name: "Glow Summer Launch", status: "Active", budget: "$12,000", timeRange: "Jun 1 - Jul 15", result: "78% KPI hit" },
  { id: "cmp-2", name: "Fit Habit Challenge", status: "Draft", budget: "$8,500", timeRange: "May 10 - Jun 20", result: "Pending" },
];

function parseRequirementText(text: string): Partial<RequirementData> {
  const clean = text.toLowerCase();
  const extract = (keyword: string) => {
    const index = clean.indexOf(keyword);
    if (index < 0) return "";
    const source = text.slice(index + keyword.length).trim();
    const line = source.split("\n")[0];
    return line.replace(/^[:\-]\s*/, "").trim();
  };

  return {
    campaignName: extract("campaign name"),
    objective: extract("objective"),
    productInfo: extract("product info"),
    targetAudience: extract("target audience"),
    brandTone: extract("brand"),
    budget: extract("budget"),
    timeline: extract("timeline"),
    kpi: extract("kpi"),
    doDont: extract("do & dont"),
  };
}

export default function SmartPlanPage() {
  const { role } = useUserStore();
  const [promptInput, setPromptInput] = useState("");
  const [activeStep, setActiveStep] = useState<StepId>("requirement");
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlannerVisible, setIsPlannerVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"create" | "list" | "detail">("create");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [requirements, setRequirements] = useState<RequirementData>({
    campaignName: "",
    objective: "",
    productInfo: "",
    targetAudience: "",
    brandTone: "",
    budget: "",
    timeline: "",
    kpi: "",
    doDont: "",
  });
  const [strategyText, setStrategyText] = useState("");
  const [conceptText, setConceptText] = useState("");
  const [briefText, setBriefText] = useState("");
  const [influencerText, setInfluencerText] = useState("");
  const [messageText, setMessageText] = useState("");
  const [trackingText, setTrackingText] = useState("");
  const [selectedInfluencers, setSelectedInfluencers] = useState<InfluencerItem[]>([]);

  const promptHint = useMemo(() => {
    return hasStarted
      ? "Use @Requirement, @Strategy, @Concept, @Brief, @Influencer, @Message, or @Tracking before details."
      : "Start with @Requirement and describe campaign details for AI planning.";
  }, [hasStarted]);

  const applyPromptText = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    const tagMatch = trimmed.match(/^@([a-zA-Z]+)\s*/);
    const section = tagMatch?.[1]?.toLowerCase();
    const resolvedSection = section ? sectionAlias[section] : undefined;
    const payload = tagMatch ? trimmed.replace(/^@[a-zA-Z]+\s*/, "") : trimmed;

    setHasStarted(true);
    setIsPlannerVisible(true);
    if (resolvedSection) setActiveStep(resolvedSection);

    if (!resolvedSection || resolvedSection === "requirement") {
      const parsed = parseRequirementText(payload);
      setRequirements((prev) => ({
        campaignName: parsed.campaignName || prev.campaignName,
        objective: parsed.objective || prev.objective,
        productInfo: parsed.productInfo || prev.productInfo,
        targetAudience: parsed.targetAudience || prev.targetAudience,
        brandTone: parsed.brandTone || prev.brandTone,
        budget: parsed.budget || prev.budget,
        timeline: parsed.timeline || prev.timeline,
        kpi: parsed.kpi || prev.kpi,
        doDont: parsed.doDont || prev.doDont,
      }));
      if (!strategyText) setStrategyText("AI Suggestion: Build phased creator funnel and run awareness to conversion sequence.");
      if (!conceptText) setConceptText("AI Suggestion: Hero concept around authentic lifestyle transformation with before/after storytelling.");
      if (!briefText) setBriefText("AI Suggestion: Provide creator brief with content format, CTA, brand guardrails, and timeline.");
      if (!influencerText) setInfluencerText("AI Suggestion: Prioritize mid-tier creators in beauty and lifestyle with high engagement.");
    } else if (resolvedSection === "strategy") {
      setStrategyText(payload);
    } else if (resolvedSection === "concept") {
      setConceptText(payload);
    } else if (resolvedSection === "brief") {
      setBriefText(payload);
    } else if (resolvedSection === "influencer") {
      setInfluencerText(payload);
    } else if (resolvedSection === "message") {
      setMessageText(payload);
    } else if (resolvedSection === "tracking") {
      setTrackingText(payload);
    }

    return true;
  };

  const applyPrompt = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (applyPromptText(promptInput)) {
      setPromptInput("");
    }
  };

  const updateRequirement = (field: keyof RequirementData, value: string) => {
    setRequirements((prev) => ({ ...prev, [field]: value }));
  };

  const addInfluencer = (item: InfluencerItem) => {
    setSelectedInfluencers((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const removeInfluencer = (id: string) => {
    setSelectedInfluencers((prev) => prev.filter((item) => item.id !== id));
  };

  if (role === "influencer") {
    return (
      <section className="p-6">
        <h1 className="text-2xl font-bold text-slate-900">Smart Plan</h1>
        <p className="mt-2 text-sm text-slate-600">
          This feature is available for agency and brand workspaces. Switch role to continue.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Smart Plan</h1>
          <p className="mt-1 text-sm text-slate-600">Plan your campaign journey from requirements to tracking.</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Back
        </Link>
      </header>

      {viewMode === "list" && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">My Campaign</h2>
            <button
              type="button"
              onClick={() => setViewMode("create")}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Create New Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-2">Campaign Name</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Budget</th>
                  <th className="pb-2">Time Range</th>
                  <th className="pb-2">Result</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {myCampaignSeed.map((campaign) => (
                  <tr key={campaign.id} className="border-t border-slate-100">
                    <td className="py-2">{campaign.name}</td>
                    <td className="py-2">{campaign.status}</td>
                    <td className="py-2">{campaign.budget}</td>
                    <td className="py-2">{campaign.timeRange}</td>
                    <td className="py-2">{campaign.result}</td>
                    <td className="py-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setViewMode("detail");
                        }}
                        className="rounded-lg border border-indigo-300 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        See Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "create" && !isPlannerVisible && (
        <div className="mx-auto w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="smart-plan-input" className="mb-2 block text-sm font-medium text-slate-700">
            AI Prompt Command
          </label>
          <textarea
            id="smart-plan-input"
            rows={9}
            value={promptInput}
            onChange={(event) => setPromptInput(event.target.value)}
            placeholder={promptHint}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              My Campaign
            </button>
            <button
              type="button"
              onClick={() => {
                if (applyPromptText(promptInput)) {
                  setPromptInput("");
                  return;
                }
                setIsPlannerVisible(true);
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}

      {(viewMode === "detail" || (viewMode === "create" && isPlannerVisible)) && (
        <>
          <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            {stepBar.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  activeStep === step.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {index + 1}. {step.label}
              </button>
            ))}
          </div>

          {viewMode === "detail" && selectedCampaign && (
            <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700">
              Viewing campaign: <span className="font-semibold">{selectedCampaign.name}</span>
            </div>
          )}

          {activeStep === "requirement" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Requirement</h2>
              {requirementFields.map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block text-xs font-medium text-slate-600">{field.label}</span>
                  <input
                    value={requirements[field.key]}
                    onChange={(event) => updateRequirement(field.key, event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </label>
              ))}
              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save Requirement
              </button>
            </div>
          )}

          {activeStep === "strategy" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Strategy</h2>
              <textarea
                rows={6}
                value={strategyText}
                onChange={(event) => setStrategyText(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save Strategy
              </button>
            </div>
          )}

          {activeStep === "concept" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Concept</h2>
              <textarea
                rows={6}
                value={conceptText}
                onChange={(event) => setConceptText(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save Concept
              </button>
            </div>
          )}

          {activeStep === "brief" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Brief</h2>
              <textarea
                rows={6}
                value={briefText}
                onChange={(event) => setBriefText(event.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save Brief
              </button>
            </div>
          )}

          {activeStep === "influencer" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Influencer</h2>
                <div className="flex gap-2">
                  <button type="button" className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    Export Excel
                  </button>
                  <button type="button" className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    Share Link
                  </button>
                </div>
              </div>

              <div className="grid gap-3">
                {seedInfluencers.map((item) => (
                  <div key={item.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="font-semibold text-slate-900">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.niche} • {item.followers} followers</div>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => addInfluencer(item)}
                        className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Add to List
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveStep("message")}
                        className="rounded-lg border border-indigo-300 px-2 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">Selected List</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  {selectedInfluencers.length === 0 ? (
                    <li className="text-slate-400">No influencer selected yet.</li>
                  ) : (
                    selectedInfluencers.map((item) => (
                      <li key={item.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                        <span>{item.name}</span>
                        <button
                          type="button"
                          onClick={() => removeInfluencer(item.id)}
                          className="rounded-md border border-rose-300 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                        >
                          Remove
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {activeStep === "message" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Message</h2>
              <textarea
                rows={6}
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                placeholder="Chat with influencers and share campaign messaging."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button type="button" className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                Send URL for Influencer Work
              </button>
            </div>
          )}

          {activeStep === "tracking" && (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Tracking</h2>
                <div className="flex gap-2">
                  <button type="button" className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    Share Link
                  </button>
                  <button type="button" className="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                    Export PDF
                  </button>
                </div>
              </div>
              <textarea
                rows={6}
                value={trackingText}
                onChange={(event) => setTrackingText(event.target.value)}
                placeholder="Track URL performance and campaign outcomes."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          )}

          <form onSubmit={applyPrompt} className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${hasStarted ? "sticky bottom-4" : ""}`}>
            <label htmlFor="smart-plan-input" className="mb-2 block text-sm font-medium text-slate-700">
              AI Prompt Command
            </label>
            <textarea
              id="smart-plan-input"
              rows={hasStarted ? 4 : 9}
              value={promptInput}
              onChange={(event) => setPromptInput(event.target.value)}
              placeholder={promptHint}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">{promptHint}</p>
              <button type="submit" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                Run AI Prompt
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
