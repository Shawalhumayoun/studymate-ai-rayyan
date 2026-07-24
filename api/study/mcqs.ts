import { Type } from "@google/genai";
import { getGeminiClient } from "../lib/gemini".Js

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }
    const ai = getGeminiClient();
    const prompt = `Based on the following study notes, generate EXACTLY 5 multiple-choice questions (MCQs) to test student comprehension for exams. Each question must have 4 realistic options, 1 correct option index (0, 1, 2, or 3), and a clear educational explanation of why that option is correct.\n\nNotes:\n"""\n${notes.slice(0, 15000)}\n"""`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an academic test designer. Create 5 engaging, accurate, non-trivial exam MCQs based strictly on the provided study material.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
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
          },
          required: ["questions"],
        },
      },
    });
    const parsedData = JSON.parse(response.text || "");
    return res.json(parsedData);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error?.message || "Failed to generate MCQs." });
  }
}
