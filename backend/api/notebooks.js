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

        let notebookTitle = title;

        // If no title provided, generate a numbered "Untitled Notebook" name
        if (!title) {
            // Get all existing notebooks for this user that start with "Untitled Notebook"
            const existingNotebooks = await prisma.notebook.findMany({
                where: {
                    userId,
                    title: {
                        startsWith: 'Untitled Notebook'
                    }
                },
                select: { title: true }
            });

            // Extract numbers from existing titles
            const numbers = existingNotebooks
                .map(nb => {
                    const match = nb.title.match(/Untitled Notebook (\d+)/);
                    return match ? parseInt(match[1]) : 0;
                })
                .filter(num => num > 0);

            // Find the next available number
            const nextNumber = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
            notebookTitle = `Untitled Notebook ${nextNumber}`;
        }

        const notebook = await prisma.notebook.create({
            data: {
                title: notebookTitle,
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

// Delete a notebook
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.notebook.delete({
            where: { id }
        });

        res.json({ message: 'Notebook deleted successfully' });
    } catch (error) {
        console.error('Delete notebook error:', error);
        res.status(500).json({ error: 'Failed to delete notebook' });
    }
});

module.exports = router;
