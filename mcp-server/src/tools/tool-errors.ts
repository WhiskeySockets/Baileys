/**
 * Tool Errors
 * 
 * Custom error hierarchy for MCP tools.
 * Provides structured error handling with error codes and metadata.
 * 
 * @module tools/tool-errors
 * 
 * Design Principles:
 * - KISS: Simple error classes with clear hierarchy
 * - SOLID: Single responsibility - each error type has one purpose
 */

// =============================================================================
// Base Error
// =============================================================================

/**
 * Base error class for all tool-related errors.
 * Provides structured error information for consistent error handling.
 */
export class ToolError extends Error {
  /** Error code for programmatic handling */
  readonly code: string;
  /** HTTP-like status code for error severity */
  readonly statusCode: number;
  /** Additional error details */
  readonly details?: unknown;
  /** Whether this error should be retried */
  readonly retryable: boolean;

  constructor(
    message: string,
    options: {
      code?: string;
      statusCode?: number;
      details?: unknown;
      retryable?: boolean;
      cause?: Error;
    } = {}
  ) {
    super(message, { cause: options.cause });
    this.name = 'ToolError';
    this.code = options.code ?? 'TOOL_ERROR';
    this.statusCode = options.statusCode ?? 500;
    this.details = options.details;
    this.retryable = options.retryable ?? false;

    // Maintain proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/response.
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      retryable: this.retryable,
    };
  }
}

// =============================================================================
// Validation Errors
// =============================================================================

/**
 * Input validation failed.
 */
export class ValidationError extends ToolError {
  constructor(message: string, details?: unknown) {
    super(message, {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      details,
      retryable: false,
    });
    this.name = 'ValidationError';
  }
}

/**
 * Required parameter is missing.
 */
export class MissingParameterError extends ValidationError {
  constructor(parameterName: string) {
    super(`Missing required parameter: ${parameterName}`, {
      parameter: parameterName,
    });
    this.name = 'MissingParameterError';
  }
}

/**
 * Parameter value is invalid.
 */
export class InvalidParameterError extends ValidationError {
  constructor(parameterName: string, reason: string) {
    super(`Invalid parameter '${parameterName}': ${reason}`, {
      parameter: parameterName,
      reason,
    });
    this.name = 'InvalidParameterError';
  }
}

// =============================================================================
// Connection Errors
// =============================================================================

/**
 * WhatsApp is not connected.
 */
export class NotConnectedError extends ToolError {
  constructor() {
    super('WhatsApp is not connected. Call whatsapp_connect first.', {
      code: 'NOT_CONNECTED',
      statusCode: 503,
      retryable: true,
    });
    this.name = 'NotConnectedError';
  }
}

/**
 * Connection failed or was lost.
 */
export class ConnectionError extends ToolError {
  constructor(message: string, cause?: Error) {
    super(message, {
      code: 'CONNECTION_ERROR',
      statusCode: 503,
      retryable: true,
      cause,
    });
    this.name = 'ConnectionError';
  }
}

/**
 * Session expired or invalid.
 */
export class SessionError extends ToolError {
  constructor(message: string) {
    super(message, {
      code: 'SESSION_ERROR',
      statusCode: 401,
      retryable: false,
    });
    this.name = 'SessionError';
  }
}

// =============================================================================
// WhatsApp API Errors
// =============================================================================

/**
 * WhatsApp API returned an error.
 */
export class WhatsAppError extends ToolError {
  constructor(message: string, details?: unknown, cause?: Error) {
    super(message, {
      code: 'WHATSAPP_ERROR',
      statusCode: 502,
      details,
      retryable: false,
      cause,
    });
    this.name = 'WhatsAppError';
  }
}

/**
 * Requested resource not found (user, group, message).
 */
export class NotFoundError extends ToolError {
  constructor(resourceType: string, identifier: string) {
    super(`${resourceType} not found: ${identifier}`, {
      code: 'NOT_FOUND',
      statusCode: 404,
      details: { resourceType, identifier },
      retryable: false,
    });
    this.name = 'NotFoundError';
  }
}

/**
 * Permission denied for the operation.
 */
export class PermissionDeniedError extends ToolError {
  constructor(operation: string, reason?: string) {
    super(
      `Permission denied for operation: ${operation}${reason ? ` (${reason})` : ''}`,
      {
        code: 'PERMISSION_DENIED',
        statusCode: 403,
        details: { operation, reason },
        retryable: false,
      }
    );
    this.name = 'PermissionDeniedError';
  }
}

/**
 * Rate limit exceeded.
 */
export class RateLimitError extends ToolError {
  /** Seconds to wait before retrying */
  readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super('Rate limit exceeded. Please wait before retrying.', {
      code: 'RATE_LIMIT',
      statusCode: 429,
      details: { retryAfter },
      retryable: true,
    });
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Type guard to check if an error is a ToolError.
 */
export function isToolError(error: unknown): error is ToolError {
  return error instanceof ToolError;
}

/**
 * Wrap unknown errors as ToolError.
 * Preserves ToolError instances, wraps others.
 */
export function wrapError(error: unknown): ToolError {
  if (isToolError(error)) {
    return error;
  }

  if (error instanceof Error) {
    // Check for common Baileys error patterns
    const message = error.message.toLowerCase();
    
    if (message.includes('not connected') || message.includes('connection closed')) {
      return new NotConnectedError();
    }
    
    if (message.includes('rate limit') || message.includes('too many')) {
      return new RateLimitError();
    }
    
    if (message.includes('not found')) {
      return new NotFoundError('Resource', 'unknown');
    }

    return new ToolError(error.message, { cause: error });
  }

  return new ToolError(String(error));
}
