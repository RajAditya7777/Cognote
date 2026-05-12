const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model (gemini-2.0-flash — stable and fast)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

module.exports = {
    model,
    genAI
};
