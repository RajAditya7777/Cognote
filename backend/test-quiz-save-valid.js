const { prisma } = require('./prismaClient');
const crypto = require('crypto');

async function testSave() {
    try {
        // Get a valid file ID first
        const file = await prisma.file.findFirst();
        if (!file) {
            console.log('No files found to test with');
            return;
        }

        const fileId = file.id;
        const setId = crypto.randomUUID();

        console.log('Testing quiz save...');
        console.log(`Using valid FileId: ${fileId}`);
        console.log(`SetId: ${setId}`);

        const result = await prisma.quiz.createMany({
            data: [
                {
                    question: 'Test question 1?',
                    options: ['A', 'B', 'C', 'D'],
                    answer: 'A',
                    fileId,
                    setId,
                    name: 'Test Quiz'
                }
            ]
        });

        console.log('Save result:', result);

        // Check if saved
        const count = await prisma.quiz.count({ where: { fileId } });
        console.log(`Quiz count for file: ${count}`);

        // Clean up
        await prisma.quiz.deleteMany({ where: { setId } });
        console.log('Cleaned up test data');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSave();
