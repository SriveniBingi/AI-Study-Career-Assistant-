require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer'); // ✅ New: For handling file uploads
const pdf = require('pdf-parse'); // ✅ New: For reading PDF text
const AIService = require('./services/ai.service');
const Study = require('./models/Study');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/study', require('./routes/study'));
// Configure Multer for memory storage (faster for small/medium PDFs)
const upload = multer({ limits: { fileSize: 50 * 1024 * 1024 } });

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Secure Atlas MongoDB Connected"))
  .catch(err => {
    console.log("❌ MONGODB ERROR: Check your .env file credentials!");
    console.log(err.message);
  });

// --- 📄 NEW: PDF UPLOAD & EXTRACTION ROUTE ---
app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file" });

    // 🕵️‍♂️ Let's try to call it directly. If it fails, we will see why.
    let data;
    if (typeof pdf === 'function') {
        data = await pdf(req.file.buffer);
    } else if (pdf && typeof pdf.default === 'function') {
        data = await pdf.default(req.file.buffer);
    } else {
        // This is a "Hail Mary" - sometimes it's nested deep
        const actualFunction = require('pdf-parse/lib/pdf-parse.js');
        data = await actualFunction(req.file.buffer);
    }

    console.log("✅ PDF Text Extracted!");
    res.json({ success: true, text: data.text });

  } catch (err) {
    console.error("❌ PDF Parse Error Detail:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- EXISTING ROUTES ---
app.post('/api/summarize', async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await AIService.generateSummary(text);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/save-study', async (req, res) => {
  try {
    const { userId, title, summary, originalText } = req.body;
    const newSession = new Study({
      user: userId,
      title,
      summary,
      originalText
    });
    await newSession.save();
    res.json({ success: true, message: "Saved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 📝 NEW: QUIZ GENERATION ROUTE ---
app.post('/api/quiz', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: "No text provided" });

    const prompt = `Generate 5 MCQs based on this text. 
    Return ONLY a raw JSON array. No conversational text.
    
    Format:
    [
      {
        "q": "Question text here?",
        "options": ["A", "B", "C", "D"],
        "a": 0, 
        "exp": "Brief explanation why this is correct."
      }
    ]
    Note: "a" must be the 0-based index of the correct option (e.g., 0 for the first option).

    TEXT: ${text.substring(0, 4000)}`;

    const aiResponse = await AIService.askAI(prompt, "You are a JSON quiz generator for an MCA project.");
    
    // Clean and Parse JSON
    const cleanJson = aiResponse.replace(/```json|```/g, "").trim();
    const quizData = JSON.parse(cleanJson);

    res.json({ success: true, data: quizData });
  } catch (err) {
    console.error("❌ Quiz Server Error:", err.message);
    res.status(500).json({ success: false, error: "AI failed to format the quiz." });
  }
});

// --- 💬 NEW: AI CHAT / DOUBT SOLVER ROUTE ---//
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    // This calls the new method we just added to ai.service.js
    const answer = await AIService.generateChatResponse(prompt, context);
    
    res.json({ success: true, answer: answer });
  } catch (err) {
    console.error("❌ Chat Error:", err.message);
    res.status(500).json({ success: false, error: "AI is currently busy. Try again!" });
  }
});


app.post('/api/career-roadmap', async (req, res) => {
  try {
    const { text } = req.body;
    
    // This prompt is the secret sauce for your project
    const prompt = `
    You are a Career Growth Expert. 
    1. Identify the professional domain of these notes (e.g. Frontend Dev, Data Science).
    2. Create a 4-step roadmap to go from "Student (learning this topic)" to "Junior Professional (in this field)".
    
    Format each step as JSON:
    - title: A specific job milestone.
    - desc: Explain how learning THIS topic leads to the next tool they need.
    - skills: [Skill from notes, Industry tool #1, Industry tool #2]
    
    Return ONLY a JSON array.
    Notes: ${text.substring(0, 2000)}
    `;

    const response = await AIService.askAI(prompt, "Industry Bridge Mode");
    const cleanJson = response.replace(/```json|```/g, "").trim();
    res.json({ success: true, data: JSON.parse(cleanJson) });
  } catch (err) {
    res.status(500).json({ success: false, error: "Roadmap service busy." });
  }
});

app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, roadmapData, jobDescription, candidateName, targetJob } = req.body;
    
    // 🎯 1. Identify the "Source of Truth"
    let criteria = "";
    let modeName = "";

    if (jobDescription && jobDescription.trim().length > 10) {
      criteria = `JOB DESCRIPTION: ${jobDescription}`;
      modeName = "JD-Specific";
    } else if (roadmapData && roadmapData.length > 0) {
      criteria = `AI GENERATED ROADMAP SKILLS: ${JSON.stringify(roadmapData)}`;
      modeName = "Roadmap-Aligned";
    } else {
      criteria = "GENERAL INDUSTRY STANDARDS FOR: " + (targetJob || "Software Engineer");
      modeName = "General Industry";
    }

    // 🧠 2. The "Zero-Bias" Prompt
    const prompt = `
    TASK: Strict Technical Gap Analysis.
    MODE: ${modeName}
    CANDIDATE: ${candidateName || "Applicant"}

    CRITERIA TO MATCH AGAINST:
    ${criteria}

    RESUME CONTENT TO ANALYZE:
    "${resumeText.substring(0, 4000)}"

    STRICT SCORING RULES:
    1. Only give points for skills found in the CRITERIA. 
    2. If the Resume has great skills (e.g., Java) but the CRITERIA asks for something else (e.g., Cybersecurity), do NOT give points for Java.
    3. If the Resume is completely unrelated to the CRITERIA, the score MUST be 0-30%.
    4. "Missing Skills" must ONLY be items found in the CRITERIA that are absent from the Resume.

    OUTPUT ONLY JSON:
    {
      "score": <0-100>,
      "feedback": "Start with 'Hello ${candidateName || 'Candidate'}'. Summarize why they did or didn't match the specific ${modeName} criteria.",
      "missingSkills": ["Skill A", "Skill B"],
      "verdict": "Match Status"
    }
    `;

    const response = await AIService.askAI(prompt, "Universal ATS Engine");

    // 🛡️ Safe Parser
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI Response");
    
    res.json({ success: true, data: JSON.parse(jsonMatch[0].trim()) });

  } catch (err) {
    console.error("❌ Analysis Error:", err);
    res.status(500).json({ success: false, error: "Analysis failed." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Premium Server on port ${PORT}`));