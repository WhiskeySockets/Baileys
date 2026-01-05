/**
 * Repository Interfaces
 * 
 * These interfaces define the contract for data access operations.
 * Implementations can be Prisma (PostgreSQL), MongoDB, Blob Storage, SQL Server, etc.
 * 
 * Following the Repository Pattern for database agnosticism:
 * - Business logic depends only on these interfaces
 * - Concrete implementations are injected via DI
 * - Migrating to a different database requires only new implementations
 */

import type { SessionStatus, MessageType, MessageStatus } from '../generated/prisma/index.js';

// =============================================================================
// Session Types
// =============================================================================

export interface SessionEntity {
  id: string;
  phoneNumber: string;
  jid: string | null;
  name: string | null;
  platform: string | null;
  status: SessionStatus;
  lastSeen: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionInput {
  phoneNumber: string;
  jid?: string;
  name?: string;
  platform?: string;
  status?: SessionStatus;
}

export interface UpdateSessionInput {
  jid?: string | null;
  name?: string | null;
  platform?: string | null;
  status?: SessionStatus;
  lastSeen?: Date | null;
}

// =============================================================================
// Message Types
// =============================================================================

export interface MessageEntity {
  id: string;
  sessionId: string;
  messageId: string;
  remoteJid: string;
  fromMe: boolean;
  participant: string | null;
  messageType: MessageType;
  content: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
  quotedId: string | null;
  status: MessageStatus;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMessageInput {
  sessionId: string;
  messageId: string;
  remoteJid: string;
  fromMe?: boolean;
  participant?: string;
  messageType: MessageType;
  content?: string;
  mediaUrl?: string;
  mediaType?: string;
  quotedId?: string;
  status?: MessageStatus;
  timestamp: Date;
}

export interface MessageQueryOptions {
  limit?: number;
  offset?: number;
  before?: Date;
  after?: Date;
  fromMe?: boolean;
}

// =============================================================================
// Contact Types
// =============================================================================

export interface ContactEntity {
  id: string;
  sessionId: string;
  jid: string;
  name: string | null;
  notify: string | null;
  status: string | null;
  imgUrl: string | null;
  isBlocked: boolean;
  isBusiness: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertContactInput {
  sessionId: string;
  jid: string;
  name?: string;
  notify?: string;
  status?: string;
  imgUrl?: string;
  isBlocked?: boolean;
  isBusiness?: boolean;
}

// =============================================================================
// Group Types
// =============================================================================

export interface GroupParticipantData {
  jid: string;
  admin?: 'admin' | 'superadmin' | null;
}

export interface GroupCacheEntity {
  id: string;
  sessionId: string;
  groupJid: string;
  subject: string;
  owner: string | null;
  description: string | null;
  announce: boolean;
  restrict: boolean;
  ephemeral: number | null;
  participants: GroupParticipantData[];
  creation: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertGroupInput {
  sessionId: string;
  groupJid: string;
  subject: string;
  owner?: string;
  description?: string;
  announce?: boolean;
  restrict?: boolean;
  ephemeral?: number;
  participants?: GroupParticipantData[];
  creation?: Date;
}

// =============================================================================
// Repository Interfaces
// =============================================================================

/**
 * Session Repository Interface
 * Manages WhatsApp session lifecycle
 */
export interface ISessionRepository {
  findById(id: string): Promise<SessionEntity | null>;
  findByPhoneNumber(phoneNumber: string): Promise<SessionEntity | null>;
  create(data: CreateSessionInput): Promise<SessionEntity>;
  update(id: string, data: UpdateSessionInput): Promise<SessionEntity>;
  delete(id: string): Promise<void>;
  updateStatus(id: string, status: SessionStatus): Promise<void>;
  updateLastSeen(id: string): Promise<void>;
  findAll(): Promise<SessionEntity[]>;
}

/**
 * Credentials Repository Interface
 * Manages Baileys authentication state (replaces useMultiFileAuthState)
 */
export interface ICredentialsRepository {
  get(sessionId: string, category: string, key: string): Promise<unknown | null>;
  set(sessionId: string, category: string, key: string, data: unknown): Promise<void>;
  delete(sessionId: string, category: string, key: string): Promise<void>;
  deleteAll(sessionId: string): Promise<void>;
  getAllByCategory(sessionId: string, category: string): Promise<Record<string, unknown>>;
}

/**
 * Message Repository Interface
 * Manages message history and persistence
 */
export interface IMessageRepository {
  save(message: CreateMessageInput): Promise<MessageEntity>;
  findBySession(sessionId: string, options?: MessageQueryOptions): Promise<MessageEntity[]>;
  findByJid(sessionId: string, jid: string, options?: MessageQueryOptions): Promise<MessageEntity[]>;
  findByMessageId(sessionId: string, messageId: string): Promise<MessageEntity | null>;
  updateStatus(sessionId: string, messageId: string, status: MessageStatus): Promise<void>;
  delete(sessionId: string, messageId: string): Promise<void>;
  deleteBySession(sessionId: string): Promise<void>;
}

/**
 * Contact Repository Interface
 * Manages contact cache
 */
export interface IContactRepository {
  upsert(contact: UpsertContactInput): Promise<ContactEntity>;
  findByJid(sessionId: string, jid: string): Promise<ContactEntity | null>;
  findBySession(sessionId: string): Promise<ContactEntity[]>;
  delete(sessionId: string, jid: string): Promise<void>;
  deleteBySession(sessionId: string): Promise<void>;
}

/**
 * Group Repository Interface
 * Manages group metadata cache
 */
export interface IGroupRepository {
  upsert(group: UpsertGroupInput): Promise<GroupCacheEntity>;
  findByJid(sessionId: string, groupJid: string): Promise<GroupCacheEntity | null>;
  findBySession(sessionId: string): Promise<GroupCacheEntity[]>;
  delete(sessionId: string, groupJid: string): Promise<void>;
  deleteBySession(sessionId: string): Promise<void>;
}

// =============================================================================
// Repository Container
// =============================================================================

/**
 * Container for all repositories
 * Used for dependency injection
 */
export interface RepositoryContainer {
  sessions: ISessionRepository;
  credentials: ICredentialsRepository;
  messages: IMessageRepository;
  contacts: IContactRepository;
  groups: IGroupRepository;
}
