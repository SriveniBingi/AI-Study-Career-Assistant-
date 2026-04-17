const axios = require('axios');

const AIService = {
  async askAI(prompt, systemRole = "You are a helpful study assistant.") {
    console.log("🛠️ Starting AI Request Sequence...");
    
    try {
      // 1. Try GROQ (Llama 3.3 - Fast & Powerful)
      console.log("🚀 Calling Groq API...");
      const groqRes = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemRole },
            { role: "user", content: prompt }
          ]
        },
        {
          headers: { 
            "Authorization": `Bearer ${process.env.GROQ_API_KEY.trim()}`,
            "Content-Type": "application/json"
          },
          timeout: 30000 // 30 second limit
        }
      );

      if (groqRes.data?.choices?.[0]?.message?.content) {
        console.log("✅ Groq Success!");
        return groqRes.data.choices[0].message.content;
      }

    } catch (error) {
      console.error("❌ Groq Error:", error.response?.data?.error?.message || error.message);
      
      // 2. Fallback to OpenRouter (Gemini 2.0 Flash)
      console.log("⚠️ Switching to OpenRouter Backup...");
      try {
        const orRes = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "google/gemini-2.0-flash-001",
            messages: [
              { role: "system", content: systemRole },
              { role: "user", content: prompt }
            ]
          },
          {
            headers: { 
              "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
              "Content-Type": "application/json"
            },
            timeout: 30000
          }
        );
        console.log("✅ OpenRouter Success!");
        return orRes.data.choices[0].message.content;
      } catch (orErr) {
        console.error("❌ Both Providers Failed.");
        throw new Error("AI Services are currently unreachable.");
      }
    }
  },
  async generateSummary(text) {
    const prompt = `Summarize this educational text into 3 clear paragraphs: ${text}`;
    return await this.askAI(prompt, "You are an expert academic summarizer.");
  },

  // 🟢 ADD THIS NEW METHOD FOR THE DOUBT SOLVER
  async generateChatResponse(userPrompt, studyContext) {
    const systemRole = `You are an AI Study and Career Assistant. 
    Use the following study context to answer the student's question accurately. 
    If the answer isn't in the context, use your general knowledge but mention that it wasn't in the notes.
    
    CONTEXT:
    ${studyContext || "No specific study notes provided yet."}`;

    return await this.askAI(userPrompt, systemRole);
  }
};

module.exports = AIService;