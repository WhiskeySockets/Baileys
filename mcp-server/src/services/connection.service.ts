/**
 * Connection Service
 * Manages WhatsApp socket lifecycle per session (multi-tenant)
 */

import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  type WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { createChildLogger } from '../infrastructure/logger.js';
import type { AuthService } from './auth.service.js';
import type { ConnectionState, SessionInfo, IConnectionService } from '../types/index.js';

const logger = createChildLogger('ConnectionService');

export interface ConnectionServiceConfig {
  authDir?: string;
  printQRInTerminal?: boolean;
  autoReconnect?: boolean;
}

export class ConnectionService implements IConnectionService {
  private socket: WASocket | null = null;
  private authService: AuthService;
  private config: ConnectionServiceConfig;
  private state: ConnectionState = { status: 'disconnected' };
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map();

  constructor(authService: AuthService, config: ConnectionServiceConfig = {}) {
    this.config = {
      printQRInTerminal: config.printQRInTerminal ?? true,
      autoReconnect: config.autoReconnect ?? true,
      ...config,
    };
    this.authService = authService;
    logger.info('ConnectionService initialized');
  }

  /**
   * Connect to WhatsApp
   */
  async connect(): Promise<void> {
    if (this.socket && this.state.status === 'connected') {
      logger.info('Already connected');
      return;
    }

    this.state = { status: 'connecting' };
    logger.info('Connecting to WhatsApp...');

    try {
      const authState = await this.authService.loadState();
      const { version, isLatest } = await fetchLatestBaileysVersion();
      
      logger.info({ version: version.join('.'), isLatest }, 'WhatsApp version');

      this.socket = makeWASocket({
        version,
        logger: logger as unknown as Parameters<typeof makeWASocket>[0]['logger'],
        auth: {
          creds: authState.creds,
          keys: makeCacheableSignalKeyStore(authState.keys, logger as unknown as Parameters<typeof makeCacheableSignalKeyStore>[1]),
        },
        printQRInTerminal: this.config.printQRInTerminal,
        generateHighQualityLinkPreview: true,
      });

      this.setupEventHandlers();
    } catch (error) {
      logger.error({ error }, 'Failed to connect');
      this.state = { status: 'disconnected', lastDisconnect: { reason: String(error), code: -1 } };
      throw error;
    }
  }

  /**
   * Setup event handlers for socket
   */
  private setupEventHandlers(): void {
    if (!this.socket) return;

    // Connection update handler
    this.socket.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        this.state = { status: 'qr_required', qrCode: qr };
        logger.info('QR code available for scanning');
        this.emit('qr', qr);
      }

      if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        
        this.state = {
          status: 'disconnected',
          lastDisconnect: {
            reason: lastDisconnect?.error?.message || 'Unknown',
            code: statusCode || -1,
          },
        };
        
        logger.info({ statusCode, shouldReconnect }, 'Connection closed');
        
        if (shouldReconnect && this.config.autoReconnect) {
          logger.info('Attempting to reconnect...');
          setTimeout(() => this.connect(), 3000);
        }
      } else if (connection === 'open') {
        this.state = { status: 'connected' };
        logger.info('Connected to WhatsApp');
        this.emit('connected', null);
      }
    });

    // Credentials update handler
    this.socket.ev.on('creds.update', async () => {
      await this.authService.saveCredentials();
    });

    // Forward message events
    this.socket.ev.on('messages.upsert', (data) => {
      this.emit('messages.upsert', data);
    });

    // Forward message update events (receipts, status changes)
    this.socket.ev.on('messages.update', (data) => {
      this.emit('messages.update', data);
    });

    // Forward group update events
    this.socket.ev.on('groups.update', (data) => {
      this.emit('groups.update', data);
    });

    // Forward presence updates
    this.socket.ev.on('presence.update', (data) => {
      this.emit('presence.update', data);
    });
  }

  /**
   * Disconnect from WhatsApp
   */
  async disconnect(): Promise<void> {
    if (this.socket) {
      await this.socket.logout();
      this.socket = null;
      this.state = { status: 'disconnected' };
      logger.info('Disconnected from WhatsApp');
    }
  }

  /**
   * Get active socket
   */
  getSocket(): WASocket | null {
    return this.socket;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.state.status === 'connected' && this.socket !== null;
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return { ...this.state };
  }

  /**
   * Get session info
   */
  getSessionInfo(): SessionInfo | null {
    if (!this.socket || !this.isConnected()) {
      return null;
    }

    const creds = this.authService.getState().creds;
    return {
      id: creds.me?.id || '',
      name: creds.me?.name,
      phoneNumber: creds.me?.id.split(':')[0].replace('@s.whatsapp.net', ''),
    };
  }

  /**
   * Request pairing code for phone number
   */
  /**
   * Wait for QR code
   */
  async waitForQR(timeoutMs: number = 45000): Promise<string> {
    if (this.state.qrCode) return this.state.qrCode;
    if (this.isConnected()) throw new Error('Already connected');

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error('Timeout waiting for QR code'));
      }, timeoutMs);

      const onQR = (qr: unknown) => {
        cleanup();
        resolve(qr as string);
      };

      const onConnect = () => {
         cleanup();
         reject(new Error('Connected without QR (session restored?)'));
      };
      
      const cleanup = () => {
        this.off('qr', onQR);
        this.off('connected', onConnect);
        clearTimeout(timeout);
      };

      this.on('qr', onQR);
      this.on('connected', onConnect);
    });
  }

  /**
   * Request pairing code for phone number
   */
  async requestPairingCode(phoneNumber: string): Promise<string> {
    if (!this.socket) {
      logger.info('Socket not initialized, connecting for pairing code...');
      await this.connect();
    }

    if (!this.socket) {
      throw new Error('Failed to initialize socket');
    }

    // Wait for the socket to be ready for authentication
    // The QR event indicates the socket is ready (we'll request pairing code instead of using QR)
    if (this.state.status !== 'qr_required' && this.state.status !== 'connected') {
      logger.info('Waiting for socket to be ready for authentication...');
      try {
        await this.waitForQR(15000); // Wait up to 15s for auth readiness
      } catch (error) {
        // If we connected without needing auth, that's fine
        if (!this.isConnected()) {
          throw new Error('Socket failed to reach authentication state');
        }
      }
    }

    // If already connected, we can't request pairing code
    if (this.isConnected()) {
      if (this.authService.isRegistered()) {
        throw new Error('Already connected and registered');
      }
    }

    logger.info({ phoneNumber }, 'Requesting pairing code...');
    const code = await this.socket.requestPairingCode(phoneNumber);
    this.state = { status: 'pairing_required', pairingCode: code };
    logger.info({ code }, 'Pairing code received');
    return code;
  }

  /**
   * Event emitter methods
   */
  on(event: string, callback: (data: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: unknown) => void): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown): void {
    this.eventListeners.get(event)?.forEach((cb) => cb(data));
  }
}

// Export class directly, no singleton
