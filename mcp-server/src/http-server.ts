/**
 * HTTP Server Entry Point
 * 
 * Runs the MCP server with StreamableHTTP transport for web deployment.
 * This allows remote clients to connect via HTTP instead of stdio.
 * Supports multi-tenancy by creating isolated service containers for each session.
 * 
 * Storage modes (controlled by USE_DATABASE env var):
 * - Filesystem: Uses baileys_auth_info/{sessionId}/ directories (default)
 * - Database: Uses PostgreSQL via Prisma repositories (recommended for production)
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';
import path from 'path';
import fs from 'fs';
import qrcode from 'qrcode-terminal';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { createMcpServer } from './server.js';
import { logger } from './infrastructure/logger.js';
import { getPrismaClient, disconnectPrisma } from './infrastructure/database.js';
import { 
  AuthService, 
  ConnectionService, 
  MessageService, 
  GroupService, 
  ContactService,
  WebhookService
} from './services/index.js';
import {
  PrismaSessionRepository,
  PrismaCredentialsRepository,
  PrismaMessageRepository,
  PrismaContactRepository,
  PrismaGroupRepository,
  type RepositoryContainer,
} from './repositories/index.js';
import { type ServiceContainer, type ServiceConfig } from './types/index.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';
const USE_DATABASE = process.env.USE_DATABASE === 'true';

// Store active sessions and their associated services
interface SessionContext {
  transport: StreamableHTTPServerTransport;
  services: ServiceContainer;
}

const sessions: Record<string, SessionContext> = {};

// Repository container (shared for database mode)
let repositoryContainer: RepositoryContainer | undefined;

/**
 * Get or create repository container (singleton for database mode)
 */
function getRepositoryContainer(): RepositoryContainer {
  if (!repositoryContainer) {
    const prisma = getPrismaClient();
    repositoryContainer = {
      sessions: new PrismaSessionRepository(prisma),
      credentials: new PrismaCredentialsRepository(prisma),
      messages: new PrismaMessageRepository(prisma),
      contacts: new PrismaContactRepository(prisma),
      groups: new PrismaGroupRepository(prisma),
    };
  }
  return repositoryContainer;
}

/**
 * Initialize services for a new session
 * Supports both filesystem (legacy) and database (recommended) modes
 */
function createServiceContainer(sessionId: string): ServiceContainer {
  let authService: AuthService;
  let repositories: RepositoryContainer | undefined;

  if (USE_DATABASE) {
    // Database mode - use Prisma repositories
    logger.info({ sessionId, mode: 'database' }, 'Initializing services for session');
    
    repositories = getRepositoryContainer();
    
    authService = new AuthService({
      sessionId,
      credentialsRepository: repositories.credentials,
    });
  } else {
    // Filesystem mode (legacy)
    const authBaseDir = process.env.AUTH_DIR || path.join(process.cwd(), 'baileys_auth_info');
    const sessionAuthDir = path.join(authBaseDir, sessionId);
    
    if (!fs.existsSync(sessionAuthDir)) {
      fs.mkdirSync(sessionAuthDir, { recursive: true });
    }

    logger.info({ sessionId, mode: 'filesystem', authDir: sessionAuthDir }, 'Initializing services for session');

    authService = new AuthService({
      authDir: sessionAuthDir,
    });
  }

  // Initialize Services (DI)
  const serviceConfig: ServiceConfig = {
    authDir: USE_DATABASE ? undefined : process.env.AUTH_DIR,
    sessionId: USE_DATABASE ? sessionId : undefined,
    useDatabase: USE_DATABASE,
    logger,
  };

  const connectionService = new ConnectionService(authService, serviceConfig);
  const messageService = new MessageService(connectionService, {
    sessionId: USE_DATABASE ? sessionId : undefined,
    messageRepository: repositories?.messages,
  });
  const groupService = new GroupService(connectionService);
  const contactService = new ContactService(connectionService);
  const webhookService = new WebhookService();

  // Setup Webhook Dispatching for this session
  // Handle incoming messages: persist to DB and dispatch webhook
  connectionService.on('messages.upsert', async (data) => {
    webhookService.dispatch('message.received', data);
    
    // Persist incoming messages to database
    if (USE_DATABASE && repositories?.messages) {
      try {
        const upsertData = data as { messages: Array<{ key: { id: string; remoteJid: string; fromMe?: boolean; participant?: string }; messageTimestamp?: number | bigint; message?: Record<string, unknown> }> };
        
        for (const msg of upsertData.messages) {
          // Determine message type from message content
          let messageType: 'TEXT' | 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'STICKER' | 'LOCATION' | 'CONTACT' | 'REACTION' | 'OTHER' = 'OTHER';
          let content: string | undefined;
          
          if (msg.message) {
            if (msg.message.conversation) {
              messageType = 'TEXT';
              content = msg.message.conversation as string;
            } else if (msg.message.extendedTextMessage) {
              messageType = 'TEXT';
              content = (msg.message.extendedTextMessage as { text?: string }).text;
            } else if (msg.message.imageMessage) {
              messageType = 'IMAGE';
              content = (msg.message.imageMessage as { caption?: string }).caption;
            } else if (msg.message.videoMessage) {
              messageType = 'VIDEO';
              content = (msg.message.videoMessage as { caption?: string }).caption;
            } else if (msg.message.audioMessage) {
              messageType = 'AUDIO';
            } else if (msg.message.documentMessage) {
              messageType = 'DOCUMENT';
              content = (msg.message.documentMessage as { fileName?: string }).fileName;
            } else if (msg.message.stickerMessage) {
              messageType = 'STICKER';
            } else if (msg.message.locationMessage) {
              messageType = 'LOCATION';
            } else if (msg.message.contactMessage) {
              messageType = 'CONTACT';
            } else if (msg.message.reactionMessage) {
              messageType = 'REACTION';
              content = (msg.message.reactionMessage as { text?: string }).text;
            }
          }
          
          const timestamp = msg.messageTimestamp 
            ? new Date(Number(msg.messageTimestamp) * 1000)
            : new Date();
          
          await repositories.messages.save({
            sessionId,
            messageId: msg.key.id,
            remoteJid: msg.key.remoteJid,
            fromMe: msg.key.fromMe ?? false,
            participant: msg.key.participant,
            messageType,
            content,
            status: 'DELIVERED',
            timestamp,
          });
          
          logger.debug({ messageId: msg.key.id, type: messageType }, 'Incoming message persisted to database');
        }
      } catch (error) {
        logger.error({ error }, 'Failed to persist incoming messages to database');
      }
    }
  });
  
  connectionService.on('messages.update', (data) => webhookService.dispatch('message.update', data));
  connectionService.on('connected', () => webhookService.dispatch('connection.update', { status: 'connected' }));
  
  // Handle QR code: Dispatch to webhook AND print to console
  connectionService.on('qr', (qr) => {
    logger.info('QR Code received, scan with WhatsApp:');
    qrcode.generate(qr as string, { small: true });
    webhookService.dispatch('connection.update', { status: 'qr_required', qr });
  });

  connectionService.on('groups.update', (data) => webhookService.dispatch('group.update', data));
  connectionService.on('presence.update', (data) => webhookService.dispatch('presence.update', data));

  const container: ServiceContainer = {
    authService,
    connectionService,
    messageService,
    groupService,
    contactService,
    webhookService,
    repositories,
  };

  // Start connection automatically for the session
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
    
    // Disconnect Prisma if using database mode
    if (USE_DATABASE) {
      await disconnectPrisma();
    }
    
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Start server
  app.listen(PORT, HOST, () => {
    logger.info({ host: HOST, port: PORT, mode: USE_DATABASE ? 'database' : 'filesystem' }, 'WhatsApp MCP HTTP Server started');
    logger.info(`Health check: http://${HOST}:${PORT}/health`);
    logger.info(`MCP endpoint: http://${HOST}:${PORT}/mcp`);
  });
}

main().catch((error) => {
  logger.error({ error }, 'Failed to start HTTP server');
  process.exit(1);
});
