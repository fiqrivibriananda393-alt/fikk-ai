// Backend Fikk AI. API key disimpan di server, bukan di HTML.
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "API key belum dipasang. Isi OPENAI_API_KEY di file .env." });
    }
    const messages = req.body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Pesan tidak ditemukan." });
    }

    // Batasi jumlah pesan dan panjang teks dari browser.
    const safeMessages = messages.slice(-20).map(m => {
      if (!["user", "assistant"].includes(m.role) || typeof m.content !== "string") {
        throw new Error("Format pesan tidak valid.");
      }
      return { role: m.role, content: m.content.slice(0, 4000) };
    });

    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "Kamu adalah Fikk AI, asisten yang ramah dan membantu. Jawab dalam bahasa yang digunakan pengguna, utamakan bahasa Indonesia, dan jelaskan dengan jelas.",
        input: safeMessages,
        max_output_tokens: 900
      })
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) {
      console.error("AI API error:", data?.error?.message || apiResponse.status);
      return res.status(502).json({ error: "Layanan AI gagal merespons. Periksa API key, saldo/kredit, dan nama model." });
    }

    const reply = data.output_text || (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n");

    if (!reply) return res.status(502).json({ error: "Layanan AI mengirim jawaban kosong." });
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || "Terjadi kesalahan pada server." });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true, app: "Fikk AI" }));

app.listen(PORT, () => {
  console.log(`Fikk AI berjalan di http://localhost:${PORT}`);
});
