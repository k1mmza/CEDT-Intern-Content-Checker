"use client";

import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";

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
  companyDetail: "Dermatologist-tested skincare for daily routines. HQ Bangkok; shipping SEA."
};

function BrandProfileView() {
  const [companyName, setCompanyName] = useState(mockBrandProfile.companyName);
  const [userName, setUserName] = useState(mockBrandProfile.userName);
  const [position, setPosition] = useState(mockBrandProfile.position);
  const [email, setEmail] = useState(mockBrandProfile.email);
  const [phone, setPhone] = useState(mockBrandProfile.phone);
  const [companyDetail, setCompanyDetail] = useState(mockBrandProfile.companyDetail);
  const avatarUrl = `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(companyName)}`;

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Brand profile</h1>
      <p className="text-slate-600">Company and account details; manage your password in Account.</p>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <img
              src={avatarUrl}
              alt="Company"
              className="h-24 w-24 rounded-2xl border border-slate-200 object-cover"
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
            <button type="button" className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
              Save changes (demo)
            </button>
          </article>

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
            <img
              src={avatarUrl}
              alt={`${mockProfile.name} profile`}
              className="h-14 w-14 rounded-full border border-slate-200 object-cover"
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
