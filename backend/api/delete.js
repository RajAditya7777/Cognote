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

// Delete Flashcards
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

module.exports = router;
