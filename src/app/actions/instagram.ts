"use server";

import { getInstagramProfile, getInstagramMedias, extractInstagramUsername, summarizeInstagramContent } from "@/lib/instagram-service";

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

    const medias = await getInstagramMedias(username);
    const contentSummary = summarizeInstagramContent(profile, medias);

    return {
      success: true,
      data: {
        id: profile.id,
        name: profile.full_name || profile.username,
        username: profile.username,
        followers: profile.follower_count,
        bio: profile.biography,
        contentSummary,
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
