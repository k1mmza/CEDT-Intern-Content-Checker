const API_KEY = process.env.RAPIDAPI_KEY;
const API_HOST = process.env.RAPIDAPI_HOST;

export interface InstagramProfileData {
  id: string;
  username: string;
  full_name: string;
  biography: string;
  profile_pic_url: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  is_private: boolean;
  is_verified: boolean;
  initial_media?: InstagramMediaData[];
}

export interface InstagramMediaData {
  id: string;
  shortcode: string;
  display_url: string;
  video_url?: string;
  is_video: boolean;
  caption: string;
  like_count: number;
  comment_count: number;
}

async function fetchFromRapidAPI(endpoint: string, params: Record<string, string>) {
  if (!API_KEY || API_KEY === 'your_rapidapi_key_here') {
    throw new Error('RapidAPI Key is not configured. Please add it to .env.local');
  }

  const url = new URL(`https://${API_HOST}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  console.log(`Calling RapidAPI: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY,
      'x-rapidapi-host': API_HOST || 'instagram-looter2.p.rapidapi.com'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`RapidAPI Error Response: ${errorText}`);
    throw new Error(`RapidAPI Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

function proxyImage(url: string): string {
  if (!url) return "";
  if (!url.includes('cdninstagram.com') && !url.includes('fbcdn.net')) return url;
  // Use weserv.nl as a free image proxy to bypass Instagram hotlinking protection
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&default=https://api.dicebear.com/9.x/shapes/svg?seed=fallback`;
}

export function extractInstagramUsername(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    // Ignore common non-profile segments
    const ignoreList = ['reels', 'p', 'stories', 'explore', 'direct'];
    
    for (const segment of segments) {
      const clean = segment.replace('@', '');
      if (!ignoreList.includes(clean.toLowerCase()) && clean.length > 0) {
        return clean;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function getInstagramProfile(username: string): Promise<InstagramProfileData | null> {
  try {
    const data = await fetchFromRapidAPI('/profile', { username });
    
    // Support various common response structures
    const user = data.data || data.result || (data.username ? data : null);
    
    if (user) {
      console.log(`Instagram Profile found for: ${user.username}`);
      console.log("Profile Data Keys:", Object.keys(user));
    } else {
      console.warn("Instagram API response structure unknown:", Object.keys(data));
    }
    
    if (!user || !user.username) {
      console.warn("Instagram API returned empty or invalid user data.");
      return null;
    }

    // Attempt to extract media from profile if available (common in scrapers)
    const mediaNodes = user.edge_owner_to_timeline_media?.edges?.map((e: any) => e.node) || user.items || user.medias || [];
    const initial_media = mediaNodes.map((item: any) => ({
      id: String(item.id || item.pk || ""),
      shortcode: item.code || item.shortcode || "",
      display_url: proxyImage(item.image_versions2?.candidates?.[0]?.url || item.display_url || item.thumbnail_src || item.thumbnail_url || ""),
      video_url: item.video_url || item.video_versions?.[0]?.url,
      is_video: !!(item.is_video || item.media_type === 2 || item.video_versions),
      caption: item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || "",
      like_count: item.like_count || item.edge_liked_by?.count || item.edge_media_preview_like?.count || 0,
      comment_count: item.comment_count || item.edge_media_to_comment?.count || 0
    }));
    
    const profilePic = user.profile_pic_url_hd || user.hd_profile_pic_url_info?.url || user.profile_pic_url || user.profile_picture || user.profile_pic || "";
    const proxiedProfilePic = proxyImage(profilePic);
    console.log(`Mapped Profile Picture URL (Proxied) for ${user.username}: ${proxiedProfilePic.slice(0, 100)}...`);

    return {
      id: String(user.id || user.pk || user.pk_id || ""),
      username: user.username,
      full_name: user.full_name || user.username,
      biography: user.biography || "",
      profile_pic_url: proxiedProfilePic,
      follower_count: user.follower_count || user.edge_followed_by?.count || 0,
      following_count: user.following_count || user.edge_follow?.count || 0,
      media_count: user.media_count || user.edge_owner_to_timeline_media?.count || 0,
      is_private: !!user.is_private,
      is_verified: !!user.is_verified,
      initial_media: initial_media.length > 0 ? initial_media : undefined
    };
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return null;
  }
}

export async function getInstagramMedias(username: string, userId?: string): Promise<InstagramMediaData[]> {
  const endpoints = [
    { url: '/v1/posts', params: { username } },
    { url: '/user/posts', params: { username } },
    { url: '/profile', params: { username } },
    { url: '/user/media', params: { username } },
  ];

  if (userId) {
    endpoints.push({ url: '/v1/user/posts', params: { id: userId } });
    endpoints.push({ url: '/user/posts', params: { id: userId } });
  }

  let data = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying Instagram media endpoint: ${endpoint.url} with params:`, endpoint.params);
      data = await fetchFromRapidAPI(endpoint.url, endpoint.params as any);
      
      const user = data.data || data.result || (data.username ? data : null);
      const items = (user && (user.edge_owner_to_timeline_media?.edges?.map((e: any) => e.node) || user.items || user.medias)) 
        || data.data?.items || data.result?.items || data.items || [];

      if (items.length > 0) {
        console.log(`Successfully found ${items.length} media items at ${endpoint.url}`);
        return items.map((item: any) => ({
          id: String(item.id || item.pk || ""),
          shortcode: item.code || item.shortcode || "",
          display_url: proxyImage(item.image_versions2?.candidates?.[0]?.url || item.display_url || item.thumbnail_src || item.thumbnail_url || ""),
          video_url: item.video_url || item.video_versions?.[0]?.url,
          is_video: !!(item.is_video || item.media_type === 2 || item.video_versions),
          caption: item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || "",
          like_count: item.like_count || item.edge_liked_by?.count || item.edge_media_preview_like?.count || 0,
          comment_count: item.comment_count || item.edge_media_to_comment?.count || 0
        }));
      }
    } catch (e) {
      // Silently fail retries
    }
  }

  return [];
}

export function summarizeInstagramContent(profile: InstagramProfileData, medias: InstagramMediaData[]): { summary: string; tags: string[] } {
  const bio = (profile.biography || "").toLowerCase();
  const captions = medias.map(m => (m.caption || "").toLowerCase()).join(" ");
  const fullText = `${bio} ${captions}`;
  const name = (profile.full_name || profile.username || "").toLowerCase();
  
  // Extract hashtags from captions
  const hashtags = Array.from(fullText.matchAll(/#(\w+)/g)).map(match => match[1]).filter(Boolean);
  const uniqueTags = Array.from(new Set(hashtags)).slice(0, 10);

  let summary = "Digital content creator sharing insights and experiences.";
  
  const matches = (keywords: string[]) => keywords.some(k => fullText.includes(k) || name.includes(k));

  if (matches(["esports", "gaming", "gamer", "streamer", "gameplay", "walkthrough", "twitch"])) {
    summary = "Focuses on competitive gaming and esports, sharing gameplay highlights and tournament updates.";
  } else if (matches(["fashion", "outfit", "style", "lookbook", "ootd", "wardrobe"])) {
    summary = "Primarily focused on fashion, style inspiration, and trendy outfit showcases.";
  } else if (matches(["travel", "explore", "adventure", "wanderlust", "destination", "trip"])) {
    summary = "Content creator documenting global travel adventures and destination guides.";
  } else if (matches(["food", "cooking", "recipe", "chef", "dining", "restaurant", "eat"])) {
    summary = "Food enthusiast sharing culinary experiences, unique recipes, and restaurant reviews.";
  } else if (matches(["fitness", "gym", "workout", "training", "health", "wellness", "athlete"])) {
    summary = "Fitness influencer providing workout motivation, training tips, and health-related content.";
  } else if (matches(["beauty", "makeup", "skincare", "cosmetics", "tutorial", "glam"])) {
    summary = "Beauty expert specializing in creative makeup tutorials and effective skincare routines.";
  } else if (matches(["tech", "gadget", "software", "developer", "hardware", "review", "digital"])) {
    summary = "Tech enthusiast reviewing the latest digital gadgets and exploring technological trends.";
  } else if (matches(["lifestyle", "vlog", "daily", "journal", "personal"])) {
    summary = "Lifestyle creator sharing personal stories, daily moments, and life experiences.";
  } else if (matches(["music", "song", "artist", "musician", "performance", "concert"])) {
    summary = "Primarily producing musical content, including original tracks and live performances.";
  }
  
  return { summary, tags: uniqueTags.length > 0 ? uniqueTags : ["instagram", "creator", "social"] };
}

export interface AudienceInference {
  gender: string;
  ageGroup: string;
  country: string;
  city: string;
  countryPercent: number;
}

export function inferAudienceData(profile: InstagramProfileData, summary: string): AudienceInference {
  const fullText = `${profile.full_name} ${profile.biography} ${summary}`.toLowerCase();
  
  // Default values
  let gender = "Mixed";
  let ageGroup = "25-34";
  let country = "Global";
  let city = "Various";
  let countryPercent = 65;

  // 1. Detect Location (Priority: Thailand)
  const isThai = /[\u0e00-\u0e7f]/.test(profile.biography) || fullText.includes("thailand") || fullText.includes("bangkok") || fullText.includes(" th");
  if (isThai) {
    country = "Thailand";
    city = "Bangkok";
    countryPercent = 75 + Math.floor(Math.random() * 15);
  }

  // 2. Detect Gender & Age based on Niche
  if (summary.includes("Beauty") || summary.includes("Fashion") || summary.includes("Skincare")) {
    gender = "Female (85%)";
    ageGroup = "18-24";
  } else if (summary.includes("Gaming") || summary.includes("Esports") || summary.includes("Tech")) {
    gender = "Male (75%)";
    ageGroup = "18-24";
  } else if (summary.includes("Fitness") || summary.includes("Athlete")) {
    gender = "Mixed (50/50)";
    ageGroup = "25-34";
  } else if (summary.includes("Food") || summary.includes("Cooking")) {
    gender = "Female (60%)";
    ageGroup = "25-44";
  }

  return { gender, ageGroup, country, city, countryPercent };
}
