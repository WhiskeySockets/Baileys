/**
 * Auth Service
 * Manages WhatsApp authentication state using Baileys' useMultiFileAuthState
 */

import { useMultiFileAuthState, type AuthenticationState } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('AuthService');

export interface AuthServiceConfig {
  authDir: string; // Required for multi-tenancy
}

export class AuthService {
  private authDir: string;
  private state: AuthenticationState | null = null;
  private saveCreds: (() => Promise<void>) | null = null;

  constructor(config: AuthServiceConfig) {
    if (!config.authDir) {
      throw new Error('authDir is required for multi-tenancy isolation');
    }
    this.authDir = config.authDir;
    logger.info({ authDir: this.authDir }, 'AuthService initialized');
  }

  /**
   * Load or initialize authentication state
   */
  async loadState(): Promise<AuthenticationState> {
    if (this.state) {
      return this.state;
    }

    logger.info('Loading authentication state...');
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
    
    this.state = state;
    this.saveCreds = saveCreds;
    
    logger.info({ registered: state.creds.registered }, 'Auth state loaded');
    return state;
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
    this.state = null;
    this.saveCreds = null;
    logger.info('Auth state cleared');
  }

  /**
   * Get the auth directory path
   */
  getAuthDir(): string {
    return this.authDir;
  }
}

// Export class directly, no singleton
