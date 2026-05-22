"use server";

import { getInstagramProfile, getInstagramMedias, extractInstagramUsername, inferAudienceData } from "@/lib/instagram-service";
import { analyzeCreatorContent } from "@/lib/ai-service";

export async function fetchInstagramInfluencer(url: string) {
  try {
    const username = extractInstagramUsername(url);
    if (!username) {
      return { error: "Could not extract Instagram username from URL." };
    }

    const profile = await getInstagramProfile(username);
    if (!profile) {
      return { error: "Could not fetch Instagram profile data." };
    }

    // Prioritize initial_media from profile response, otherwise fetch separately
    let medias = profile.initial_media || [];
    let captions: string[] = medias.map(m => m.caption).filter(Boolean);

    if (medias.length === 0) {
      const result = await getInstagramMedias(username, profile.id);
      medias = result.items;
      captions = result.captions;
    }
    
    const aiAnalysis = await analyzeCreatorContent(
      profile.full_name || profile.username,
      profile.biography,
      captions,
      "Instagram"
    );

    const audience = inferAudienceData(profile, aiAnalysis.summary);

    return {
      success: true,
      data: {
        id: profile.id,
        name: profile.full_name || profile.username,
        username: profile.username,
        followers: profile.follower_count,
        bio: profile.biography,
        contentSummary: aiAnalysis.summary,
        tags: aiAnalysis.tags,
        audience: audience,
        thumbnail: profile.profile_pic_url,
        medias: medias.slice(0, 6).map(m => ({
          id: m.id,
          thumbnail: m.display_url,
          title: m.caption,
          viewCount: m.like_count + m.comment_count, // Fallback for engagement
          is_video: m.is_video,
          shortcode: m.shortcode
        }))
      }
    };
  } catch (error) {
    console.error("Server Action Error (fetchInstagramInfluencer):", error);
    return { error: "An unexpected error occurred while fetching Instagram data." };
  }
}
