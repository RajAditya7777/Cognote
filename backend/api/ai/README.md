# AI Features - Implementation Guide

This directory contains placeholder routes for AI-powered features that will be implemented using the **Google Gemini API**.

## 🚧 Current Status: NOT IMPLEMENTED

The AI routes are currently **placeholders** that return "Not implemented yet" responses. This allows the backend structure to be complete while you learn and implement the Gemini integration at your own pace.

## 📋 Planned AI Features

### 1. **Text Summarization** (`POST /api/ai/summarize`)
Generate concise summaries of uploaded PDF notes.

**Future Implementation:**
- Extract text from uploaded PDF or fetch from database
- Send text to Gemini API with summarization prompt
- Save generated summary to database (Summary model in schema)
- Return summary to frontend

**Example Gemini Prompt:**
```
Summarize the following text in 3-5 bullet points, focusing on key concepts:

[TEXT HERE]
```

---

### 2. **Flashcard Generation** (`POST /api/ai/flashcards`)
Automatically create study flashcards from notes.

**Future Implementation:**
- Parse note content
- Send to Gemini API requesting question-answer pairs
- Parse JSON response with flashcards
- Save to database (Flashcard model)
- Return array of flashcards

**Example Gemini Prompt:**
```
Generate 10 flashcards from the following text. Return as JSON array with format:
[{"question": "...", "answer": "..."}]

[TEXT HERE]
```

---

### 3. **Quiz Generation** (`POST /api/ai/quiz`)
Create multiple-choice quizzes for self-testing.

**Future Implementation:**
- Extract key concepts from notes
- Send to Gemini API requesting quiz questions
- Parse response with questions, options, and correct answers
- Save to database (Quiz model)
- Return quiz questions

**Example Gemini Prompt:**
```
Generate 5 multiple-choice questions from the following text. Return as JSON:
[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "B"}]

[TEXT HERE]
```

---

### 4. **Chat with Notes** (`POST /api/ai/chat`)
Conversational AI that answers questions about your notes.

**Future Implementation:**
- Fetch relevant notes/files for context
- Maintain conversation history
- Send context + user question to Gemini API
- Stream or return AI response
- Optionally save conversation

**Example Gemini Prompt:**
```
You are a helpful study assistant. Answer the user's question based on these notes:

[NOTES CONTEXT]

User question: [USER QUESTION]
```

---

## 🔧 How to Implement

### Step 1: Install Gemini SDK
```bash
npm install @google/generative-ai
```

### Step 2: Get API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` file:
```
GEMINI_API_KEY=your-api-key-here
```

### Step 3: Initialize Gemini Client
Create a new file `backend/lib/gemini.js`:
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

module.exports = { model };
```

### Step 4: Implement Routes
Replace the placeholder functions in `placeholders.js` with actual Gemini API calls.

**Example for summarization:**
```javascript
const { model } = require('../../lib/gemini');

async function summarize(req, res) {
  const { text } = req.body;
  
  const prompt = `Summarize the following text in 3-5 bullet points:\n\n${text}`;
  const result = await model.generateContent(prompt);
  const summary = result.response.text();
  
  res.json({ summary });
}
```

### Step 5: Update Database Models
Uncomment the Summary, Flashcard, and Quiz models in `prisma/schema.prisma` and run:
```bash
npx prisma db push
```

---

## 📚 Resources

- [Gemini API Documentation](https://ai.google.dev/docs)
- [Gemini Node.js Quickstart](https://ai.google.dev/tutorials/node_quickstart)
- [Prompt Engineering Guide](https://ai.google.dev/docs/prompt_best_practices)

---

## 💡 Tips

1. **Start Simple**: Implement summarization first, it's the easiest
2. **Use JSON Mode**: For structured outputs (flashcards, quizzes), use Gemini's JSON mode
3. **Handle Errors**: Add try-catch blocks and handle rate limits
4. **Test Prompts**: Experiment in [Google AI Studio](https://makersuite.google.com/) before coding
5. **Add Authentication**: Use the `verifyToken` middleware on all AI routes

---

**Ready to implement?** Start with the summarization feature and gradually add the others!
