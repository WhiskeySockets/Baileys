/**
 * Tools Module
 * 
 * Barrel file for MCP tools registration.
 * Exports the tool registry and registration functions.
 * 
 * @module tools
 * 
 * Design:
 * - KISS: Simple, focused exports
 * - DRY: Single registration point for all tools
 * - SOLID: Clear separation of concerns
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createChildLogger } from '../infrastructure/logger.js';
import type { ServiceContainer } from '../types/index.js';
import { createToolRegistry } from './tool-registry.js';
import { registerConnectionTools } from './connection.tools.js';
import { registerMessagingTools } from './messaging.tools.js';
import { registerContactTools } from './contact.tools.js';
import { registerGroupTools } from './group.tools.js';
import { registerWebhookTools } from './webhook.tools.js';

const logger = createChildLogger('Tools');

// =============================================================================
// Exports
// =============================================================================

// Re-export framework components
export { ToolRegistry, createToolRegistry, defineTool } from './tool-registry.js';
export { createToolHandler } from './tool-executor.js';
export * from './tool-types.js';
export * from './tool-errors.js';

// Re-export tool definitions for individual use
export { connectionTools, registerConnectionTools } from './connection.tools.js';
export { messagingTools, registerMessagingTools } from './messaging.tools.js';
export { contactTools, registerContactTools } from './contact.tools.js';
export { groupTools, registerGroupTools } from './group.tools.js';
export { webhookTools, registerWebhookTools } from './webhook.tools.js';

// =============================================================================
// Main Registration Function
// =============================================================================

/**
 * Register all MCP tools with the server.
 * Creates a registry and registers all tool categories.
 * 
 * @param server - MCP server instance
 * @param services - Service container with business logic services
 * 
 * @example
 * ```typescript
 * const server = new McpServer(SERVER_INFO);
 * const services = createServiceContainer();
 * registerAllTools(server, services);
 * ```
 */
export function registerAllTools(server: McpServer, services: ServiceContainer): void {
  logger.info('Registering all MCP tools...');

  // Create tool registry
  const registry = createToolRegistry(server, services, {
    logPerformance: true,
    timeout: 30000,
  });

  // Register all tool categories
  registerConnectionTools(registry);
  registerMessagingTools(registry);
  registerContactTools(registry);
  registerGroupTools(registry);
  registerWebhookTools(registry);

  // Log summary
  const tools = registry.getRegisteredTools();
  const byCategory = {
    connection: registry.getToolsByCategory('connection').length,
    messaging: registry.getToolsByCategory('messaging').length,
    contact: registry.getToolsByCategory('contact').length,
    group: registry.getToolsByCategory('group').length,
    webhook: registry.getToolsByCategory('webhook').length,
  };

  logger.info(
    { totalTools: tools.length, byCategory },
    'All MCP tools registered'
  );
}
