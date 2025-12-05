const { prisma } = require('../../prismaClient');

async function getHistory(req, res) {
    try {
        const { userId, fileId, notebookId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        let where = { userId };

        if (fileId) {
            // If specific file is requested, filter by that file
            where.fileId = fileId;
        } else if (notebookId) {
            // If notebook is specified, only get messages from files in that notebook
            const filesInNotebook = await prisma.file.findMany({
                where: { notebookId },
                select: { id: true }
            });

            const fileIds = filesInNotebook.map(f => f.id);

            if (fileIds.length > 0) {
                where.fileId = { in: fileIds };
            } else {
                // No files in this notebook yet, return empty array
                return res.json([]);
            }
        }

        const messages = await prisma.message.findMany({
            where,
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
}

module.exports = { getHistory };
