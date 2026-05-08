import { Influencer } from "@/lib/types";

export function getMainFollowerPlatform(influencer: Influencer): { platform: string; followers: number } {
  const entries = Object.entries(influencer.followersByPlatform);
  if (entries.length === 0) {
    return { platform: influencer.platforms[0] ?? "Instagram", followers: influencer.followers };
  }
  let bestPlatform = entries[0]![0];
  let bestCount = entries[0]![1];
  for (const [platform, count] of entries) {
    if (count > bestCount) {
      bestPlatform = platform;
      bestCount = count;
    }
  }
  return { platform: bestPlatform, followers: bestCount };
}
