/**
 * Connection MCP Tools
 * Tools for managing WhatsApp connection
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('ConnectionTools');

/**
 * Register connection-related MCP tools
 */
export function registerConnectionTools(server: McpServer, services: ServiceContainer): void {
  const { connectionService } = services;

  // ========================================================================
  // whatsapp_connect
  // ========================================================================
  server.registerTool(
    'whatsapp_connect',
    {
      title: 'Connect to WhatsApp',
      description: 'Initialize connection to WhatsApp. Will return QR code if authentication is needed.',
      inputSchema: {},
      outputSchema: {
        status: z.enum(['disconnected', 'connecting', 'connected', 'qr_required', 'pairing_required']),
        qrCode: z.string().optional(),
        pairingCode: z.string().optional(),
      },
    },
    async () => {
      logger.info('Tool: whatsapp_connect');
      
      await connectionService.connect();
      const state = connectionService.getState();
      
      return {
        content: [{ type: 'text', text: JSON.stringify(state) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_disconnect
  // ========================================================================
  server.registerTool(
    'whatsapp_disconnect',
    {
      title: 'Disconnect from WhatsApp',
      description: 'Disconnect and logout from WhatsApp',
      inputSchema: {},
      outputSchema: {
        success: z.boolean(),
      },
    },
    async () => {
      logger.info('Tool: whatsapp_disconnect');
      
      await connectionService.disconnect();
      const result = { success: true };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_connection_status
  // ========================================================================
  server.registerTool(
    'whatsapp_connection_status',
    {
      title: 'Get Connection Status',
      description: 'Get current WhatsApp connection status',
      inputSchema: {},
      outputSchema: {
        status: z.enum(['disconnected', 'connecting', 'connected', 'qr_required', 'pairing_required']),
        isConnected: z.boolean(),
        sessionInfo: z.object({
          id: z.string(),
          name: z.string().optional(),
          phoneNumber: z.string().optional(),
        }).nullable(),
      },
    },
    async () => {
      logger.info('Tool: whatsapp_connection_status');
      
      const state = connectionService.getState();
      const sessionInfo = connectionService.getSessionInfo();
      
      const result = {
        ...state,
        isConnected: connectionService.isConnected(),
        sessionInfo,
      };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  // ========================================================================
  // whatsapp_request_pairing_code
  // ========================================================================
  server.registerTool(
    'whatsapp_request_pairing_code',
    {
      title: 'Request Pairing Code',
      description: 'Request a pairing code for phone number authentication (alternative to QR)',
      inputSchema: {
        phoneNumber: z.string().describe('Phone number with country code (no + or spaces)'),
      },
      outputSchema: {
        pairingCode: z.string(),
      },
    },
    async ({ phoneNumber }) => {
      logger.info({ phoneNumber }, 'Tool: whatsapp_request_pairing_code');
      
      const pairingCode = await connectionService.requestPairingCode(phoneNumber);
      const result = { pairingCode };
      
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
      };
    }
  );

  logger.info('Connection tools registered');
}
