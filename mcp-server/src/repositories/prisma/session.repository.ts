/**
 * Prisma Session Repository
 * Implements ISessionRepository for PostgreSQL via Prisma
 */

import type { PrismaClient, SessionStatus } from '../../generated/prisma/index.js';
import type {
  ISessionRepository,
  SessionEntity,
  CreateSessionInput,
  UpdateSessionInput,
} from '../interfaces.js';

export class PrismaSessionRepository implements ISessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<SessionEntity | null> {
    return this.prisma.session.findUnique({
      where: { id },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<SessionEntity | null> {
    return this.prisma.session.findUnique({
      where: { phoneNumber },
    });
  }

  async create(data: CreateSessionInput): Promise<SessionEntity> {
    return this.prisma.session.create({
      data: {
        phoneNumber: data.phoneNumber,
        jid: data.jid,
        name: data.name,
        platform: data.platform,
        status: data.status ?? 'DISCONNECTED',
      },
    });
  }

  async update(id: string, data: UpdateSessionInput): Promise<SessionEntity> {
    return this.prisma.session.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: SessionStatus): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { status },
    });
  }

  async updateLastSeen(id: string): Promise<void> {
    await this.prisma.session.update({
      where: { id },
      data: { lastSeen: new Date() },
    });
  }

  async findAll(): Promise<SessionEntity[]> {
    return this.prisma.session.findMany({
      orderBy: { updatedAt: 'desc' },
    });
  }
}
