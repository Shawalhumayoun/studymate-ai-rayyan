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
    const prompt = `Analyze these study notes and generate ALL three study resources:
1. A concise, well-structured summary with key takeaways.
2. Exactly 5 multiple-choice questions (MCQs) with 4 options each, correct index, and explanations.
3. 4 to 8 difficult terms explained in simple, plain English with real-life examples and analogies.

Notes:
"""
${notes.slice(0, 15000)}
"""`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are StudyMate AI, the ultimate study assistant. Provide comprehensive, highly accurate study materials.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
                detailedSummary: { type: Type.STRING },
                estimatedReadTimeMinutes: { type: Type.NUMBER },
              },
              required: ["title", "keyTakeaways", "detailedSummary", "estimatedReadTimeMinutes"],
            },
            mcqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
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
          required: ["summary", "mcqs", "vocabulary"],
        },
      },
    });
    const parsedData = JSON.parse(response.text || "");
    return res.json(parsedData);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "Failed to process study notes." });
  }
}
