/**
 * Prisma Repository Implementations
 * 
 * These are the concrete implementations using Prisma ORM for PostgreSQL.
 * They implement the repository interfaces defined in ../interfaces.ts.
 * 
 * To migrate to a different database (MongoDB, SQL Server, etc.):
 * 1. Create a new folder (e.g., ./mongo/)
 * 2. Implement the same interfaces
 * 3. Update the dependency injection in the service container
 */

export { PrismaSessionRepository } from './session.repository.js';
export { PrismaCredentialsRepository } from './credentials.repository.js';
export { PrismaMessageRepository } from './message.repository.js';
export { PrismaContactRepository } from './contact.repository.js';
export { PrismaGroupRepository } from './group.repository.js';
