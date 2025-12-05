const { prisma } = require('./prismaClient');

async function main() {
    try {
        console.log('Testing Prisma Message model...');
        const count = await prisma.message.count();
        console.log('Message count:', count);
        console.log('Prisma Message model is working.');
    } catch (error) {
        console.error('Error testing Prisma Message model:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
