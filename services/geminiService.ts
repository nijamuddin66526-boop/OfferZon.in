
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDealInsight = async (query: string, availableDeals: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for: "${query}". 
      Available deals: ${JSON.stringify(availableDeals)}. 
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { recommendation: "I couldn't analyze the deals right now, but check out our 'Loot' section for the best value!", topDeals: [] };
  }
};
