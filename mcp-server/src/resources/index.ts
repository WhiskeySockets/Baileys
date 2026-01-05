/**
 * MCP Resources
 * Static and dynamic resources exposed by the server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('Resources');

/**
 * Register all MCP resources with the server
 */
export function registerResources(server: McpServer, services: ServiceContainer): void {
  const { connectionService, groupService } = services;
  logger.info('Registering MCP resources...');

  // ========================================================================
  // whatsapp://connection/status
  // ========================================================================
  server.resource(
    'connection-status',
    'whatsapp://connection/status',
    {
      description: 'Current WhatsApp connection status and session info',
    },
    async () => {
      const state = connectionService.getState();
      const sessionInfo = connectionService.getSessionInfo();

      const data = {
        status: state.status,
        isConnected: connectionService.isConnected(),
        sessionInfo,
        lastDisconnect: state.lastDisconnect,
      };

      return {
        contents: [
          {
            uri: 'whatsapp://connection/status',
            text: JSON.stringify(data, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    }
  );

  // ========================================================================
  // whatsapp://groups/list
  // ========================================================================
  server.resource(
    'groups-list',
    'whatsapp://groups/list',
    {
      description: 'List of all WhatsApp groups the user participates in',
    },
    async () => {
      if (!connectionService.isConnected()) {
        return {
          contents: [
            {
              uri: 'whatsapp://groups/list',
              text: JSON.stringify({ error: 'NOT_CONNECTED', groups: [] }),
              mimeType: 'application/json',
            },
          ],
        };
      }

      const groups = await groupService.getAllGroups();

      const data = {
        count: groups.length,
        groups: groups.map((g) => ({
          jid: g.jid,
          subject: g.subject,
          owner: g.owner,
          participantCount: g.participants.length,
        })),
      };

      return {
        contents: [
          {
            uri: 'whatsapp://groups/list',
            text: JSON.stringify(data, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    }
  );

  logger.info('MCP resources registered');
}
