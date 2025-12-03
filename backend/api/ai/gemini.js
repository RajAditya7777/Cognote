const { model } = require('../../lib/gemini');
const { prisma } = require('../../prismaClient');

/**
 * Summarize Text Endpoint
 * POST /api/ai/summarize
 */
async function summarize(req, res) {
    try {
        const { text, fileId } = req.body;

        if (!text && !fileId) {
            return res.status(400).json({ error: 'Text or fileId is required' });
        }

        let contentToSummarize = text;

        if (fileId) {
            const note = await prisma.note.findFirst({
                where: { fileId: fileId }
            });
            if (note) {
                contentToSummarize = note.content;
            } else {
                return res.status(404).json({ error: 'Note not found for this file' });
            }
        }

        const prompt = `Summarize the following text concisely, capturing the main points:\n\n${contentToSummarize}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summaryText = response.text();

        // Optionally save summary
        if (fileId) {
            await prisma.summary.upsert({
                where: { fileId: fileId },
                update: { content: summaryText },
                create: {
                    content: summaryText,
                    fileId: fileId
                }
            });
        }

        res.json({ summary: summaryText });
    } catch (error) {
        console.error('Summarization error:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
}

/**
 * Generate Flashcards Endpoint
 * POST /api/ai/flashcards
 */
async function flashcards(req, res) {
    try {
        const { text, fileId, count = 5 } = req.body;

        let contentToProcess = text;
        if (fileId) {
            const note = await prisma.note.findFirst({ where: { fileId } });
            if (!note) return res.status(404).json({ error: 'Note not found' });
            contentToProcess = note.content;
        }

        const prompt = `Generate ${count} flashcards from the following text. Return a JSON array of objects with "front" and "back" keys. Do not include markdown formatting like \`\`\`json.\n\nText:\n${contentToProcess}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();

        // Clean up markdown code blocks if present
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const flashcardsData = JSON.parse(textResponse);

        // Save to DB
        if (fileId && Array.isArray(flashcardsData)) {
            // Delete old flashcards for this file to avoid duplicates/stale data
            await prisma.flashcard.deleteMany({ where: { fileId } });

            await prisma.flashcard.createMany({
                data: flashcardsData.map(fc => ({
                    front: fc.front,
                    back: fc.back,
                    fileId
                }))
            });
        }

        res.json({ flashcards: flashcardsData });
    } catch (error) {
        console.error('Flashcard generation error:', error);
        res.status(500).json({ error: 'Failed to generate flashcards' });
    }
}

/**
 * Generate Quiz Endpoint
 * POST /api/ai/quiz
 */
async function quiz(req, res) {
    try {
        const { text, fileId, count = 5 } = req.body;

        let contentToProcess = text;
        if (fileId) {
            const note = await prisma.note.findFirst({ where: { fileId } });
            if (!note) return res.status(404).json({ error: 'Note not found' });
            contentToProcess = note.content;
        }

        const prompt = `Generate a quiz with ${count} multiple-choice questions from the following text. Return a JSON array of objects with "question", "options" (array of strings), and "answer" (string, matching one of the options) keys. Do not include markdown formatting.\n\nText:\n${contentToProcess}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();

        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const quizData = JSON.parse(textResponse);

        if (fileId && Array.isArray(quizData)) {
            await prisma.quiz.deleteMany({ where: { fileId } });
            await prisma.quiz.createMany({
                data: quizData.map(q => ({
                    question: q.question,
                    options: q.options,
                    answer: q.answer,
                    fileId
                }))
            });
        }

        res.json({ quiz: quizData });
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
}

/**
 * Chat with Notes Endpoint
 * POST /api/ai/chat
 */
async function chat(req, res) {
    try {
        const { message, fileId, conversationHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let context = "";
        if (fileId) {
            const note = await prisma.note.findFirst({ where: { fileId } });
            if (note) {
                context = `Context from user's notes:\n${note.content}\n\n`;
            }
        }

        // Construct history for Gemini
        // Gemini expects history in { role: 'user' | 'model', parts: [{ text: '...' }] } format
        // Assuming conversationHistory comes in as simple objects, we map them.
        // If it's the first message, history is empty.

        const chat = model.startChat({
            history: conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }))
        });

        const prompt = `${context}User question: ${message}`;
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({
            role: 'assistant',
            content: text
        });
    } catch (error) {
        console.error('Chat error details:', error);
        res.status(500).json({ error: 'Failed to process chat message', details: error.message });
    }
}

module.exports = {
    summarize,
    flashcards,
    quiz,
    chat
};
