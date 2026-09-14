import { jest } from '@jest/globals'
import type { proto } from '../../../WAProto/index.js'
import type { AnyMessageContent } from '../../Types/Message'
import type { ILogger } from '../../Utils/logger'
import {
	invalidateRecentMessageForContent,
	MessageRetryCoordinator,
	MessageRetryManager,
	withMessageRetryInvalidation
} from '../../Utils/message-retry-manager'

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

describe('MessageRetryManager.removeRecentMessage', () => {
	it('removes a cached message by destination and id', () => {
		const manager = new MessageRetryManager(noopLogger, 5)
		const to = 'chat@s.whatsapp.net'
		const id = 'MSG-1'

		manager.addRecentMessage(to, id, buildMessage('hello'))

		expect(manager.removeRecentMessage(to, id)).toBe(true)
		expect(manager.getRecentMessage(to, id)).toBeUndefined()
	})

	it('is a no-op for an unknown destination and id', () => {
		const manager = new MessageRetryManager(noopLogger, 5)

		expect(manager.removeRecentMessage('chat@s.whatsapp.net', 'does-not-exist')).toBe(false)
	})

	it('does not remove the same custom id from another chat', () => {
		const manager = new MessageRetryManager(noopLogger, 5)
		const id = 'CUSTOM-ID'

		manager.addRecentMessage('first@s.whatsapp.net', id, buildMessage('first'))
		manager.addRecentMessage('second@s.whatsapp.net', id, buildMessage('second'))

		expect(manager.removeRecentMessage('first@s.whatsapp.net', id)).toBe(true)
		expect(manager.getRecentMessage('first@s.whatsapp.net', id)).toBeUndefined()
		expect(manager.getRecentMessage('second@s.whatsapp.net', id)).toBeDefined()
	})

	it.each([
		['successful', (manager: MessageRetryManager, id: string, to: string) => manager.markRetrySuccess(id, to)],
		['failed', (manager: MessageRetryManager, id: string, to: string) => manager.markRetryFailed(id, to)]
	])('cleans up only the retried destination after a %s retry when custom ids collide', (_status, markRetry) => {
		const manager = new MessageRetryManager(noopLogger, 5)
		const id = 'CUSTOM-ID'

		manager.addRecentMessage('first@s.whatsapp.net', id, buildMessage('first'))
		manager.addRecentMessage('second@s.whatsapp.net', id, buildMessage('second'))

		markRetry(manager, id, 'first@s.whatsapp.net')

		expect(manager.getRecentMessage('first@s.whatsapp.net', id)).toBeUndefined()
		expect(manager.getRecentMessage('second@s.whatsapp.net', id)).toBeDefined()
	})
})

describe('MessageRetryManager retry bookkeeping', () => {
	it('tracks retry limits independently for the same custom id in different destinations', () => {
		const manager = new MessageRetryManager(noopLogger, 2)
		const id = 'CUSTOM-ID'
		const first = 'first@s.whatsapp.net'
		const second = 'second@s.whatsapp.net'

		expect(manager.incrementRetryCount(id, first)).toBe(1)
		expect(manager.incrementRetryCount(id, first)).toBe(2)

		expect(manager.hasExceededMaxRetries(id, first)).toBe(true)
		expect(manager.hasExceededMaxRetries(id, second)).toBe(false)
	})

	it('clears only the completed destination retry count', () => {
		const manager = new MessageRetryManager(noopLogger, 2)
		const id = 'CUSTOM-ID'
		const first = 'first@s.whatsapp.net'
		const second = 'second@s.whatsapp.net'

		manager.incrementRetryCount(id, first)
		manager.incrementRetryCount(id, second)
		manager.markRetrySuccess(id, first)

		expect(manager.getRetryCount(id, first)).toBe(0)
		expect(manager.getRetryCount(id, second)).toBe(1)
	})

	it('clears only the failed destination retry count', () => {
		const manager = new MessageRetryManager(noopLogger, 2)
		const id = 'CUSTOM-ID'
		const first = 'first@s.whatsapp.net'
		const second = 'second@s.whatsapp.net'

		manager.incrementRetryCount(id, first)
		manager.incrementRetryCount(id, second)
		manager.markRetryFailed(id, first)

		expect(manager.getRetryCount(id, first)).toBe(0)
		expect(manager.getRetryCount(id, second)).toBe(1)
	})

	it('cancels only the completed destination phone request', () => {
		jest.useFakeTimers()
		const manager = new MessageRetryManager(noopLogger, 2)
		const id = 'CUSTOM-ID'
		const firstCallback = jest.fn()
		const secondCallback = jest.fn()

		manager.schedulePhoneRequest(id, firstCallback, 10, 'first@s.whatsapp.net')
		manager.schedulePhoneRequest(id, secondCallback, 10, 'second@s.whatsapp.net')
		manager.markRetrySuccess(id, 'first@s.whatsapp.net')
		jest.advanceTimersByTime(10)

		expect(firstCallback).not.toHaveBeenCalled()
		expect(secondCallback).toHaveBeenCalledTimes(1)
		manager.clear()
		jest.useRealTimers()
	})

	it('cancels destination-scoped phone requests when cleared', () => {
		jest.useFakeTimers()
		const manager = new MessageRetryManager(noopLogger, 2)
		const firstCallback = jest.fn()
		const secondCallback = jest.fn()

		manager.schedulePhoneRequest('CUSTOM-ID', firstCallback, 10, 'first@s.whatsapp.net')
		manager.schedulePhoneRequest('CUSTOM-ID', secondCallback, 10, 'second@s.whatsapp.net')
		manager.clear()
		jest.advanceTimersByTime(10)

		expect(firstCallback).not.toHaveBeenCalled()
		expect(secondCallback).not.toHaveBeenCalled()
		jest.useRealTimers()
	})
})

describe('invalidateRecentMessageForContent', () => {
	const to = 'chat@s.whatsapp.net'
	const id = 'MSG-1'

	let coordinator: MessageRetryCoordinator
	let manager: MessageRetryManager

	beforeEach(() => {
		coordinator = new MessageRetryCoordinator()
		manager = new MessageRetryManager(noopLogger, 5, coordinator)
		manager.addRecentMessage(to, id, buildMessage('original'))
	})

	it.each([
		['edit', { text: 'edited', edit: { remoteJid: to, fromMe: true, id } }],
		['revoke', { delete: { remoteJid: to, fromMe: true, id } }]
	] as const)('drops the original cache entry for local %s content', (_name, content) => {
		expect(invalidateRecentMessageForContent(manager, content as AnyMessageContent)).toBe(true)
		expect(manager.getRecentMessage(to, id)).toBeUndefined()
	})

	it('keeps the cache entry for ordinary content', () => {
		expect(invalidateRecentMessageForContent(manager, { text: 'ordinary' })).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
	})

	it('keeps the cache entry when the target key is incomplete', () => {
		const content = { text: 'edited', edit: { remoteJid: to, fromMe: true } } as AnyMessageContent

		expect(invalidateRecentMessageForContent(manager, content)).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
	})

	it('does not invalidate an outgoing cache entry for an admin revoke of another participant message', () => {
		const content = { delete: { remoteJid: to, fromMe: false, id } } as AnyMessageContent

		expect(invalidateRecentMessageForContent(manager, content)).toBe(false)
		expect(manager.getRecentMessage(to, id)).toBeDefined()
		expect(manager.isRecentMessageInvalidated(to, id)).toBe(false)
	})

	it('keeps an edited message invalidated when the exact key is reused', () => {
		const content = { text: 'edited', edit: { remoteJid: to, fromMe: true, id } } as AnyMessageContent

		expect(invalidateRecentMessageForContent(manager, content)).toBe(true)
		expect(manager.isRecentMessageInvalidated(to, id)).toBe(true)

		manager.addRecentMessage(to, id, buildMessage('replacement'))

		expect(manager.isRecentMessageInvalidated(to, id)).toBe(true)
	})

	it('serializes an in-flight retry before the final edit and invalidation', async () => {
		const events: string[] = []
		let releaseRetry!: () => void
		const retryGate = new Promise<void>(resolve => {
			releaseRetry = resolve
		})
		const content = { text: 'edited', edit: { remoteJid: to, fromMe: true, id } } as AnyMessageContent

		const retry = coordinator.withMessageLock(to, id, async () => {
			events.push('retry-start')
			await retryGate
			events.push('retry-end')
		})
		await Promise.resolve()

		const edit = withMessageRetryInvalidation(coordinator, manager, content, async () => {
			events.push('edit-relay')
		})
		await Promise.resolve()
		expect(events).toEqual(['retry-start'])

		releaseRetry()
		await Promise.all([retry, edit])

		expect(events).toEqual(['retry-start', 'retry-end', 'edit-relay'])
		expect(manager.isRecentMessageInvalidated(to, id)).toBe(true)
	})

	it('suppresses a retry that reaches the lock after a successful edit', async () => {
		let releaseEdit!: () => void
		const editGate = new Promise<void>(resolve => {
			releaseEdit = resolve
		})
		const content = { text: 'edited', edit: { remoteJid: to, fromMe: true, id } } as AnyMessageContent
		let retryRelayCount = 0

		const edit = withMessageRetryInvalidation(coordinator, manager, content, async () => editGate)
		await Promise.resolve()
		const retry = coordinator.withMessageLock(to, id, async () => {
			if (!manager.isRecentMessageInvalidated(to, id)) {
				retryRelayCount++
			}
		})

		releaseEdit()
		await Promise.all([edit, retry])

		expect(retryRelayCount).toBe(0)
	})

	it('does not invalidate when the edit relay fails', async () => {
		const content = { text: 'edited', edit: { remoteJid: to, fromMe: true, id } } as AnyMessageContent

		await expect(
			withMessageRetryInvalidation(coordinator, manager, content, async () => {
				throw new Error('relay failed')
			})
		).rejects.toThrow('relay failed')
		expect(manager.getRecentMessage(to, id)).toBeDefined()
		expect(manager.isRecentMessageInvalidated(to, id)).toBe(false)
	})
})

describe('MessageRetryCoordinator', () => {
	it('holds every requested message lock for the duration of a batch', async () => {
		const coordinator = new MessageRetryCoordinator()
		let enterBatch!: () => void
		const batchEntered = new Promise<void>(resolve => {
			enterBatch = resolve
		})
		let releaseBatch!: () => void
		const batchGate = new Promise<void>(resolve => {
			releaseBatch = resolve
		})
		const acquired: string[] = []

		const batch = coordinator.withMessageLocks('target@s.whatsapp.net', ['B', 'A', 'A'], async () => {
			enterBatch()
			await batchGate
		})
		await batchEntered

		const first = coordinator.withMessageLock('target@s.whatsapp.net', 'A', () => acquired.push('A'))
		const second = coordinator.withMessageLock('target@s.whatsapp.net', 'B', () => acquired.push('B'))
		await Promise.resolve()
		expect(acquired).toEqual([])

		releaseBatch()
		await Promise.all([batch, first, second])
		expect(acquired.sort()).toEqual(['A', 'B'])
	})

	it('cancels a prepared retry even after its bounded invalidation marker is evicted', () => {
		const coordinator = new MessageRetryCoordinator()
		const retry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')

		coordinator.invalidateMessage('target@s.whatsapp.net', 'TARGET')
		for (let index = 0; coordinator.isMessageInvalidated('target@s.whatsapp.net', 'TARGET'); index++) {
			if (index >= 10_000) throw new Error('invalidation marker was not bounded')
			coordinator.invalidateMessage(`other-${index}@s.whatsapp.net`, `OTHER-${index}`)
		}

		expect(coordinator.isMessageInvalidated('target@s.whatsapp.net', 'TARGET')).toBe(false)
		expect(retry.isCancelled()).toBe(true)
		retry.finish()
	})

	it('keeps a prepared retry cancelled when the exact key is cached again', () => {
		const coordinator = new MessageRetryCoordinator()
		const manager = new MessageRetryManager(noopLogger, 5, coordinator)
		const retry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')

		coordinator.invalidateMessage('target@s.whatsapp.net', 'TARGET')
		manager.addRecentMessage('target@s.whatsapp.net', 'TARGET', buildMessage('replacement'))

		expect(coordinator.isMessageInvalidated('target@s.whatsapp.net', 'TARGET')).toBe(true)
		expect(retry.isCancelled()).toBe(true)
		retry.finish()
	})

	it('cancels active prepared retries when cleared', () => {
		const coordinator = new MessageRetryCoordinator()
		const retry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')

		coordinator.clear()

		expect(retry.isCancelled()).toBe(true)
		retry.finish()
	})

	it('does not let an old retry finish remove a newer retry set after clear', () => {
		const coordinator = new MessageRetryCoordinator()
		const oldRetry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')
		coordinator.clear()
		const newRetry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')

		oldRetry.finish()
		coordinator.invalidateMessage('target@s.whatsapp.net', 'TARGET')

		expect(newRetry.isCancelled()).toBe(true)
		newRetry.finish()
	})

	it('coordinates a prepared retry without a recent-message payload cache', async () => {
		const coordinator = new MessageRetryCoordinator()
		const retry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')
		const content = {
			text: 'edited',
			edit: { remoteJid: 'target@s.whatsapp.net', fromMe: true, id: 'TARGET' }
		} as AnyMessageContent

		await withMessageRetryInvalidation(coordinator, null, content, async () => {})

		expect(retry.isCancelled()).toBe(true)
		retry.finish()
	})

	it('keeps a prepared retry valid when an edit relay fails without a recent-message payload cache', async () => {
		const coordinator = new MessageRetryCoordinator()
		const retry = coordinator.prepareRetry('target@s.whatsapp.net', 'TARGET')
		const content = {
			text: 'edited',
			edit: { remoteJid: 'target@s.whatsapp.net', fromMe: true, id: 'TARGET' }
		} as AnyMessageContent

		await expect(
			withMessageRetryInvalidation(coordinator, null, content, async () => {
				throw new Error('relay failed')
			})
		).rejects.toThrow('relay failed')

		expect(retry.isCancelled()).toBe(false)
		retry.finish()
	})
})
