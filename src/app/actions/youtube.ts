"use server";

import { getChannelIdFromUrl, getChannelData, getLatestVideosStats } from "@/lib/youtube-service";
import { analyzeCreatorContent } from "@/lib/ai-service";

export async function fetchYouTubeInfluencer(url: string) {
  try {
    const channelId = await getChannelIdFromUrl(url);
    if (!channelId) {
      return { error: "Could not resolve YouTube Channel ID from URL." };
    }

    const channel = await getChannelData(channelId);
    if (!channel) {
      return { error: "Could not fetch channel data." };
    }

    const stats = await getLatestVideosStats(channelId);
    const aiAnalysis = await analyzeCreatorContent(
      channel.title,
      channel.description,
      stats.descriptions,
      "YouTube"
    );

    return {
      success: true,
      data: {
        id: channel.id,
        name: channel.title,
        followers: parseInt(channel.statistics.subscriberCount || "0", 10),
        avgViews: stats.avgViews,
        tags: aiAnalysis.tags.length > 0 ? aiAnalysis.tags : stats.tags,
        thumbnail: channel.thumbnails.high.url || channel.thumbnails.medium.url || channel.thumbnails.default.url,
        description: channel.description,
        customUrl: channel.customUrl,
        country: channel.country,
        videos: stats.videos,
        contentSummary: aiAnalysis.summary
      }
    };
  } catch (error) {
    console.error("Server Action Error (fetchYouTubeInfluencer):", error);
    return { error: "An unexpected error occurred while fetching YouTube data." };
  }
}
