/**
 * Tools barrel file
 * Registers all MCP tools with the server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerConnectionTools } from './connection.tools.js';
import { registerMessagingTools } from './messaging.tools.js';
import { registerContactTools } from './contact.tools.js';
import { registerGroupTools } from './group.tools.js';
import { registerWebhookTools } from './webhook.tools.js';
import { type ServiceContainer } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('Tools');

/**
 * Register all MCP tools with the server
 */
export function registerAllTools(server: McpServer, services: ServiceContainer): void {
  logger.info('Registering all MCP tools...');

  registerConnectionTools(server, services);
  registerMessagingTools(server, services);
  registerContactTools(server, services);
  registerGroupTools(server, services);
  registerWebhookTools(server, services);

  logger.info('All MCP tools registered');
}
