/**
 * HTTP Server Entry Point
 * 
 * Runs the MCP server with StreamableHTTP transport for web deployment.
 * This allows remote clients to connect via HTTP instead of stdio.
 * Supports multi-tenancy by creating isolated service containers for each session.
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import path from 'path';
import fs from 'fs';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createMcpServer } from './server.js';
import { logger } from './infrastructure/logger.js';
import { 
  AuthService, 
  ConnectionService, 
  MessageService, 
  GroupService, 
  ContactService,
  WebhookService
} from './services/index.js';
import { type ServiceContainer, type ServiceConfig } from './types/index.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Store active sessions and their associated services
interface SessionContext {
  transport: StreamableHTTPServerTransport;
  services: ServiceContainer;
}

const sessions: Record<string, SessionContext> = {};

/**
 * Initialize services for a new session
 * Creates a unique auth directory for isolation
 */
function createServiceContainer(sessionId: string): ServiceContainer {
  // 1. Setup Session-Specific Auth Directory
  const authBaseDir = process.env.AUTH_DIR || path.join(process.cwd(), 'baileys_auth_info');
  const sessionAuthDir = path.join(authBaseDir, sessionId);
  
  if (!fs.existsSync(sessionAuthDir)) {
    fs.mkdirSync(sessionAuthDir, { recursive: true });
  }

  logger.info({ sessionId, authDir: sessionAuthDir }, 'Initializing services for session');

  // 2. Initialize Services (DI)
  const serviceConfig: ServiceConfig = {
    authDir: sessionAuthDir,
    logger
  };

  const authService = new AuthService(serviceConfig);
  const connectionService = new ConnectionService(authService, serviceConfig);
  const messageService = new MessageService(connectionService);
  const groupService = new GroupService(connectionService);
  const contactService = new ContactService(connectionService);
  const webhookService = new WebhookService();

  // 3. Setup Webhook Dispatching for this session
  connectionService.on('messages.upsert', (data) => webhookService.dispatch('message.received', data));
  connectionService.on('messages.update', (data) => webhookService.dispatch('message.update', data));
  connectionService.on('connected', () => webhookService.dispatch('connection.update', { status: 'connected' }));
  connectionService.on('qr', (qr) => webhookService.dispatch('connection.update', { status: 'qr_required', qr }));
  connectionService.on('groups.update', (data) => webhookService.dispatch('group.update', data));
  connectionService.on('presence.update', (data) => webhookService.dispatch('presence.update', data));

  const container: ServiceContainer = {
    authService,
    connectionService,
    messageService,
    groupService,
    contactService,
    webhookService
  };

  // Start connection automatically for the session
  // Note: We might want to make this lazy or triggered by a tool, but for now we auto-connect
  connectionService.connect().catch(err => {
    logger.error({ sessionId, error: err }, 'Failed to initiate WhatsApp connection');
  });

  return container;
}

async function main(): Promise<void> {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      activeSessions: Object.keys(sessions).length
    });
  });

  // MCP endpoint - handles all MCP protocol messages
  app.post('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && sessions[sessionId]) {
      // Reuse existing session
      transport = sessions[sessionId].transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New session initialization
      
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          // Initialize services context for this new session
          const services = createServiceContainer(id);
          const server = createMcpServer(services);
          
          sessions[id] = { transport, services };
          
          server.connect(transport).catch(err => {
             logger.error({ sessionId: id, error: err }, 'Failed to connect server to transport');
          });

          logger.info({ sessionId: id }, 'MCP session initialized');
        },
      });

      transport.onclose = async () => {
        if (transport.sessionId && sessions[transport.sessionId]) {
          const { services } = sessions[transport.sessionId];
          
          // Cleanup services
          logger.info({ sessionId: transport.sessionId }, 'Closing session services');
          await services.connectionService.disconnect();
          
          delete sessions[transport.sessionId];
          logger.info({ sessionId: transport.sessionId }, 'MCP session closed');
        }
      };

      // We don't await server.connect() here because it waits for transport connection?
      // Actually StreamableHTTPServerTransport handles connection internally.
      // The server.connect(transport) is called inside onsessioninitialized to ensure we have the ID.
      
    } else {
      // Invalid request - no session ID for non-init request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid request: missing session ID or not an initialization request',
        },
        id: null,
      });
      return;
    }

    // Handle the request
    await transport.handleRequest(req, res, req.body);
  });

  // SSE endpoint for server-to-client notifications
  app.get('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (!sessionId || !sessions[sessionId]) {
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32600,
          message: 'Invalid or missing session ID',
        },
        id: null,
      });
      return;
    }

    const { transport } = sessions[sessionId];
    await transport.handleRequest(req, res);
  });

  // Session cleanup endpoint
  app.delete('/mcp', async (req: Request, res: Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    
    if (sessionId && sessions[sessionId]) {
      const { transport } = sessions[sessionId];
      await transport.close();
      // Cleanup is handled in onclose callback
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });

  // Handle graceful shutdown
  const shutdown = async () => {
    logger.info('Shutting down server...');
    
    // Close all sessions
    for (const [id, { transport, services }] of Object.entries(sessions)) {
      logger.info({ sessionId: id }, 'Disconnecting session');
      await services.connectionService.disconnect();
      await transport.close();
    }
    
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Start server
  app.listen(PORT, HOST, () => {
    logger.info({ host: HOST, port: PORT }, 'WhatsApp MCP HTTP Server started');
    logger.info(`Health check: http://${HOST}:${PORT}/health`);
    logger.info(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  });
}

main().catch((error) => {
  logger.error({ error }, 'Failed to start HTTP server');
  process.exit(1);
});
