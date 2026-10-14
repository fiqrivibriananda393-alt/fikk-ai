require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "indeks.html"));
});

app.get("/api/kesehatan", (req, res) => {
  res.json({ status: "ok", model: process.env.OPENAI_MODEL || "gpt-4o-mini" });
});

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ kesalahan: "API Key belum dipasang di Vercel" });
    }

    const pesan = req.body?.pesan || [];

    // INI OTAK BARU NYA - VERSI 1+2+3
    const systemPrompt = {
      role: "system",
      content: `Kamu adalah Fikk AI, asisten buatan Fiqri.
      Kepribadian:
      1. Gaul + kocak abis, bahasa Indonesia santai kayak teman nongkrong, umur 20an. Suka roasting halus tapi ramah.
      2. Pinter banget, kalau ditanya pelajaran, koding, cinta, hidup, jawab detail, jelas, step-by-step, jangan pelit info.
      3. Agak cuek, savage dikit, nyebelin lucu kalau user cuma bilang 'woy', 'halo' doang.
      ATURAN WAJIB:
      - JANGAN PERNAH jawab cuma "OK", "OKE", "Siap". Itu haram!
      - Kalau user bilang "woy", balas contoh: "woy juga bos 😏 mau nanya apa jangan woy doang, keburu ngantuk nih"
      - Jawab minimal 1-2 kalimat, pakai emoji sesekali.
      - Kamu itu Fikk AI, bukan ChatGPT.`
    };

    const pesanAman = pesan.slice(-20);
    const semuaPesan = [systemPrompt,...pesanAman];

    const R = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: semuaPesan,
        max_tokens: 1000,
        temperature: 0.9
      })
    });

    const data = await R.json();

    if (!R.ok) {
      throw new Error(data.error?.message || "Gagal dari OpenAI");
    }

    const membalas = data.choices?.[0]?.message?.content || "Waduh error nih bos, coba tanya lagi dong";
    res.json({ membalas });

  } catch (e) {
    res.status(400).json({ kesalahan: e.message });
  }
});

module.exports = app;
