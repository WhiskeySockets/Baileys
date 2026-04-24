import { jest } from '@jest/globals'
import { proto } from '../../../WAProto/index.js'
import type { BaileysEventEmitter, ChatMutation, Contact } from '../../Types'
import { LabelAssociationType } from '../../Types/LabelAssociation'
import { processSyncAction } from '../../Utils/chat-utils'
import type { ILogger } from '../../Utils/logger'

const createMockEventEmitter = () => {
	const emittedEvents: Array<{ event: string; data: unknown }> = []
	const emit = jest.fn((event: string, data: unknown) => {
		emittedEvents.push({ event, data })
		return true
	})
	return {
		emit,
		emittedEvents,
		on: jest.fn(),
		off: jest.fn(),
		removeAllListeners: jest.fn()
	} as unknown as BaileysEventEmitter & { emittedEvents: typeof emittedEvents }
}

const createMockLogger = (): ILogger =>
	({
		warn: jest.fn(),
		info: jest.fn(),
		debug: jest.fn(),
		error: jest.fn(),
		trace: jest.fn(),
		child: jest.fn(function (this: ILogger) {
			return this
		}),
		level: 'silent'
	}) as unknown as ILogger

const createSyncAction = (
	action: proto.ISyncActionValue,
	index: string[] = ['type', 'id', 'msgId', '0']
): ChatMutation => ({
	syncAction: { value: action },
	index
})

const mockMe: Contact = { id: 'me@s.whatsapp.net', name: 'Test User' }

describe('processSyncAction', () => {
	let ev: ReturnType<typeof createMockEventEmitter>
	let logger: ILogger

	beforeEach(() => {
		jest.clearAllMocks()
		ev = createMockEventEmitter()
		logger = createMockLogger()
	})

	describe('muteAction', () => {
		it('emits chats.update with muteEndTime when muted', () => {
			const syncAction = createSyncAction({ muteAction: { muted: true, muteEndTimestamp: 1700000000 } }, [
				'mute',
				'chat123@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ id: 'chat123@s.whatsapp.net', muteEndTime: 1700000000 })])
			)
		})

		it('emits null muteEndTime when unmuted', () => {
			const syncAction = createSyncAction({ muteAction: { muted: false, muteEndTimestamp: 0 } }, [
				'mute',
				'chat123@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ muteEndTime: null })])
			)
		})
	})

	describe('archiveChatAction', () => {
		it('emits chats.update with archived true/false', () => {
			const archived = createSyncAction({ archiveChatAction: { archived: true } }, ['archive', 'chat@s.whatsapp.net'])
			processSyncAction(archived, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ archived: true })])
			)
		})

		it('handles type fallback without archiveChatAction', () => {
			const syncAction = createSyncAction({}, ['archive', 'chat@s.whatsapp.net'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ archived: true })])
			)
		})
	})

	describe('markChatAsReadAction', () => {
		it('emits unreadCount 0 when read is true', () => {
			const read = createSyncAction({ markChatAsReadAction: { read: true } }, ['markRead', 'chat@s.whatsapp.net'])
			processSyncAction(read, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ unreadCount: 0 })])
			)
		})

		it('emits unreadCount -1 when read is false', () => {
			const unread = createSyncAction({ markChatAsReadAction: { read: false } }, ['markRead', 'chat@s.whatsapp.net'])
			processSyncAction(unread, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ unreadCount: -1 })])
			)
		})

		it('emits null unreadCount during initial sync when already read', () => {
			const syncAction = createSyncAction({ markChatAsReadAction: { read: true } }, ['markRead', 'chat@s.whatsapp.net'])
			processSyncAction(syncAction, ev, mockMe, { accountSettings: { unarchiveChats: false } }, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ unreadCount: null })])
			)
		})
	})

	describe('deleteMessageForMeAction', () => {
		it('emits messages.delete with correct key', () => {
			const syncAction = createSyncAction({ deleteMessageForMeAction: { deleteMedia: false } }, [
				'deleteMessageForMe',
				'chat@s.whatsapp.net',
				'msg456',
				'1'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('messages.delete', {
				keys: [{ remoteJid: 'chat@s.whatsapp.net', id: 'msg456', fromMe: true }]
			})
		})
	})

	describe('contactAction', () => {
		it('emits contacts.upsert and lid-mapping.update for PN user with LID', () => {
			const syncAction = createSyncAction({ contactAction: { fullName: 'John', lidJid: '123@lid', pnJid: null } }, [
				'contact',
				'5511999@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('contacts.upsert', [
				{
					id: '5511999@s.whatsapp.net',
					name: 'John',
					lid: '123@lid',
					phoneNumber: '5511999@s.whatsapp.net'
				}
			])
			expect(ev.emit).toHaveBeenCalledWith('lid-mapping.update', {
				lid: '123@lid',
				pn: '5511999@s.whatsapp.net'
			})
		})

		it('does not emit events when id is missing', () => {
			const syncAction = createSyncAction({ contactAction: { fullName: 'John', lidJid: '123@lid', pnJid: null } }, [
				'contact',
				''
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emittedEvents.filter(e => e.event === 'contacts.upsert')).toHaveLength(0)
		})
	})

	describe('pushNameSetting', () => {
		it('emits creds.update when name differs', () => {
			const syncAction = createSyncAction({ pushNameSetting: { name: 'New' } }, ['pushName'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('creds.update', { me: { ...mockMe, name: 'New' } })
		})

		it('does not emit when name is same or empty', () => {
			const same = createSyncAction({ pushNameSetting: { name: 'Test User' } }, ['pushName'])
			processSyncAction(same, ev, mockMe, undefined, logger)
			expect(ev.emit).not.toHaveBeenCalled()
		})
	})

	describe('pinAction', () => {
		it('emits chats.update with pinned timestamp or null', () => {
			const syncAction: ChatMutation = {
				syncAction: { value: { pinAction: { pinned: true }, timestamp: 1700000000 } },
				index: ['pin', 'chat@s.whatsapp.net']
			}
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith(
				'chats.update',
				expect.arrayContaining([expect.objectContaining({ pinned: 1700000000 })])
			)
		})
	})

	describe('starAction', () => {
		it('emits messages.update with starred value', () => {
			const syncAction = createSyncAction({ starAction: { starred: true } }, [
				'star',
				'chat@s.whatsapp.net',
				'msg',
				'1'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('messages.update', [
				{
					key: { remoteJid: 'chat@s.whatsapp.net', id: 'msg', fromMe: true },
					update: { starred: true }
				}
			])
		})
	})

	describe('deleteChatAction', () => {
		it('emits chats.delete when not initial sync', () => {
			const syncAction = createSyncAction({ deleteChatAction: { messageRange: null } }, [
				'deleteChat',
				'chat@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('chats.delete', ['chat@s.whatsapp.net'])
		})

		it('does NOT emit during initial sync', () => {
			const syncAction = createSyncAction({ deleteChatAction: { messageRange: null } }, [
				'deleteChat',
				'chat@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, { accountSettings: { unarchiveChats: false } }, logger)
			expect(ev.emit).not.toHaveBeenCalled()
		})
	})

	describe('labelEditAction', () => {
		it('emits labels.edit', () => {
			const syncAction = createSyncAction(
				{ labelEditAction: { name: 'Important', color: 1, deleted: false, predefinedId: 5 } },
				['label', 'label123']
			)
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('labels.edit', {
				id: 'label123',
				name: 'Important',
				color: 1,
				deleted: false,
				predefinedId: '5'
			})
		})
	})

	describe('labelAssociationAction', () => {
		it('emits labels.association for chat label', () => {
			const syncAction = createSyncAction({ labelAssociationAction: { labeled: true } }, [
				LabelAssociationType.Chat,
				'label123',
				'chat@s.whatsapp.net'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('labels.association', {
				type: 'add',
				association: { type: LabelAssociationType.Chat, chatId: 'chat@s.whatsapp.net', labelId: 'label123' }
			})
		})

		it('emits labels.association for message label', () => {
			const syncAction = createSyncAction({ labelAssociationAction: { labeled: true } }, [
				LabelAssociationType.Message,
				'label123',
				'chat@s.whatsapp.net',
				'msg789'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('labels.association', {
				type: 'add',
				association: {
					type: LabelAssociationType.Message,
					chatId: 'chat@s.whatsapp.net',
					messageId: 'msg789',
					labelId: 'label123'
				}
			})
		})
	})

	describe('pnForLidChatAction', () => {
		it('emits lid-mapping.update when pnJid is present', () => {
			const syncAction = createSyncAction({ pnForLidChatAction: { pnJid: '5511999@s.whatsapp.net' } }, [
				'pnForLid',
				'123@lid'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('lid-mapping.update', { lid: '123@lid', pn: '5511999@s.whatsapp.net' })
		})

		it('does not emit when pnJid is missing', () => {
			const syncAction = createSyncAction({ pnForLidChatAction: { pnJid: '' } }, ['pnForLid', '123@lid'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).not.toHaveBeenCalled()
		})
	})

	describe('lockChatAction', () => {
		it('emits chats.lock', () => {
			const syncAction = createSyncAction({ lockChatAction: { locked: true } }, ['lockChat', 'chat@s.whatsapp.net'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('chats.lock', { id: 'chat@s.whatsapp.net', locked: true })
		})
	})

	describe('lidContactAction', () => {
		it('emits contacts.upsert with LID contact', () => {
			const syncAction = createSyncAction({ lidContactAction: { fullName: 'LID Contact' } }, ['lidContact', '123@lid'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('contacts.upsert', [
				{
					id: '123@lid',
					name: 'LID Contact',
					lid: '123@lid',
					phoneNumber: undefined
				}
			])
		})
	})

	describe('settings actions', () => {
		it('localeSetting emits settings.update', () => {
			const syncAction = createSyncAction({ localeSetting: { locale: 'en-US' } }, ['locale'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('settings.update', { setting: 'locale', value: 'en-US' })
		})

		it('unarchiveChatsSetting emits creds.update', () => {
			const syncAction = createSyncAction({ unarchiveChatsSetting: { unarchiveChats: true } }, ['unarchiveChats'])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(ev.emit).toHaveBeenCalledWith('creds.update', { accountSettings: { unarchiveChats: true } })
		})
	})

	describe('unprocessable actions', () => {
		it('logs debug for unknown action', () => {
			const syncAction = createSyncAction({ unknownAction: {} } as unknown as proto.ISyncActionValue, [
				'unknown',
				'id123'
			])
			processSyncAction(syncAction, ev, mockMe, undefined, logger)
			expect(logger.debug).toHaveBeenCalledWith({ syncAction, id: 'id123' }, 'unprocessable update')
			expect(ev.emit).not.toHaveBeenCalled()
		})
	})
})
