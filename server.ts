import express from "express";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Mock render endpoint
  app.post("/api/render", async (req, res) => {
    const { questions, topic } = req.body;
    
    // Simulate a rendering process
    // In a real app, this would use @remotion/renderer and @remotion/bundler
    // but puppeteer might fail in this container environment.
    
    res.json({ 
      status: "rendering", 
      jobId: Math.random().toString(36).substring(7),
      message: "Video rendering started in background."
    });
  });

  app.get("/api/render/:jobId", async (req, res) => {
    // Simulate checking render status
    // For demo purposes, we'll just say it's done immediately
    res.json({
      status: "done",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
