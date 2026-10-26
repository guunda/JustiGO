// Justigo Server — AI-Powered Legal Awareness Platform
// Brand: Justigo | Tagline: Understand Your Rights. Know Your Next Step.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { checkProviders, generateLegalAdvice, generateCustomChecklist } = require("./backend/services/aiService");
const { verifiedStatutes, prebuiltChecklists } = require("./backend/services/legalKnowledge");
const { verifiedResources } = require("./backend/data/verifiedResources");
const {
  getAllDoubts,
  addCitizenDoubt,
  addStudentAnswer,
  upvoteAnswer,
  getLeaderboard,
  getStudentCertificate
} = require("./backend/data/studentStore");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));
// Also expose 'brand' directory for direct template inspection
app.use("/brand", express.static(path.join(__dirname, "brand")));

// =========================================================================
// API Routes: System Health & Provider Diagnostics
// =========================================================================

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    platform: "Justigo",
    tagline: "Understand Your Rights. Know Your Next Step.",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/providers", async (req, res) => {
  try {
    const providers = await checkProviders();
    res.json({
      success: true,
      defaultProvider: process.env.DEFAULT_PROVIDER || "ollama",
      providers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// API Routes: AI Legal Assistant
// =========================================================================

app.post("/api/assistant/chat/stream", async (req, res) => {
  const { query, history, provider } = req.body;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Query is required" });
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { streamLegalAdvice } = require("./backend/services/aiService");

  await streamLegalAdvice({
    query: query.trim(),
    history: history || [],
    provider: provider || process.env.DEFAULT_PROVIDER || "ollama",
    onToken: (token) => {
      res.write(`data: ${JSON.stringify({ type: "token", token })}\n\n`);
    },
    onDone: (result) => {
      res.write(`data: ${JSON.stringify({ type: "done", result })}\n\n`);
      res.end();
    },
    onError: (err) => {
      res.write(`data: ${JSON.stringify({ type: "error", error: err.message })}\n\n`);
      res.end();
    }
  });
});

app.post("/api/assistant/chat", async (req, res) => {
  const { query, history, provider } = req.body;
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Query is required" });
  }

  try {
    const advice = await generateLegalAdvice({
      query: query.trim(),
      history: history || [],
      provider: provider || process.env.DEFAULT_PROVIDER || "ollama"
    });

    res.json({
      success: true,
      ...advice,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// API Routes: Document Checklist Generator
// =========================================================================

app.get("/api/checklist/categories", (req, res) => {
  const categories = Object.keys(prebuiltChecklists).map(key => ({
    id: key,
    title: prebuiltChecklists[key].title,
    statute: prebuiltChecklists[key].statute,
    forum: prebuiltChecklists[key].forum,
    itemCount: prebuiltChecklists[key].items.length
  }));

  res.json({ success: true, categories });
});

app.get("/api/checklist/:category", (req, res) => {
  const categoryId = req.params.category.toLowerCase();
  const checklist = prebuiltChecklists[categoryId];

  if (!checklist) {
    return res.status(404).json({ success: false, error: "Checklist category not found" });
  }

  res.json({ success: true, checklist });
});

app.post("/api/checklist/generate", async (req, res) => {
  const { prompt, provider } = req.body;
  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ success: false, error: "Case description prompt is required" });
  }

  try {
    const customChecklist = await generateCustomChecklist({
      prompt: prompt.trim(),
      provider: provider || "ollama"
    });

    res.json({
      success: true,
      isAiGenerated: true,
      checklist: customChecklist
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =========================================================================
// API Routes: Law Student Learning Hub
// =========================================================================

app.get("/api/students/doubts", (req, res) => {
  const domain = req.query.domain || "all";
  const doubts = getAllDoubts(domain);
  res.json({ success: true, count: doubts.length, doubts });
});

app.post("/api/students/doubts", (req, res) => {
  const { title, domain, description, author } = req.body;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: "Title and description are required" });
  }

  const doubt = addCitizenDoubt({ title, domain, description, author });
  res.status(201).json({ success: true, doubt });
});

app.post("/api/students/doubts/:id/answer", (req, res) => {
  const doubtId = req.params.id;
  const { studentName, universityId, college, summary, keySteps, documentsSuggested } = req.body;

  if (!summary) {
    return res.status(400).json({ success: false, error: "Summary research note is required" });
  }

  try {
    const result = addStudentAnswer(doubtId, {
      studentName,
      universityId,
      college,
      summary,
      keySteps,
      documentsSuggested
    });
    res.status(201).json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

app.post("/api/students/answers/:id/upvote", (req, res) => {
  const answerId = req.params.id;
  try {
    const updatedAnswer = upvoteAnswer(answerId);
    res.json({ success: true, answer: updatedAnswer });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

app.get("/api/students/leaderboard", (req, res) => {
  const leaderboard = getLeaderboard();
  res.json({ success: true, leaderboard });
});

app.get("/api/students/certificate/:studentId", (req, res) => {
  const certificate = getStudentCertificate(req.params.studentId);
  res.json({ success: true, certificate });
});

// =========================================================================
// API Routes: Official Legal Resource Directory
// =========================================================================

app.get("/api/resources", (req, res) => {
  const category = req.query.category || "all";
  const search = (req.query.search || "").toLowerCase().trim();

  let results = verifiedResources;

  if (category !== "all") {
    results = results.filter(r => r.category === category);
  }

  if (search) {
    results = results.filter(r =>
      r.name.toLowerCase().includes(search) ||
      r.description.toLowerCase().includes(search) ||
      r.helpline.toLowerCase().includes(search) ||
      r.location.toLowerCase().includes(search)
    );
  }

  res.json({
    success: true,
    total: results.length,
    resources: results
  });
});

// Root fallback to frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log("==========================================================");
  console.log(` Justigo Server Running on http://localhost:${PORT}`);
  console.log(` Brand: Justigo | Tagline: Understand Your Rights. Know Your Next Step.`);
  console.log(` Default AI Engine: ${process.env.DEFAULT_PROVIDER || "ollama"}`);
  console.log("==========================================================");
});

module.exports = { app, server };
