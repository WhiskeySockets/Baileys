/**
 * Webhook MCP Tools
 * Tools for managing webhook subscriptions
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { type ServiceContainer, type WebhookEvent } from '../types/index.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('WebhookTools');

const WebhookEventSchema = z.enum([
  'message.received',
  'message.sent',
  'message.update',
  'connection.update',
  'group.update',
  'presence.update',
  '*',
]);

/**
 * Register all webhook tools with the MCP server
 */
export function registerWebhookTools(server: McpServer, services: ServiceContainer): void {
  const { webhookService } = services;
  logger.info('Registering webhook tools...');

  // ========================================================================
  // whatsapp_webhook_register
  // ========================================================================
  server.tool(
    'whatsapp_webhook_register',
    'Register a webhook endpoint to receive real-time WhatsApp events',
    {
      url: z.string().url().describe('The webhook endpoint URL (HTTPS recommended)'),
      events: z
        .array(WebhookEventSchema)
        .optional()
        .describe('Event types to subscribe to. Use ["*"] for all events. Default: ["*"]'),
      secret: z
        .string()
        .optional()
        .describe('Optional HMAC secret for signature verification'),
    },
    async ({ url, events, secret }) => {
      logger.info({ url, events }, 'Registering webhook');

      webhookService.register({
        url,
        events: (events as WebhookEvent[]) || ['*'],
        secret,
        enabled: true,
      });

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: true,
              message: 'Webhook registered successfully',
              url,
              events: events || ['*'],
            }),
          },
        ],
      };
    }
  );

  // ========================================================================
  // whatsapp_webhook_unregister
  // ========================================================================
  server.tool(
    'whatsapp_webhook_unregister',
    'Remove a registered webhook endpoint',
    {
      url: z.string().url().describe('The webhook URL to unregister'),
    },
    async ({ url }) => {
      logger.info({ url }, 'Unregistering webhook');

      const removed = webhookService.unregister(url);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: removed,
              message: removed ? 'Webhook removed' : 'Webhook not found',
              url,
            }),
          },
        ],
      };
    }
  );

  // ========================================================================
  // whatsapp_webhook_list
  // ========================================================================
  server.tool(
    'whatsapp_webhook_list',
    'List all registered webhook endpoints',
    {},
    async () => {
      logger.info('Listing webhooks');

      const webhooks = webhookService.list();

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              count: webhooks.length,
              webhooks,
            }),
          },
        ],
      };
    }
  );

  // ========================================================================
  // whatsapp_webhook_test
  // ========================================================================
  server.tool(
    'whatsapp_webhook_test',
    'Send a test payload to a registered webhook to verify connectivity',
    {
      url: z.string().url().describe('The webhook URL to test'),
    },
    async ({ url }) => {
      logger.info({ url }, 'Testing webhook');

      const result = await webhookService.test(url);

      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              url,
              ...result,
            }),
          },
        ],
      };
    }
  );

  logger.info('Webhook tools registered');
}
