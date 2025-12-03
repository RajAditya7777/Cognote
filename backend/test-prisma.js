const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

console.log('Testing Prisma Client instantiation...');

try {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    console.log('Adapter created.');

    const prisma = new PrismaClient({
        adapter,
        log: ['info']
    });

    console.log('Prisma Client instantiated successfully!');
    console.log('Client Version:', PrismaClient.version); // Might be undefined depending on version
} catch (e) {
    console.error('❌ Failed to instantiate Prisma Client:');
    console.error(e);
}
