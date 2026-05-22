const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeChannelData {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  country?: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
    videoCount: string;
  };
}

export interface YouTubeVideoData {
  id: string;
  title: string;
  viewCount: number;
  thumbnail: string;
}

export async function getChannelIdFromUrl(url: string): Promise<string | null> {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace("www.", "");
    const pathname = parsed.pathname;

    if (pathname.startsWith("/channel/")) {
      return pathname.split("/")[2];
    }

    if (pathname.startsWith("/user/")) {
      const username = pathname.split("/")[2];
      const res = await fetch(`${BASE_URL}/channels?part=id&forUsername=${username}&key=${API_KEY}`);
      const data = await res.json();
      return data.items?.[0]?.id || null;
    }

    if (pathname.startsWith("/@")) {
      const handle = pathname.split("/")[1];
      const res = await fetch(`${BASE_URL}/channels?part=id&forHandle=${handle}&key=${API_KEY}`);
      const data = await res.json();
      return data.items?.[0]?.id || null;
    }

    let videoId = null;
    if (hostname === "youtu.be") {
      videoId = pathname.slice(1);
    } else if (pathname.startsWith("/watch")) {
      videoId = parsed.searchParams.get("v");
    }

    if (videoId) {
      const res = await fetch(`${BASE_URL}/videos?part=snippet&id=${videoId}&key=${API_KEY}`);
      const data = await res.json();
      return data.items?.[0]?.snippet?.channelId || null;
    }

    return null;
  } catch (error) {
    console.error("Error resolving YouTube URL:", error);
    return null;
  }
}

export async function getChannelData(channelId: string): Promise<YouTubeChannelData | null> {
  try {
    const res = await fetch(`${BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
    const data = await res.json();
    if (!data.items?.length) return null;
    
    const item = data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      customUrl: item.snippet.customUrl,
      publishedAt: item.snippet.publishedAt,
      country: item.snippet.country,
      thumbnails: item.snippet.thumbnails,
      statistics: item.statistics,
    };
  } catch (error) {
    console.error("Error fetching YouTube channel data:", error);
    return null;
  }
}

export async function getLatestVideosStats(channelId: string, limit = 30): Promise<{ avgViews: number; tags: string[]; videos: YouTubeVideoData[]; contentSummary: string }> {
  try {
    const searchRes = await fetch(
      `${BASE_URL}/search?part=id,snippet&channelId=${channelId}&maxResults=${limit}&order=date&type=video&key=${API_KEY}`
    );
    const searchData = await searchRes.json();
    
    if (!searchData.items?.length) return { avgViews: 0, tags: [], videos: [], contentSummary: "" };

    const videoIds = searchData.items.map((item: any) => item.id.videoId).filter(Boolean);

    const videosRes = await fetch(
      `${BASE_URL}/videos?part=snippet,statistics&id=${videoIds.join(",")}&key=${API_KEY}`
    );
    const videosData = await videosRes.json();

    let totalViews = 0;
    const allTags = new Set<string>();
    const videos: YouTubeVideoData[] = [];
    const allText: string[] = [];

    videosData.items?.forEach((video: any) => {
      const views = parseInt(video.statistics.viewCount || "0", 10);
      totalViews += views;
      
      videos.push({
        id: video.id,
        title: video.snippet.title,
        viewCount: views,
        thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url
      });

      allText.push(video.snippet.title);
      allText.push(video.snippet.description);

      if (video.snippet.tags) {
        video.snippet.tags.forEach((tag: string) => allTags.add(tag.toLowerCase()));
      }
    });

    // Simple heuristic-based summarizer
    const fullText = allText.join(" ").toLowerCase();
    let contentSummary = "Content creator focusing on digital media.";
    
    if (fullText.includes("music video") || fullText.includes("official audio") || fullText.includes("song")) {
      contentSummary = "Primarily producing music videos, original tracks, and musical performances.";
    } else if (fullText.includes("gaming") || fullText.includes("gameplay") || fullText.includes("walkthrough")) {
      contentSummary = "Focuses on gaming content, including gameplay walkthroughs, reviews, and live streams.";
    } else if (fullText.includes("review") || fullText.includes("unboxing") || fullText.includes("tech")) {
      contentSummary = "Specializes in product reviews, unboxings, and technical deep-dives.";
    } else if (fullText.includes("vlog") || fullText.includes("daily life") || fullText.includes("lifestyle")) {
      contentSummary = "Creates lifestyle vlogs, sharing daily experiences and personal stories.";
    } else if (fullText.includes("tutorial") || fullText.includes("how to") || fullText.includes("education")) {
      contentSummary = "Educational creator providing tutorials, guides, and informative content.";
    } else if (fullText.includes("travel") || fullText.includes("adventure") || fullText.includes("explore")) {
      contentSummary = "Travel enthusiast documenting adventures, destination guides, and global explorations.";
    } else if (fullText.includes("beauty") || fullText.includes("makeup") || fullText.includes("skincare")) {
      contentSummary = "Beauty and skincare expert sharing makeup tutorials and product recommendations.";
    } else if (fullText.includes("cooking") || fullText.includes("recipe") || fullText.includes("food")) {
      contentSummary = "Food-focused creator sharing recipes, cooking techniques, and culinary experiences.";
    }

    return {
      avgViews: Math.round(totalViews / videoIds.length),
      tags: Array.from(allTags).slice(0, 20),
      videos: videos.slice(0, 6),
      contentSummary
    };
  } catch (error) {
    console.error("Error fetching YouTube videos stats:", error);
    return { avgViews: 0, tags: [], videos: [], contentSummary: "" };
  }
}
