/**
 * Message Service
 * Handles all message operations: send, read, delete, forward
 */

import type { WASocket, AnyMessageContent, proto } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';
import { type ConnectionService } from './connection.service.js';
import type {
  IMessageService,
  SendTextInput,
  SendMediaInput,
  SendReactionInput,
  SendMessageResult,
  MessageKey,
} from '../types/index.js';

const logger = createChildLogger('MessageService');

export class MessageService implements IMessageService {
  private connectionService: ConnectionService;

  constructor(connectionService: ConnectionService) {
    this.connectionService = connectionService;
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
    const options: { quoted?: proto.IWebMessageInfo } = {};

    // Handle quoted message
    if (input.quotedMessageId) {
      options.quoted = {
        key: {
          remoteJid: input.jid,
          id: input.quotedMessageId,
        },
      } as proto.IWebMessageInfo;
    }

    const result = await socket.sendMessage(input.jid, content, options);

    logger.info({ messageId: result?.key?.id }, 'Text message sent');

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp: Date.now(),
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

    logger.info({ messageId: result?.key?.id, mediaType: input.mediaType }, 'Media message sent');

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp: Date.now(),
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
  async forwardMessage(jid: string, message: proto.IWebMessageInfo): Promise<SendMessageResult> {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Forwarding message');

    const result = await socket.sendMessage(jid, { forward: message });

    logger.info({ messageId: result?.key?.id }, 'Message forwarded');

    return {
      success: true,
      messageId: result?.key?.id || '',
      timestamp: Date.now(),
    };
  }
}

// Export class directly, no singleton
