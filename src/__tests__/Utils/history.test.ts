import { jest } from '@jest/globals'
import { createCipheriv, createHmac, randomBytes } from 'crypto'
import $protobuf from 'protobufjs/minimal.js'
import { deflateSync } from 'zlib'
import { proto } from '../../../WAProto/index.js'
import { hkdf, sha256 } from '../../Utils/crypto'
import { downloadGroupHistoryBundle, processHistoryMessage } from '../../Utils/history'
import { hkdfInfoKey } from '../../Utils/messages-media'

describe('processHistoryMessage', () => {
	describe('phoneNumberToLidMappings extraction', () => {
		it('should extract LID-PN mappings from history sync payload', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [],
				phoneNumberToLidMappings: [
					{ lidJid: '11111111111111@lid', pnJid: '1234567890123@s.whatsapp.net' },
					{ lidJid: '22222222222222@lid', pnJid: '9876543210987@s.whatsapp.net' }
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([
				{ lid: '11111111111111@lid', pn: '1234567890123@s.whatsapp.net' },
				{ lid: '22222222222222@lid', pn: '9876543210987@s.whatsapp.net' }
			])
		})

		it('should skip mappings with missing lidJid or pnJid', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.RECENT,
				conversations: [],
				phoneNumberToLidMappings: [
					{ lidJid: undefined, pnJid: '1234567890123@s.whatsapp.net' },
					{ lidJid: '11111111111111@lid', pnJid: undefined },
					{ lidJid: '22222222222222@lid', pnJid: '9876543210987@s.whatsapp.net' }
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([{ lid: '22222222222222@lid', pn: '9876543210987@s.whatsapp.net' }])
		})

		it('should return empty array when no mappings exist', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: []
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should process mappings regardless of sync type', () => {
			const syncTypes = [proto.HistorySync.HistorySyncType.PUSH_NAME, proto.HistorySync.HistorySyncType.ON_DEMAND]

			for (const syncType of syncTypes) {
				const historySync: proto.IHistorySync = {
					syncType,
					conversations: [],
					pushnames: [],
					phoneNumberToLidMappings: [{ lidJid: '11111111111111@lid', pnJid: '1234567890123@s.whatsapp.net' }]
				}

				const result = processHistoryMessage(historySync)

				expect(result.lidPnMappings).toEqual([{ lid: '11111111111111@lid', pn: '1234567890123@s.whatsapp.net' }])
			}
		})
	})

	describe('conversations processing', () => {
		it('should extract contacts with LID and PN from conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@s.whatsapp.net',
						name: 'Test User',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.contacts).toHaveLength(1)
			expect(result.contacts[0]).toEqual({
				id: '1234567890123@s.whatsapp.net',
				name: 'Test User',
				lid: '11111111111111@lid',
				phoneNumber: '1234567890123@s.whatsapp.net'
			})
		})
	})

	describe('LID-PN mapping extraction from conversations', () => {
		it('should extract mapping when chat.id is LID and pnJid exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1234567890123@s.whatsapp.net'
			})
		})

		it('should extract mapping when chat.id is PN and lidJid exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@s.whatsapp.net',
						lidJid: '11111111111111@lid'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1234567890123@s.whatsapp.net'
			})
		})

		it('should not extract mapping for group chats', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '123456789012345678@g.us',
						lidJid: '11111111111111@lid',
						pnJid: '1234567890123@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toEqual([])
		})

		it('should combine mappings from phoneNumberToLidMappings and conversations', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				phoneNumberToLidMappings: [{ lidJid: '11111111111111@lid', pnJid: '1111111111111@s.whatsapp.net' }],
				conversations: [
					{
						id: '22222222222222@lid',
						pnJid: '2222222222222@s.whatsapp.net'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toHaveLength(2)
			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@lid',
				pn: '1111111111111@s.whatsapp.net'
			})
			expect(result.lidPnMappings).toContainEqual({
				lid: '22222222222222@lid',
				pn: '2222222222222@s.whatsapp.net'
			})
		})

		it('should extract mapping for hosted LID users', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '11111111111111@hosted.lid',
						pnJid: '1234567890123@hosted'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@hosted.lid',
				pn: '1234567890123@hosted'
			})
		})

		it('should extract mapping for hosted PN users', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '1234567890123@hosted',
						lidJid: '11111111111111@hosted.lid'
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '11111111111111@hosted.lid',
				pn: '1234567890123@hosted'
			})
		})

		it('should extract mapping from userReceipt when pnJid is missing and chat.id is LID', () => {
			// Based on real-world case: LID chat without pnJid but userReceipt contains PN
			// See: https://github.com/WhiskeySockets/Baileys/pull/2282#issuecomment-3777941679
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						// pnJid is intentionally missing
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									messageTimestamp: 1768320044,
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net',
											receiptTimestamp: 1768320045,
											readTimestamp: 1768327083
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			expect(result.lidPnMappings).toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when pnJid already exists', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						pnJid: '5518888881234@s.whatsapp.net', // pnJid exists
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net' // different PN
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should use pnJid, not userReceipt
			expect(result.lidPnMappings).toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518888881234@s.whatsapp.net'
			})
			// Should NOT contain the userReceipt PN
			expect(result.lidPnMappings).not.toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when fromMe is false', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: false, // Not from me
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '5518999991234@s.whatsapp.net'
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should not extract mapping when fromMe is false
			expect(result.lidPnMappings).not.toContainEqual({
				lid: '211071956705386@lid',
				pn: '5518999991234@s.whatsapp.net'
			})
		})

		it('should not extract mapping from userReceipt when userJid is also a LID', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [
					{
						id: '211071956705386@lid',
						messages: [
							{
								message: {
									key: {
										remoteJid: '211071956705386@lid',
										fromMe: true,
										id: '3EB052FF8D9D00646C9994'
									},
									userReceipt: [
										{
											userJid: '152230971891797@lid' // Also a LID, not a PN
										}
									]
								}
							}
						]
					}
				]
			}

			const result = processHistoryMessage(historySync)

			// Should not create a LID->LID mapping
			expect(result.lidPnMappings).toHaveLength(0)
		})
	})

	describe('pastParticipants extraction', () => {
		it('should pass through pastParticipants from history sync payload', () => {
			const pastParticipants = [
				{
					groupJid: '123456789012345678@g.us',
					pastParticipants: [
						{ userJid: '1234567890123@s.whatsapp.net', leaveReason: 1, leaveTs: 1700000000 },
						{ userJid: '9876543210987@s.whatsapp.net', leaveReason: 2, leaveTs: 1700000001 }
					]
				}
			]

			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [],
				pastParticipants
			}

			const result = processHistoryMessage(historySync)

			expect(result.pastParticipants).toEqual(pastParticipants)
		})

		it('should return undefined pastParticipants when not present in payload', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: []
			}

			const result = processHistoryMessage(historySync)

			expect(result.pastParticipants).toBeUndefined()
		})

		it('should pass through empty pastParticipants array', () => {
			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.INITIAL_BOOTSTRAP,
				conversations: [],
				pastParticipants: []
			}

			const result = processHistoryMessage(historySync)

			expect(result.pastParticipants).toEqual([])
		})

		it('should pass through pastParticipants with multiple groups', () => {
			const pastParticipants = [
				{
					groupJid: '111111111111111111@g.us',
					pastParticipants: [{ userJid: '1111111111111@s.whatsapp.net', leaveReason: 1, leaveTs: 1700000000 }]
				},
				{
					groupJid: '222222222222222222@g.us',
					pastParticipants: [{ userJid: '2222222222222@s.whatsapp.net', leaveReason: 2, leaveTs: 1700000001 }]
				}
			]

			const historySync: proto.IHistorySync = {
				syncType: proto.HistorySync.HistorySyncType.RECENT,
				conversations: [],
				pastParticipants
			}

			const result = processHistoryMessage(historySync)

			expect(result.pastParticipants).toEqual(pastParticipants)
		})
	})
})

const buildEncryptedGroupHistory = (payload: Uint8Array, mediaKey: Uint8Array, info = 'Group History'): Buffer => {
	const expanded = hkdf(mediaKey, 112, { info })
	const iv = expanded.slice(0, 16)
	const cipherKey = expanded.slice(16, 48)
	const macKey = expanded.slice(48, 80)

	const compressed = deflateSync(payload)
	const cipher = createCipheriv('aes-256-cbc', cipherKey, iv)
	const ciphertext = Buffer.concat([cipher.update(compressed), cipher.final()])
	const mac = createHmac('sha256', macKey).update(iv).update(ciphertext).digest().subarray(0, 10)

	return Buffer.concat([ciphertext, mac])
}

describe('downloadGroupHistoryBundle', () => {
	const directPath = '/v/t62.15575-24/synthetic-group-history.enc'

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('uses raw Group History HKDF info without wrapping other media types', () => {
		expect(hkdfInfoKey('group-history')).toBe('Group History')
		expect(hkdfInfoKey('image')).toBe('WhatsApp Image Keys')
	})

	it('downloads, decrypts, inflates, and decodes WebMessageInfo entries from mmg.whatsapp.net', async () => {
		const mediaKey = randomBytes(32)
		const msg1 = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_1', fromMe: false },
			message: { conversation: 'first message' }
		}).finish()
		const msg2 = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_2', fromMe: true },
			message: { conversation: 'second message' }
		}).finish()

		const payload = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(msg1)
			.uint32((1 << 3) | 2)
			.bytes(msg2)
			.finish()
		const encrypted = buildEncryptedGroupHistory(payload, mediaKey)
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		const messages = await downloadGroupHistoryBundle({ mediaKey, directPath })

		expect(fetchSpy).toHaveBeenCalledTimes(1)
		expect(String(fetchSpy.mock.calls[0]?.[0])).toBe(`https://mmg.whatsapp.net${directPath}`)
		expect(messages).toHaveLength(2)
		expect(messages[0]?.key?.id).toBe('MSG_1')
		expect(messages[0]?.message?.conversation).toBe('first message')
		expect(messages[1]?.key?.id).toBe('MSG_2')
		expect(messages[1]?.message?.conversation).toBe('second message')
	})

	it('rejects a bundle encrypted with WhatsApp History Keys (md-msg-hist) semantics', async () => {
		const mediaKey = randomBytes(32)
		const msg = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_HIST', fromMe: false },
			message: { conversation: 'wrong info key' }
		}).finish()
		const payload = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(msg)
			.finish()
		const encrypted = buildEncryptedGroupHistory(payload, mediaKey, 'WhatsApp History Keys')
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		await expect(downloadGroupHistoryBundle({ mediaKey, directPath })).rejects.toThrow()
	})

	it('returns an empty array for an empty GroupHistory payload', async () => {
		const mediaKey = randomBytes(32)
		const encrypted = buildEncryptedGroupHistory(new Uint8Array(0), mediaKey)
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		const messages = await downloadGroupHistoryBundle({ mediaKey, directPath })

		expect(messages).toEqual([])
	})

	it('skips unknown fields while decoding field-1 WebMessageInfo entries', async () => {
		const mediaKey = randomBytes(32)
		const msg = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_UNKNOWN', fromMe: false },
			message: { conversation: 'kept' }
		}).finish()
		const payload = $protobuf.Writer.create()
			.uint32((7 << 3) | 0)
			.uint32(42)
			.uint32((1 << 3) | 2)
			.bytes(msg)
			.uint32((6 << 3) | 2)
			.bytes(Buffer.from('ignored'))
			.finish()
		const encrypted = buildEncryptedGroupHistory(payload, mediaKey)
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		const messages = await downloadGroupHistoryBundle({ mediaKey, directPath })

		expect(messages).toHaveLength(1)
		expect(messages[0]?.key?.id).toBe('MSG_UNKNOWN')
		expect(messages[0]?.message?.conversation).toBe('kept')
	})

	it('throws Boom 400 when mediaKey or directPath/url is missing', async () => {
		await expect(downloadGroupHistoryBundle({ directPath })).rejects.toMatchObject({
			output: { statusCode: 400 }
		})
		await expect(downloadGroupHistoryBundle({ mediaKey: randomBytes(32) })).rejects.toMatchObject({
			output: { statusCode: 400 }
		})
	})

	it.each([
		{
			name: 'tampered ciphertext byte',
			mutateFile: (file: Buffer) => {
				file[0] = (file[0] ?? 0) ^ 0xff
			},
			corruptHash: false,
			expectedMessage: 'MAC mismatch'
		},
		{
			name: 'tampered MAC byte',
			mutateFile: (file: Buffer) => {
				const last = file.length - 1
				file[last] = (file[last] ?? 0) ^ 0xff
			},
			corruptHash: false,
			expectedMessage: 'MAC mismatch'
		},
		{
			name: 'wrong fileEncSha256',
			mutateFile: () => {},
			corruptHash: true,
			expectedMessage: 'fileEncSha256 mismatch'
		}
	])('rejects with Boom 412 on $name', async ({ mutateFile, corruptHash, expectedMessage }) => {
		const mediaKey = randomBytes(32)
		const msg = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_VERIFY', fromMe: false },
			message: { conversation: 'verify integrity' }
		}).finish()
		const payload = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(msg)
			.finish()
		const encrypted = Buffer.from(buildEncryptedGroupHistory(payload, mediaKey))
		mutateFile(encrypted)

		let fileEncSha256: Buffer | undefined
		if (corruptHash) {
			fileEncSha256 = Buffer.from(sha256(encrypted))
			fileEncSha256[0] = (fileEncSha256[0] ?? 0) ^ 0xff
		}

		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		await expect(downloadGroupHistoryBundle({ mediaKey, directPath, fileEncSha256 })).rejects.toMatchObject({
			message: expectedMessage,
			output: { statusCode: 412 }
		})
	})

	it('decodes when fileEncSha256 matches the encrypted file', async () => {
		const mediaKey = randomBytes(32)
		const msg = proto.WebMessageInfo.encode({
			key: { remoteJid: '1234567890@g.us', id: 'MSG_HASH_OK', fromMe: true },
			message: { conversation: 'hash verified' }
		}).finish()
		const payload = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(msg)
			.finish()
		const encrypted = buildEncryptedGroupHistory(payload, mediaKey)
		const fileEncSha256 = sha256(encrypted)

		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		const messages = await downloadGroupHistoryBundle({ mediaKey, directPath, fileEncSha256 })

		expect(messages).toHaveLength(1)
		expect(messages[0]?.key?.id).toBe('MSG_HASH_OK')
		expect(messages[0]?.message?.conversation).toBe('hash verified')
	})

	it('decodes all GroupHistory message fields in wire order', async () => {
		const mediaKey = randomBytes(32)
		const encodeMsg = (id: string) =>
			proto.WebMessageInfo.encode({
				key: { remoteJid: '1234567890@g.us', id, fromMe: false },
				message: { conversation: id }
			}).finish()

		const parentKey = proto.MessageKey.encode({
			remoteJid: '1234567890@g.us',
			id: 'PARENT_1',
			fromMe: false
		}).finish()

		const associatedList = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(encodeMsg('B1'))
			.uint32((1 << 3) | 2)
			.bytes(encodeMsg('B2'))
			.uint32((2 << 3) | 2)
			.bytes(parentKey)
			.uint32((3 << 3) | 0)
			.uint32(1)
			.finish()

		const payload = $protobuf.Writer.create()
			.uint32((1 << 3) | 2)
			.bytes(encodeMsg('A'))
			.uint32((2 << 3) | 2)
			.bytes(associatedList)
			.uint32((3 << 3) | 2)
			.bytes(encodeMsg('C'))
			.uint32((4 << 3) | 2)
			.bytes(encodeMsg('D'))
			.uint32((5 << 3) | 2)
			.bytes(encodeMsg('E'))
			.uint32((1 << 3) | 2)
			.bytes(encodeMsg('F'))
			.finish()

		const encrypted = buildEncryptedGroupHistory(payload, mediaKey)
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(new Uint8Array(encrypted)))

		const messages = await downloadGroupHistoryBundle({ mediaKey, directPath })

		expect(messages.map(m => m.key?.id)).toEqual(['A', 'B1', 'B2', 'C', 'D', 'E', 'F'])
	})

	it('rejects encrypted downloads exceeding 20 MiB with Boom 413', async () => {
		const mediaKey = randomBytes(32)
		const oversized = new Uint8Array(20 * 1024 * 1024 + 16)
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(oversized))

		await expect(downloadGroupHistoryBundle({ mediaKey, directPath })).rejects.toMatchObject({
			message: 'Group history bundle exceeds maximum size',
			output: { statusCode: 413 }
		})
	})
})
