/**
 * Messaging MCP Tools
 * Tools for sending messages, reactions, and managing read status
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('MessagingTools');

/**
 * Register all messaging-related MCP tools
 */
export function registerMessagingTools(server: McpServer, services: ServiceContainer): void {
  const { messageService } = services;

  // ========================================================================
  // whatsapp_send_text
  // ========================================================================
  server.registerTool(
    'whatsapp_send_text',
    {
      title: 'Send Text Message',
      description: 'Send a text message to a WhatsApp user or group',
      inputSchema: {
        jid: z.string().describe('Recipient JID (e.g., 1234567890@s.whatsapp.net for users, xxx@g.us for groups)'),
        text: z.string().describe('Message text content'),
        quotedMessageId: z.string().optional().describe('Optional message ID to reply to'),
      },
      outputSchema: {
        success: z.boolean(),
        messageId: z.string(),
        timestamp: z.number(),
      },
    },
    async ({ jid, text, quotedMessageId }) => {
      logger.info({ jid }, 'Tool: whatsapp_send_text');
      
      const result = await messageService.sendText({ jid, text, quotedMessageId });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_send_media
  // ========================================================================
  server.registerTool(
    'whatsapp_send_media',
    {
      title: 'Send Media Message',
      description: 'Send an image, video, audio, or document to a WhatsApp user or group',
      inputSchema: {
        jid: z.string().describe('Recipient JID'),
        mediaType: z.enum(['image', 'video', 'audio', 'document', 'sticker']).describe('Type of media'),
        url: z.string().describe('URL or local file path to the media'),
        caption: z.string().optional().describe('Optional caption (for image/video)'),
        filename: z.string().optional().describe('Filename (for documents)'),
        mimetype: z.string().optional().describe('MIME type if not auto-detected'),
      },
      outputSchema: {
        success: z.boolean(),
        messageId: z.string(),
        timestamp: z.number(),
      },
    },
    async ({ jid, mediaType, url, caption, filename, mimetype }) => {
      logger.info({ jid, mediaType }, 'Tool: whatsapp_send_media');
      
      const result = await messageService.sendMedia({ 
        jid, 
        mediaType, 
        url, 
        caption, 
        filename, 
        mimetype 
      });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_send_reaction
  // ========================================================================
  server.registerTool(
    'whatsapp_send_reaction',
    {
      title: 'Send Reaction',
      description: 'React to a message with an emoji. Use empty string to remove reaction.',
      inputSchema: {
        jid: z.string().describe('Chat JID where the message is'),
        messageId: z.string().describe('ID of the message to react to'),
        emoji: z.string().describe('Emoji to react with (empty string to remove)'),
      },
      outputSchema: {
        success: z.boolean(),
        messageId: z.string(),
        timestamp: z.number(),
      },
    },
    async ({ jid, messageId, emoji }) => {
      logger.info({ jid, messageId, emoji }, 'Tool: whatsapp_send_reaction');
      
      const result = await messageService.sendReaction({ jid, messageId, emoji });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_read_messages
  // ========================================================================
  server.registerTool(
    'whatsapp_read_messages',
    {
      title: 'Read Messages',
      description: 'Mark messages as read',
      inputSchema: {
        messageKeys: z.array(z.object({
          remoteJid: z.string().describe('Chat JID'),
          id: z.string().describe('Message ID'),
          fromMe: z.boolean().optional().describe('Whether the message is from me'),
        })).describe('Array of message keys to mark as read'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ messageKeys }) => {
      logger.info({ count: messageKeys.length }, 'Tool: whatsapp_read_messages');
      
      await messageService.readMessages(messageKeys);
      
      const result = { success: true };
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_delete_message
  // ========================================================================
  server.registerTool(
    'whatsapp_delete_message',
    {
      title: 'Delete Message',
      description: 'Delete a message for everyone (only works for your own messages)',
      inputSchema: {
        jid: z.string().describe('Chat JID'),
        messageId: z.string().describe('Message ID to delete'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ jid, messageId }) => {
      logger.info({ jid, messageId }, 'Tool: whatsapp_delete_message');
      
      await messageService.deleteMessage(jid, messageId);
      
      const result = { success: true };
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  logger.info('Messaging tools registered');
}
