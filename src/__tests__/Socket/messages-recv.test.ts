import { jest } from '@jest/globals'
import { DEFAULT_CONNECTION_CONFIG } from '../../Defaults'
import type { AuthenticationState } from '../../Types'
import { type BinaryNode } from '../../WABinary'

type WsListener = (node: BinaryNode) => unknown

const sendNode = jest.fn(async () => undefined)
const authState = {
	creds: {},
	keys: {
		get: jest.fn(async () => ({})),
		set: jest.fn(async () => undefined)
	}
}

jest.unstable_mockModule('../../Socket/messages-send', () => ({
	makeMessagesSocket: jest.fn(() => ({
		authState,
		sendNode,
		ws: {
			on: jest.fn()
		},
		ev: {
			on: jest.fn()
		},
		registerSocketEndHandler: jest.fn(),
		signalRepository: {
			lidMapping: {
				getLIDForPN: jest.fn()
			}
		}
	}))
}))

const { makeMessagesRecvSocket } = await import('../../Socket/messages-recv')

describe('sendMessageAck', () => {
	it('acknowledges notifications before credentials identify the device', async () => {
		const sock = makeMessagesRecvSocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: authState as unknown as AuthenticationState
		})
		const node: BinaryNode = {
			tag: 'notification',
			attrs: {
				id: 'pre-login-notification',
				from: 's.whatsapp.net',
				type: 'companion_reg_refresh'
			}
		}

		await expect(sock.sendMessageAck(node)).resolves.toBeUndefined()
		expect(sendNode).toHaveBeenCalledWith({
			tag: 'ack',
			attrs: {
				id: 'pre-login-notification',
				to: 's.whatsapp.net',
				class: 'notification',
				type: 'companion_reg_refresh'
			}
		})
	})
})

describe('status stanza handling', () => {
	const getStatusHandler = (sock: ReturnType<typeof makeMessagesRecvSocket>) => {
		const on = sock.ws.on as unknown as jest.Mock
		const call = on.mock.calls.find(([event]) => event === 'CB:status')
		expect(call).toBeDefined()
		return call![1] as WsListener
	}

	it('acks a top-level status stanza', async () => {
		sendNode.mockClear()
		const sock = makeMessagesRecvSocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: authState as unknown as AuthenticationState
		})
		const node: BinaryNode = {
			tag: 'status',
			attrs: { id: 'status-id', from: '1234567890@s.whatsapp.net', type: 'media' }
		}

		await getStatusHandler(sock)(node)

		expect(sendNode).toHaveBeenCalledWith({
			tag: 'ack',
			attrs: {
				id: 'status-id',
				to: '1234567890@s.whatsapp.net',
				class: 'status',
				type: 'media'
			}
		})
	})

	it('does not ack newsletter statuses', async () => {
		sendNode.mockClear()
		const sock = makeMessagesRecvSocket({
			...DEFAULT_CONNECTION_CONFIG,
			auth: authState as unknown as AuthenticationState
		})
		const node: BinaryNode = {
			tag: 'status',
			attrs: { id: 'status-id', from: '1234567890@newsletter', type: 'text' }
		}

		await getStatusHandler(sock)(node)

		expect(sendNode).not.toHaveBeenCalled()
	})
})
