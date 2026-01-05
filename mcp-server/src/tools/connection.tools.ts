/**
 * Connection Tools
 * 
 * MCP tools for managing WhatsApp connection lifecycle.
 * Uses the Tool Registry for declarative, DRY registration.
 * 
 * @module tools/connection.tools
 */

import { z } from 'zod';
import type { ToolRegistry, ToolDefinition, ToolContext } from './tool-registry.js';
import { defineTool } from './tool-registry.js';

// =============================================================================
// Schemas
// =============================================================================

const ConnectionStatusSchema = z.enum([
  'disconnected',
  'connecting',
  'connected',
  'qr_required',
  'pairing_required',
]);

const EmptyInputSchema = z.object({});

const ConnectOutputSchema = z.object({
  status: ConnectionStatusSchema,
  qrCode: z.string().optional(),
  pairingCode: z.string().optional(),
});

const DisconnectOutputSchema = z.object({
  success: z.boolean(),
});

const ConnectionStatusOutputSchema = z.object({
  status: ConnectionStatusSchema,
  isConnected: z.boolean(),
  sessionInfo: z.object({
    id: z.string(),
    name: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).nullable(),
});

const RequestPairingInputSchema = z.object({
  phoneNumber: z.string().describe('Phone number with country code (no + or spaces)'),
});

const PairingCodeOutputSchema = z.object({
  pairingCode: z.string(),
});

const QrCodeOutputSchema = z.object({
  qrCode: z.string(),
});

// =============================================================================
// Type Definitions
// =============================================================================

type EmptyInput = z.infer<typeof EmptyInputSchema>;
type RequestPairingInput = z.infer<typeof RequestPairingInputSchema>;

// =============================================================================
// Tool Definitions
// =============================================================================

/**
 * Connect to WhatsApp tool definition.
 */
export const connectTool: ToolDefinition<EmptyInput, unknown> = defineTool({
  name: 'whatsapp_connect',
  title: 'Connect to WhatsApp',
  description: 'Initialize connection to WhatsApp. Will return QR code if authentication is needed.',
  inputSchema: EmptyInputSchema,
  outputSchema: ConnectOutputSchema,
  requiresConnection: false, // This tool initiates connection
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    await ctx.services.connectionService.connect();
    return ctx.services.connectionService.getState();
  },
});

/**
 * Disconnect from WhatsApp tool definition.
 */
export const disconnectTool: ToolDefinition<EmptyInput, { success: boolean }> = defineTool({
  name: 'whatsapp_disconnect',
  title: 'Disconnect from WhatsApp',
  description: 'Disconnect and logout from WhatsApp',
  inputSchema: EmptyInputSchema,
  outputSchema: DisconnectOutputSchema,
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    await ctx.services.connectionService.disconnect();
    return { success: true };
  },
});

/**
 * Get connection status tool definition.
 */
export const connectionStatusTool: ToolDefinition<EmptyInput, unknown> = defineTool({
  name: 'whatsapp_connection_status',
  title: 'Get Connection Status',
  description: 'Get current WhatsApp connection status',
  inputSchema: EmptyInputSchema,
  outputSchema: ConnectionStatusOutputSchema,
  requiresConnection: false, // Can check status even if not connected
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    const state = ctx.services.connectionService.getState();
    const sessionInfo = ctx.services.connectionService.getSessionInfo();
    return {
      ...state,
      isConnected: ctx.services.connectionService.isConnected(),
      sessionInfo,
    };
  },
});

/**
 * Request pairing code tool definition.
 */
export const requestPairingCodeTool: ToolDefinition<RequestPairingInput, { pairingCode: string }> = defineTool({
  name: 'whatsapp_request_pairing_code',
  title: 'Request Pairing Code',
  description: 'Request a pairing code for phone number authentication. Auto-connects if not initialized.',
  inputSchema: RequestPairingInputSchema,
  outputSchema: PairingCodeOutputSchema,
  requiresConnection: false, // Used during connection setup
  handler: async (input: RequestPairingInput, ctx: ToolContext) => {
    const pairingCode = await ctx.services.connectionService.requestPairingCode(input.phoneNumber);
    return { pairingCode };
  },
});

/**
 * Get QR code tool definition.
 */
export const getQrCodeTool: ToolDefinition<EmptyInput, { qrCode: string }> = defineTool({
  name: 'whatsapp_get_qr_code',
  title: 'Get QR Code',
  description: 'Get the QR code for authentication. Initiates connection if needed and waits for QR.',
  inputSchema: EmptyInputSchema,
  outputSchema: QrCodeOutputSchema,
  requiresConnection: false,
  handler: async (_input: EmptyInput, ctx: ToolContext) => {
    // Check if we need to connect
    if (!ctx.services.connectionService.getSocket()) {
       await ctx.services.connectionService.connect();
    }
    const qrCode = await ctx.services.connectionService.waitForQR();
    return { qrCode };
  },
});

// =============================================================================
// Tool Collection
// =============================================================================

/**
 * All connection tool definitions.
 */
export const connectionTools: ToolDefinition<unknown, unknown>[] = [
  connectTool as ToolDefinition<unknown, unknown>,
  disconnectTool as ToolDefinition<unknown, unknown>,
  connectionStatusTool as ToolDefinition<unknown, unknown>,
  requestPairingCodeTool as ToolDefinition<unknown, unknown>,
  getQrCodeTool as ToolDefinition<unknown, unknown>,
];

// =============================================================================
// Registration Function
// =============================================================================

/**
 * Register all connection tools with the registry.
 * 
 * @param registry - Tool registry instance
 */
export function registerConnectionTools(registry: ToolRegistry): void {
  registry.registerAll(connectionTools, 'connection');
}
