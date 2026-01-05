/**
 * Auth Service
 * Manages WhatsApp authentication state with support for both
 * filesystem (legacy) and database (recommended) storage.
 * 
 * Storage modes:
 * - Filesystem: Uses Baileys' useMultiFileAuthState (backwards compatible)
 * - Database: Uses useDatabaseAuthState with repository pattern (recommended)
 */

import { useMultiFileAuthState, type AuthenticationState } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';
import { useDatabaseAuthState, clearDatabaseAuthState } from './database-auth-state.js';
import type { ICredentialsRepository } from '../repositories/interfaces.js';

const logger = createChildLogger('AuthService');

export interface AuthServiceConfig {
  // Filesystem mode (legacy)
  authDir?: string;
  
  // Database mode (recommended)
  sessionId?: string;
  credentialsRepository?: ICredentialsRepository;
}

export class AuthService {
  private config: AuthServiceConfig;
  private state: AuthenticationState | null = null;
  private saveCreds: (() => Promise<void>) | null = null;
  private useDatabase: boolean;

  constructor(config: AuthServiceConfig) {
    // Validate config - need either authDir or database config
    if (!config.authDir && !(config.sessionId && config.credentialsRepository)) {
      throw new Error(
        'AuthService requires either authDir (filesystem mode) or ' +
        'sessionId + credentialsRepository (database mode)'
      );
    }
    
    this.config = config;
    this.useDatabase = !!(config.sessionId && config.credentialsRepository);
    
    logger.info(
      { 
        mode: this.useDatabase ? 'database' : 'filesystem',
        sessionId: config.sessionId,
        authDir: config.authDir,
      }, 
      'AuthService initialized'
    );
  }

  /**
   * Load or initialize authentication state
   */
  async loadState(): Promise<AuthenticationState> {
    if (this.state) {
      return this.state;
    }

    logger.info('Loading authentication state...');

    if (this.useDatabase) {
      // Database mode
      const { state, saveCreds } = await useDatabaseAuthState(
        this.config.sessionId!,
        this.config.credentialsRepository!
      );
      this.state = state;
      this.saveCreds = saveCreds;
    } else {
      // Filesystem mode (legacy)
      const { state, saveCreds } = await useMultiFileAuthState(this.config.authDir!);
      this.state = state;
      this.saveCreds = saveCreds;
    }
    
    logger.info(
      { registered: this.state.creds.registered }, 
      'Auth state loaded'
    );
    
    return this.state;
  }

  /**
   * Get current auth state (throws if not loaded)
   */
  getState(): AuthenticationState {
    if (!this.state) {
      throw new Error('Auth state not loaded. Call loadState() first.');
    }
    return this.state;
  }

  /**
   * Check if credentials are registered with WhatsApp
   */
  isRegistered(): boolean {
    return this.state?.creds?.registered ?? false;
  }

  /**
   * Save updated credentials
   */
  async saveCredentials(): Promise<void> {
    if (this.saveCreds) {
      await this.saveCreds();
      logger.debug('Credentials saved');
    }
  }

  /**
   * Clear stored auth state (for logout)
   */
  async clearState(): Promise<void> {
    if (this.useDatabase && this.config.sessionId && this.config.credentialsRepository) {
      await clearDatabaseAuthState(
        this.config.sessionId,
        this.config.credentialsRepository
      );
    }
    
    this.state = null;
    this.saveCreds = null;
    logger.info('Auth state cleared');
  }

  /**
   * Get the session ID (database mode only)
   */
  getSessionId(): string | undefined {
    return this.config.sessionId;
  }

  /**
   * Get the auth directory path (filesystem mode only)
   */
  getAuthDir(): string | undefined {
    return this.config.authDir;
  }

  /**
   * Check if using database mode
   */
  isDatabaseMode(): boolean {
    return this.useDatabase;
  }
}

// Export class directly, no singleton
