/**
 * Message Service
 * Handles all message operations: send, read, delete, forward
 */

import type { WASocket, AnyMessageContent, WAMessage } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';
import { type ConnectionService } from './connection.service.js';
import type { IMessageRepository, CreateMessageInput } from '../repositories/interfaces.js';
import type { MessageType } from '../generated/prisma/index.js';
import type {
  IMessageService,
  SendTextInput,
  SendMediaInput,
  SendReactionInput,
  SendMessageResult,
  MessageKey,
} from '../types/index.js';

const logger = createChildLogger('MessageService');

export interface MessageServiceConfig {
  sessionId?: string;
  messageRepository?: IMessageRepository;
}

export class MessageService implements IMessageService {
  private connectionService: ConnectionService;
  private sessionId?: string;
  private messageRepository?: IMessageRepository;

  constructor(connectionService: ConnectionService, config?: MessageServiceConfig) {
    this.connectionService = connectionService;
    this.sessionId = config?.sessionId;
    this.messageRepository = config?.messageRepository;
  }

  /**
   * Persist message to database if repository is available
   */
  private async persistMessage(input: CreateMessageInput): Promise<void> {
    if (!this.messageRepository || !this.sessionId) {
      return; // Skip if no repository or sessionId configured
    }

    try {
      await this.messageRepository.save(input);
      logger.debug({ messageId: input.messageId }, 'Message persisted to database');
    } catch (error) {
      logger.error({ error, messageId: input.messageId }, 'Failed to persist message to database');
      // Don't throw - persistence failure shouldn't break message sending
    }
  }
// ... methods remain same

// Export class directly, no singleton

  /**
   * Get socket or throw if not connected
   */
  private getSocket(): WASocket {
    const socket = this.connectionService.getSocket();
    if (!socket || !this.connectionService.isConnected()) {
      throw new Error('NOT_CONNECTED: WhatsApp is not connected');
    }
    return socket;
  }

  /**
   * Send a text message
   */
  async sendText(input: SendTextInput): Promise<SendMessageResult> {
    const socket = this.getSocket();
    logger.debug({ jid: input.jid }, 'Sending text message');

    const content: AnyMessageContent = { text: input.text };
    const options: any = {};

    // Handle quoted message
    if (input.quotedMessageId) {
      options.quoted = {
        key: {
          remoteJid: input.jid,
          id: input.quotedMessageId,
        },
      } as WAMessage;
    }

    const result = await socket.sendMessage(input.jid, content, options);
    const timestamp = Date.now();

    logger.info({ messageId: result?.key?.id }, 'Text message sent');

    // Persist sent message to database
    await this.persistMessage({
      sessionId: this.sessionId || '',
      messageId: result?.key?.id || '',
      remoteJid: input.jid,
      fromMe: true,
      messageType: 'TEXT',
      content: input.text,
      quotedId: input.quotedMessageId,
      status: 'SENT',
      timestamp: new Date(timestamp),
    });

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp,
    };
  }

  /**
   * Send media message (image, video, audio, document)
   */
  async sendMedia(input: SendMediaInput): Promise<SendMessageResult> {
    const socket = this.getSocket();
    logger.debug({ jid: input.jid, mediaType: input.mediaType }, 'Sending media message');

    const content = this.buildMediaContent(input);
    const result = await socket.sendMessage(input.jid, content);
    const timestamp = Date.now();

    logger.info({ messageId: result?.key?.id, mediaType: input.mediaType }, 'Media message sent');

    // Map media type to MessageType enum
    const messageTypeMap: Record<string, MessageType> = {
      image: 'IMAGE',
      video: 'VIDEO',
      audio: 'AUDIO',
      document: 'DOCUMENT',
      sticker: 'STICKER',
    };

    // Persist sent message to database
    await this.persistMessage({
      sessionId: this.sessionId || '',
      messageId: result?.key?.id || '',
      remoteJid: input.jid,
      fromMe: true,
      messageType: messageTypeMap[input.mediaType] || 'OTHER',
      content: input.caption,
      mediaUrl: input.url,
      mediaType: input.mimetype,
      status: 'SENT',
      timestamp: new Date(timestamp),
    });

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp,
    };
  }

  /**
   * Build media content based on type
   */
  private buildMediaContent(input: SendMediaInput): AnyMessageContent {
    const mediaSource = { url: input.url };
    const caption = input.caption;

    switch (input.mediaType) {
      case 'image':
        return { image: mediaSource, caption };
      case 'video':
        return { video: mediaSource, caption };
      case 'audio':
        return { audio: mediaSource, mimetype: input.mimetype || 'audio/mp4' };
      case 'document':
        return {
          document: mediaSource,
          fileName: input.filename || 'document',
          mimetype: input.mimetype || 'application/octet-stream',
        };
      case 'sticker':
        return { sticker: mediaSource };
      default:
        throw new Error(`Unsupported media type: ${input.mediaType}`);
    }
  }

  /**
   * Send reaction to a message
   */
  async sendReaction(input: SendReactionInput): Promise<SendMessageResult> {
    const socket = this.getSocket();
    logger.debug({ jid: input.jid, messageId: input.messageId, emoji: input.emoji }, 'Sending reaction');

    const result = await socket.sendMessage(input.jid, {
      react: {
        text: input.emoji, // Empty string removes reaction
        key: {
          remoteJid: input.jid,
          id: input.messageId,
        },
      },
    });

    logger.info({ messageId: input.messageId }, 'Reaction sent');

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp: Date.now(),
    };
  }

  /**
   * Mark messages as read
   */
  async readMessages(keys: MessageKey[]): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ count: keys.length }, 'Marking messages as read');

    const waKeys = keys.map((k) => ({
      remoteJid: k.remoteJid,
      id: k.id,
      fromMe: k.fromMe,
      participant: k.participant,
    }));

    await socket.readMessages(waKeys);
    logger.info({ count: keys.length }, 'Messages marked as read');
  }

  /**
   * Delete message for everyone
   */
  async deleteMessage(jid: string, messageId: string): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ jid, messageId }, 'Deleting message');

    await socket.sendMessage(jid, {
      delete: {
        remoteJid: jid,
        id: messageId,
        fromMe: true,
      },
    });

    logger.info({ messageId }, 'Message deleted');
  }

  /**
   * Forward a message
   */
  async forwardMessage(jid: string, message: WAMessage): Promise<SendMessageResult> {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Forwarding message');

    const result = await socket.sendMessage(jid, { forward: message } as any);

    logger.info({ messageId: result?.key?.id }, 'Message forwarded');

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp: Date.now(),
    };
  }
}

// Export class directly, no singleton
