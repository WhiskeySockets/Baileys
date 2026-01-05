/**
 * Tool Types
 * 
 * Type definitions for the MCP Tool Registration Framework.
 * Provides type-safe contracts for tool handlers, context, and responses.
 * 
 * @module tools/tool-types
 * 
 * Design Principles:
 * - KISS: Simple, focused interfaces
 * - DRY: Reusable type definitions
 * - SOLID: Interface segregation, single responsibility
 */

import type { z } from 'zod';
import type { Logger } from 'pino';
import type { ServiceContainer } from '../types/index.js';

// =============================================================================
// Zod Type Aliases (Zod 4 compatible)
// =============================================================================

/** Generic Zod schema type */
export type ZodSchema<T = unknown> = z.ZodType<T>;

// =============================================================================
// Tool Handler Types
// =============================================================================

/**
 * Context provided to every tool handler.
 * Contains injected dependencies and metadata.
 */
export interface ToolContext {
  /** Child logger scoped to the tool name */
  logger: Logger;
  /** Service container with all business logic services */
  services: ServiceContainer;
  /** Tool execution metadata */
  meta: {
    /** Tool name */
    toolName: string;
    /** Execution start time (for perf tracking) */
    startTime: number;
  };
}

/**
 * Generic tool handler function signature.
 * All tool handlers must conform to this contract.
 * 
 * @typeParam TInput - Input parameters type (inferred from inputSchema)
 * @typeParam TOutput - Output result type (inferred from outputSchema)
 */
export type ToolHandler<TInput, TOutput> = (
  input: TInput,
  context: ToolContext
) => Promise<TOutput>;

// =============================================================================
// Tool Definition Types
// =============================================================================

/**
 * Complete tool definition with metadata, schemas, and handler.
 * This is the primary interface for defining new tools.
 * 
 * @typeParam TInput - Input parameters type
 * @typeParam TOutput - Output result type
 * 
 * @example
 * ```typescript
 * const sendTextTool: ToolDefinition<SendTextInput, SendTextOutput> = {
 *   name: 'whatsapp_send_text',
 *   title: 'Send Text Message',
 *   description: 'Send a text message to a WhatsApp user or group',
 *   inputSchema: z.object({ jid: z.string(), text: z.string() }),
 *   outputSchema: z.object({ messageId: z.string() }),
 *   handler: async (input, ctx) => {
 *     return await ctx.services.messageService.sendText(input);
 *   },
 * };
 * ```
 */
export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  /** Unique tool identifier (snake_case, prefixed with 'whatsapp_') */
  name: string;
  /** Human-readable title for display */
  title: string;
  /** Detailed description of tool functionality */
  description: string;
  /** Zod schema for input validation */
  inputSchema: ZodSchema<TInput>;
  /** Zod schema for output validation (documentation purposes) */
  outputSchema: ZodSchema<TOutput>;
  /** Tool handler function */
  handler: ToolHandler<TInput, TOutput>;
  /** Optional tags for categorization */
  tags?: string[];
  /** Whether the tool requires an active WhatsApp connection */
  requiresConnection?: boolean;
}

// =============================================================================
// Tool Response Types
// =============================================================================

/**
 * MCP-compliant tool response format.
 * All tools must return responses in this format.
 */
export interface ToolResponse {
  content: ToolResponseContent[];
  isError?: boolean;
}

/**
 * Individual content item in tool response.
 */
export interface ToolResponseContent {
  type: 'text';
  text: string;
}

// =============================================================================
// Tool Result Types (Business Logic)
// =============================================================================

/**
 * Standard success result with data.
 */
export interface SuccessResult<T> {
  success: true;
  data: T;
}

/**
 * Standard error result with details.
 */
export interface ErrorResult {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Union type for tool execution result.
 */
export type ToolResult<T> = SuccessResult<T> | ErrorResult;

// =============================================================================
// Tool Category Types
// =============================================================================

/**
 * Tool categories for organization and discovery.
 */
export type ToolCategory = 
  | 'connection'
  | 'messaging'
  | 'contact'
  | 'group'
  | 'webhook';

/**
 * Tool metadata for registry.
 */
export interface ToolMetadata {
  name: string;
  title: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  requiresConnection: boolean;
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Infer input type from a ToolDefinition.
 */
export type InferToolInput<T> = T extends ToolDefinition<infer I, unknown> ? I : never;

/**
 * Infer output type from a ToolDefinition.
 */
export type InferToolOutput<T> = T extends ToolDefinition<unknown, infer O> ? O : never;
