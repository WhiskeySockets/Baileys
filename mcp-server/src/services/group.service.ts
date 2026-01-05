/**
 * Group Service
 * Handles all group operations
 */

import type { WASocket, GroupMetadata, ParticipantAction as WAParticipantAction } from '@whiskeysockets/baileys';
import { createChildLogger } from '../infrastructure/logger.js';
import { type ConnectionService } from './connection.service.js';
import type {
  IGroupService,
  CreateGroupInput,
  GroupParticipantsInput,
  GroupSettingsInput,
  GroupInfo,
  ParticipantAction,
} from '../types/index.js';

const logger = createChildLogger('GroupService');

export class GroupService implements IGroupService {
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
   * Create a new group
   */
  async createGroup(input: CreateGroupInput): Promise<GroupInfo> {
    const socket = this.getSocket();
    logger.debug({ subject: input.subject, participants: input.participants.length }, 'Creating group');

    const result = await socket.groupCreate(input.subject, input.participants);

    logger.info({ groupJid: result.id, subject: input.subject }, 'Group created');

    return this.mapGroupMetadata(result);
  }

  /**
   * Update group participants (add, remove, promote, demote)
   */
  async updateParticipants(input: GroupParticipantsInput): Promise<void> {
    const socket = this.getSocket();
    const action = this.mapParticipantAction(input.action);
    
    logger.debug({ 
      groupJid: input.groupJid, 
      action: input.action, 
      participants: input.participants.length 
    }, 'Updating group participants');

    await socket.groupParticipantsUpdate(input.groupJid, input.participants, action);

    logger.info({ 
      groupJid: input.groupJid, 
      action: input.action, 
      count: input.participants.length 
    }, 'Group participants updated');
  }

  /**
   * Map our action type to Baileys action type
   */
  private mapParticipantAction(action: ParticipantAction): WAParticipantAction {
    const actionMap: Record<ParticipantAction, WAParticipantAction> = {
      add: 'add',
      remove: 'remove',
      promote: 'promote',
      demote: 'demote',
    };
    return actionMap[action];
  }

  /**
   * Update group settings
   */
  async updateSettings(input: GroupSettingsInput): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ groupJid: input.groupJid }, 'Updating group settings');

    if (input.subject) {
      await socket.groupUpdateSubject(input.groupJid, input.subject);
      logger.debug({ groupJid: input.groupJid, subject: input.subject }, 'Subject updated');
    }

    if (input.description !== undefined) {
      await socket.groupUpdateDescription(input.groupJid, input.description);
      logger.debug({ groupJid: input.groupJid }, 'Description updated');
    }

    if (input.ephemeral !== undefined) {
      await socket.groupToggleEphemeral(input.groupJid, input.ephemeral);
      logger.debug({ groupJid: input.groupJid, ephemeral: input.ephemeral }, 'Ephemeral updated');
    }

    logger.info({ groupJid: input.groupJid }, 'Group settings updated');
  }

  /**
   * Get group metadata
   */
  async getMetadata(groupJid: string): Promise<GroupInfo> {
    const socket = this.getSocket();
    logger.debug({ groupJid }, 'Fetching group metadata');

    const metadata = await socket.groupMetadata(groupJid);

    logger.info({ groupJid, subject: metadata.subject }, 'Group metadata fetched');

    return this.mapGroupMetadata(metadata);
  }

  /**
   * Leave a group
   */
  async leave(groupJid: string): Promise<void> {
    const socket = this.getSocket();
    logger.debug({ groupJid }, 'Leaving group');

    await socket.groupLeave(groupJid);

    logger.info({ groupJid }, 'Left group');
  }

  /**
   * Get invite code for group
   */
  async getInviteCode(groupJid: string): Promise<string> {
    const socket = this.getSocket();
    logger.debug({ groupJid }, 'Getting invite code');

    const code = await socket.groupInviteCode(groupJid);

    logger.info({ groupJid }, 'Invite code retrieved');

    return code ?? '';
  }

  /**
   * Join group via invite code
   */
  async joinViaInvite(inviteCode: string): Promise<string> {
    const socket = this.getSocket();
    logger.debug('Joining group via invite code');

    const groupJid = await socket.groupAcceptInvite(inviteCode);

    logger.info({ groupJid }, 'Joined group via invite');

    return groupJid ?? '';
  }

  /**
   * Get all groups the user is participating in
   */
  async getAllGroups(): Promise<GroupInfo[]> {
    const socket = this.getSocket();
    logger.debug('Fetching all participating groups');

    const groups = await socket.groupFetchAllParticipating();

    const groupInfos = Object.values(groups).map((g) => this.mapGroupMetadata(g));

    logger.info({ count: groupInfos.length }, 'All groups fetched');

    return groupInfos;
  }

  /**
   * Map Baileys GroupMetadata to our GroupInfo
   */
  private mapGroupMetadata(metadata: GroupMetadata): GroupInfo {
    return {
      jid: metadata.id,
      subject: metadata.subject,
      owner: metadata.owner,
      creation: metadata.creation,
      description: metadata.desc,
      participants: metadata.participants.map((p) => ({
        jid: p.id,
        admin: p.admin,
      })),
      ephemeralDuration: metadata.ephemeralDuration,
      restrict: metadata.restrict,
      announce: metadata.announce,
    };
  }
}

// Export class directly, no singleton
