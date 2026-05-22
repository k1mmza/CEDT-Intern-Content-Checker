import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface AICreatorAnalysis {
  summary: string;
  tags: string[];
  primaryNiche: string;
  tone: string;
}

export async function analyzeCreatorContent(
  name: string,
  bio: string,
  captions: string[],
  platform: string
): Promise<AICreatorAnalysis> {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    console.warn("Gemini API Key not configured, using fallback analysis.");
    return {
      summary: "Digital content creator sharing insights and experiences.",
      tags: [platform.toLowerCase(), "creator"],
      primaryNiche: "Lifestyle",
      tone: "Informative"
    };
  }

  try {
    const prompt = `
      Analyze the following social media creator profile from ${platform}.
      
      Name: ${name}
      Bio: ${bio}
      Recent Post Captions:
      ${captions.join("\n---\n")}

      Based on this information, provide:
      1. A professional one-sentence summary of what they primarily do (in English). Start with "Primarily focused on..." or "Focuses on...".
      2. The primary niche (one or two words).
      3. The tone of their content (one or two words).
      4. Top 5 most relevant tags.

      Return the response in EXACTLY this JSON format:
      {
        "summary": "...",
        "primaryNiche": "...",
        "tone": "...",
        "tags": ["...", "...", "..."]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text in case Gemini adds markdown code blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(jsonStr);

    return {
      summary: analysis.summary || "Digital content creator.",
      tags: analysis.tags || [],
      primaryNiche: analysis.primaryNiche || "Lifestyle",
      tone: analysis.tone || "Professional"
    };
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return {
      summary: "Digital content creator across various themes.",
      tags: [platform.toLowerCase(), "creator"],
      primaryNiche: "Lifestyle",
      tone: "Mixed"
    };
  }
}
