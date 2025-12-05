const { prisma } = require('./prismaClient');

async function checkGeneratedContent() {
    try {
        console.log('Checking generated content in database...\n');

        // Get a recent file
        const recentFile = await prisma.file.findFirst({
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                filename: true,
                createdAt: true
            }
        });

        if (!recentFile) {
            console.log('No files found');
            return;
        }

        console.log(`Most recent file: ${recentFile.filename} (${recentFile.id})`);
        console.log(`Created: ${recentFile.createdAt}\n`);

        // Check quiz
        const quizCount = await prisma.quiz.count({
            where: { fileId: recentFile.id }
        });
        console.log(`Quiz questions for this file: ${quizCount}`);

        // Check flashcards
        const flashcardCount = await prisma.flashcard.count({
            where: { fileId: recentFile.id }
        });
        console.log(`Flashcards for this file: ${flashcardCount}`);

        // Check summary
        const summary = await prisma.summary.findUnique({
            where: { fileId: recentFile.id }
        });
        console.log(`Summary for this file: ${summary ? 'Yes' : 'No'}`);

        // Check total counts
        console.log('\nTotal in database:');
        const totalQuiz = await prisma.quiz.count();
        const totalFlashcards = await prisma.flashcard.count();
        const totalSummaries = await prisma.summary.count();
        console.log(`- Total quiz questions: ${totalQuiz}`);
        console.log(`- Total flashcards: ${totalFlashcards}`);
        console.log(`- Total summaries: ${totalSummaries}`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkGeneratedContent();
