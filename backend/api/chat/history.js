const { prisma } = require('../../prismaClient');

async function getHistory(req, res) {
    try {
        const { userId, fileId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const where = { userId };
        if (fileId) {
            where.fileId = fileId;
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
