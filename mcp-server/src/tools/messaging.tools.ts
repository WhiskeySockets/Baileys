/**
 * Messaging Tools
 * 
 * MCP tools for sending messages, reactions, and managing read status.
 * Uses the Tool Registry for declarative, DRY registration.
 * 
 * @module tools/messaging.tools
 */

import { z } from 'zod';
import type { ToolRegistry, ToolDefinition, ToolContext } from './tool-registry.js';
import { defineTool } from './tool-registry.js';
import type { SendTextInput, SendMediaInput, SendReactionInput, MessageKey } from '../types/index.js';

// =============================================================================
// Schemas
// =============================================================================

const SendTextInputSchema = z.object({
  jid: z.string().describe('Recipient JID (e.g., 1234567890@s.whatsapp.net for users, xxx@g.us for groups)'),
  text: z.string().describe('Message text content'),
  quotedMessageId: z.string().optional().describe('Optional message ID to reply to'),
});

const SendTextOutputSchema = z.object({
  success: z.boolean(),
  messageId: z.string(),
  timestamp: z.number(),
});

const SendMediaInputSchema = z.object({
  jid: z.string().describe('Recipient JID'),
  mediaType: z.enum(['image', 'video', 'audio', 'document', 'sticker']).describe('Type of media'),
  url: z.string().describe('URL or local file path to the media'),
  caption: z.string().optional().describe('Optional caption (for image/video)'),
  filename: z.string().optional().describe('Filename (for documents)'),
  mimetype: z.string().optional().describe('MIME type if not auto-detected'),
});

const SendReactionInputSchema = z.object({
  jid: z.string().describe('Chat JID where the message is'),
  messageId: z.string().describe('ID of the message to react to'),
  emoji: z.string().describe('Emoji to react with (empty string to remove)'),
});

const SuccessOutputSchema = z.object({
  success: z.boolean(),
});

const MessageKeySchema = z.object({
  remoteJid: z.string().describe('Chat JID'),
  id: z.string().describe('Message ID'),
  fromMe: z.boolean().optional().describe('Whether the message is from me'),
});

const ReadMessagesInputSchema = z.object({
  messageKeys: z.array(MessageKeySchema).describe('Array of message keys to mark as read'),
});

const DeleteMessageInputSchema = z.object({
  jid: z.string().describe('Chat JID'),
  messageId: z.string().describe('Message ID to delete'),
});

// =============================================================================
// Type Definitions for Schemas
// =============================================================================

type SendTextSchemaInput = z.infer<typeof SendTextInputSchema>;
type SendMediaSchemaInput = z.infer<typeof SendMediaInputSchema>;
type SendReactionSchemaInput = z.infer<typeof SendReactionInputSchema>;
type ReadMessagesSchemaInput = z.infer<typeof ReadMessagesInputSchema>;
type DeleteMessageSchemaInput = z.infer<typeof DeleteMessageInputSchema>;

// =============================================================================
// Tool Definitions
// =============================================================================

/**
 * Send text message tool definition.
 */
export const sendTextTool: ToolDefinition<SendTextSchemaInput, unknown> = defineTool({
  name: 'whatsapp_send_text',
  title: 'Send Text Message',
  description: 'Send a text message to a WhatsApp user or group',
  inputSchema: SendTextInputSchema,
  outputSchema: SendTextOutputSchema,
  handler: async (input: SendTextSchemaInput, ctx: ToolContext) => {
    const result = await ctx.services.messageService.sendText(input as SendTextInput);
    return result;
  },
});

/**
 * Send media message tool definition.
 */
export const sendMediaTool: ToolDefinition<SendMediaSchemaInput, unknown> = defineTool({
  name: 'whatsapp_send_media',
  title: 'Send Media Message',
  description: 'Send an image, video, audio, or document to a WhatsApp user or group',
  inputSchema: SendMediaInputSchema,
  outputSchema: SendTextOutputSchema,
  handler: async (input: SendMediaSchemaInput, ctx: ToolContext) => {
    const result = await ctx.services.messageService.sendMedia(input as SendMediaInput);
    return result;
  },
});

/**
 * Send reaction tool definition.
 */
export const sendReactionTool: ToolDefinition<SendReactionSchemaInput, unknown> = defineTool({
  name: 'whatsapp_send_reaction',
  title: 'Send Reaction',
  description: 'React to a message with an emoji. Use empty string to remove reaction.',
  inputSchema: SendReactionInputSchema,
  outputSchema: SendTextOutputSchema,
  handler: async (input: SendReactionSchemaInput, ctx: ToolContext) => {
    const result = await ctx.services.messageService.sendReaction(input as SendReactionInput);
    return result;
  },
});

/**
 * Read messages tool definition.
 */
export const readMessagesTool: ToolDefinition<ReadMessagesSchemaInput, { success: boolean }> = defineTool({
  name: 'whatsapp_read_messages',
  title: 'Read Messages',
  description: 'Mark messages as read',
  inputSchema: ReadMessagesInputSchema,
  outputSchema: SuccessOutputSchema,
  handler: async (input: ReadMessagesSchemaInput, ctx: ToolContext) => {
    await ctx.services.messageService.readMessages(input.messageKeys as MessageKey[]);
    return { success: true };
  },
});

/**
 * Delete message tool definition.
 */
export const deleteMessageTool: ToolDefinition<DeleteMessageSchemaInput, { success: boolean }> = defineTool({
  name: 'whatsapp_delete_message',
  title: 'Delete Message',
  description: 'Delete a message for everyone (only works for your own messages)',
  inputSchema: DeleteMessageInputSchema,
  outputSchema: SuccessOutputSchema,
  handler: async (input: DeleteMessageSchemaInput, ctx: ToolContext) => {
    await ctx.services.messageService.deleteMessage(input.jid, input.messageId);
    return { success: true };
  },
});

// =============================================================================
// Tool Collection
// =============================================================================

/**
 * All messaging tool definitions.
 * Used for bulk registration.
 */
export const messagingTools: ToolDefinition<unknown, unknown>[] = [
  sendTextTool as ToolDefinition<unknown, unknown>,
  sendMediaTool as ToolDefinition<unknown, unknown>,
  sendReactionTool as ToolDefinition<unknown, unknown>,
  readMessagesTool as ToolDefinition<unknown, unknown>,
  deleteMessageTool as ToolDefinition<unknown, unknown>,
];

// =============================================================================
// Registration Function
// =============================================================================

/**
 * Register all messaging tools with the registry.
 * 
 * @param registry - Tool registry instance
 */
export function registerMessagingTools(registry: ToolRegistry): void {
  registry.registerAll(messagingTools, 'messaging');
}
