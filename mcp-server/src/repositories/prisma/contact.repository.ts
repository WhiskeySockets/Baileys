/**
 * Prisma Contact Repository
 * Implements IContactRepository for PostgreSQL via Prisma
 */

import type { PrismaClient } from '../../generated/prisma/index.js';
import type {
  IContactRepository,
  ContactEntity,
  UpsertContactInput,
} from '../interfaces.js';

export class PrismaContactRepository implements IContactRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(contact: UpsertContactInput): Promise<ContactEntity> {
    return this.prisma.contact.upsert({
      where: {
        sessionId_jid: {
          sessionId: contact.sessionId,
          jid: contact.jid,
        },
      },
      create: {
        sessionId: contact.sessionId,
        jid: contact.jid,
        name: contact.name,
        notify: contact.notify,
        status: contact.status,
        imgUrl: contact.imgUrl,
        isBlocked: contact.isBlocked ?? false,
        isBusiness: contact.isBusiness ?? false,
      },
      update: {
        name: contact.name,
        notify: contact.notify,
        status: contact.status,
        imgUrl: contact.imgUrl,
        isBlocked: contact.isBlocked,
        isBusiness: contact.isBusiness,
      },
    });
  }

  async findByJid(sessionId: string, jid: string): Promise<ContactEntity | null> {
    return this.prisma.contact.findUnique({
      where: {
        sessionId_jid: { sessionId, jid },
      },
    });
  }

  async findBySession(sessionId: string): Promise<ContactEntity[]> {
    return this.prisma.contact.findMany({
      where: { sessionId },
      orderBy: { name: 'asc' },
    });
  }

  async delete(sessionId: string, jid: string): Promise<void> {
    await this.prisma.contact.delete({
      where: {
        sessionId_jid: { sessionId, jid },
      },
    }).catch(() => {
      // Ignore if not found
    });
  }

  async deleteBySession(sessionId: string): Promise<void> {
    await this.prisma.contact.deleteMany({
      where: { sessionId },
    });
  }
}
