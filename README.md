# StudyMate AI 🎓✨
StudyMate AI is a modern AI-powered study assistant built to help students comprehend long lecture notes, generate practice MCQs, and decode difficult technical vocabulary in simple English.
## Problem
Students often struggle to understand lengthy lecture notes and prepare for exams quickly. StudyMate AI solves this problem by converting notes into simple summaries, quizzes, and vocabulary explanations using AI.
## Live Demo
https://studymate-ai-rayyan.vercel.app
## Features 🚀
- 📄 **Instant Notes Summarization**: Synthesizes lengthy notes into structured key takeaways and bullet points.
- 🎯 **5-Question MCQ Quiz Generator**: Creates multiple choice questions with answer keys and explanations for practice.
- 💡 **Simple Vocabulary Explainer**: Extracts complex terms and explains them in plain, easy-to-understand English.
- 📋 **One-Click Copying**: Copy summaries, quizzes, and vocabulary directly to your clipboard.
- 🌙 **Dark & Light Mode**: Toggle smoothly between eye-friendly themes.
- 📱 **Fully Responsive**: Optimized for phones, tablets, and desktops.
- ⚡ **History Tracking**: Keeps past study sessions saved locally for quick revision.

## Tech Stack 🛠️
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, Motion (Framer Motion)
- **Backend**: Node.js, Express, TypeScript
- **AI Integration**: `@google/genai` (Gemini 3.6 Flash)
- **Build Tool**: Vite & esbuild

## Environment Variables 🔑
Create a `.env` file in the root directory and add:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Local Development 💻
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

## Deployment to Vercel 🌐
1. Push this repository to **GitHub**.
2. Go to [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set the Environment Variable:
   - Name: `GEMINI_API_KEY`
   - Value: `[Your Gemini API Key from Google AI Studio]`
5. Click **Deploy**.
