/**
 * Contact Service
 * Handles contact-related operations
 */

import type { WASocket } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';
import { type ConnectionService } from './connection.service.js';
import type { IContactService, NumberCheckResult } from '../types/index.js';

const logger = createChildLogger('ContactService');

export class ContactService implements IContactService {
  private connectionService: ConnectionService;

  constructor(connectionService: ConnectionService) {
    this.connectionService = connectionService;
  }
// ... methods remain same

// Export class directly, no singleton

  /**
   * Get socket or throw if not connected
   */
  private getSocket(): WASocket {
    const socket = this.connectionService.getSocket();
    if (!socket || !this.connectionService.isConnected()) {
      throw new Error('NOT_CONNECTED: WhatsApp is not connected');
    }
    return socket;
  }

  /**
   * Convert phone number to JID format
   */
  private phoneToJid(phoneNumber: string): string {
    // Remove all non-numeric characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    // Remove leading + if present
    const number = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
    return `${number}@s.whatsapp.net`;
  }

  /**
   * Check if a phone number is registered on WhatsApp
   */
  async checkNumber(phoneNumber: string): Promise<NumberCheckResult> {
    const socket = this.getSocket();
    const jid = this.phoneToJid(phoneNumber);
    
    logger.debug({ phoneNumber, jid }, 'Checking if number exists on WhatsApp');

    try {
      const results = await socket.onWhatsApp(jid);
      const result = results?.[0];
      
      if (result?.exists) {
        logger.info({ phoneNumber, jid: result.jid }, 'Number exists on WhatsApp');
        return { exists: true, jid: result.jid };
      } else {
        logger.info({ phoneNumber }, 'Number does not exist on WhatsApp');
        return { exists: false };
      }
    } catch (error) {
      logger.error({ error, phoneNumber }, 'Error checking number');
      throw error;
    }
  }

  /**
   * Get profile picture URL
   */
  async getProfilePicture(jid: string, highRes = false): Promise<string | null> {
    const socket = this.getSocket();
    logger.debug({ jid, highRes }, 'Fetching profile picture');

    try {
      const url = await socket.profilePictureUrl(jid, highRes ? 'image' : 'preview');
      logger.info({ jid, hasUrl: !!url }, 'Profile picture fetched');
      return url ?? null;
    } catch (error: unknown) {
      // 404 means no profile picture set
      if ((error as { output?: { statusCode?: number } })?.output?.statusCode === 404) {
        logger.debug({ jid }, 'No profile picture set');
        return null;
      }
      throw error;
    }
  }

  /**
   * Get user's status/about text
   */
  async getStatus(jid: string): Promise<string | null> {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Fetching user status');

    try {
      const result = await socket.fetchStatus(jid);
      const statusObj = result?.[0];
      const status = typeof statusObj?.status === 'string' ? statusObj.status : null;
      logger.info({ jid, hasStatus: !!status }, 'Status fetched');
      return status;
    } catch (error) {
      logger.error({ error, jid }, 'Error fetching status');
      throw error;
    }
  }

  /**
   * Get business profile (if applicable)
   */
  async getBusinessProfile(jid: string) {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Fetching business profile');

    try {
      const profile = await socket.getBusinessProfile(jid);
      logger.info({ jid, hasProfile: !!profile }, 'Business profile fetched');
      return profile;
    } catch (error) {
      logger.error({ error, jid }, 'Error fetching business profile');
      throw error;
    }
  }

  /**
   * Block a user
   */
  async blockUser(jid: string): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Blocking user');

    await socket.updateBlockStatus(jid, 'block');

    logger.info({ jid }, 'User blocked');
  }

  /**
   * Unblock a user
   */
  async unblockUser(jid: string): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ jid }, 'Unblocking user');

    await socket.updateBlockStatus(jid, 'unblock');

    logger.info({ jid }, 'User unblocked');
  }

  /**
   * Get blocked users list
   */
  async getBlockedUsers(): Promise<string[]> {
    const socket = this.getSocket();
    logger.debug('Fetching blocked users');

    const blocklist = await socket.fetchBlocklist();

    logger.info({ count: blocklist.length }, 'Blocked users fetched');

    return blocklist.filter((jid): jid is string => jid !== undefined);
  }
}

// Export class directly, no singleton
