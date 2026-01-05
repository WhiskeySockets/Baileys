/**
 * Contact MCP Tools
 * Tools for checking numbers, getting profiles, and managing contacts
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('ContactTools');

/**
 * Register all contact-related MCP tools
 */
export function registerContactTools(server: McpServer, services: ServiceContainer): void {
  const { contactService } = services;

  // ========================================================================
  // whatsapp_check_number
  // ========================================================================
  server.registerTool(
    'whatsapp_check_number',
    {
      title: 'Check Phone Number',
      description: 'Check if a phone number is registered on WhatsApp',
      inputSchema: {
        phoneNumber: z.string().describe('Phone number with country code (e.g., +1234567890)'),
      },
      outputSchema: {
        exists: z.boolean(),
        jid: z.string().optional(),
      },
    },
    async ({ phoneNumber }) => {
      logger.info({ phoneNumber }, 'Tool: whatsapp_check_number');
      
      const result = await contactService.checkNumber(phoneNumber);
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_profile_picture
  // ========================================================================
  server.registerTool(
    'whatsapp_get_profile_picture',
    {
      title: 'Get Profile Picture',
      description: 'Get the profile picture URL of a user or group',
      inputSchema: {
        jid: z.string().describe('User or group JID'),
        highRes: z.boolean().optional().describe('Get high resolution image (default: false)'),
      },
      outputSchema: {
        url: z.string().nullable(),
      },
    },
    async ({ jid, highRes }) => {
      logger.info({ jid, highRes }, 'Tool: whatsapp_get_profile_picture');
      
      const url = await contactService.getProfilePicture(jid, highRes);
      const result = { url };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_status
  // ========================================================================
  server.registerTool(
    'whatsapp_get_status',
    {
      title: 'Get User Status',
      description: 'Get the "about" status text of a user',
      inputSchema: {
        jid: z.string().describe('User JID'),
      },
      outputSchema: {
        status: z.string().nullable(),
      },
    },
    async ({ jid }) => {
      logger.info({ jid }, 'Tool: whatsapp_get_status');
      
      const status = await contactService.getStatus(jid);
      const result = { status };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_block_user
  // ========================================================================
  server.registerTool(
    'whatsapp_block_user',
    {
      title: 'Block User',
      description: 'Block a user on WhatsApp',
      inputSchema: {
        jid: z.string().describe('User JID to block'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ jid }) => {
      logger.info({ jid }, 'Tool: whatsapp_block_user');
      
      await contactService.blockUser(jid);
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_unblock_user
  // ========================================================================
  server.registerTool(
    'whatsapp_unblock_user',
    {
      title: 'Unblock User',
      description: 'Unblock a user on WhatsApp',
      inputSchema: {
        jid: z.string().describe('User JID to unblock'),
      },
      outputSchema: {
        success: z.boolean(),
      },
    },
    async ({ jid }) => {
      logger.info({ jid }, 'Tool: whatsapp_unblock_user');
      
      await contactService.unblockUser(jid);
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_get_blocked_users
  // ========================================================================
  server.registerTool(
    'whatsapp_get_blocked_users',
    {
      title: 'Get Blocked Users',
      description: 'Get list of blocked users',
      inputSchema: {},
      outputSchema: {
        blockedUsers: z.array(z.string()),
      },
    },
    async () => {
      logger.info('Tool: whatsapp_get_blocked_users');
      
      const blockedUsers = await contactService.getBlockedUsers();
      const result = { blockedUsers };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  logger.info('Contact tools registered');
}
