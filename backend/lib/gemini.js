const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the generative model (gemini-1.5-flash is good for speed and cost)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

module.exports = {
    model,
    genAI
};
