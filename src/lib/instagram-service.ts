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
    } else {
      console.warn("Instagram API response structure unknown:", Object.keys(data));
    }
    
    if (!user || !user.username) {
      console.warn("Instagram API returned empty or invalid user data.");
      return null;
    }
    
    return {
      id: String(user.id || user.pk || user.pk_id || ""),
      username: user.username,
      full_name: user.full_name || user.username,
      biography: user.biography || "",
      profile_pic_url: user.profile_pic_url_hd || user.hd_profile_pic_url_info?.url || user.profile_pic_url || "",
      follower_count: user.follower_count || user.edge_followed_by?.count || 0,
      following_count: user.following_count || user.edge_follow?.count || 0,
      media_count: user.media_count || user.edge_owner_to_timeline_media?.count || 0,
      is_private: !!user.is_private,
      is_verified: !!user.is_verified
    };
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return null;
  }
}

export async function getInstagramMedias(username: string): Promise<InstagramMediaData[]> {
  try {
    const endpoints = ['/v1/posts', '/v1/user/medias', '/v1/user/posts', '/v1/reels', '/user/media', '/user/posts'];
    let data = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying Instagram media endpoint: ${endpoint}`);
        data = await fetchFromRapidAPI(endpoint, { username });
        if (data) break;
      } catch (e) {
        console.warn(`Endpoint ${endpoint} failed.`);
      }
    }

    if (!data) {
      console.error("All Instagram media endpoints failed.");
      return [];
    }
      
    const items = data.data?.items || data.result?.items || data.items || data.edge_owner_to_timeline_media?.edges?.map((e: any) => e.node) || [];
    console.log(`Instagram Medias found for ${username}: ${items.length} items`);
    
    if (items.length > 0) {
      console.log("SAMPLE MEDIA ITEM KEYS:", Object.keys(items[0]));
      console.log("SAMPLE MEDIA ITEM (first 200 chars):", JSON.stringify(items[0]).slice(0, 200));
    }
    
    if (!Array.isArray(items)) {
      console.warn("Instagram API returned non-array media items.");
      return [];
    }
    
    return items.map((item: any) => ({
      id: String(item.id || item.pk || ""),
      shortcode: item.code || item.shortcode || "",
      display_url: item.image_versions2?.candidates?.[0]?.url || item.display_url || item.thumbnail_src || item.thumbnail_url || "",
      video_url: item.video_url || item.video_versions?.[0]?.url,
      is_video: !!(item.is_video || item.media_type === 2 || item.video_versions),
      caption: item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || "",
      like_count: item.like_count || item.edge_liked_by?.count || item.edge_media_preview_like?.count || 0,
      comment_count: item.comment_count || item.edge_media_to_comment?.count || 0
    }));
  } catch (error) {
    console.error("Error fetching Instagram medias:", error);
    return [];
  }
}

export function summarizeInstagramContent(profile: InstagramProfileData, medias: InstagramMediaData[]): string {
  const bio = profile.biography.toLowerCase();
  const captions = medias.map(m => m.caption.toLowerCase()).join(" ");
  const fullText = `${bio} ${captions}`;
  
  if (fullText.includes("fashion") || fullText.includes("outfit") || fullText.includes("style")) {
    return "Primarily focused on fashion, style inspiration, and outfit showcases.";
  } else if (fullText.includes("travel") || fullText.includes("explore") || fullText.includes("adventure")) {
    return "Content creator documenting travel adventures and global explorations.";
  } else if (fullText.includes("food") || fullText.includes("cooking") || fullText.includes("recipe")) {
    return "Food enthusiast sharing culinary experiences, recipes, and dining spots.";
  } else if (fullText.includes("fitness") || fullText.includes("gym") || fullText.includes("workout")) {
    return "Fitness influencer providing workout motivation and health-related content.";
  } else if (fullText.includes("beauty") || fullText.includes("makeup") || fullText.includes("skincare")) {
    return "Beauty expert specializing in makeup tutorials and skincare routines.";
  } else if (fullText.includes("lifestyle") || fullText.includes("daily")) {
    return "Lifestyle creator sharing daily moments and personal storytelling.";
  } else if (fullText.includes("tech") || fullText.includes("gadget")) {
    return "Tech enthusiast reviewing the latest gadgets and digital trends.";
  }
  
  return "Digital content creator across various lifestyle themes.";
}
