const express = require('express');
const router = express.Router();
const { prisma } = require('../prismaClient');

// Create a new notebook
router.post('/', async (req, res) => {
    try {
        const { userId, title } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        const notebook = await prisma.notebook.create({
            data: {
                title: title || 'Untitled Notebook',
                userId
            }
        });

        res.json(notebook);
    } catch (error) {
        console.error('Create notebook error:', error);
        res.status(500).json({ error: 'Failed to create notebook' });
    }
});

// Get all notebooks for a user
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const notebooks = await prisma.notebook.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                _count: {
                    select: { files: true }
                }
            }
        });

        res.json(notebooks);
    } catch (error) {
        console.error('Get notebooks error:', error);
        res.status(500).json({ error: 'Failed to fetch notebooks' });
    }
});

// Update a notebook
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, customPrompt } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (customPrompt !== undefined) updateData.customPrompt = customPrompt;

        const notebook = await prisma.notebook.update({
            where: { id },
            data: updateData
        });

        res.json(notebook);
    } catch (error) {
        console.error('Update notebook error:', error);
        res.status(500).json({ error: 'Failed to update notebook' });
    }
});

module.exports = router;
