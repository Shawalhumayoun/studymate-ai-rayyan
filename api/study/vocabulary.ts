import { Type } from "@google/genai";
import { getGeminiClient } from "../lib/gemini.JS";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }
    const ai = getGeminiClient();
    const prompt = `Identify difficult, technical, or specialized terms/jargon from the study notes below. Explain them in extremely simple, plain English that a 12-year-old or beginner student can instantly grasp. Provide a simple definition, a real-world example or sentence, and an easy analogy or synonym. Extract between 4 and 8 key terms.\n\nNotes:\n"""\n${notes.slice(0, 15000)}\n"""`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a friendly teacher who simplifies complex jargon into crystal-clear, plain English with relatable analogies.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocabulary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  simpleDefinition: { type: Type.STRING },
                  contextExample: { type: Type.STRING },
                  analogyOrSynonym: { type: Type.STRING },
                },
                required: ["term", "simpleDefinition", "contextExample", "analogyOrSynonym"],
              },
            },
          },
          required: ["vocabulary"],
        },
      },
    });
    const parsedData = JSON.parse(response.text || "");
    return res.json(parsedData);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "Failed to explain difficult words." });
  }
}
