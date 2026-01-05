/**
 * Repository Layer Exports
 * 
 * This module provides the repository pattern abstraction layer.
 * Import interfaces for type-safe dependency injection.
 * Import Prisma implementations for PostgreSQL/Supabase.
 */

// Interfaces (for dependency injection and database agnosticism)
export type {
  // Session
  ISessionRepository,
  SessionEntity,
  CreateSessionInput,
  UpdateSessionInput,
  // Credentials
  ICredentialsRepository,
  // Messages
  IMessageRepository,
  MessageEntity,
  CreateMessageInput,
  MessageQueryOptions,
  // Contacts
  IContactRepository,
  ContactEntity,
  UpsertContactInput,
  // Groups
  IGroupRepository,
  GroupCacheEntity,
  GroupParticipantData,
  UpsertGroupInput,
  // Container
  RepositoryContainer,
} from './interfaces.js';

// Prisma implementations (PostgreSQL/Supabase)
export {
  PrismaSessionRepository,
  PrismaCredentialsRepository,
  PrismaMessageRepository,
  PrismaContactRepository,
  PrismaGroupRepository,
} from './prisma/index.js';
