import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Helper to initialize Gemini client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing. Please set GEMINI_API_KEY in environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 1. Generate Summary Route
app.post("/api/study/summarize", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }

    const ai = getGeminiClient();
    const prompt = `Analyze the following study notes and generate a structured, highly clear, student-friendly summary.
    
Notes:
"""
${notes.slice(0, 15000)}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert AI study tutor. Transform raw study notes into concise, digestible, and well-organized summaries for exam preparation.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A clear, descriptive title summarizing the main topic of the notes.",
            },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 to 6 bullet points highlighting the most important key facts to remember.",
            },
            detailedSummary: {
              type: Type.STRING,
              description: "A cohesive, 2-3 paragraph summary breaking down the core concepts logically.",
            },
            estimatedReadTimeMinutes: {
              type: Type.NUMBER,
              description: "Estimated reading time in minutes.",
            },
          },
          required: ["title", "keyTakeaways", "detailedSummary", "estimatedReadTimeMinutes"],
        },
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating summary:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate summary. Please try again.",
    });
  }
});

// 2. Generate 5 MCQs Route
app.post("/api/study/mcqs", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }

    const ai = getGeminiClient();
    const prompt = `Based on the following study notes, generate EXACTLY 5 multiple-choice questions (MCQs) to test student comprehension for exams. Each question must have 4 realistic options, 1 correct option index (0, 1, 2, or 3), and a clear educational explanation of why that option is correct.

Notes:
"""
${notes.slice(0, 15000)}
"""`;

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
              description: "List of exactly 5 MCQs",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING, description: "The exam question text." },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Array of exactly 4 choices (A, B, C, D).",
                  },
                  correctIndex: {
                    type: Type.INTEGER,
                    description: "Zero-based index of the correct answer (0 to 3).",
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "Clear, encouraging explanation of why the correct option is right.",
                  },
                },
                required: ["id", "question", "options", "correctIndex", "explanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error generating MCQs:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate MCQs. Please try again.",
    });
  }
});

// 3. Explain Difficult Words Route
app.post("/api/study/vocabulary", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return res.status(400).json({ error: "Please provide valid study notes." });
    }

    const ai = getGeminiClient();
    const prompt = `Identify difficult, technical, or specialized terms/jargon from the study notes below. Explain them in extremely simple, plain English that a 12-year-old or beginner student can instantly grasp. Provide a simple definition, a real-world example or sentence, and an easy analogy or synonym. Extract between 4 and 8 key terms.

Notes:
"""
${notes.slice(0, 15000)}
"""`;

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
              description: "List of difficult terms simplified",
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING, description: "The difficult word or term." },
                  simpleDefinition: {
                    type: Type.STRING,
                    description: "Definition explained in plain, jargon-free English.",
                  },
                  contextExample: {
                    type: Type.STRING,
                    description: "A practical sentence or context example.",
                  },
                  analogyOrSynonym: {
                    type: Type.STRING,
                    description: "A relatable analogy or simple synonym.",
                  },
                },
                required: ["term", "simpleDefinition", "contextExample", "analogyOrSynonym"],
              },
            },
          },
          required: ["vocabulary"],
        },
      },
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error explaining vocabulary:", error);
    return res.status(500).json({
      error: error?.message || "Failed to explain difficult words. Please try again.",
    });
  }
});

// 4. Combined Processing Route (Summarize + MCQs + Vocabulary in one request)
app.post("/api/study/process-all", async (req, res) => {
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

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error processing all study materials:", error);
    return res.status(500).json({
      error: error?.message || "Failed to process study notes. Please try again.",
    });
  }
});

// Vite Integration & Server Startup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
