import type { proto } from '../../../WAProto/index.js'
import type { ILogger } from '../../Utils/logger'
import { MessageRetryManager } from '../../Utils/message-retry-manager'

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
