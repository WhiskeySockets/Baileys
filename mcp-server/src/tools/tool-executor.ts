/**
 * Tool Executor
 * 
 * Core execution engine for MCP tools.
 * Provides centralized logging, error handling, and response formatting.
 * 
 * @module tools/tool-executor
 * 
 * Design Principles:
 * - KISS: Simple, focused execution logic
 * - DRY: Single point for all cross-cutting concerns
 * - SOLID: 
 *   - SRP: Only handles execution, not registration
 *   - OCP: Extensible via middleware pattern (future)
 */

import { createChildLogger } from '../infrastructure/logger.js';
import type { ServiceContainer } from '../types/index.js';
import type {
  ToolDefinition,
  ToolContext,
  ToolResponse,
} from './tool-types.js';
import { ToolError, wrapError, NotConnectedError } from './tool-errors.js';

// =============================================================================
// Executor Configuration
// =============================================================================

export interface ExecutorConfig {
  /** Enable performance logging */
  logPerformance?: boolean;
  /** Maximum execution time in ms (0 = no limit) */
  timeout?: number;
}

const defaultConfig: ExecutorConfig = {
  logPerformance: true,
  timeout: 30000, // 30 seconds
};

// =============================================================================
// Tool Executor
// =============================================================================

/**
 * Creates an executable handler from a tool definition.
 * Wraps the handler with logging, error handling, and response formatting.
 * 
 * @param definition - The tool definition
 * @param services - Service container for dependency injection
 * @param config - Optional executor configuration
 * @returns MCP-compatible handler function
 * 
 * @example
 * ```typescript
 * const handler = createToolHandler(sendTextTool, services);
 * const response = await handler({ jid: '123@s.whatsapp.net', text: 'Hello' });
 * ```
 */
export function createToolHandler<TInput, TOutput>(
  definition: ToolDefinition<TInput, TOutput>,
  services: ServiceContainer,
  config: ExecutorConfig = defaultConfig
): (input: TInput) => Promise<ToolResponse> {
  const toolLogger = createChildLogger(definition.name);

  return async (input: TInput): Promise<ToolResponse> => {
    const startTime = performance.now();
    
    // Create execution context
    const context: ToolContext = {
      logger: toolLogger,
      services,
      meta: {
        toolName: definition.name,
        startTime,
      },
    };

    try {
      // Pre-execution logging
      toolLogger.info(
        { input: sanitizeForLogging(input) },
        `Executing tool: ${definition.name}`
      );

      // Connection check for tools that require it
      if (definition.requiresConnection !== false) {
        if (!services.connectionService.isConnected()) {
          throw new NotConnectedError();
        }
      }

      // Execute with timeout
      const result = await executeWithTimeout(
        () => definition.handler(input, context),
        config.timeout ?? defaultConfig.timeout!,
        definition.name
      );

      // Post-execution logging
      const duration = performance.now() - startTime;
      if (config.logPerformance) {
        toolLogger.info(
          { duration: Math.round(duration), success: true },
          `Tool completed: ${definition.name}`
        );
      }

      // Format successful response
      return formatSuccessResponse(result);

    } catch (error) {
      // Error handling
      const duration = performance.now() - startTime;
      const toolError = wrapError(error);
      
      toolLogger.error(
        {
          error: toolError.toJSON(),
          duration: Math.round(duration),
        },
        `Tool failed: ${definition.name}`
      );

      return formatErrorResponse(toolError);
    }
  };
}

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Execute a function with timeout.
 */
async function executeWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  toolName: string
): Promise<T> {
  if (timeoutMs <= 0) {
    return fn();
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new ToolError(`Tool execution timed out after ${timeoutMs}ms`, {
        code: 'TIMEOUT',
        statusCode: 408,
        details: { toolName, timeoutMs },
        retryable: true,
      }));
    }, timeoutMs);

    fn()
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/**
 * Format a successful result as MCP response.
 */
function formatSuccessResponse<T>(result: T): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

/**
 * Format an error as MCP response.
 */
function formatErrorResponse(error: ToolError): ToolResponse {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
            retryable: error.retryable,
          },
        }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Sanitize input for logging (remove sensitive data).
 */
function sanitizeForLogging(input: unknown): unknown {
  if (input === null || input === undefined) {
    return input;
  }

  if (typeof input !== 'object') {
    return input;
  }

  const sensitiveKeys = ['password', 'secret', 'token', 'key', 'auth'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'string' && value.length > 500) {
      sanitized[key] = `${value.substring(0, 100)}... [truncated]`;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
