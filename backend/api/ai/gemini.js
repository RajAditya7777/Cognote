const { model } = require('../../lib/gemini');
const { prisma } = require('../../prismaClient');

/**
 * Summarize Text Endpoint
 * POST /api/ai/summarize
 */
async function summarize(req, res) {
    try {
        const { text, fileId, fileIds, userId } = req.body;

        if (!text && !fileId && (!fileIds || fileIds.length === 0)) {
            return res.status(400).json({ error: 'Text, fileId, or fileIds is required' });
        }

        let contentToSummarize = text || "";

        if (fileIds && fileIds.length > 0) {
            const notes = await prisma.note.findMany({
                where: { fileId: { in: fileIds } }
            });
            if (notes.length > 0) {
                contentToSummarize += "\n\n" + notes.map(n => n.content).join("\n\n");
            }
        } else if (fileId) {
            const note = await prisma.note.findFirst({
                where: { fileId: fileId }
            });
            if (note) {
                contentToSummarize = note.content;
            } else {
                return res.status(404).json({ error: 'Note not found for this file' });
            }
        }

        let customInstruction = "";
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { customPrompt: true } });
            if (user?.customPrompt) customInstruction = `\n\nUser Custom Instruction: ${user.customPrompt}`;
        }

        const prompt = `Summarize the following text concisely, capturing the main points.${customInstruction}\n\n${contentToSummarize}`;
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
        const { text, fileId, fileIds, userId, count = 5 } = req.body;

        let contentToProcess = text || "";

        if (fileIds && fileIds.length > 0) {
            const notes = await prisma.note.findMany({
                where: { fileId: { in: fileIds } }
            });
            if (notes.length > 0) {
                contentToProcess += "\n\n" + notes.map(n => n.content).join("\n\n");
            }
        } else if (fileId) {
            const note = await prisma.note.findFirst({ where: { fileId } });
            if (!note) return res.status(404).json({ error: 'Note not found' });
            contentToProcess = note.content;
        }

        let customInstruction = "";
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { customPrompt: true } });
            if (user?.customPrompt) customInstruction = `\n\nUser Custom Instruction: ${user.customPrompt}`;
        }

        const prompt = `Generate ${count} flashcards from the following text. Return a JSON array of objects with "front" and "back" keys. Do not include markdown formatting like \`\`\`json.${customInstruction}\n\nText:\n${contentToProcess}`;

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
        const { text, fileId, fileIds, userId, count = 5 } = req.body;

        let contentToProcess = text || "";

        if (fileIds && fileIds.length > 0) {
            const notes = await prisma.note.findMany({
                where: { fileId: { in: fileIds } }
            });
            if (notes.length > 0) {
                contentToProcess += "\n\n" + notes.map(n => n.content).join("\n\n");
            }
        } else if (fileId) {
            const note = await prisma.note.findFirst({ where: { fileId } });
            if (!note) return res.status(404).json({ error: 'Note not found' });
            contentToProcess = note.content;
        }

        let customInstruction = "";
        if (userId) {
            const user = await prisma.user.findUnique({ where: { id: userId }, select: { customPrompt: true } });
            if (user?.customPrompt) customInstruction = `\n\nUser Custom Instruction: ${user.customPrompt}`;
        }

        const prompt = `Generate a quiz with ${count} multiple-choice questions from the following text. 
        Return a JSON array of objects with the following structure:
        {
            "question": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answer": "The correct option text (must match one of the options exactly)",
            "explanations": {
                "0": "Explanation for why Option A is correct/incorrect",
                "1": "Explanation for why Option B is correct/incorrect",
                "2": "Explanation for why Option C is correct/incorrect",
                "3": "Explanation for why Option D is correct/incorrect"
            },
            "hint": "A helpful hint"
        }
        Do not include markdown formatting.
        ${customInstruction}
        
        Text:
        ${contentToProcess}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();
        console.log("Raw Gemini Response:", textResponse); // Log raw response for debugging

        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        let quizData;
        try {
            quizData = JSON.parse(textResponse);
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError);
            console.error("Failed Text:", textResponse);
            // Attempt to recover or return a partial error
            return res.status(500).json({ error: 'Failed to parse AI response', details: parseError.message });
        }

        if (fileId && Array.isArray(quizData)) {
            console.log(`Saving quiz for file ${fileId} with ${quizData.length} questions`);
            try {
                await prisma.quiz.deleteMany({ where: { fileId } });
                await prisma.quiz.createMany({
                    data: quizData.map(q => ({
                        question: q.question,
                        options: q.options,
                        answer: q.answer,
                        explanations: q.explanations || {}, // Save explanations
                        hint: q.hint || "",             // Save hint
                        fileId
                    }))
                });
                console.log("Quiz saved successfully to DB");
            } catch (dbError) {
                console.error("Database Save Error:", dbError);
                // We don't block the response if DB save fails, but we log it
            }
        }

        res.json({ quiz: quizData });
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
    }
}

/**
 * Chat with Notes Endpoint
 * POST /api/ai/chat
 */
async function chat(req, res) {
    try {
        const { message, fileId, conversationHistory = [], userId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Validate fileId if provided
        if (fileId) {
            const fileExists = await prisma.file.findUnique({
                where: { id: fileId }
            });
            if (!fileExists) {
                return res.status(404).json({ error: 'File not found' });
            }
        }

        // Save user message
        if (userId) {
            await prisma.message.create({
                data: {
                    content: message,
                    role: 'user',
                    userId,
                    fileId
                }
            });
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

        const systemInstruction = `You are a helpful and intelligent AI assistant for a notebook application called "CogNote". 
        Your goal is to help users understand their notes, study effectively, and extract insights.
        
        You have access to the user's notes (provided in the context). 
        
        **Primary Directive:**
        1.  **Prioritize the User's Notes:** Always check the provided context from the notes first. If the answer is in the notes, answer based on them.
        2.  **General Knowledge Fallback:** If the user asks a question that is NOT covered by the notes (e.g., general definitions, facts, or concepts not mentioned in the text), you SHOULD answer using your general knowledge.
        3.  **Transparency:** When answering from general knowledge, explicitly state: "This information is not in your notes, but generally..." or similar.
        
        When asked to "summarize", provide a concise and clear summary of the notes.
        When asked for a "quiz", generate a short multiple-choice quiz based on the notes.
        When asked for "flashcards", generate a list of key terms and definitions from the notes.
        
        Always be professional, clear, and concise. Use markdown for formatting (lists, bold text, code blocks) to make the response easy to read.`;

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemInstruction }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. I am ready to assist you with your notes." }]
                },
                ...conversationHistory.map(msg => ({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                }))
            ]
        });

        const prompt = `${context}User question: ${message}`;
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        // Save assistant response
        if (userId) {
            await prisma.message.create({
                data: {
                    content: text,
                    role: 'assistant',
                    userId,
                    fileId
                }
            });
        }

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
