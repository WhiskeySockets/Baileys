/**
 * MCP Server Setup
 * Creates and configures the MCP server with all tools and resources
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerAllTools } from './tools/index.js';
import { registerResources } from './resources/index.js';
import { createChildLogger } from './infrastructure/logger.js';
import { type ServiceContainer } from './types/index.js';

const logger = createChildLogger('Server');

const SERVER_INFO = {
  name: 'whatsapp-mcp',
  version: '1.0.0',
};

/**
 * Create and configure the MCP server with injected services
 */
export function createMcpServer(services: ServiceContainer): McpServer {
  logger.info({ ...SERVER_INFO }, 'Creating MCP server');

  const server = new McpServer(SERVER_INFO);

  // Register all tools with injected services
  registerAllTools(server, services);

  // Register resources with injected services
  registerResources(server, services);

  logger.info('MCP server configured');

  return server;
}
