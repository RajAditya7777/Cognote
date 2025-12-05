const express = require('express');
const router = express.Router();
const { prisma } = require('../prismaClient');
const fs = require('fs');

// Delete File
router.delete('/file/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find file to get path
        const file = await prisma.file.findUnique({ where: { id } });
        if (!file) return res.status(404).json({ error: 'File not found' });

        // Delete from DB (Cascade will handle related notes, quizzes, etc.)
        await prisma.file.delete({ where: { id } });

        // Delete from filesystem
        if (fs.existsSync(file.filepath)) {
            fs.unlinkSync(file.filepath);
        }

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Delete file error:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

// Delete All Quizzes for a File
router.delete('/quiz/file/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        await prisma.quiz.deleteMany({ where: { fileId } });
        res.json({ message: 'All quizzes for file deleted successfully' });
    } catch (error) {
        console.error('Delete all quizzes error:', error);
        res.status(500).json({ error: 'Failed to delete quizzes' });
    }
});

// Delete Quiz
router.delete('/quiz/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.quiz.delete({ where: { id } });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error('Delete quiz error:', error);
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

// Delete All Flashcards for a File
router.delete('/flashcards/file/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        await prisma.flashcard.deleteMany({ where: { fileId } });
        res.json({ message: 'All flashcards for file deleted successfully' });
    } catch (error) {
        console.error('Delete all flashcards error:', error);
        res.status(500).json({ error: 'Failed to delete flashcards' });
    }
});

// Delete Flashcards
router.delete('/flashcards/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.flashcard.delete({ where: { id } });
        res.json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        console.error('Delete flashcards error:', error);
        res.status(500).json({ error: 'Failed to delete flashcards' });
    }
});

// Delete Summary
router.delete('/summary/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.summary.delete({ where: { id } });
        res.json({ message: 'Summary deleted successfully' });
    } catch (error) {
        console.error('Delete summary error:', error);
        res.status(500).json({ error: 'Failed to delete summary' });
    }
});

// Delete Quiz Set by setId
router.delete('/quiz/set/:setId', async (req, res) => {
    try {
        const { setId } = req.params;
        await prisma.quiz.deleteMany({ where: { setId } });
        res.json({ message: 'Quiz set deleted successfully' });
    } catch (error) {
        console.error('Delete quiz set error:', error);
        res.status(500).json({ error: 'Failed to delete quiz set' });
    }
});

// Delete Flashcard Set by setId
router.delete('/flashcards/set/:setId', async (req, res) => {
    try {
        const { setId } = req.params;
        await prisma.flashcard.deleteMany({ where: { setId } });
        res.json({ message: 'Flashcard set deleted successfully' });
    } catch (error) {
        console.error('Delete flashcard set error:', error);
        res.status(500).json({ error: 'Failed to delete flashcard set' });
    }
});

module.exports = router;
