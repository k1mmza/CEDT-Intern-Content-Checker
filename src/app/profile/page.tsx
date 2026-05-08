"use client";

import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import type { Role } from "@/lib/types";
import { useReviewStore } from "@/store/useReviewStore";
import { useUserStore } from "@/store/useUserStore";

function ProfileRatingAvatar({
  src,
  alt,
  imgClassName,
  role
}: {
  src: string;
  alt: string;
  imgClassName: string;
  role: Role;
}) {
  const displayName = useUserStore((s) => s.name);
  const reviews = useReviewStore((s) => s.reviews);
  const avg = useMemo(
    () => useReviewStore.getState().getAverageRatingReceived(role, displayName),
    [reviews, role, displayName]
  );
  return (
    <div className="relative inline-block shrink-0">
      <img src={src} alt={alt} className={imgClassName} />
      <div
        className="pointer-events-none absolute -right-1 -top-1 flex items-center gap-0.5 rounded-full border border-rose-100 bg-white px-1.5 py-0.5 text-[11px] font-bold leading-none text-rose-600 shadow-md"
        title="Average rating from partners on finished campaigns"
      >
        <Heart className="h-3.5 w-3.5 shrink-0 fill-rose-500 text-rose-500" aria-hidden />
        <span>{avg != null ? avg.toFixed(1) : "—"}</span>
      </div>
    </div>
  );
}

function ProfileReviewsSection({ role }: { role: Role }) {
  const displayName = useUserStore((s) => s.name);
  const reviews = useReviewStore((s) => s.reviews);
  const written = useMemo(
    () => useReviewStore.getState().getReviewsWrittenBy(role, displayName),
    [reviews, role, displayName]
  );
  const received = useMemo(
    () => useReviewStore.getState().getReviewsReceivedBy(role, displayName),
    [reviews, role, displayName]
  );

  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Partner review ratings</h2>
      <p className="mt-1 text-xs text-slate-500">
        Ratings use your account display name (same as when you submit reviews on a finished campaign).
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Comments you wrote</h3>
          {written.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No reviews yet. Finish a campaign, then rate partners from the campaign page.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {written.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900">
                    {r.rating}/5 → {r.toName} ({r.toRole}) — {r.campaignName}
                  </p>
                  {r.comment ? <p className="mt-1 text-slate-600">&ldquo;{r.comment}&rdquo;</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Comments about you</h3>
          {received.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No partner feedback yet.</p>
          ) : (
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {received.map((r) => (
                <li key={r.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-900">
                    {r.rating}/5 from {r.fromName} ({r.fromRole}) — {r.campaignName}
                  </p>
                  {r.comment ? <p className="mt-1 text-slate-600">&ldquo;{r.comment}&rdquo;</p> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  );
}

const mockInfluencerProfile = {
  name: "Lina Park",
  username: "@linapark.creates",
  bio: "Beauty + lifestyle creator. I make story-driven product content with strong save/share performance.",
  location: "Bangkok, Thailand",
  email: "lina@influapp.mock",
  profileCompleteness: 86,
  totalFollowers: 242000,
  averageViews: 83000,
  engagementRate: 5.4,
  growthRate: 7.2,
  categories: ["Beauty", "Lifestyle", "Travel"],
  socialAccounts: [
    { platform: "TikTok", username: "@linapark.creates", followers: 145000, avgViews: 68000, engagementRate: 5.8 },
    { platform: "Instagram", username: "@linapark.creates", followers: 76000, avgViews: 22000, engagementRate: 4.9 },
    { platform: "YouTube", username: "Lina Park", followers: 21000, avgViews: 12000, engagementRate: 3.9 }
  ],
  audience: {
    gender: "Female 72% / Male 26% / Other 2%",
    age: "18-24 (38%), 25-34 (41%), 35-44 (15%), 45+ (6%)",
    topCountries: ["Thailand 64%", "Malaysia 14%", "Singapore 9%"],
    topCities: ["Bangkok", "Chiang Mai", "Kuala Lumpur"]
  },
  pricing: {
    post: 4500,
    video: 7800,
    bundle: 12000
  },
  services: ["UGC Content", "Product Review", "Affiliate", "Brand Ambassador"],
  portfolio: [
    "Summer Skincare Launch - TikTok x IG Stories",
    "Travel Essentials Reels Series",
    "Daily Routine Product Integration"
  ],
  availability: "Available",
  notificationSettings: {
    messageAlerts: true,
    campaignAlerts: true
  },
  privacy: "Public"
};

const mockBrandProfile = {
  companyName: "GlowLab Co., Ltd.",
  userName: "Sarah Chen",
  position: "Head of Growth",
  email: "sarah.chen@glowlab.mock",
  phone: "+66 2 000 0000",
  companyDetail: "Dermatologist-tested skincare for daily routines. HQ Bangkok; shipping SEA.",
  websiteUrl: "https://www.glowlab.mock",
  socialInstagram: "https://www.instagram.com/glowlab.mock",
  socialFacebook: "https://www.facebook.com/glowlab.mock",
  socialLinkedIn: "https://www.linkedin.com/company/glowlab-mock",
  socialTikTok: "https://www.tiktok.com/@glowlab.mock"
};

const mockAgencyProfile = {
  companyName: "Digital Marketing Agency Co., Ltd.",
  userName: "Sarah Chen",
  position: "Senior Campaign Manager",
  email: "sarah.chen@agency.mock",
  phone: "+66 2 111 2222",
  companyDetail: "Full-service influencer and performance campaigns across SEA. Offices in Bangkok and Singapore.",
  websiteUrl: "https://www.digitalagency.mock",
  socialInstagram: "https://www.instagram.com/digitalagency.mock",
  socialFacebook: "https://www.facebook.com/digitalagency.mock",
  socialLinkedIn: "https://www.linkedin.com/company/digitalagency-mock",
  socialTikTok: ""
};

function BrandProfileView() {
  const { role } = useUserStore();
  const profileRole: Role = role === "agency" ? "agency" : "brand";
  const base = role === "agency" ? mockAgencyProfile : mockBrandProfile;
  const [companyName, setCompanyName] = useState(base.companyName);
  const [userName, setUserName] = useState(base.userName);
  const [position, setPosition] = useState(base.position);
  const [email, setEmail] = useState(base.email);
  const [phone, setPhone] = useState(base.phone);
  const [companyDetail, setCompanyDetail] = useState(base.companyDetail);
  const [websiteUrl, setWebsiteUrl] = useState(base.websiteUrl);
  const [socialInstagram, setSocialInstagram] = useState(base.socialInstagram);
  const [socialFacebook, setSocialFacebook] = useState(base.socialFacebook);
  const [socialLinkedIn, setSocialLinkedIn] = useState(base.socialLinkedIn);
  const [socialTikTok, setSocialTikTok] = useState(base.socialTikTok);
  const avatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}`;
  const heading = role === "agency" ? "Agency profile" : "Brand profile";
  const subline =
    role === "agency"
      ? "Agency and account details; add your site and socials so creators know who they are working with."
      : "Company and account details; add your site and socials for creator trust.";

  return (
    <section key={role} className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{heading}</h1>
      <p className="text-slate-600">{subline} Manage your password in Account.</p>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <ProfileRatingAvatar
              src={avatarUrl}
              alt="Company"
              imgClassName="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
              role={profileRole}
            />
            <p className="mt-3 text-sm text-slate-500">Company logo (demo)</p>
            <button type="button" className="mt-2 text-sm font-semibold text-indigo-600 hover:underline">
              Change image
            </button>
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Company &amp; user</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-slate-600">Company name</span>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Your name</span>
                <input
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Position</span>
                <input
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="text-slate-600">Telephone</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                />
              </label>
            </div>
            <label className="mt-3 block text-sm">
              <span className="text-slate-600">Company details</span>
              <textarea
                value={companyDetail}
                onChange={(e) => setCompanyDetail(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
              />
            </label>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="text-base font-semibold text-slate-900">Website &amp; company socials</h3>
              <p className="mt-1 text-xs text-slate-500">Shown on campaign pages and briefs (demo fields only).</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block text-sm sm:col-span-2">
                  <span className="text-slate-600">Company website</span>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">Instagram</span>
                  <input
                    type="url"
                    value={socialInstagram}
                    onChange={(e) => setSocialInstagram(e.target.value)}
                    placeholder="https://www.instagram.com/…"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">Facebook</span>
                  <input
                    type="url"
                    value={socialFacebook}
                    onChange={(e) => setSocialFacebook(e.target.value)}
                    placeholder="https://www.facebook.com/…"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">LinkedIn</span>
                  <input
                    type="url"
                    value={socialLinkedIn}
                    onChange={(e) => setSocialLinkedIn(e.target.value)}
                    placeholder="https://www.linkedin.com/company/…"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-slate-600">TikTok</span>
                  <input
                    type="url"
                    value={socialTikTok}
                    onChange={(e) => setSocialTikTok(e.target.value)}
                    placeholder="https://www.tiktok.com/@…"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                  />
                </label>
              </div>
            </div>

            <button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
              Save changes (demo)
            </button>
          </article>

          <ProfileReviewsSection role={profileRole} />

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Account</h2>
            <p className="mt-1 text-sm text-slate-600">Change password and security settings (wireframe).</p>
            <div className="mt-3 grid gap-3 sm:max-w-md">
              <input
                type="password"
                placeholder="Current password"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="password"
                placeholder="New password"
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <button type="button" className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800">
                Update password
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function InfluencerProfileView() {
  const mockProfile = mockInfluencerProfile;
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(mockProfile.name)}`;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Influencer Profile Management</h1>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ProfileRatingAvatar
              src={avatarUrl}
              alt={`${mockProfile.name} profile`}
              imgClassName="h-14 w-14 rounded-full border border-slate-200 object-cover"
              role="influencer"
            />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{mockProfile.name}</h2>
              <p className="text-sm text-slate-600">{mockProfile.username}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-700">{mockProfile.bio}</p>
          <div className="mt-4 space-y-1 text-sm text-slate-600">
            <p>{mockProfile.location}</p>
            <p>{mockProfile.email}</p>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-500">Profile Strength</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{mockProfile.profileCompleteness}% complete</p>
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Performance Overview</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Total Followers</p>
                <p className="text-lg font-semibold text-slate-900">{mockProfile.totalFollowers.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Average Views</p>
                <p className="text-lg font-semibold text-slate-900">{mockProfile.averageViews.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Engagement Rate</p>
                <p className="text-lg font-semibold text-slate-900">{mockProfile.engagementRate}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Growth Rate</p>
                <p className="text-lg font-semibold text-emerald-600">+{mockProfile.growthRate}%</p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Social Accounts</h2>
            <div className="mt-3 space-y-2">
              {mockProfile.socialAccounts.map((account) => (
                <div key={account.platform} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{account.platform}</p>
                    <p className="text-slate-500">{account.username}</p>
                  </div>
                  <p className="mt-1 text-slate-600">
                    {account.followers.toLocaleString()} followers | {account.avgViews.toLocaleString()} avg views |{" "}
                    {account.engagementRate}% ER
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>

      <ProfileReviewsSection role="influencer" />

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Content Categories</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {mockProfile.categories.map((category) => (
              <span key={category} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                {category}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Audience Insights</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Demographics: {mockProfile.audience.gender}</li>
            <li>Age Range: {mockProfile.audience.age}</li>
            <li>Top Countries: {mockProfile.audience.topCountries.join(", ")}</li>
            <li>Top Cities: {mockProfile.audience.topCities.join(", ")}</li>
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Pricing &amp; Services</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-600">
            <li>Price per Post: THB {mockProfile.pricing.post.toLocaleString()}</li>
            <li>Price per Video: THB {mockProfile.pricing.video.toLocaleString()}</li>
            <li>Bundle Price: THB {mockProfile.pricing.bundle.toLocaleString()}</li>
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            {mockProfile.services.map((service) => (
              <span key={service} className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700">
                {service}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Portfolio</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {mockProfile.portfolio.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
          <p className="mt-2 text-sm text-slate-600">
            Status: <span className="font-semibold text-emerald-600">{mockProfile.availability}</span>
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Settings</h2>
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            <li>Message Alerts: {mockProfile.notificationSettings.messageAlerts ? "On" : "Off"}</li>
            <li>Campaign Alerts: {mockProfile.notificationSettings.campaignAlerts ? "On" : "Off"}</li>
            <li>Privacy: {mockProfile.privacy}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { role } = useUserStore();
  if (role === "brand" || role === "agency") return <BrandProfileView />;
  return <InfluencerProfileView />;
}
