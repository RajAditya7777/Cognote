const { prisma } = require('./prismaClient');

async function testAllModels() {
    try {
        console.log('Testing all Prisma models...\n');

        // Test User
        console.log('1. Testing User model...');
        const userCount = await prisma.user.count();
        console.log(`   ✓ User count: ${userCount}`);

        // Test File
        console.log('2. Testing File model...');
        const fileCount = await prisma.file.count();
        console.log(`   ✓ File count: ${fileCount}`);

        // Test Quiz with relations
        console.log('3. Testing Quiz model with relations...');
        const quizzes = await prisma.quiz.findMany({
            take: 1,
            include: { file: true }
        });
        console.log(`   ✓ Quiz count: ${quizzes.length}`);

        // Test Flashcard with relations
        console.log('4. Testing Flashcard model with relations...');
        const flashcards = await prisma.flashcard.findMany({
            take: 1,
            include: { file: true }
        });
        console.log(`   ✓ Flashcard count: ${flashcards.length}`);

        // Test Summary
        console.log('5. Testing Summary model...');
        const summaryCount = await prisma.summary.count();
        console.log(`   ✓ Summary count: ${summaryCount}`);

        // Test the exact query from user/data endpoint
        console.log('6. Testing File query with all relations...');
        const files = await prisma.file.findMany({
            where: { userId: 'cmiq4yuly0000yts075pt9qb0' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                filename: true,
                createdAt: true,
                extractedText: true,
                notebookId: true,
                quiz: true,
                flashcards: true,
                summary: true
            }
        });
        console.log(`   ✓ Files with relations: ${files.length}`);

        console.log('\n✅ All models working correctly!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAllModels();
