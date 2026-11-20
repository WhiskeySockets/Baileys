import { jest } from '@jest/globals'
import P from 'pino'
import {
	handleServerEncryptNotification,
	type ServerEncryptNotificationContext
} from '../../Utils/server-encrypt-notification'
import { type BinaryNode, S_WHATSAPP_NET } from '../../WABinary'

const logger = P({ level: 'silent' })

describe('Server encrypt notification handling', () => {
	let mockQuery: jest.Mock<(node: BinaryNode) => Promise<unknown>>
	let mockUploadPreKeys: jest.Mock<() => Promise<void>>
	let inFlightPreKeyLow: Set<string>

	function createNode(child: BinaryNode, id = 'stanza-1'): BinaryNode {
		return {
			tag: 'notification',
			attrs: { from: S_WHATSAPP_NET, type: 'encrypt', id },
			content: [child]
		}
	}

	function createContext(): ServerEncryptNotificationContext {
		return { query: mockQuery, uploadPreKeys: mockUploadPreKeys, inFlightPreKeyLow, logger }
	}

	beforeEach(() => {
		mockQuery = jest.fn()
		mockUploadPreKeys = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
		inFlightPreKeyLow = new Set()
	})

	it('uploads pre-keys when the count is low', async () => {
		const result = await handleServerEncryptNotification(
			createNode({ tag: 'count', attrs: { value: '2' } }),
			createContext()
		)

		expect(result).toEqual({ action: 'prekey_count', count: 2, uploaded: true })
		expect(mockUploadPreKeys).toHaveBeenCalledTimes(1)
		expect(inFlightPreKeyLow.size).toBe(0)
	})

	it('does not upload when the count is enough', async () => {
		const result = await handleServerEncryptNotification(
			createNode({ tag: 'count', attrs: { value: '50' } }),
			createContext()
		)

		expect(result).toEqual({ action: 'prekey_count', count: 50, uploaded: false })
		expect(mockUploadPreKeys).not.toHaveBeenCalled()
	})

	it('skips a notification already being handled', async () => {
		inFlightPreKeyLow.add('stanza-1')

		const result = await handleServerEncryptNotification(
			createNode({ tag: 'count', attrs: { value: '0' } }),
			createContext()
		)

		expect(result).toEqual({ action: 'in_flight' })
		expect(mockUploadPreKeys).not.toHaveBeenCalled()
	})

	it('checks the key bundle digest without uploading when the server has it', async () => {
		mockQuery.mockResolvedValue({ tag: 'iq', attrs: { type: 'result' } })

		const result = await handleServerEncryptNotification(createNode({ tag: 'digest', attrs: {} }), createContext())

		expect(result).toEqual({ action: 'digest_ok' })
		expect(mockQuery).toHaveBeenCalledWith({
			tag: 'iq',
			attrs: { xmlns: 'encrypt', type: 'get', to: S_WHATSAPP_NET },
			content: [{ tag: 'digest', attrs: {} }]
		})
		expect(mockUploadPreKeys).not.toHaveBeenCalled()
	})

	it('uploads pre-keys when the server has no key bundle (digest 404)', async () => {
		mockQuery.mockRejectedValue(Object.assign(new Error('item-not-found'), { data: 404 }))

		const result = await handleServerEncryptNotification(createNode({ tag: 'digest', attrs: {} }), createContext())

		expect(result).toEqual({ action: 'digest_missing_uploaded' })
		expect(mockUploadPreKeys).toHaveBeenCalledTimes(1)
	})

	it('only logs other digest errors', async () => {
		mockQuery.mockRejectedValue(Object.assign(new Error('service-unavailable'), { data: 503 }))

		const result = await handleServerEncryptNotification(createNode({ tag: 'digest', attrs: {} }), createContext())

		expect(result).toEqual({ action: 'digest_failed', code: 503 })
		expect(mockUploadPreKeys).not.toHaveBeenCalled()
	})

	it('ignores the post-quantum pre-key count instead of crashing', async () => {
		const result = await handleServerEncryptNotification(
			createNode({ tag: 'pq_count', attrs: { value: '3' } }),
			createContext()
		)

		expect(result).toEqual({ action: 'pq_count_ignored' })
		expect(mockQuery).not.toHaveBeenCalled()
		expect(mockUploadPreKeys).not.toHaveBeenCalled()
	})

	it('does not crash on an unknown child', async () => {
		const result = await handleServerEncryptNotification(createNode({ tag: 'other', attrs: {} }), createContext())

		expect(result).toEqual({ action: 'unknown' })
	})
})
