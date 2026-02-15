
import { GoogleGenAI, Type } from "@google/genai";

// Ensure process.env exists locally to prevent ReferenceError during module evaluation
// This is critical for preventing a blank white screen if the global shim isn't loaded yet
if (typeof (window as any).process === 'undefined') {
  (window as any).process = { env: {} };
}

// Strictly adhering to the required initialization pattern
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDealInsight = async (query: string, availableDeals: any[]) => {
  try {
    // Check if API key is actually present before making the call
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. Returning default recommendation.");
      return { 
        recommendation: "I'm currently in preview mode. Please check the 'Loot' badges for the best deals!", 
        topDeals: availableDeals.slice(0, 2).map(d => d.title) 
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for: "${query}". 
      Available deals: ${JSON.stringify(availableDeals.slice(0, 10))}. 
      Recommend the top 2 best value deals from the list and explain why. 
      Keep it short, professional, and persuasive.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            topDeals: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["recommendation", "topDeals"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return { 
      recommendation: "I couldn't analyze the deals right now, but check out our 'Loot' section for the best value!", 
      topDeals: [] 
    };
  }
};
