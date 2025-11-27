const { PrismaClient } = require('@prisma/client');

// Singleton pattern to prevent multiple Prisma Client instances
const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

// Use global variable to store Prisma Client in development
// This prevents hot-reload from creating new instances
const globalForPrisma = global;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

module.exports = { prisma };
