import type { proto } from '../../../WAProto/index.js'
import type { WAMessageUpdate } from '../../Types/Message'
import { WAMessageStubType } from '../../Types/Message'
import type { ILogger } from '../../Utils/logger'
import { invalidateRecentMessageOnUpdate, MessageRetryManager } from '../../Utils/message-retry-manager'

const noopLogger: ILogger = {
	level: 'silent',
	child: () => noopLogger,
	trace: () => {},
	debug: () => {},
	info: () => {},
	warn: () => {},
	error: () => {}
}

const buildMessage = (text: string): proto.IMessage => ({ conversation: text })

const buildUpdate = (overrides: Partial<WAMessageUpdate>): WAMessageUpdate => ({
	key: { remoteJid: 'chat@s.whatsapp.net', fromMe: true, id: 'MSG-1' },
	update: {},
	...overrides
})

describe('MessageRetryManager.removeRecentMessage', () => {
	it('removes a cached message by id so a subsequent retry lookup misses', () => {
		const manager = new MessageRetryManager(noopLogger, 5)
		const to = 'chat@s.whatsapp.net'
		const id = 'MSG-1'

		manager.addRecentMessage(to, id, buildMessage('hello'))
		expect(manager.getRecentMessage(to, id)).toBeDefined()

		manager.removeRecentMessage(id)

		expect(manager.getRecentMessage(to, id)).toBeUndefined()
	})

	it('is a no-op for unknown ids', () => {
		const manager = new MessageRetryManager(noopLogger, 5)
		expect(() => manager.removeRecentMessage('does-not-exist')).not.toThrow()
	})

	it('only removes the targeted entry and keeps unrelated cached messages intact', () => {
		const manager = new MessageRetryManager(noopLogger, 5)
		const to = 'chat@s.whatsapp.net'

		manager.addRecentMessage(to, 'A', buildMessage('a'))
		manager.addRecentMessage(to, 'B', buildMessage('b'))

		manager.removeRecentMessage('A')

		expect(manager.getRecentMessage(to, 'A')).toBeUndefined()
		expect(manager.getRecentMessage(to, 'B')).toBeDefined()
	})
})

describe('invalidateRecentMessageOnUpdate', () => {
	const to = 'chat@s.whatsapp.net'
	const id = 'MSG-1'

	let manager: MessageRetryManager

	beforeEach(() => {
		manager = new MessageRetryManager(noopLogger, 5)
		manager.addRecentMessage(to, id, buildMessage('original'))
	})

	it('drops the cache entry on a fromMe REVOKE update', () => {
		const removed = invalidateRecentMessageOnUpdate(
			manager,
			buildUpdate({ update: { messageStubType: WAMessageStubType.REVOKE } })
		)

		expect(removed).toBe(true)
		expect(manager.getRecentMessage(to, id)).toBeUndefined()
	})

	it('drops the cache entry on a fromMe edit update (update.message.editedMessage)', () => {
		const removed = invalidateRecentMessageOnUpdate(
			manager,
			buildUpdate({
				update: {
					message: {
						editedMessage: { message: { conversation: 'edited' } }
					} as proto.IMessage
				}
			})
		)

		expect(removed).toBe(true)
		expect(manager.getRecentMessage(to, id)).toBeUndefined()
	})

	it('keeps the cache entry when the update is not from us (fromMe=false)', () => {
		const removed = invalidateRecentMessageOnUpdate(
			manager,
			buildUpdate({
				key: { remoteJid: to, fromMe: false, id, participant: 'other@s.whatsapp.net' },
				update: { messageStubType: WAMessageStubType.REVOKE }
			})
		)

		expect(removed).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
	})

	it('keeps the cache entry on unrelated updates (status, receipt, etc.)', () => {
		const removed = invalidateRecentMessageOnUpdate(manager, buildUpdate({ update: { status: 3 /* SERVER_ACK */ } }))

		expect(removed).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
	})

	it('ignores updates with no key.id (defensive)', () => {
		const removed = invalidateRecentMessageOnUpdate(
			manager,
			buildUpdate({
				key: { remoteJid: to, fromMe: true, id: undefined as unknown as string },
				update: { messageStubType: WAMessageStubType.REVOKE }
			})
		)

		expect(removed).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
	})
})
