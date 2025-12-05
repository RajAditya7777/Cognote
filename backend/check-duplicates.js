const { prisma } = require('./prismaClient');

async function checkDuplicates() {
    try {
        // Check for duplicate filenames
        const files = await prisma.file.groupBy({
            by: ['filename'],
            _count: {
                filename: true
            },
            having: {
                filename: {
                    _count: {
                        gt: 1
                    }
                }
            }
        });

        console.log('Duplicate filenames:', files);

        // Show all files
        const allFiles = await prisma.file.findMany({
            select: {
                id: true,
                filename: true,
                createdAt: true,
                userId: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20
        });

        console.log('\nRecent files:');
        allFiles.forEach(f => {
            console.log(`- ${f.filename} (${f.id.substring(0, 8)}...) - ${f.createdAt}`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkDuplicates();
