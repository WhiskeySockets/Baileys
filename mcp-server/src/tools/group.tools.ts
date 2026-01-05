/**
 * Group MCP Tools
 * Tools for creating and managing WhatsApp groups
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('GroupTools');

/**
 * Register all group-related MCP tools
 */
export function registerGroupTools(server: McpServer, services: ServiceContainer): void {
  const { groupService } = services;

  // ========================================================================
  // whatsapp_create_group
  // ========================================================================
  server.registerTool(
    'whatsapp_create_group',
    {
      title: 'Create Group',
      description: 'Create a new WhatsApp group',
      inputSchema: {
        subject: z.string().describe('Group name/subject'),
        participants: z.array(z.string()).describe('Array of participant JIDs to add'),
      },
      outputSchema: {
        jid: z.string(),
        subject: z.string(),
        owner: z.string().optional(),
        creation: z.number().optional(),
      },
    },
    async ({ subject, participants }) => {
      logger.info({ subject, participantCount: participants.length }, 'Tool: whatsapp_create_group');
      
      const result = await groupService.createGroup({ subject, participants });
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_group_participants
  // ========================================================================
  server.registerTool(
    'whatsapp_group_participants',
    {
      title: 'Manage Group Participants',
      description: 'Add, remove, promote, or demote group participants',
      inputSchema: {
        groupJid: z.string().describe('Group JID'),
        participants: z.array(z.string()).describe('Array of participant JIDs'),
        action: z.enum(['add', 'remove', 'promote', 'demote']).describe('Action to perform'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ groupJid, participants, action }) => {
      logger.info({ groupJid, action, participantCount: participants.length }, 'Tool: whatsapp_group_participants');
      
      await groupService.updateParticipants({ groupJid, participants, action });
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_group_settings
  // ========================================================================
  server.registerTool(
    'whatsapp_group_settings',
    {
      title: 'Update Group Settings',
      description: 'Update group subject, description, or ephemeral settings',
      inputSchema: {
        groupJid: z.string().describe('Group JID'),
        subject: z.string().optional().describe('New group name'),
        description: z.string().optional().describe('New group description'),
        ephemeral: z.number().optional().describe('Disappearing messages duration in seconds (0 to disable)'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ groupJid, subject, description, ephemeral }) => {
      logger.info({ groupJid }, 'Tool: whatsapp_group_settings');
      
      await groupService.updateSettings({ groupJid, subject, description, ephemeral });
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_group_info
  // ========================================================================
  server.registerTool(
    'whatsapp_get_group_info',
    {
      title: 'Get Group Info',
      description: 'Get detailed information about a group',
      inputSchema: {
        groupJid: z.string().describe('Group JID'),
      },
      outputSchema: {
        jid: z.string(),
        subject: z.string(),
        owner: z.string().optional(),
        creation: z.number().optional(),
        description: z.string().optional(),
        participants: z.array(z.object({
          jid: z.string(),
          admin: z.enum(['admin', 'superadmin']).nullable().optional(),
        })),
      },
    },
    async ({ groupJid }) => {
      logger.info({ groupJid }, 'Tool: whatsapp_get_group_info');
      
      const result = await groupService.getMetadata(groupJid);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_leave_group
  // ========================================================================
  server.registerTool(
    'whatsapp_leave_group',
    {
      title: 'Leave Group',
      description: 'Leave a WhatsApp group',
      inputSchema: {
        groupJid: z.string().describe('Group JID to leave'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ groupJid }) => {
      logger.info({ groupJid }, 'Tool: whatsapp_leave_group');
      
      await groupService.leave(groupJid);
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_group_invite
  // ========================================================================
  server.registerTool(
    'whatsapp_get_group_invite',
    {
      title: 'Get Group Invite Code',
      description: 'Get the invite code/link for a group (requires admin)',
      inputSchema: {
        groupJid: z.string().describe('Group JID'),
      },
      outputSchema: {
        inviteCode: z.string(),
        inviteLink: z.string(),
      },
    },
    async ({ groupJid }) => {
      logger.info({ groupJid }, 'Tool: whatsapp_get_group_invite');
      
      const inviteCode = await groupService.getInviteCode(groupJid);
      const result = { 
        inviteCode,
        inviteLink: `https://chat.whatsapp.com/${inviteCode}`,
      };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_join_group
  // ========================================================================
  server.registerTool(
    'whatsapp_join_group',
    {
      title: 'Join Group via Invite',
      description: 'Join a group using an invite code',
      inputSchema: {
        inviteCode: z.string().describe('Group invite code (from invite link)'),
      },
      outputSchema: {
        groupJid: z.string(),
      },
    },
    async ({ inviteCode }) => {
      logger.info('Tool: whatsapp_join_group');
      
      const groupJid = await groupService.joinViaInvite(inviteCode);
      const result = { groupJid };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_all_groups
  // ========================================================================
  server.registerTool(
    'whatsapp_get_all_groups',
    {
      title: 'Get All Groups',
      description: 'Get list of all groups the user participates in',
      inputSchema: {},
      outputSchema: {
        groups: z.array(z.object({
          jid: z.string(),
          subject: z.string(),
          owner: z.string().optional(),
        })),
      },
    },
    async () => {
      logger.info('Tool: whatsapp_get_all_groups');
      
      const groups = await groupService.getAllGroups();
      const result = { 
        groups: groups.map(g => ({
          jid: g.jid,
          subject: g.subject,
          owner: g.owner,
        })),
      };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  logger.info('Group tools registered');
}
