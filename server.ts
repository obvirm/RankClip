import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { generateAIVideoIdea, generateSubtitleTimestamps } from "./src/services/gemini.js";

// Make sure to load environment variables
import dotenv from "dotenv";
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API Endpoints
  app.post("/api/ai/suggest-idea", async (req, res) => {
    try {
      const { theme } = req.body;
      if (!theme) {
        return res.status(400).json({ error: "Theme is required" });
      }
      const idea = await generateAIVideoIdea(theme);
      return res.json(idea);
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || "Failed to generate AI content" });
    }
  });

  app.post("/api/ai/generate-subtitles", async (req, res) => {
    try {
      const { videoTitle, duration } = req.body;
      if (!videoTitle) {
        return res.status(400).json({ error: "videoTitle is required" });
      }
      const subtitles = await generateSubtitleTimestamps(videoTitle, duration || 10);
      return res.json({ subtitles });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ error: err.message || "Failed to generate subtitles" });
    }
  });

  // Vite middleware for development / static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
