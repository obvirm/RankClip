import { GoogleGenAI, Type } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment variables.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export async function generateAIVideoIdea(videoTheme: string) {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `You are a viral YouTube Shorts, TikTok, and Reels creator. Suggest a top 5 or top 3 funny ranking list content based on the user's requested theme: "${videoTheme}".
Provide:
1. A catchy viral title (all caps, punchy).
2. Five funny list items appropriate for ranking stickers and text overlays.
Keep items short (1-3 words max, e.g. "OOPS", "HUH", "FAILS").
Respond in valid JSON format only conforming to this structure:
{
  "headerTitle": "RANKING MOST FUNNIEST PRANKS",
  "items": [
    {"rank": "1", "text": "THE SPLASH"},
    {"rank": "2", "text": "FAKE BUG"},
    {"rank": "3", "text": "AIRHORN"},
    {"rank": "4", "text": "SCARE CROW"},
    {"rank": "5", "text": "ICE COLD"}
  ]
}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headerTitle: { type: Type.STRING, description: "Viral Title for top header bar" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rank: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["rank", "text"]
              }
            }
          },
          required: ["headerTitle", "items"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Failed to generate AI video idea:", error);
    // Return fallback
    return {
      headerTitle: `TOP ranking: ${videoTheme.toUpperCase()}`,
      items: [
        { rank: "1", text: "THE CHAMP" },
        { rank: "2", text: "UNBELIEVABLE" },
        { rank: "3", text: "SO CLOSE" },
        { rank: "4", text: "SAD FAIL" },
        { rank: "5", text: "NO WAY" }
      ]
    };
  }
}

export async function generateSubtitleTimestamps(videoTitle: string, duration: number) {
  const ai = getGeminiClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a list of 4 auto-caption overlays with precise mock timestamps for a short-form video about: "${videoTitle}". The video is ${duration} seconds long.
Ensure timestamps start at 0 and end before ${duration}.
Provide the response in valid JSON conforming to this structure:
[
  {"text": "Yo check this out!", "startTime": 0, "endTime": 2.5},
  {"text": "This is absolute madness...", "startTime": 2.6, "endTime": 5.5},
  {"text": "Look at his face right here!", "startTime": 5.6, "endTime": 8.0},
  {"text": "Don't forget to follow for more!", "startTime": 8.1, "endTime": 10.0}
]`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              startTime: { type: Type.NUMBER },
              endTime: { type: Type.NUMBER }
            },
            required: ["text", "startTime", "endTime"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text.trim());
    }
    throw new Error("Empty response from AI subtitles generator");
  } catch (error) {
    console.error("Failed to generate AI subtitles:", error);
    return [
      { text: "WHOA! ARE YOU READY?", startTime: 0, endTime: 2.5 },
      { text: "Wait for the climax...", startTime: 3.0, endTime: 6.0 },
      { text: "HE ACTUALLY DID IT!", startTime: 6.5, endTime: 9.0 },
      { text: "SUBSCRIBE FOR MORE!", startTime: 9.5, endTime: duration }
    ];
  }
}
