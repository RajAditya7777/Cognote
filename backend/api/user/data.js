const { prisma } = require('../../prismaClient');

async function getUserData(req, res) {
    try {
        const { userId, notebookId } = req.body; // In a real app, this would come from the auth middleware (req.user.id)

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Build where clause for files
        const fileWhere = { userId };
        if (notebookId) {
            fileWhere.notebookId = notebookId;
        }

        const files = await prisma.file.findMany({
            where: fileWhere,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                filename: true,
                createdAt: true,
                extractedText: true, // Fetch extracted text
                notebookId: true,    // Include notebook association
                quiz: true,       // Fetch full quiz data
                flashcards: true, // Fetch full flashcards data
                summary: true     // Fetch full summary data
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
