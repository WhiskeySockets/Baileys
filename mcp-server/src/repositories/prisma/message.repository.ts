/**
 * Prisma Message Repository
 * Implements IMessageRepository for PostgreSQL via Prisma
 */

import type { PrismaClient, MessageStatus } from '../../generated/prisma/index.js';
import type {
  IMessageRepository,
  MessageEntity,
  CreateMessageInput,
  MessageQueryOptions,
} from '../interfaces.js';

export class PrismaMessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(message: CreateMessageInput): Promise<MessageEntity> {
    return this.prisma.message.upsert({
      where: {
        sessionId_messageId: {
          sessionId: message.sessionId,
          messageId: message.messageId,
        },
      },
      create: {
        sessionId: message.sessionId,
        messageId: message.messageId,
        remoteJid: message.remoteJid,
        fromMe: message.fromMe ?? false,
        participant: message.participant,
        messageType: message.messageType,
        content: message.content,
        mediaUrl: message.mediaUrl,
        mediaType: message.mediaType,
        quotedId: message.quotedId,
        status: message.status ?? 'PENDING',
        timestamp: message.timestamp,
      },
      update: {
        content: message.content,
        mediaUrl: message.mediaUrl,
        status: message.status,
      },
    });
  }

  async findBySession(
    sessionId: string,
    options?: MessageQueryOptions
  ): Promise<MessageEntity[]> {
    return this.prisma.message.findMany({
      where: {
        sessionId,
        ...(options?.before && { timestamp: { lt: options.before } }),
        ...(options?.after && { timestamp: { gt: options.after } }),
        ...(options?.fromMe !== undefined && { fromMe: options.fromMe }),
      },
      orderBy: { timestamp: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
  }

  async findByJid(
    sessionId: string,
    jid: string,
    options?: MessageQueryOptions
  ): Promise<MessageEntity[]> {
    return this.prisma.message.findMany({
      where: {
        sessionId,
        remoteJid: jid,
        ...(options?.before && { timestamp: { lt: options.before } }),
        ...(options?.after && { timestamp: { gt: options.after } }),
        ...(options?.fromMe !== undefined && { fromMe: options.fromMe }),
      },
      orderBy: { timestamp: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
  }

  async findByMessageId(
    sessionId: string,
    messageId: string
  ): Promise<MessageEntity | null> {
    return this.prisma.message.findUnique({
      where: {
        sessionId_messageId: { sessionId, messageId },
      },
    });
  }

  async updateStatus(
    sessionId: string,
    messageId: string,
    status: MessageStatus
  ): Promise<void> {
    await this.prisma.message.update({
      where: {
        sessionId_messageId: { sessionId, messageId },
      },
      data: { status },
    });
  }

  async delete(sessionId: string, messageId: string): Promise<void> {
    await this.prisma.message.delete({
      where: {
        sessionId_messageId: { sessionId, messageId },
      },
    }).catch(() => {
      // Ignore if not found
    });
  }

  async deleteBySession(sessionId: string): Promise<void> {
    await this.prisma.message.deleteMany({
      where: { sessionId },
    });
  }
}
