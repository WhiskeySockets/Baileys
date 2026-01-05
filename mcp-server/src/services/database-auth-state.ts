/**
 * Database Auth State
 * 
 * Custom Baileys AuthenticationState implementation backed by database.
 * Replaces the filesystem-based useMultiFileAuthState from Baileys.
 * 
 * This adapter connects Baileys' auth system with our repository pattern,
 * enabling session persistence in PostgreSQL (or any other database 
 * that implements ICredentialsRepository).
 */

import {
  initAuthCreds,
  BufferJSON,
  type AuthenticationCreds,
  type AuthenticationState,
  type SignalDataTypeMap,
  type SignalDataSet,
} from '@whiskeysockets/baileys';
import type { ICredentialsRepository } from '../repositories/interfaces.js';
import { createChildLogger } from '../infrastructure/logger.js';

const logger = createChildLogger('DatabaseAuthState');

// Baileys signal data categories
type SignalDataCategory = keyof SignalDataTypeMap;

/**
 * Creates a Baileys-compatible AuthenticationState backed by database storage.
 * 
 * @param sessionId - Unique session identifier (used as foreign key in credentials table)
 * @param credentialsRepository - Repository implementation for credential storage
 * @returns AuthenticationState and saveCreds function for Baileys
 * 
 * @example
 * ```typescript
 * const { state, saveCreds } = await useDatabaseAuthState(
 *   'session-123',
 *   new PrismaCredentialsRepository(prisma)
 * );
 * 
 * const socket = makeWASocket({
 *   auth: state,
 *   // ...other options
 * });
 * 
 * socket.ev.on('creds.update', saveCreds);
 * ```
 */
export async function useDatabaseAuthState(
  sessionId: string,
  credentialsRepository: ICredentialsRepository
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> {
  
  // Load or initialize credentials
  let creds: AuthenticationCreds;
  
  const storedCreds = await credentialsRepository.get(sessionId, 'creds', 'main');
  
  if (storedCreds) {
    // Parse stored credentials with BufferJSON to restore Buffer objects
    creds = JSON.parse(JSON.stringify(storedCreds), BufferJSON.reviver);
    logger.info({ sessionId, registered: creds.registered }, 'Loaded credentials from database');
  } else {
    // Initialize new credentials
    creds = initAuthCreds();
    logger.info({ sessionId }, 'Initialized new credentials');
  }

  /**
   * Save credentials to database
   */
  const saveCreds = async (): Promise<void> => {
    // Serialize with BufferJSON to properly handle Buffer objects
    const serialized = JSON.parse(JSON.stringify(creds, BufferJSON.replacer));
    await credentialsRepository.set(sessionId, 'creds', 'main', serialized);
    logger.debug({ sessionId }, 'Credentials saved to database');
  };

  /**
   * Get signal keys from database
   */
  const getKeys = async <T extends SignalDataCategory>(
    type: T,
    ids: string[]
  ): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
    const data: { [id: string]: SignalDataTypeMap[T] } = {};
    
    // Get all keys for this category
    const allKeys = await credentialsRepository.getAllByCategory(sessionId, type);
    
    for (const id of ids) {
      const value = allKeys[id];
      if (value !== undefined && value !== null) {
        // Revive Buffer objects
        data[id] = JSON.parse(JSON.stringify(value), BufferJSON.reviver);
      }
    }
    
    return data;
  };

  /**
   * Set signal keys in database
   */
  const setKeys = async (data: SignalDataSet): Promise<void> => {
    const promises: Promise<void>[] = [];
    
    for (const [category, entries] of Object.entries(data)) {
      if (!entries) continue;
      
      for (const [key, value] of Object.entries(entries)) {
        if (value !== undefined && value !== null) {
          // Serialize with BufferJSON
          const serialized = JSON.parse(JSON.stringify(value, BufferJSON.replacer));
          promises.push(
            credentialsRepository.set(sessionId, category, key, serialized)
          );
        } else {
          // Delete null/undefined values
          promises.push(
            credentialsRepository.delete(sessionId, category, key)
          );
        }
      }
    }
    
    await Promise.all(promises);
  };

  return {
    state: {
      creds,
      keys: {
        get: getKeys,
        set: setKeys,
      },
    },
    saveCreds,
  };
}

/**
 * Clear all auth state for a session
 * Use this for logout/session cleanup
 */
export async function clearDatabaseAuthState(
  sessionId: string,
  credentialsRepository: ICredentialsRepository
): Promise<void> {
  await credentialsRepository.deleteAll(sessionId);
  logger.info({ sessionId }, 'Cleared all auth state from database');
}
