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
  const url = new URL(`https://${API_HOST}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-key': API_KEY || '',
      'x-rapidapi-host': API_HOST || ''
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RapidAPI Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export function extractInstagramUsername(url: string): string | null {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    // Handle instagram.com/username/ or instagram.com/username
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length > 0) {
      return segments[0].replace('@', '');
    }
    return null;
  } catch {
    return null;
  }
}

export async function getInstagramProfile(username: string): Promise<InstagramProfileData | null> {
  try {
    const data = await fetchFromRapidAPI('/v1/user/info', { username });
    // Note: The actual response structure of Instagram Looter might vary slightly.
    // Based on common RapidAPI patterns, it usually returns a 'result' or 'data' object.
    const user = data.data || data.result || data;
    
    return {
      id: user.id || user.pk,
      username: user.username,
      full_name: user.full_name,
      biography: user.biography,
      profile_pic_url: user.profile_pic_url_hd || user.profile_pic_url,
      follower_count: user.follower_count,
      following_count: user.following_count,
      media_count: user.media_count,
      is_private: user.is_private,
      is_verified: user.is_verified
    };
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return null;
  }
}

export async function getInstagramMedias(username: string): Promise<InstagramMediaData[]> {
  try {
    const data = await fetchFromRapidAPI('/v1/user/medias', { username });
    const items = data.data?.items || data.result?.items || data.items || [];
    
    return items.map((item: any) => ({
      id: item.id || item.pk,
      shortcode: item.code,
      display_url: item.image_versions2?.candidates?.[0]?.url || item.thumbnail_url,
      video_url: item.video_versions?.[0]?.url,
      is_video: item.media_type === 2,
      caption: item.caption?.text || "",
      like_count: item.like_count,
      comment_count: item.comment_count
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
