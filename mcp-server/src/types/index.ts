/**
 * WhatsApp MCP Server - Type Definitions
 */

import type { WASocket } from '@whiskeysockets/baileys';
import type { RepositoryContainer } from '../repositories/interfaces.js';

// ============================================================================
// Connection Types
// ============================================================================

export type ConnectionStatus = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'qr_required'
  | 'pairing_required';

export interface ConnectionState {
  status: ConnectionStatus;
  qrCode?: string;
  pairingCode?: string;
  lastDisconnect?: {
    reason: string;
    code: number;
  };
}

export interface SessionInfo {
  id: string;
  name?: string;
  phoneNumber?: string;
  platform?: string;
}

// ============================================================================
// Message Types
// ============================================================================

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'sticker';

export interface SendTextInput {
  jid: string;
  text: string;
  quotedMessageId?: string;
}

export interface SendMediaInput {
  jid: string;
  mediaType: MediaType;
  url: string;
  caption?: string;
  filename?: string;
  mimetype?: string;
}

export interface SendReactionInput {
  jid: string;
  messageId: string;
  emoji: string;
}

export interface MessageKey {
  remoteJid: string;
  id: string;
  fromMe?: boolean;
  participant?: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId: string;
  timestamp: number;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface ChatInfo {
  jid: string;
  name: string;
  unreadCount: number;
  lastMessage?: string;
  timestamp: number;
  isGroup: boolean;
  archived: boolean;
  muted: boolean;
}

// ============================================================================
// Contact Types
// ============================================================================

export interface ContactInfo {
  jid: string;
  name?: string;
  notify?: string;
  status?: string;
  imgUrl?: string;
}

export interface NumberCheckResult {
  exists: boolean;
  jid?: string;
}

// ============================================================================
// Group Types
// ============================================================================

export type ParticipantAction = 'add' | 'remove' | 'promote' | 'demote';

export interface GroupParticipant {
  jid: string;
  admin?: 'admin' | 'superadmin' | null;
}

export interface GroupInfo {
  jid: string;
  subject: string;
  owner?: string;
  creation?: number;
  description?: string;
  participants: GroupParticipant[];
  ephemeralDuration?: number;
  restrict?: boolean;
  announce?: boolean;
}

export interface CreateGroupInput {
  subject: string;
  participants: string[];
}

export interface GroupParticipantsInput {
  groupJid: string;
  participants: string[];
  action: ParticipantAction;
}

export interface GroupSettingsInput {
  groupJid: string;
  subject?: string;
  description?: string;
  ephemeral?: number;
}

// ============================================================================
// Webhook Types
// ============================================================================

export type WebhookEvent =
  | 'message.received'
  | 'message.sent'
  | 'message.update'
  | 'connection.update'
  | 'group.update'
  | 'presence.update'
  | '*'; // Wildcard for all events

export interface WebhookConfig {
  url: string;
  events: WebhookEvent[];
  secret?: string;
  enabled: boolean;
}

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: number;
  data: unknown;
  signature?: string;
}

// ============================================================================
// Service Interfaces
// ============================================================================

export interface IConnectionService {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getSocket(): WASocket | null;
  isConnected(): boolean;
  getState(): ConnectionState;
  getSessionInfo(): SessionInfo | null;
  requestPairingCode(phoneNumber: string): Promise<string>;
  waitForQR(timeoutMs?: number): Promise<string>;
  on(event: string, callback: (data: unknown) => void): void;
  off(event: string, callback: (data: unknown) => void): void;
}

export interface IMessageService {
  sendText(input: SendTextInput): Promise<SendMessageResult>;
  sendMedia(input: SendMediaInput): Promise<SendMessageResult>;
  sendReaction(input: SendReactionInput): Promise<SendMessageResult>;
  readMessages(keys: MessageKey[]): Promise<void>;
  deleteMessage(jid: string, messageId: string): Promise<void>;
}

export interface IGroupService {
  createGroup(input: CreateGroupInput): Promise<GroupInfo>;
  updateParticipants(input: GroupParticipantsInput): Promise<void>;
  updateSettings(input: GroupSettingsInput): Promise<void>;
  getMetadata(groupJid: string): Promise<GroupInfo>;
  leave(groupJid: string): Promise<void>;
  getInviteCode(groupJid: string): Promise<string | null>;
  joinViaInvite(code: string): Promise<string>;
  getAllGroups(): Promise<GroupInfo[]>;
}

export interface IContactService {
  checkNumber(phoneNumber: string): Promise<NumberCheckResult>;
  getProfilePicture(jid: string, highRes?: boolean): Promise<string | null>;
  getStatus(jid: string): Promise<string | null>;
  blockUser(jid: string): Promise<void>;
  unblockUser(jid: string): Promise<void>;
  getBlockedUsers(): Promise<string[]>;
}

export interface IWebhookService {
  register(config: WebhookConfig): void;
  unregister(url: string): boolean;
  list(): WebhookConfig[];
  dispatch(event: WebhookEvent, data: unknown): Promise<void>;
  test(url: string): Promise<{ success: boolean; error?: string }>;
}

export interface IAuthService {
  /** Load or initialize authentication state */
  loadState(): Promise<unknown>;
  /** Get current auth state (throws if not loaded) */
  getState(): unknown;
  /** Check if credentials are registered with WhatsApp */
  isRegistered(): boolean;
  /** Save updated credentials */
  saveCredentials(): Promise<void>;
  /** Clear stored auth state (for logout) */
  clearState(): Promise<void>;
  /** Get the session ID (database mode only) */
  getSessionId(): string | undefined;
  /** Get the auth directory path (filesystem mode only) */
  getAuthDir(): string | undefined;
  /** Check if using database mode */
  isDatabaseMode(): boolean;
}

// ============================================================================
// Dependency Injection
// ============================================================================

export interface ServiceConfig {
  // Filesystem mode (legacy)
  authDir?: string;
  
  // Database mode (recommended)
  sessionId?: string;
  useDatabase?: boolean;
  
  logger?: unknown;
}

export interface ServiceContainer {
  connectionService: IConnectionService;
  authService: IAuthService;
  messageService: IMessageService;
  groupService: IGroupService;
  contactService: IContactService;
  webhookService: IWebhookService;
  
  // Repository layer (database mode)
  repositories?: RepositoryContainer;
}
