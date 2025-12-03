const { prisma } = require('../../prismaClient');

async function getUserData(req, res) {
    try {
        const { userId } = req.body; // In a real app, this would come from the auth middleware (req.user.id)

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const files = await prisma.file.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                filename: true,
                createdAt: true,
                // Don't fetch extractedText for the list view to save bandwidth
            }
        });

        const notes = await prisma.note.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ files, notes });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
}

module.exports = getUserData;
