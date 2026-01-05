/**
 * Prisma Credentials Repository
 * Implements ICredentialsRepository for PostgreSQL via Prisma
 * 
 * This is the KEY repository for Baileys auth state persistence.
 * It stores all WhatsApp credentials that were previously saved to filesystem.
 */

import type { PrismaClient } from '../../generated/prisma/index.js';
import type { ICredentialsRepository } from '../interfaces.js';

export class PrismaCredentialsRepository implements ICredentialsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async get(sessionId: string, category: string, key: string): Promise<unknown | null> {
    const credential = await this.prisma.credential.findUnique({
      where: {
        sessionId_category_key: { sessionId, category, key },
      },
    });
    return credential?.data ?? null;
  }

  async set(sessionId: string, category: string, key: string, data: unknown): Promise<void> {
    await this.prisma.credential.upsert({
      where: {
        sessionId_category_key: { sessionId, category, key },
      },
      create: {
        sessionId,
        category,
        key,
        data: data as object,
      },
      update: {
        data: data as object,
      },
    });
  }

  async delete(sessionId: string, category: string, key: string): Promise<void> {
    await this.prisma.credential.delete({
      where: {
        sessionId_category_key: { sessionId, category, key },
      },
    }).catch(() => {
      // Ignore if not found
    });
  }

  async deleteAll(sessionId: string): Promise<void> {
    await this.prisma.credential.deleteMany({
      where: { sessionId },
    });
  }

  async getAllByCategory(sessionId: string, category: string): Promise<Record<string, unknown>> {
    const credentials = await this.prisma.credential.findMany({
      where: { sessionId, category },
    });

    return Object.fromEntries(
      credentials.map((cred) => [cred.key, cred.data])
    );
  }
}
