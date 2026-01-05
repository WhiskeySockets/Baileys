/**
 * Webhook Service
 * Manages webhook subscriptions and dispatches events to external endpoints
 * 
 * Follows SOLID principles:
 * - SRP: Only handles webhook dispatch, not event generation
 * - OCP: New events can be added without modifying dispatcher
 * - DIP: Depends on abstract event types, not concrete socket
 */

import crypto from 'crypto';
import { createChildLogger } from '../infrastructure/logger.js';
import type { IWebhookService, WebhookConfig, WebhookEvent, WebhookPayload } from '../types/index.js';

const logger = createChildLogger('WebhookService');

const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 10000]; // Exponential backoff
const REQUEST_TIMEOUT = 10000; // 10 seconds

export class WebhookService implements IWebhookService {
  private webhooks: Map<string, WebhookConfig> = new Map();

  constructor() {
    logger.info('WebhookService initialized');
  }

  /**
   * Register a new webhook endpoint
   */
  register(config: WebhookConfig): void {
    if (!config.url) {
      throw new Error('Webhook URL is required');
    }

    // Warn about non-HTTPS URLs
    if (!config.url.startsWith('https://') && !config.url.includes('localhost')) {
      logger.warn({ url: config.url }, 'Webhook URL is not HTTPS - consider using secure endpoints');
    }

    this.webhooks.set(config.url, {
      ...config,
      enabled: config.enabled ?? true,
      events: config.events ?? ['*'],
    });

    logger.info({ url: config.url, events: config.events }, 'Webhook registered');
  }

  /**
   * Unregister a webhook by URL
   */
  unregister(url: string): boolean {
    const existed = this.webhooks.delete(url);
    if (existed) {
      logger.info({ url }, 'Webhook unregistered');
    }
    return existed;
  }

  /**
   * List all registered webhooks
   */
  list(): WebhookConfig[] {
    return Array.from(this.webhooks.values()).map((w) => ({
      ...w,
      secret: w.secret ? '***' : undefined, // Mask secrets
    }));
  }

  /**
   * Dispatch an event to all matching webhooks
   */
  async dispatch(event: WebhookEvent, data: unknown): Promise<void> {
    const matchingWebhooks = this.getMatchingWebhooks(event);

    if (matchingWebhooks.length === 0) {
      return;
    }

    logger.debug({ event, webhookCount: matchingWebhooks.length }, 'Dispatching event to webhooks');

    const payload: WebhookPayload = {
      event,
      timestamp: Date.now(),
      data,
    };

    // Dispatch to all matching webhooks in parallel
    await Promise.allSettled(
      matchingWebhooks.map((webhook) => this.sendWithRetry(webhook, payload))
    );
  }

  /**
   * Send a test payload to a specific webhook
   */
  async test(url: string): Promise<{ success: boolean; error?: string }> {
    const webhook = this.webhooks.get(url);
    if (!webhook) {
      return { success: false, error: 'Webhook not found' };
    }

    const testPayload: WebhookPayload = {
      event: 'connection.update',
      timestamp: Date.now(),
      data: { test: true, message: 'This is a test webhook payload' },
    };

    try {
      await this.sendRequest(webhook, testPayload);
      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Get webhooks that match the given event
   */
  private getMatchingWebhooks(event: WebhookEvent): WebhookConfig[] {
    return Array.from(this.webhooks.values()).filter((w) => {
      if (!w.enabled) return false;
      if (w.events.includes('*')) return true;
      return w.events.includes(event);
    });
  }

  /**
   * Send request with retry logic
   */
  private async sendWithRetry(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        await this.sendRequest(webhook, payload);
        logger.debug({ url: webhook.url, attempt: attempt + 1 }, 'Webhook delivered');
        return;
      } catch (error) {
        lastError = error as Error;
        logger.warn(
          { url: webhook.url, attempt: attempt + 1, error: String(error) },
          'Webhook delivery failed, retrying...'
        );

        if (attempt < MAX_RETRIES - 1) {
          await this.delay(RETRY_DELAYS[attempt]);
        }
      }
    }

    logger.error(
      { url: webhook.url, error: String(lastError) },
      'Webhook delivery failed after all retries'
    );
  }

  /**
   * Send HTTP POST request to webhook endpoint
   */
  private async sendRequest(webhook: WebhookConfig, payload: WebhookPayload): Promise<void> {
    const body = JSON.stringify(payload);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'WhatsApp-MCP-Webhook/1.0',
    };

    // Add HMAC signature if secret is configured
    if (webhook.secret) {
      const signature = this.generateSignature(body, webhook.secret);
      headers['X-Webhook-Signature'] = signature;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Generate HMAC-SHA256 signature
   */
  private generateSignature(payload: string, secret: string): string {
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export class directly, no singleton
