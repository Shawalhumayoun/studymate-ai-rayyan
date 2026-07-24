import { Type } from "@google/genai";
import { getGeminiClient } from "../lib/gemini";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }
    const ai = getGeminiClient();
    const prompt = `Analyze the following study notes and generate a structured, highly clear, student-friendly summary.\n\nNotes:\n"""\n${notes.slice(0, 15000)}\n"""`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI study tutor. Transform raw study notes into concise, digestible, and well-organized summaries for exam preparation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedSummary: { type: Type.STRING },
            estimatedReadTimeMinutes: { type: Type.NUMBER },
          },
          required: ["title", "keyTakeaways", "detailedSummary", "estimatedReadTimeMinutes"],
        },
      },
    });
    const parsedData = JSON.parse(response.text || "");
    return res.json(parsedData);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "Failed to generate summary." });
  }
}
