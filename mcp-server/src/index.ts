#!/usr/bin/env node
/**
 * WhatsApp MCP Server - Entry Point
 * 
 * This server exposes WhatsApp functionality via the Model Context Protocol
 * for integration with LLM applications like Claude Desktop.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import qrcode from 'qrcode-terminal';
import path from 'path';
import fs from 'fs';
import { createMcpServer } from './server.js';
import { 
  AuthService, 
  ConnectionService, 
  MessageService, 
  GroupService, 
  ContactService,
  WebhookService
} from './services/index.js';
import { logger } from './infrastructure/logger.js';
import { type ServiceContainer, type ServiceConfig } from './types/index.js';

async function main(): Promise<void> {
  logger.info('Starting WhatsApp MCP Server...');

  try {
    // 1. Setup Auth Directory
    const authDir = path.join(process.cwd(), 'baileys_auth_info');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // 2. Initialize Services (DI)
    const serviceConfig: ServiceConfig = {
      authDir,
      logger
    };

    const authService = new AuthService(serviceConfig);
    // Explicitly disable terminal QR printing to prevent stdout pollution breaking MCP
    // The ServiceConfig type doesn't include printQRInTerminal, but ConnectionServiceConfig does
    const connectionService = new ConnectionService(authService, { ...serviceConfig, printQRInTerminal: false });
    const messageService = new MessageService(connectionService);
    const groupService = new GroupService(connectionService);
    const contactService = new ContactService(connectionService);
    const webhookService = new WebhookService();

    // 3. Create Service Container
    const services: ServiceContainer = {
      authService,
      connectionService,
      messageService,
      groupService,
      contactService,
      webhookService
    };

    // 4. Create MCP Server with injected services
    const server = createMcpServer(services);

    // 5. Create stdio transport
    const transport = new StdioServerTransport();

    // 6. Setup Event Handlers

    // Configure connection service options
    // We can't set these in constructor anymore as they were part of IConnectionServiceOptions
    // which was merged into the constructor arguments in the previous refactor step?
    // Actually, looking at connection.service.ts, the constructor takes (authService, config).
    // The config parameter is ServiceConfig which has authDir and logger.
    // The previous implementation passed { printQRInTerminal: false, autoReconnect: true } to getConnectionService factory.
    // We need to check if ConnectionService constructor supports these options or if we need to set them differently.
    // Retaining existing behavior: manual QR handling.

    // Handle QR code event manually to print to stderr
    connectionService.on('qr', (qr) => {
      logger.info('QR Code received, scan with WhatsApp:');
      // Print QR to stderr specifically to avoid breaking MCP JSON-RPC on stdout
      qrcode.generate(qr as string, { small: true }, (code) => {
        process.stderr.write(code + '\n');
      });
    });

    connectionService.on('connected', () => {
      logger.info('WhatsApp connected!');
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down...');
      await connectionService.disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    // 7. Connect server to transport
    await server.connect(transport);

    logger.info('WhatsApp MCP Server started successfully');
    logger.info('Waiting for MCP client connections...');
    
    // 8. Trigger connection process
    if (!connectionService.isConnected()) {
        connectionService.connect().catch(err => {
            logger.error({ error: err }, 'Failed to initiate connection');
        });
    }

  } catch (error) {
    logger.error({ error }, 'Failed to start MCP server');
    process.exit(1);
  }
}

main();
