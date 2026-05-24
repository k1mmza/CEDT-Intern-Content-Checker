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

interface IRRawItem {
  id?: string;
  pk?: string;
  code?: string;
  shortcode?: string;
  image_versions2?: { candidates?: { url: string }[] };
  display_url?: string;
  thumbnail_src?: string;
  thumbnail_url?: string;
  video_url?: string;
  video_versions?: { url: string }[];
  is_video?: boolean;
  media_type?: number;
  caption?: { text: string };
  edge_media_to_caption?: { edges?: { node?: { text: string } }[] };
  like_count?: number;
  edge_liked_by?: { count: number };
  edge_media_preview_like?: { count: number };
  comment_count?: number;
  edge_media_to_comment?: { count: number };
}

interface IRRawUser {
  id?: string;
  pk?: string;
  pk_id?: string;
  username: string;
  full_name?: string;
  biography?: string;
  profile_pic_url_hd?: string;
  hd_profile_pic_url_info?: { url: string };
  profile_pic_url?: string;
  profile_picture?: string;
  profile_pic?: string;
  follower_count?: number;
  edge_followed_by?: { count: number };
  following_count?: number;
  edge_follow?: { count: number };
  media_count?: number;
  edge_owner_to_timeline_media?: { 
    count: number;
    edges?: { node: IRRawItem }[];
  };
  items?: IRRawItem[];
  medias?: IRRawItem[];
  is_private?: boolean;
  is_verified?: boolean;
}

export async function getInstagramProfile(username: string): Promise<InstagramProfileData | null> {
  try {
    const data = await fetchFromRapidAPI('/profile', { username });
    
    const user = (data.data || data.result || (data.username ? data : null)) as IRRawUser | null;
    
    if (user) {
      console.log(`Instagram Profile found for: ${user.username}`);
    } else {
      console.warn("Instagram API response structure unknown");
    }
    
    if (!user || !user.username) {
      console.warn("Instagram API returned empty or invalid user data.");
      return null;
    }

    const mediaNodes = user.edge_owner_to_timeline_media?.edges?.map((e) => e.node) || user.items || user.medias || [];
    const initial_media = mediaNodes.map((item: IRRawItem) => ({
      id: String(item.id || item.pk || ""),
      shortcode: String(item.code || item.shortcode || ""),
      display_url: proxyImage(String(item.image_versions2?.candidates?.[0]?.url || item.display_url || item.thumbnail_src || item.thumbnail_url || "")),
      video_url: item.video_url || item.video_versions?.[0]?.url,
      is_video: !!(item.is_video || item.media_type === 2 || item.video_versions),
      caption: String(item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || ""),
      like_count: Number(item.like_count || item.edge_liked_by?.count || item.edge_media_preview_like?.count || 0),
      comment_count: Number(item.comment_count || item.edge_media_to_comment?.count || 0)
    }));
    
    const profilePic = user.profile_pic_url_hd || user.hd_profile_pic_url_info?.url || user.profile_pic_url || user.profile_picture || user.profile_pic || "";
    const proxiedProfilePic = proxyImage(profilePic);

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

export async function getInstagramMedias(username: string, userId?: string): Promise<{ items: InstagramMediaData[]; captions: string[] }> {
  const endpoints: { url: string; params: Record<string, string> }[] = [
    { url: '/v1/posts', params: { username } },
    { url: '/user/posts', params: { username } },
    { url: '/profile', params: { username } },
    { url: '/user/media', params: { username } },
  ];

  if (userId) {
    endpoints.push({ url: '/v1/user/posts', params: { id: userId } });
    endpoints.push({ url: '/user/posts', params: { id: userId } });
  }

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying Instagram media endpoint: ${endpoint.url}`);
      const responseData = await fetchFromRapidAPI(endpoint.url, endpoint.params);
      
      const user = (responseData.data || responseData.result || (responseData.username ? responseData : null)) as IRRawUser | null;
      const rawItems = (user && (user.edge_owner_to_timeline_media?.edges?.map((e) => e.node) || user.items || user.medias)) 
        || responseData.data?.items || responseData.result?.items || responseData.items || [];

      if (Array.isArray(rawItems) && rawItems.length > 0) {
        const items = (rawItems as IRRawItem[]).map((item) => ({
          id: String(item.id || item.pk || ""),
          shortcode: String(item.code || item.shortcode || ""),
          display_url: proxyImage(String(item.image_versions2?.candidates?.[0]?.url || item.display_url || item.thumbnail_src || item.thumbnail_url || "")),
          video_url: item.video_url || item.video_versions?.[0]?.url,
          is_video: !!(item.is_video || item.media_type === 2 || item.video_versions),
          caption: String(item.caption?.text || item.edge_media_to_caption?.edges?.[0]?.node?.text || ""),
          like_count: Number(item.like_count || item.edge_liked_by?.count || item.edge_media_preview_like?.count || 0),
          comment_count: Number(item.comment_count || item.edge_media_to_comment?.count || 0)
        }));
        
        return {
          items,
          captions: items.map((m) => m.caption).filter(Boolean)
        };
      }
    } catch {
      // Silently fail retries
    }
  }

  return { items: [], captions: [] };
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
