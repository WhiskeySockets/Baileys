/**
 * Group Tools
 * 
 * MCP tools for creating and managing WhatsApp groups.
 * Uses the Tool Registry for declarative, DRY registration.
 * 
 * @module tools/group.tools
 */

import { z } from 'zod';
import type { ToolRegistry, ToolDefinition, ToolContext } from './tool-registry.js';
import { defineTool } from './tool-registry.js';
import type { CreateGroupInput, GroupParticipantsInput, GroupSettingsInput, GroupInfo } from '../types/index.js';

// =============================================================================
// Schemas
// =============================================================================

const GroupJidInputSchema = z.object({
  groupJid: z.string().describe('Group JID'),
});

const EmptyInputSchema = z.object({});

const SuccessOutputSchema = z.object({
  success: z.boolean(),
});

const CreateGroupInputSchema = z.object({
  subject: z.string().describe('Group name/subject'),
  participants: z.array(z.string()).describe('Array of participant JIDs to add'),
});

const CreateGroupOutputSchema = z.object({
  jid: z.string(),
  subject: z.string(),
  owner: z.string().optional(),
  creation: z.number().optional(),
});

const ParticipantActionSchema = z.enum(['add', 'remove', 'promote', 'demote']);

const GroupParticipantsInputSchema = z.object({
  groupJid: z.string().describe('Group JID'),
  participants: z.array(z.string()).describe('Array of participant JIDs'),
  action: ParticipantActionSchema.describe('Action to perform'),
});

const GroupSettingsInputSchema = z.object({
  groupJid: z.string().describe('Group JID'),
  subject: z.string().optional().describe('New group name'),
  description: z.string().optional().describe('New group description'),
  ephemeral: z.number().optional().describe('Disappearing messages duration in seconds (0 to disable)'),
});

const GroupParticipantSchema = z.object({
  jid: z.string(),
  admin: z.enum(['admin', 'superadmin']).nullable().optional(),
});

const GroupInfoOutputSchema = z.object({
  jid: z.string(),
  subject: z.string(),
  owner: z.string().optional(),
  creation: z.number().optional(),
  description: z.string().optional(),
  participants: z.array(GroupParticipantSchema),
});

const InviteCodeOutputSchema = z.object({
  inviteCode: z.string(),
  inviteLink: z.string(),
});

const JoinGroupInputSchema = z.object({
  inviteCode: z.string().describe('Group invite code (from invite link)'),
});

const JoinGroupOutputSchema = z.object({
  groupJid: z.string(),
});

const GroupListOutputSchema = z.object({
  groups: z.array(z.object({
    jid: z.string(),
    subject: z.string(),
    owner: z.string().optional(),
  })),
});

// =============================================================================
// Type Definitions
// =============================================================================

type GroupJidInput = z.infer<typeof GroupJidInputSchema>;
type CreateGroupSchemaInput = z.infer<typeof CreateGroupInputSchema>;
type GroupParticipantsSchemaInput = z.infer<typeof GroupParticipantsInputSchema>;
type GroupSettingsSchemaInput = z.infer<typeof GroupSettingsInputSchema>;
type JoinGroupSchemaInput = z.infer<typeof JoinGroupInputSchema>;
type EmptyInput = z.infer<typeof EmptyInputSchema>;

// =============================================================================
// Tool Definitions
// =============================================================================

/**
 * Create group tool definition.
 */
export const createGroupTool: ToolDefinition<CreateGroupSchemaInput, unknown> = defineTool({
  name: 'whatsapp_create_group',
  title: 'Create Group',
  description: 'Create a new WhatsApp group',
  inputSchema: CreateGroupInputSchema,
  outputSchema: CreateGroupOutputSchema,
  handler: async (input: CreateGroupSchemaInput, ctx: ToolContext) => {
    const result = await ctx.services.groupService.createGroup(input as CreateGroupInput);
    return result;
  },
});

/**
 * Manage group participants tool definition.
 */
export const groupParticipantsTool: ToolDefinition<GroupParticipantsSchemaInput, { success: boolean }> = defineTool({
  name: 'whatsapp_group_participants',
  title: 'Manage Group Participants',
  description: 'Add, remove, promote, or demote group participants',
  inputSchema: GroupParticipantsInputSchema,
  outputSchema: SuccessOutputSchema,
  handler: async (input: GroupParticipantsSchemaInput, ctx: ToolContext) => {
    await ctx.services.groupService.updateParticipants(input as GroupParticipantsInput);
    return { success: true };
  },
});

/**
 * Update group settings tool definition.
 */
export const groupSettingsTool: ToolDefinition<GroupSettingsSchemaInput, { success: boolean }> = defineTool({
  name: 'whatsapp_group_settings',
  title: 'Update Group Settings',
  description: 'Update group subject, description, or ephemeral settings',
  inputSchema: GroupSettingsInputSchema,
  outputSchema: SuccessOutputSchema,
  handler: async (input: GroupSettingsSchemaInput, ctx: ToolContext) => {
    await ctx.services.groupService.updateSettings(input as GroupSettingsInput);
    return { success: true };
  },
});

/**
 * Get group info tool definition.
 */
export const getGroupInfoTool: ToolDefinition<GroupJidInput, GroupInfo> = defineTool({
  name: 'whatsapp_get_group_info',
  title: 'Get Group Info',
  description: 'Get detailed information about a group',
  inputSchema: GroupJidInputSchema,
  outputSchema: GroupInfoOutputSchema,
  handler: async (input: GroupJidInput, ctx: ToolContext) => {
    return await ctx.services.groupService.getMetadata(input.groupJid);
  },
});

/**
 * Leave group tool definition.
 */
export const leaveGroupTool: ToolDefinition<GroupJidInput, { success: boolean }> = defineTool({
  name: 'whatsapp_leave_group',
  title: 'Leave Group',
  description: 'Leave a WhatsApp group',
  inputSchema: GroupJidInputSchema,
  outputSchema: SuccessOutputSchema,
  handler: async (input: GroupJidInput, ctx: ToolContext) => {
    await ctx.services.groupService.leave(input.groupJid);
    return { success: true };
  },
});

/**
 * Get group invite code tool definition.
 */
export const getGroupInviteTool: ToolDefinition<GroupJidInput, { inviteCode: string; inviteLink: string }> = defineTool({
  name: 'whatsapp_get_group_invite',
  title: 'Get Group Invite Code',
  description: 'Get the invite code/link for a group (requires admin)',
  inputSchema: GroupJidInputSchema,
  outputSchema: InviteCodeOutputSchema,
  handler: async (input: GroupJidInput, ctx: ToolContext) => {
    const inviteCode = await ctx.services.groupService.getInviteCode(input.groupJid);
    return {
      inviteCode: inviteCode || '',
      inviteLink: inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : '',
    };
  },
});

/**
 * Join group via invite tool definition.
 */
export const joinGroupTool: ToolDefinition<JoinGroupSchemaInput, { groupJid: string }> = defineTool({
  name: 'whatsapp_join_group',
  title: 'Join Group via Invite',
  description: 'Join a group using an invite code',
  inputSchema: JoinGroupInputSchema,
  outputSchema: JoinGroupOutputSchema,
  handler: async (input: JoinGroupSchemaInput, ctx: ToolContext) => {
    const groupJid = await ctx.services.groupService.joinViaInvite(input.inviteCode);
    return { groupJid };
  },
});

/**
 * Get all groups tool definition.
 */
export const getAllGroupsTool: ToolDefinition<EmptyInput, unknown> = defineTool({
  name: 'whatsapp_get_all_groups',
  title: 'Get All Groups',
  description: 'Get list of all groups the user participates in',
  inputSchema: EmptyInputSchema,
  outputSchema: GroupListOutputSchema,
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    const groups = await ctx.services.groupService.getAllGroups();
    return {
      groups: groups.map((g: GroupInfo) => ({
        jid: g.jid,
        subject: g.subject,
        owner: g.owner,
      })),
    };
  },
});

// =============================================================================
// Tool Collection
// =============================================================================

/**
 * All group tool definitions.
 */
export const groupTools: ToolDefinition<unknown, unknown>[] = [
  createGroupTool as ToolDefinition<unknown, unknown>,
  groupParticipantsTool as ToolDefinition<unknown, unknown>,
  groupSettingsTool as ToolDefinition<unknown, unknown>,
  getGroupInfoTool as ToolDefinition<unknown, unknown>,
  leaveGroupTool as ToolDefinition<unknown, unknown>,
  getGroupInviteTool as ToolDefinition<unknown, unknown>,
  joinGroupTool as ToolDefinition<unknown, unknown>,
  getAllGroupsTool as ToolDefinition<unknown, unknown>,
];

// =============================================================================
// Registration Function
// =============================================================================

/**
 * Register all group tools with the registry.
 * 
 * @param registry - Tool registry instance
 */
export function registerGroupTools(registry: ToolRegistry): void {
  registry.registerAll(groupTools, 'group');
}
