import Link from "next/link";
import {
  BarChart3,
  Filter,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet
} from "lucide-react";

const audiencePaths = [
  {
    id: "for-teams",
    badge: "Agencies & campaign leads",
    title: "Ship client-ready campaigns without the spreadsheet chaos",
    summary:
      "Built for managers juggling multiple briefs who need fast discovery, comparable metrics, and less back-and-forth.",
    bullets: [
      "Advanced filters and side-by-side evaluation",
      "Performance snapshots you can stand behind in a client call",
      "Bulk-friendly flows to shortlist and move faster"
    ],
    cta: { href: "/register", label: "Create workspace" },
    secondary: { href: "/discover", label: "Preview discovery" }
  },
  {
    id: "for-brands",
    badge: "Brand & in-house teams",
    title: "Run influencer programs with guidance—not guesswork",
    summary:
      "For teams running campaigns without an agency: clear next steps, recommendations, and a calmer path from budget to launch.",
    bullets: [
      "Guided campaign setup instead of a blank canvas",
      "Suggestions that highlight strong fits for your brief",
      "Pricing and ROI framing so decisions feel safer"
    ],
    cta: { href: "/register", label: "Get started" },
    secondary: { href: "/discover", label: "Browse creators" }
  },
  {
    id: "for-creators",
    badge: "Creators",
    title: "Find paid work, stay in one thread, get clarity on deliverables",
    summary:
      "Built for mobile-first creators who want to apply fast, see what brands expect, and spend less time chasing updates.",
    bullets: [
      "Campaign cards with clear scope and expectations",
      "Fast chat so negotiations do not stall in DMs",
      "Visibility into milestones and payment status"
    ],
    cta: { href: "/register", label: "Join & find campaigns" },
    secondary: { href: "/campaigns", label: "Browse campaigns" }
  }
] as const;

const capabilityBlocks = [
  {
    icon: Filter,
    title: "Discovery that keeps up with you",
    detail: "Slice by niche, audience size, and engagement so you are not manually combing feeds."
  },
  {
    icon: ShieldCheck,
    title: "Signals you can trust",
    detail: "Surface quality cues beyond vanity metrics—so fake followers and hollow reach are easier to spot."
  },
  {
    icon: Sparkles,
    title: "Recommendations, not noise",
    detail: "Ranked suggestions highlight strong fits when you do not have time to compare every profile."
  },
  {
    icon: MessageCircle,
    title: "One deal thread",
    detail: "Negotiate, align on deliverables, and keep context in chat instead of scattered email."
  },
  {
    icon: BarChart3,
    title: "Reporting-ready tracking",
    detail: "Live status, applicants, and performance snapshots you can export when the client asks."
  },
  {
    icon: Wallet,
    title: "Transparent expectations",
    detail: "Creators see clear briefs; brands see structured deliverables—fewer surprises for everyone."
  }
] as const;

const brandSteps = [
  "Define your campaign goals, budget, and audience.",
  "Discover or accept recommended creators that match the brief.",
  "Align in chat, track delivery, and capture results in one workspace."
];

const creatorSteps = [
  "Browse open campaigns that fit your platforms and rates.",
  "Apply or pitch with everything visible up front.",
  "Deliver updates in-app, message brands quickly, and track milestones."
];

export default function HomePage() {
  return (
    <div className="space-y-12 pb-10">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-12 text-white sm:px-8 sm:py-14">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">
          Influencer marketplace platform
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          Match trusted creators, launch faster, and keep every deal in one place.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-indigo-100 sm:text-lg">
          Whether you run ten client campaigns or your first in-house collab, InfluApp replaces the patchwork of
          spreadsheets, DMs, and screenshots with discovery, chat, and tracking built for speed and clarity.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50"
          >
            Create free account
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center justify-center rounded-xl border border-white/40 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Browse creators
          </Link>
          <Link href="/login" className="text-center text-sm font-medium text-indigo-100 underline-offset-4 hover:underline sm:ml-1">
            Already have access? Log in
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-indigo-100">
          <span className="rounded-full bg-white/10 px-3 py-1">Agencies</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Brands</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Creators</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Ops-ready quality signals</span>
        </div>
      </section>

      <section id="for-teams" className="scroll-mt-8 space-y-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Who InfluApp is for</h2>
          <p className="mt-2 text-slate-600">
            Three personas, one platform—each gets flows tuned to how they work, not a single generic dashboard.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {audiencePaths.map((block) => (
            <article key={block.id} id={block.id} className="flex flex-col scroll-mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{block.badge}</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{block.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{block.summary}</p>
              <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-700">
                {block.bullets.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={block.cta.href}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
                >
                  {block.cta.label}
                </Link>
                <Link
                  href={block.secondary.href}
                  className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  {block.secondary.label}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-6 py-6 sm:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Trust and quality by design</h2>
              <p className="mt-1 text-sm text-slate-600">
                Operations-minded controls—verification cues, structured deliverables, and dispute-ready
                history—keep the marketplace credible for brands and fair for creators.
              </p>
            </div>
          </div>
          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            See it in your workspace
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Capabilities mapped to real workflows</h2>
          <p className="mt-2 text-slate-600">
            Every feature answers a recurring pain point: slow discovery, fuzzy metrics, scattered comms, and late
            reporting.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityBlocks.map(({ icon: Icon, title, detail }) => (
            <article key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Two guided paths—pick the lane that matches your role. Both stay inside the same platform, so handoffs
          between brand, agency, and creator stay visible.
        </p>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <LayoutDashboard className="h-4 w-4" aria-hidden />
              Brands & agencies
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              {brandSteps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/campaigns/create" className="mt-5 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Start a guided campaign →
            </Link>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
              <Users className="h-4 w-4" aria-hidden />
              Creators
            </div>
            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              {creatorSteps.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <Link href="/campaigns" className="mt-5 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-500">
              Explore open campaigns →
            </Link>
          </div>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Start on the free MVP tier to validate workflows with your team. When you are ready for deeper analytics,
          bulk actions, and client-ready exports, upgrade to unlock advanced reporting and automation.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-sm font-semibold text-slate-900">MVP — Free</p>
            <p className="mt-2 text-sm text-slate-600">Core discovery, chat, campaign tracking, and profile essentials.</p>
          </div>
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
            <p className="text-sm font-semibold text-slate-900">Teams — Coming next</p>
            <p className="mt-2 text-sm text-slate-600">
              Advanced filters, bulk shortlisting, richer performance dashboards, and exportable reports for client
              reviews.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-10 text-white sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Ready to replace the busywork?</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Join agencies scaling partnerships, brands launching with confidence, and creators who want steady,
              transparent work—all in one workspace.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Register free
            </Link>
            <Link
              href="/discover"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Preview discovery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
