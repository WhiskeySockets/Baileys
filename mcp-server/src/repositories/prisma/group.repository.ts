/**
 * Prisma Group Repository
 * Implements IGroupRepository for PostgreSQL via Prisma
 */

import type { PrismaClient, Prisma } from '../../generated/prisma/index.js';
import type {
  IGroupRepository,
  GroupCacheEntity,
  GroupParticipantData,
  UpsertGroupInput,
} from '../interfaces.js';

export class PrismaGroupRepository implements IGroupRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsert(group: UpsertGroupInput): Promise<GroupCacheEntity> {
    const result = await this.prisma.groupCache.upsert({
      where: {
        sessionId_groupJid: {
          sessionId: group.sessionId,
          groupJid: group.groupJid,
        },
      },
      create: {
        sessionId: group.sessionId,
        groupJid: group.groupJid,
        subject: group.subject,
        owner: group.owner,
        description: group.description,
        announce: group.announce ?? false,
        restrict: group.restrict ?? false,
        ephemeral: group.ephemeral,
        participants: (group.participants ?? []) as unknown as Prisma.InputJsonValue,
        creation: group.creation,
      },
      update: {
        subject: group.subject,
        owner: group.owner,
        description: group.description,
        announce: group.announce,
        restrict: group.restrict,
        ephemeral: group.ephemeral,
        participants: group.participants as unknown as Prisma.InputJsonValue,
        creation: group.creation,
      },
    });

    // Transform the result to match GroupCacheEntity interface
    return {
      ...result,
      participants: result.participants as unknown as GroupParticipantData[],
    };
  }

  async findByJid(sessionId: string, groupJid: string): Promise<GroupCacheEntity | null> {
    const result = await this.prisma.groupCache.findUnique({
      where: {
        sessionId_groupJid: { sessionId, groupJid },
      },
    });

    if (!result) return null;

    return {
      ...result,
      participants: result.participants as unknown as GroupParticipantData[],
    };
  }

  async findBySession(sessionId: string): Promise<GroupCacheEntity[]> {
    const results = await this.prisma.groupCache.findMany({
      where: { sessionId },
      orderBy: { subject: 'asc' },
    });

    return results.map((result) => ({
      ...result,
      participants: result.participants as unknown as GroupParticipantData[],
    }));
  }

  async delete(sessionId: string, groupJid: string): Promise<void> {
    await this.prisma.groupCache.delete({
      where: {
        sessionId_groupJid: { sessionId, groupJid },
      },
    }).catch(() => {
      // Ignore if not found
    });
  }

  async deleteBySession(sessionId: string): Promise<void> {
    await this.prisma.groupCache.deleteMany({
      where: { sessionId },
    });
  }
}
