const { prisma } = require('./prismaClient');
const crypto = require('crypto');

async function testSave() {
    try {
        const fileId = 'cmisrkv7s0004115n0rvx1gv9'; // Recent file
        const setId = crypto.randomUUID();

        console.log('Testing quiz save...');
        console.log(`FileId: ${fileId}`);
        console.log(`SetId: ${setId}`);

        const result = await prisma.quiz.createMany({
            data: [
                {
                    question: 'Test question 1?',
                    options: ['A', 'B', 'C', 'D'],
                    answer: 'A',
                    fileId,
                    setId
                },
                {
                    question: 'Test question 2?',
                    options: ['A', 'B', 'C', 'D'],
                    answer: 'B',
                    fileId,
                    setId
                }
            ]
        });

        console.log('Save result:', result);

        // Check if saved
        const count = await prisma.quiz.count({ where: { fileId } });
        console.log(`Quiz count for file: ${count}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSave();
