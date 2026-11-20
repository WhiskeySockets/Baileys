import * as http from 'http'
import type { AddressInfo } from 'net'
import { URL } from 'url'
import { WebSocketClient } from '../../../Socket/Client'
import type { SocketConfig } from '../../../Types'
import { getCodeFromWSError } from '../../../Utils/generics'

describe('WebSocketClient', () => {
	let server: http.Server | undefined

	afterEach(async () => {
		await new Promise<void>(resolve => (server ? server.close(() => resolve()) : resolve()))
		server = undefined
	})

	it('emits an error when the upgrade gets a non-101 response and the server closes the connection', async () => {
		server = http.createServer((_req, res) => {
			res.writeHead(503, { Connection: 'close' })
			res.end('Service Unavailable')
		})
		await new Promise<void>(resolve => server!.listen(0, '127.0.0.1', resolve))
		const { port } = server.address() as AddressInfo

		const client = new WebSocketClient(new URL(`ws://127.0.0.1:${port}/ws/chat`), {
			connectTimeoutMs: 20_000
		} as SocketConfig)

		const error = await new Promise<Error>((resolve, reject) => {
			const timer = setTimeout(() => reject(new Error('no error emitted, socket is stuck in CONNECTING')), 2_000)
			client.once('error', (err: Error) => {
				clearTimeout(timer)
				resolve(err)
			})
			client.connect()
		})

		expect(getCodeFromWSError(error)).toBe(503)
		expect(client.isConnecting).toBe(false)
	})
})
