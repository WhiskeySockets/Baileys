import { describe, expect, it, jest } from '@jest/globals'
import { createRefreshMediaConn } from '../../Socket/messages-send'
import type { BinaryNode } from '../../WABinary'

const makeDeferred = <T>() => {
	let resolve!: (value: T) => void
	let reject!: (reason?: unknown) => void

	const promise = new Promise<T>((res, rej) => {
		resolve = res
		reject = rej
	})

	return { promise, resolve, reject }
}

const makeMediaConnResult = (hostname: string): BinaryNode =>
	({
		tag: 'iq',
		attrs: {},
		content: [
			{
				tag: 'media_conn',
				attrs: {
					auth: 'auth-token',
					ttl: '60'
				},
				content: [
					{
						tag: 'host',
						attrs: {
							hostname,
							maxContentLengthBytes: '1000'
						}
					}
				]
			}
		]
	}) as BinaryNode

describe('refreshMediaConn', () => {
	it('does not discard a successful refresh when an older concurrent refresh fails', async () => {
		const first = makeDeferred<BinaryNode>()
		const second = makeDeferred<BinaryNode>()
		const query = (jest.fn() as jest.MockedFunction<(node: BinaryNode) => Promise<BinaryNode>>)
			.mockImplementationOnce(() => first.promise)
			.mockImplementationOnce(() => second.promise)
			.mockImplementation(() => {
				throw new Error('unexpected requery')
			})

		const logger: any = {
			level: 'debug',
			trace: jest.fn(),
			debug: jest.fn(),
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			child: jest.fn()
		}
		logger.child.mockImplementation(() => logger)

		const refreshMediaConn = createRefreshMediaConn(query, logger)

		const firstCall = refreshMediaConn()
		const secondCall = refreshMediaConn()

		second.resolve(makeMediaConnResult('upload-2.whatsapp.net'))
		await expect(secondCall).resolves.toMatchObject({
			hosts: [{ hostname: 'upload-2.whatsapp.net' }]
		})

		first.reject(new Error('first refresh failed'))
		await expect(firstCall).rejects.toThrow('first refresh failed')

		const cached = await refreshMediaConn()

		expect(query).toHaveBeenCalledTimes(2)
		expect(cached.hosts[0]?.hostname).toBe('upload-2.whatsapp.net')
	})
})
