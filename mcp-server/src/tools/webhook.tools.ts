/**
 * Webhook Tools
 * 
 * MCP tools for managing webhook subscriptions.
 * Uses the Tool Registry for declarative, DRY registration.
 * 
 * @module tools/webhook.tools
 */

import { z } from 'zod';
import type { ToolRegistry, ToolDefinition, ToolContext } from './tool-registry.js';
import { defineTool } from './tool-registry.js';
import type { WebhookEvent } from '../types/index.js';

// =============================================================================
// Schemas
// =============================================================================

const WebhookEventSchema = z.enum([
  'message.received',
  'message.sent',
  'message.update',
  'connection.update',
  'group.update',
  'presence.update',
  '*',
]);

const RegisterWebhookInputSchema = z.object({
  url: z.string().url().describe('The webhook endpoint URL (HTTPS recommended)'),
  events: z.array(WebhookEventSchema).optional().describe('Event types to subscribe to. Use ["*"] for all events. Default: ["*"]'),
  secret: z.string().optional().describe('Optional HMAC secret for signature verification'),
});

const RegisterWebhookOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  url: z.string(),
  events: z.array(z.string()),
});

const UrlInputSchema = z.object({
  url: z.string().url().describe('The webhook URL'),
});

const UnregisterWebhookOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  url: z.string(),
});

const EmptyInputSchema = z.object({});

const WebhookConfigSchema = z.object({
  url: z.string(),
  events: z.array(z.string()),
  secret: z.string().optional(),
  enabled: z.boolean(),
});

const ListWebhooksOutputSchema = z.object({
  count: z.number(),
  webhooks: z.array(WebhookConfigSchema),
});

const TestWebhookOutputSchema = z.object({
  url: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
});

// =============================================================================
// Type Definitions
// =============================================================================

type RegisterWebhookInput = z.infer<typeof RegisterWebhookInputSchema>;
type UrlInput = z.infer<typeof UrlInputSchema>;
type EmptyInput = z.infer<typeof EmptyInputSchema>;

// =============================================================================
// Tool Definitions
// =============================================================================

/**
 * Register webhook tool definition.
 */
export const registerWebhookTool: ToolDefinition<RegisterWebhookInput, unknown> = defineTool({
  name: 'whatsapp_webhook_register',
  title: 'Register Webhook',
  description: 'Register a webhook endpoint to receive real-time WhatsApp events',
  inputSchema: RegisterWebhookInputSchema,
  outputSchema: RegisterWebhookOutputSchema,
  requiresConnection: false, // Webhooks can be registered before connection
  handler: async (input: RegisterWebhookInput, ctx: ToolContext) => {
    ctx.services.webhookService.register({
      url: input.url,
      events: (input.events as WebhookEvent[]) || ['*'],
      secret: input.secret,
      enabled: true,
    });

    return {
      success: true,
      message: 'Webhook registered successfully',
      url: input.url,
      events: input.events || ['*'],
    };
  },
});

/**
 * Unregister webhook tool definition.
 */
export const unregisterWebhookTool: ToolDefinition<UrlInput, unknown> = defineTool({
  name: 'whatsapp_webhook_unregister',
  title: 'Unregister Webhook',
  description: 'Remove a registered webhook endpoint',
  inputSchema: UrlInputSchema,
  outputSchema: UnregisterWebhookOutputSchema,
  requiresConnection: false,
  handler: async (input: UrlInput, ctx: ToolContext) => {
    const removed = ctx.services.webhookService.unregister(input.url);
    return {
      success: removed,
      message: removed ? 'Webhook removed' : 'Webhook not found',
      url: input.url,
    };
  },
});

/**
 * List webhooks tool definition.
 */
export const listWebhooksTool: ToolDefinition<EmptyInput, unknown> = defineTool({
  name: 'whatsapp_webhook_list',
  title: 'List Webhooks',
  description: 'List all registered webhook endpoints',
  inputSchema: EmptyInputSchema,
  outputSchema: ListWebhooksOutputSchema,
  requiresConnection: false,
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    const webhooks = ctx.services.webhookService.list();
    return {
      count: webhooks.length,
      webhooks,
    };
  },
});

/**
 * Test webhook tool definition.
 */
export const testWebhookTool: ToolDefinition<UrlInput, unknown> = defineTool({
  name: 'whatsapp_webhook_test',
  title: 'Test Webhook',
  description: 'Send a test payload to a registered webhook to verify connectivity',
  inputSchema: UrlInputSchema,
  outputSchema: TestWebhookOutputSchema,
  requiresConnection: false,
  handler: async (input: UrlInput, ctx: ToolContext) => {
    const result = await ctx.services.webhookService.test(input.url);
    return {
      url: input.url,
      ...result,
    };
  },
});

// =============================================================================
// Tool Collection
// =============================================================================

/**
 * All webhook tool definitions.
 */
export const webhookTools: ToolDefinition<unknown, unknown>[] = [
  registerWebhookTool as ToolDefinition<unknown, unknown>,
  unregisterWebhookTool as ToolDefinition<unknown, unknown>,
  listWebhooksTool as ToolDefinition<unknown, unknown>,
  testWebhookTool as ToolDefinition<unknown, unknown>,
];

// =============================================================================
// Registration Function
// =============================================================================

/**
 * Register all webhook tools with the registry.
 * 
 * @param registry - Tool registry instance
 */
export function registerWebhookTools(registry: ToolRegistry): void {
  registry.registerAll(webhookTools, 'webhook');
}
