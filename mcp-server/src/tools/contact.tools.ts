/**
 * Contact Tools
 * 
 * MCP tools for checking numbers, getting profiles, and managing contacts.
 * Uses the Tool Registry for declarative, DRY registration.
 * 
 * @module tools/contact.tools
 */

import { z } from 'zod';
import type { ToolRegistry, ToolDefinition, ToolContext } from './tool-registry.js';
import { defineTool } from './tool-registry.js';

// =============================================================================
// Schemas
// =============================================================================

const JidInputSchema = z.object({
  jid: z.string().describe('User JID'),
});

const PhoneNumberInputSchema = z.object({
  phoneNumber: z.string().describe('Phone number with country code (e.g., +1234567890)'),
});

const CheckNumberOutputSchema = z.object({
  exists: z.boolean(),
  jid: z.string().optional(),
});

const ProfilePictureInputSchema = z.object({
  jid: z.string().describe('User or group JID'),
  highRes: z.boolean().optional().describe('Get high resolution image (default: false)'),
});

const ProfilePictureOutputSchema = z.object({
  url: z.string().nullable(),
});

const StatusOutputSchema = z.object({
  status: z.string().nullable(),
});

const SuccessOutputSchema = z.object({
  success: z.boolean(),
});

const EmptyInputSchema = z.object({});

const BlockedUsersOutputSchema = z.object({
  blockedUsers: z.array(z.string()),
});

// =============================================================================
// Type Definitions
// =============================================================================

type JidInput = z.infer<typeof JidInputSchema>;
type PhoneNumberInput = z.infer<typeof PhoneNumberInputSchema>;
type ProfilePictureInput = z.infer<typeof ProfilePictureInputSchema>;
type EmptyInput = z.infer<typeof EmptyInputSchema>;

// =============================================================================
// Tool Definitions
// =============================================================================

/**
 * Check phone number tool definition.
 */
export const checkNumberTool: ToolDefinition<PhoneNumberInput, unknown> = defineTool({
  name: 'whatsapp_check_number',
  title: 'Check Phone Number',
  description: 'Check if a phone number is registered on WhatsApp',
  inputSchema: PhoneNumberInputSchema,
  outputSchema: CheckNumberOutputSchema,
  handler: async (input: PhoneNumberInput, ctx: ToolContext) => {
    return await ctx.services.contactService.checkNumber(input.phoneNumber);
  },
});

/**
 * Get profile picture tool definition.
 */
export const getProfilePictureTool: ToolDefinition<ProfilePictureInput, { url: string | null }> = defineTool({
  name: 'whatsapp_get_profile_picture',
  title: 'Get Profile Picture',
  description: 'Get the profile picture URL of a user or group',
  inputSchema: ProfilePictureInputSchema,
  outputSchema: ProfilePictureOutputSchema,
  handler: async (input: ProfilePictureInput, ctx: ToolContext) => {
    const url = await ctx.services.contactService.getProfilePicture(input.jid, input.highRes);
    return { url };
  },
});

/**
 * Get user status tool definition.
 */
export const getStatusTool: ToolDefinition<JidInput, { status: string | null }> = defineTool({
  name: 'whatsapp_get_status',
  title: 'Get User Status',
  description: 'Get the "about" status text of a user',
  inputSchema: JidInputSchema,
  outputSchema: StatusOutputSchema,
  handler: async (input: JidInput, ctx: ToolContext) => {
    const status = await ctx.services.contactService.getStatus(input.jid);
    return { status };
  },
});

/**
 * Block user tool definition.
 */
export const blockUserTool: ToolDefinition<JidInput, { success: boolean }> = defineTool({
  name: 'whatsapp_block_user',
  title: 'Block User',
  description: 'Block a user on WhatsApp',
  inputSchema: z.object({
    jid: z.string().describe('User JID to block'),
  }),
  outputSchema: SuccessOutputSchema,
  handler: async (input: JidInput, ctx: ToolContext) => {
    await ctx.services.contactService.blockUser(input.jid);
    return { success: true };
  },
});

/**
 * Unblock user tool definition.
 */
export const unblockUserTool: ToolDefinition<JidInput, { success: boolean }> = defineTool({
  name: 'whatsapp_unblock_user',
  title: 'Unblock User',
  description: 'Unblock a user on WhatsApp',
  inputSchema: z.object({
    jid: z.string().describe('User JID to unblock'),
  }),
  outputSchema: SuccessOutputSchema,
  handler: async (input: JidInput, ctx: ToolContext) => {
    await ctx.services.contactService.unblockUser(input.jid);
    return { success: true };
  },
});

/**
 * Get blocked users tool definition.
 */
export const getBlockedUsersTool: ToolDefinition<EmptyInput, { blockedUsers: string[] }> = defineTool({
  name: 'whatsapp_get_blocked_users',
  title: 'Get Blocked Users',
  description: 'Get list of blocked users',
  inputSchema: EmptyInputSchema,
  outputSchema: BlockedUsersOutputSchema,
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    const blockedUsers = await ctx.services.contactService.getBlockedUsers();
    return { blockedUsers };
  },
});

// =============================================================================
// Tool Collection
// =============================================================================

/**
 * All contact tool definitions.
 */
export const contactTools: ToolDefinition<unknown, unknown>[] = [
  checkNumberTool as ToolDefinition<unknown, unknown>,
  getProfilePictureTool as ToolDefinition<unknown, unknown>,
  getStatusTool as ToolDefinition<unknown, unknown>,
  blockUserTool as ToolDefinition<unknown, unknown>,
  unblockUserTool as ToolDefinition<unknown, unknown>,
  getBlockedUsersTool as ToolDefinition<unknown, unknown>,
];

// =============================================================================
// Registration Function
// =============================================================================

/**
 * Register all contact tools with the registry.
 * 
 * @param registry - Tool registry instance
 */
export function registerContactTools(registry: ToolRegistry): void {
  registry.registerAll(contactTools, 'contact');
}
