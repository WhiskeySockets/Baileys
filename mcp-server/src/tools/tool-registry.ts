/**
 * Tool Registry
 * 
 * Registry pattern for MCP tool management.
 * Provides declarative tool registration with the MCP server.
 * 
 * @module tools/tool-registry
 * 
 * Design Principles:
 * - KISS: Simple registration API
 * - DRY: Single registration point, no code duplication
 * - SOLID:
 *   - SRP: Only handles registration
 *   - OCP: Extensible for new tool categories
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createChildLogger } from '../infrastructure/logger.js';
import type { ServiceContainer } from '../types/index.js';
import type { ToolDefinition, ToolMetadata, ToolCategory, ZodSchema } from './tool-types.js';
import { createToolHandler, type ExecutorConfig } from './tool-executor.js';

// Re-export types for convenience
export type { ToolDefinition, ToolCategory, ToolMetadata, ZodSchema, ToolContext } from './tool-types.js';

const logger = createChildLogger('ToolRegistry');

// =============================================================================
// Tool Registry Class
// =============================================================================

/**
 * Registry for managing and registering MCP tools.
 * Provides a declarative API for tool registration with automatic
 * handler wrapping and schema conversion.
 * 
 * @example
 * ```typescript
 * const registry = new ToolRegistry(server, services);
 * 
 * registry.register({
 *   name: 'whatsapp_send_text',
 *   title: 'Send Text Message',
 *   description: 'Send a text message',
 *   inputSchema: z.object({ jid: z.string(), text: z.string() }),
 *   outputSchema: z.object({ messageId: z.string() }),
 *   handler: async (input, ctx) => {
 *     return await ctx.services.messageService.sendText(input);
 *   },
 * });
 * 
 * // Or register multiple tools at once
 * registry.registerAll(messagingTools);
 * ```
 */
export class ToolRegistry {
  private server: McpServer;
  private services: ServiceContainer;
  private registeredTools: Map<string, ToolMetadata> = new Map();
  private executorConfig: ExecutorConfig;

  constructor(
    server: McpServer,
    services: ServiceContainer,
    config: ExecutorConfig = {}
  ) {
    this.server = server;
    this.services = services;
    this.executorConfig = config;
  }

  /**
   * Register a single tool with the MCP server.
   */
  register<TInput, TOutput>(
    definition: ToolDefinition<TInput, TOutput>,
    category: ToolCategory = 'messaging'
  ): void {
    const { name, title, description, inputSchema, tags = [], requiresConnection = true } = definition;

    // Validate tool name convention
    if (!name.startsWith('whatsapp_')) {
      logger.warn({ name }, 'Tool name should start with "whatsapp_"');
    }

    // Check for duplicate registration
    if (this.registeredTools.has(name)) {
      logger.warn({ name }, 'Tool already registered, skipping');
      return;
    }

    // Create wrapped handler with logging, error handling, etc.
    const wrappedHandler = createToolHandler(
      { ...definition, requiresConnection },
      this.services,
      this.executorConfig
    );

    // Convert Zod schemas to MCP format - extract shape from ZodObject
    const inputSchemaForMcp = extractSchemaShape(inputSchema);

    // Register with MCP server using the tool() method
    this.server.tool(
      name,
      description,
      inputSchemaForMcp,
      async (input) => {
        const result = await wrappedHandler(input as TInput);
        return {
          content: result.content.map(c => ({
            type: 'text' as const,
            text: c.text || '',
          })),
          isError: result.isError,
        };
      }
    );

    // Store metadata
    this.registeredTools.set(name, {
      name,
      title,
      description,
      category,
      tags,
      requiresConnection,
    });

    logger.debug({ name, title, category }, 'Tool registered');
  }

  /**
   * Register multiple tools at once.
   */
  registerAll(
    definitions: ToolDefinition<unknown, unknown>[],
    category: ToolCategory = 'messaging'
  ): void {
    for (const definition of definitions) {
      this.register(definition, category);
    }
  }

  /**
   * Get metadata for all registered tools.
   */
  getRegisteredTools(): ToolMetadata[] {
    return Array.from(this.registeredTools.values());
  }

  /**
   * Get tools by category.
   */
  getToolsByCategory(category: ToolCategory): ToolMetadata[] {
    return this.getRegisteredTools().filter(t => t.category === category);
  }

  /**
   * Check if a tool is registered.
   */
  hasTools(name: string): boolean {
    return this.registeredTools.has(name);
  }

  /**
   * Get total count of registered tools.
   */
  get count(): number {
    return this.registeredTools.size;
  }
}

// =============================================================================
// Schema Conversion Utilities
// =============================================================================

/**
 * Extract the shape from a Zod schema for MCP registration.
 * MCP SDK expects a record of Zod types.
 */
function extractSchemaShape<T>(schema: ZodSchema<T>): Record<string, unknown> {
  // Check if it's a ZodObject with a shape property
  if (
    schema !== null &&
    typeof schema === 'object' &&
    'shape' in schema &&
    typeof (schema as { shape: unknown }).shape === 'object'
  ) {
    return (schema as { shape: Record<string, unknown> }).shape;
  }

  // For empty or non-object schemas, return empty object
  return {};
}

// =============================================================================
// Factory Functions
// =============================================================================

/**
 * Create a new tool registry instance.
 * Convenience function for creating registries.
 */
export function createToolRegistry(
  server: McpServer,
  services: ServiceContainer,
  config?: ExecutorConfig
): ToolRegistry {
  return new ToolRegistry(server, services, config);
}

// =============================================================================
// Builder Helpers
// =============================================================================

/**
 * Helper to create a tool definition with type inference.
 * Provides better type inference than object literal.
 * 
 * @example
 * ```typescript
 * const sendTextTool = defineTool({
 *   name: 'whatsapp_send_text',
 *   title: 'Send Text',
 *   description: 'Send a text message',
 *   inputSchema: z.object({ jid: z.string(), text: z.string() }),
 *   outputSchema: z.object({ messageId: z.string() }),
 *   handler: async (input, ctx) => ({ messageId: '123' }),
 * });
 * ```
 */
export function defineTool<TInput, TOutput>(
  definition: ToolDefinition<TInput, TOutput>
): ToolDefinition<TInput, TOutput> {
  return definition;
}
