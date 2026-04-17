const { GoogleGenerativeAI } = require("@google/generative-ai");

const AIService = {
  async generateSummary(text) {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      // Use the 'latest' alias which always points to the active production model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-latest" });

      console.log("📡 Attempting connection with gemini-1.5-flash-latest...");
      
      const result = await model.generateContent(text);
      const response = await result.response;
      return response.text();
      
    } catch (error) {
      console.error("❌ Gemini Service Error:", error.message);
      throw new Error(`Model Error: ${error.message}`);
    }
  }
};

module.exports = AIService;