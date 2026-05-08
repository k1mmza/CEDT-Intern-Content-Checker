"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

type StepId = "requirement" | "brief";

type RequirementData = {
  campaignName: string;
  objective: string;
  contentAngle: string;
  productInfo: string;
  productLinkOrWebsite: string;
  ctaMessage: string;
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

const stepBar: { id: StepId; label: string }[] = [
  { id: "requirement", label: "Requirement" },
  { id: "brief", label: "Brief" },
];

const requirementFields: { key: keyof RequirementData; label: string }[] = [
  { key: "campaignName", label: "Campaign Name" },
  { key: "objective", label: "Objective" },
  { key: "contentAngle", label: "Content Angle" },
  { key: "productInfo", label: "Product Info" },
  { key: "productLinkOrWebsite", label: "Product link or official website" },
  { key: "ctaMessage", label: "CTA message" },
  { key: "targetAudience", label: "Target Audience" },
  { key: "brandTone", label: "Brand Identity/Tone" },
  { key: "budget", label: "Budget" },
  { key: "timeline", label: "Timeline" },
  { key: "kpi", label: "KPI" },
  { key: "doDont", label: "Do & Dont" },
];

type BriefSubSection = "strategy" | "concept" | "briefBody";

const sectionAlias: Record<string, StepId | BriefSubSection> = {
  requirement: "requirement",
  strategy: "strategy",
  concept: "concept",
  brief: "briefBody",
  influencer: "brief",
  message: "brief",
  messages: "brief",
  tracking: "brief",
};

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
    contentAngle: extract("content angle"),
    productInfo: extract("product info"),
    productLinkOrWebsite: extract("product link") || extract("official website") || extract("website"),
    ctaMessage: extract("cta message") || extract("cta"),
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
    contentAngle: "",
    productInfo: "",
    productLinkOrWebsite: "",
    ctaMessage: "",
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

  const promptHint = useMemo(() => {
    return hasStarted
      ? "Use @Requirement, @Strategy, @Concept, or @Brief before details (brief step covers strategy, concept, and creative brief)."
      : "Start with @Requirement and describe campaign details for AI planning.";
  }, [hasStarted]);

  const applyPromptText = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return false;

    const tagMatch = trimmed.match(/^@([a-zA-Z]+)\s*/);
    const section = tagMatch?.[1]?.toLowerCase();
    const resolved = section ? sectionAlias[section] : undefined;
    const payload = tagMatch ? trimmed.replace(/^@[a-zA-Z]+\s*/, "") : trimmed;

    setHasStarted(true);
    setIsPlannerVisible(true);

    const briefSubs: BriefSubSection[] = ["strategy", "concept", "briefBody"];
    if (resolved === "requirement") {
      setActiveStep("requirement");
    } else if (resolved === "brief" || (resolved && briefSubs.includes(resolved as BriefSubSection))) {
      setActiveStep("brief");
    }

    if (!resolved || resolved === "requirement") {
      const parsed = parseRequirementText(payload);
      setRequirements((prev) => ({
        campaignName: parsed.campaignName || prev.campaignName,
        objective: parsed.objective || prev.objective,
        contentAngle: parsed.contentAngle || prev.contentAngle,
        productInfo: parsed.productInfo || prev.productInfo,
        productLinkOrWebsite: parsed.productLinkOrWebsite || prev.productLinkOrWebsite,
        ctaMessage: parsed.ctaMessage || prev.ctaMessage,
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
    } else if (resolved === "strategy") {
      setStrategyText(payload);
    } else if (resolved === "concept") {
      setConceptText(payload);
    } else if (resolved === "briefBody" || resolved === "brief") {
      setBriefText(payload);
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
          <p className="mt-1 text-sm text-slate-600">Plan your campaign from requirements through the creative brief.</p>
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
                    placeholder={
                      field.key === "productLinkOrWebsite"
                        ? "https://…"
                        : field.key === "ctaMessage"
                          ? "e.g. Shop now, link in bio"
                          : `Enter ${field.label.toLowerCase()}`
                    }
                  />
                </label>
              ))}
              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save Requirement
              </button>
            </div>
          )}

          {activeStep === "brief" && (
            <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Brief</h2>
              <p className="text-xs text-slate-500">Strategy, concept, and creative brief live in one place for creators and stakeholders.</p>

              <div className="space-y-2">
                <span className="block text-xs font-medium text-slate-600">Strategy</span>
                <textarea
                  rows={5}
                  value={strategyText}
                  onChange={(event) => setStrategyText(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-medium text-slate-600">Concept</span>
                <textarea
                  rows={5}
                  value={conceptText}
                  onChange={(event) => setConceptText(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-2">
                <span className="block text-xs font-medium text-slate-600">Creative brief</span>
                <textarea
                  rows={5}
                  value={briefText}
                  onChange={(event) => setBriefText(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <button type="button" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                Save brief
              </button>
            </div>
          )}

          <form onSubmit={applyPrompt} className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${hasStarted ? "sticky bottom-4" : ""}`}>
            <label htmlFor="smart-plan-input-planner" className="mb-2 block text-sm font-medium text-slate-700">
              AI Prompt Command
            </label>
            <textarea
              id="smart-plan-input-planner"
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
