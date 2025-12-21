import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// For serverless environments like Vercel, we need to handle connection pooling better
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// Only cache in development - in production, each request gets a fresh connection
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

