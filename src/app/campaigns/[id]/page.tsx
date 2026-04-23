"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { brandCampaigns, trackingByCampaign } from "@/mock/brand-campaigns";
import { influencers } from "@/mock/influencers";
import { exportRowsToExcel } from "@/lib/excel";

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { role } = useUserStore();
  const [shareMessage, setShareMessage] = useState("");
  const brandCampaign = brandCampaigns.find((c) => c.id === id);
  const canManageCampaign = role === "brand" || role === "agency";

  const influencerRows = useMemo(
    () =>
      influencers.map((influencer, index) => {
        const primaryPlatform = influencer.platforms[0] ?? "Instagram";
        const socialHandle = influencer.name.toLowerCase().replace(/\s+/g, "");
        const socialMediaLink = `https://www.${primaryPlatform.toLowerCase()}.com/${socialHandle}`;
        return {
          marker: index + 1,
          kolName: influencer.name,
          socialMediaLink,
          platform: primaryPlatform,
          platformFollowers: influencer.followers,
          category: influencer.category,
          estimateView: Math.round(influencer.followers * 0.35),
          engagementRate: influencer.engagementRate,
          kolRate: influencer.ratePerPost
        };
      }),
    []
  );

  const copyShareLink = async () => {
    const shareUrl = typeof window === "undefined" ? "" : window.location.href;
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("Campaign link copied.");
    } catch {
      setShareMessage("Unable to copy automatically. Please copy from browser URL.");
    }
  };

  const exportInfluencersExcel = () => {
    exportRowsToExcel({
      filename: `campaign-${id}-influencers.xls`,
      sheetName: "Influencer List",
      headers: [
        "Marker",
        "KOL name",
        "Social media link",
        "Platform",
        "Platform Follower No.",
        "Category/Niche",
        "Estimate view",
        "Engagement Rate",
        "KOL Rate"
      ],
      rows: influencerRows.map((row) => [
        row.marker,
        row.kolName,
        row.socialMediaLink,
        row.platform,
        row.platformFollowers,
        row.category,
        row.estimateView,
        `${row.engagementRate}%`,
        `THB ${row.kolRate}`
      ])
    });
    setShareMessage("Influencer list exported to Excel.");
  };

  if (canManageCampaign && !brandCampaign) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Campaign not found</h1>
        <p className="text-slate-600">This ID is not in your brand campaigns list.</p>
        <Link href="/campaigns" className="text-indigo-600 hover:underline">
          Back to campaigns
        </Link>
      </section>
    );
  }

  if (canManageCampaign && brandCampaign) {
    const rows = trackingByCampaign[id] ?? [];

    return (
      <section className="space-y-6">
        <article className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Campaign management</h1>
              <p className="mt-1 text-sm text-slate-600">{brandCampaign.name}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  brandCampaign.status === "active"
                    ? "bg-emerald-100 text-emerald-800"
                    : brandCampaign.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                }`}
              >
                {brandCampaign.status}
              </span>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {brandCampaign.visibility === "public" ? "Public" : "Private"}
              </span>
            </div>
          </div>
          <div className="mt-4 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <p>Objective: {brandCampaign.objective}</p>
            <p>Platform: {brandCampaign.platform}</p>
            <p>Budget: THB {brandCampaign.budget.toLocaleString()}</p>
            <p>Spent: THB {brandCampaign.spent.toLocaleString()}</p>
            <p>Deadline: {brandCampaign.deadline}</p>
            <p>Influencers joined: {brandCampaign.influencersJoined}</p>
          </div>
        </article>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Influencers &amp; content</h2>
            {rows.length === 0 ? (
              <p className="mt-2 text-sm text-slate-600">No submissions yet. Use Discover to invite creators for private campaigns.</p>
            ) : (
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {rows.map((r) => (
                  <li key={r.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    {r.influencerName} — {r.contentLabel}{" "}
                    <span className="text-slate-400">({r.contentType})</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Actions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href="/discover"
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white"
              >
                Discover influencers
              </Link>
              <Link
                href="/messages"
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700"
              >
                Open messages
              </Link>
              <Link
                href="/tracking"
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700"
              >
                Tracking
              </Link>
            </div>
          </article>
        </div>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Share influencer list</h2>
              <p className="mt-1 text-sm text-slate-600">Share this campaign list by link or export as an Excel file.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700"
              >
                Share link
              </button>
              <button
                type="button"
                onClick={exportInfluencersExcel}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white"
              >
                Export Excel
              </button>
            </div>
          </div>
          {shareMessage ? <p className="mt-3 text-xs font-medium text-emerald-700">{shareMessage}</p> : null}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 font-medium">Marker</th>
                  <th className="px-4 py-2 font-medium">KOL name</th>
                  <th className="px-4 py-2 font-medium">Social media link</th>
                  <th className="px-4 py-2 font-medium">Platform</th>
                  <th className="px-4 py-2 font-medium">Platform Follower No.</th>
                  <th className="px-4 py-2 font-medium">Category/Niche</th>
                  <th className="px-4 py-2 font-medium">Estimate view</th>
                  <th className="px-4 py-2 font-medium">Engagement Rate</th>
                  <th className="px-4 py-2 font-medium">KOL Rate</th>
                </tr>
              </thead>
              <tbody>
                {influencerRows.map((row) => (
                  <tr key={row.kolName} className="border-t border-slate-100">
                    <td className="px-4 py-2 text-slate-700">{row.marker}</td>
                    <td className="px-4 py-2 font-medium text-slate-900">{row.kolName}</td>
                    <td className="px-4 py-2 text-indigo-600">{row.socialMediaLink}</td>
                    <td className="px-4 py-2 text-slate-700">{row.platform}</td>
                    <td className="px-4 py-2 text-slate-700">{row.platformFollowers.toLocaleString()}</td>
                    <td className="px-4 py-2 text-slate-700">{row.category}</td>
                    <td className="px-4 py-2 text-slate-700">{row.estimateView.toLocaleString()}</td>
                    <td className="px-4 py-2 text-slate-700">{row.engagementRate}%</td>
                    <td className="px-4 py-2 text-slate-700">THB {row.kolRate.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <Link href="/campaigns" className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
          Back to campaigns
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <article className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Campaign Detail</h1>
            <p className="mt-1 text-sm text-slate-600">Summer Skincare Awareness Campaign</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white">Apply Now</button>
            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">Save</button>
          </div>
        </div>
        <div className="mt-4 grid gap-1 text-sm text-slate-600">
          <p>Brand: GlowLab</p>
          <p>Platform: TikTok / Instagram</p>
          <p className="text-base font-semibold text-emerald-600">Budget: THB 8,000 - THB 10,000</p>
          <p>Deadline: 30 May 2026</p>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick Stats</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Follower requirement: 10,000+</li>
            <li>Engagement requirement: 3%+</li>
            <li>Content type: Video / Story</li>
            <li>Location: Thailand</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Apply deadline: 20 May 2026</li>
            <li>Submission date: 28 May 2026</li>
            <li>Review date: 30 May 2026</li>
            <li>Payment date: 05 Jun 2026</li>
          </ul>
        </article>
      </div>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Campaign Brief</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          <div>
            <h3 className="font-semibold text-slate-800">Overview</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Goal: Brand awareness</li>
              <li>Brand: Dermatologist-tested skincare</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Requirements</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>1 short video + 3 stories</li>
              <li>Real usage demonstration</li>
              <li>Key message: gentle for daily use</li>
              <li>Do: mention results, Don&apos;t: medical claims</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Deliverables</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>1 TikTok video</li>
              <li>3 IG stories</li>
            </ul>
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Payment Details</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Budget: Range based on experience</li>
            <li>Payment type: Per post / Package</li>
            <li>Method: Bank transfer</li>
          </ul>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Brand Info</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>GlowLab official profile</li>
            <li>Past campaigns available on request</li>
          </ul>
          <button className="mt-4 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white">Message Brand</button>
        </article>
      </div>

      <article className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Similar Campaigns</h2>
        <p className="mt-2 text-sm text-slate-600">Suggested jobs: Beauty routine challenge, skincare review bundle.</p>
      </article>

      <Link href="/campaigns" className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
        Back to Campaigns
      </Link>
    </section>
  );
}
