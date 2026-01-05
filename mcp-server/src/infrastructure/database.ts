/**
 * Database Infrastructure
 * 
 * Prisma client singleton and database connection management.
 * This module handles the database lifecycle for the MCP server.
 */

import { PrismaClient } from '../generated/prisma/index.js';
import { createChildLogger } from './logger.js';

const logger = createChildLogger('Database');

let prismaClient: PrismaClient | null = null;

/**
 * Get or create the Prisma client singleton
 */
export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      log: [
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });
    logger.info('Prisma client initialized');
  }
  return prismaClient;
}

/**
 * Disconnect Prisma client (for graceful shutdown)
 */
export async function disconnectPrisma(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
    logger.info('Prisma client disconnected');
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = getPrismaClient();
    await client.$queryRaw`SELECT 1`;
    logger.info('Database connection test successful');
    return true;
  } catch (error) {
    logger.error({ error }, 'Database connection test failed');
    return false;
  }
}
