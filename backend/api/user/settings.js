const express = require('express');
const router = express.Router();
const { prisma } = require('../../prismaClient');

// Get User Settings & Profile
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                email: true,
                username: true,
                customPrompt: true
            }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Update User Profile (Name, Username, Prompt)
router.post('/profile', async (req, res) => {
    try {
        const { userId, name, username, customPrompt } = req.body;

        if (!userId) return res.status(400).json({ error: 'UserId is required' });

        // Check if username is taken (if changed)
        if (username) {
            const existingUser = await prisma.user.findUnique({ where: { username } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'Username is already taken' });
            }
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (username !== undefined) updateData.username = username;
        if (customPrompt !== undefined) updateData.customPrompt = customPrompt;

        await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
