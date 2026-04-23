import { Influencer } from "@/lib/types";

interface InfluencerCardProps {
  influencer: Influencer;
  isActive?: boolean;
  onSelect?: (influencer: Influencer) => void;
}

export function InfluencerCard({ influencer, isActive = false, onSelect }: InfluencerCardProps) {
  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(influencer.name)}`;

  return (
    <article
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(influencer)}
      onKeyDown={(event) => {
        if (!onSelect) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(influencer);
        }
      }}
      className={`w-full overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
        isActive ? "border-indigo-400 ring-2 ring-indigo-200" : "border-slate-200"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="relative border-b border-slate-100">
        <img src={avatarUrl} alt={`${influencer.name} profile`} className="h-60 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="flex items-end justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold text-white">{influencer.name}</h3>
              <p className="mt-0.5 text-sm text-slate-100">{influencer.category}</p>
            </div>
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              Score {influencer.performanceScore}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {influencer.platforms.map((platform) => (
            <span
              key={platform}
              className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-600"
            >
              {platform}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {influencer.stylePresent.map((style) => (
            <span
              key={style}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
            >
              {style}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-4 px-4 pb-4">
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-slate-500">Followers</p>
            <p className="font-semibold text-slate-900">{influencer.followers.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-slate-500">Engagement</p>
            <p className="font-semibold text-slate-900">{influencer.engagementRate}%</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-2.5">
            <p className="text-slate-500">Rate</p>
            <p className="font-semibold text-slate-900">${influencer.ratePerPost}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="w-full rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Add to list
        </button>
      </div>
    </article>
  );
}
