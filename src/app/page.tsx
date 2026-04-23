import Link from "next/link";

const features = [
  { title: "Smart Discovery", detail: "Filter by followers, category, and engagement in seconds." },
  { title: "Built-in Chat", detail: "Negotiate and align quickly with a single deal thread." },
  { title: "Campaign Tracking", detail: "See live status, applicants, and performance snapshots." }
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-14 text-white">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-100">Influencer Marketplace Platform</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Find the Right Influencers. Launch Campaigns Faster.
        </h1>
        <p className="mt-4 max-w-2xl text-indigo-100">
          All-in-one workspace for agencies, brands, and creators to connect, collaborate, and grow.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/dashboard" className="rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700">
            Start Free
          </Link>
          <Link href="/discover" className="rounded-xl border border-indigo-200 px-5 py-3 font-semibold text-white">
            Explore Influencers
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((item) => (
          <article key={item.title} className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </article>
        ))}
      </section>

      <section id="how-it-works" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        <p className="mt-2 text-slate-600">
          Create a campaign, discover matching creators, and launch faster with messaging and tracking in one place.
        </p>
      </section>

      <section id="pricing" className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
        <p className="mt-2 text-slate-600">Start free for MVP access, then upgrade for advanced filters and analytics.</p>
      </section>
    </div>
  );
}
