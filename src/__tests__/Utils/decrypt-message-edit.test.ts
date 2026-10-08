import { jest } from '@jest/globals'
import { createCipheriv, hkdfSync } from 'node:crypto'
import { proto } from '../../../WAProto/index.js'
import type {
	AuthenticationCreds,
	BaileysEventEmitter,
	SignalKeyStoreWithTransaction,
	SignalRepositoryWithLIDStore,
	SocketConfig,
	WAMessage,
	WAMessageKey,
	WAMessageUpdate
} from '../../Types'
import { decryptMessageEdit, processEncryptedMessageEdit } from '../../Utils/decrypt-message-edit'
import type { ILogger } from '../../Utils/logger'
import processMessage from '../../Utils/process-message'

const ORIGINAL_ID = 'ORIGINAL-MESSAGE-ID'
const ENVELOPE_ID = 'EDIT-ENVELOPE-ID'
const DIRECT_AUTHOR_PN = '111111111111@s.whatsapp.net'
const DIRECT_AUTHOR_LID = '222222222222@lid'
const LOCAL_PN = '333333333333@s.whatsapp.net'
const LOCAL_LID = '444444444444@lid'
const GROUP_JID = '120363000000000000@g.us'
const MESSAGE_SECRET = Buffer.from(Array.from({ length: 32 }, (_, index) => index + 1))
const EDIT_IV = Buffer.from('000102030405060708090a0b', 'hex')

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

const createLidMapping = (mappings: Record<string, string> = {}) => ({
	getLIDForPN: jest.fn<(jid: string) => Promise<string | null>>(async jid => mappings[jid] || null),
	getPNForLID: jest.fn<(jid: string) => Promise<string | null>>(async jid => mappings[jid] || null)
})

const encryptWithNodeHkdf = (
	plaintext: Uint8Array,
	originalSenderJid: string,
	editorJid: string,
	messageSecret: Uint8Array = MESSAGE_SECRET,
	iv: Uint8Array = EDIT_IV
) => {
	const info = Buffer.concat([
		Buffer.from(ORIGINAL_ID),
		Buffer.from(originalSenderJid),
		Buffer.from(editorJid),
		Buffer.from('Message Edit')
	])
	const key = Buffer.from(hkdfSync('sha256', messageSecret, Buffer.alloc(32), info, 32))
	const cipher = createCipheriv('aes-256-gcm', key, iv)
	cipher.setAAD(Buffer.alloc(0))

	return Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()])
}

const sealProtocolMessage = ({
	originalSenderJid,
	editorJid,
	editedText,
	targetKey,
	protocolType = proto.Message.ProtocolMessage.Type.MESSAGE_EDIT,
	embeddedTargetId = ORIGINAL_ID,
	messageSecret = MESSAGE_SECRET,
	timestampMs = 1_725_000_000_000
}: {
	originalSenderJid: string
	editorJid: string
	editedText: string
	targetKey: WAMessageKey
	protocolType?: proto.Message.ProtocolMessage.Type
	embeddedTargetId?: string
	messageSecret?: Uint8Array
	timestampMs?: number
}): proto.Message.ISecretEncryptedMessage => {
	const plaintext = proto.Message.encode(
		proto.Message.create({
			protocolMessage: {
				key: { ...targetKey, id: embeddedTargetId },
				type: protocolType,
				editedMessage: { conversation: editedText },
				timestampMs
			}
		})
	).finish()

	return proto.Message.SecretEncryptedMessage.create({
		targetMessageKey: targetKey,
		encPayload: encryptWithNodeHkdf(plaintext, originalSenderJid, editorJid, messageSecret),
		encIv: EDIT_IV,
		secretEncType: proto.Message.SecretEncryptedMessage.SecretEncType.MESSAGE_EDIT
	})
}

const createEnvelope = (
	key: WAMessageKey,
	secretEncryptedMessage: proto.Message.ISecretEncryptedMessage
): WAMessage => ({
	key: { ...key, id: ENVELOPE_ID },
	message: { secretEncryptedMessage },
	messageTimestamp: 1_725_000_001
})

const originalMessage = (messageSecret: Uint8Array = MESSAGE_SECRET): proto.IMessage => ({
	conversation: 'before',
	messageContextInfo: { messageSecret }
})

const getEditedText = (update: WAMessageUpdate | undefined) =>
	update?.update.message?.editedMessage?.message?.conversation

describe('decryptMessageEdit', () => {
	it('decrypts a protocol message encrypted with an independent HKDF implementation', () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})

		const decoded = decryptMessageEdit(encrypted, {
			originalSenderJid: DIRECT_AUTHOR_PN,
			originalMsgId: ORIGINAL_ID,
			messageSecret: MESSAGE_SECRET,
			editorJid: DIRECT_AUTHOR_PN
		})

		expect(decoded.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		expect(decoded.protocolMessage?.editedMessage?.conversation).toBe('after')
	})

	it('rejects an incorrect editor identity', () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})

		expect(() =>
			decryptMessageEdit(encrypted, {
				originalSenderJid: DIRECT_AUTHOR_PN,
				originalMsgId: ORIGINAL_ID,
				messageSecret: MESSAGE_SECRET,
				editorJid: '555555555555@s.whatsapp.net'
			})
		).toThrow()
	})

	it('rejects malformed IV and message-secret lengths before decryption', () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})

		expect(() =>
			decryptMessageEdit(
				{ ...encrypted, encIv: Buffer.alloc(11) },
				{
					originalSenderJid: DIRECT_AUTHOR_PN,
					originalMsgId: ORIGINAL_ID,
					messageSecret: MESSAGE_SECRET,
					editorJid: DIRECT_AUTHOR_PN
				}
			)
		).toThrow(/IV length/)
		expect(() =>
			decryptMessageEdit(encrypted, {
				originalSenderJid: DIRECT_AUTHOR_PN,
				originalMsgId: ORIGINAL_ID,
				messageSecret: Buffer.alloc(31),
				editorJid: DIRECT_AUTHOR_PN
			})
		).toThrow(/secret length/)
	})
})

describe('processEncryptedMessageEdit', () => {
	it.each([
		{ addressingMode: 'PN', remoteJid: DIRECT_AUTHOR_PN, remoteJidAlt: DIRECT_AUTHOR_LID },
		{ addressingMode: 'LID', remoteJid: DIRECT_AUTHOR_LID, remoteJidAlt: DIRECT_AUTHOR_PN }
	])('decrypts a direct-message edit with $addressingMode-first addressing', async ({ remoteJid, remoteJidAlt }) => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: remoteJid,
			editorJid: remoteJid,
			editedText: 'direct after',
			targetKey
		})
		const message = createEnvelope(
			{
				remoteJid,
				remoteJidAlt,
				fromMe: false,
				id: ENVELOPE_ID
			},
			encrypted
		)
		const getMessage = jest.fn<SocketConfig['getMessage']>().mockResolvedValue(originalMessage())
		const lidMapping = createLidMapping({
			[DIRECT_AUTHOR_PN]: DIRECT_AUTHOR_LID,
			[DIRECT_AUTHOR_LID]: DIRECT_AUTHOR_PN
		})

		const update = await processEncryptedMessageEdit({
			message,
			secretEncryptedMessage: encrypted,
			getMessage,
			lidMapping,
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(getMessage).toHaveBeenCalledWith({
			remoteJid,
			remoteJidAlt,
			fromMe: false,
			id: ORIGINAL_ID
		})
		expect(update?.key).toEqual({
			remoteJid,
			remoteJidAlt,
			fromMe: false,
			id: ORIGINAL_ID
		})
		expect(getEditedText(update)).toBe('direct after')
		expect(update?.update.messageTimestamp).toBe(1_725_000_000)
		expect(lidMapping.getLIDForPN).not.toHaveBeenCalled()
		expect(lidMapping.getPNForLID).not.toHaveBeenCalled()
	})

	it('decrypts a group edit using the participant identity', async () => {
		const targetKey = {
			id: ORIGINAL_ID,
			remoteJid: GROUP_JID,
			participant: DIRECT_AUTHOR_LID,
			fromMe: true
		}
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_LID,
			editorJid: DIRECT_AUTHOR_LID,
			editedText: 'group after',
			targetKey
		})
		const message = createEnvelope(
			{
				remoteJid: GROUP_JID,
				participant: DIRECT_AUTHOR_LID,
				participantAlt: DIRECT_AUTHOR_PN,
				fromMe: false,
				id: ENVELOPE_ID
			},
			encrypted
		)
		const getMessage = jest.fn<SocketConfig['getMessage']>().mockResolvedValue(originalMessage())

		const update = await processEncryptedMessageEdit({
			message,
			secretEncryptedMessage: encrypted,
			getMessage,
			lidMapping: createLidMapping({
				[DIRECT_AUTHOR_PN]: DIRECT_AUTHOR_LID,
				[DIRECT_AUTHOR_LID]: DIRECT_AUTHOR_PN
			}),
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(getMessage).toHaveBeenCalledWith({
			remoteJid: GROUP_JID,
			participant: DIRECT_AUTHOR_LID,
			participantAlt: DIRECT_AUTHOR_PN,
			fromMe: false,
			id: ORIGINAL_ID
		})
		expect(update?.key.remoteJid).toBe(GROUP_JID)
		expect(update?.key.participant).toBe(DIRECT_AUTHOR_LID)
		expect(getEditedText(update)).toBe('group after')
	})

	it('retries decryption with a mapped LID identity when only a PN arrives on the envelope', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: GROUP_JID, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_LID,
			editorJid: DIRECT_AUTHOR_LID,
			editedText: 'mapped group after',
			targetKey
		})
		const lidMapping = createLidMapping({
			[DIRECT_AUTHOR_PN]: DIRECT_AUTHOR_LID,
			[DIRECT_AUTHOR_LID]: DIRECT_AUTHOR_PN
		})

		const update = await processEncryptedMessageEdit({
			message: createEnvelope(
				{
					remoteJid: GROUP_JID,
					participant: DIRECT_AUTHOR_PN,
					fromMe: false,
					id: ENVELOPE_ID
				},
				encrypted
			),
			secretEncryptedMessage: encrypted,
			getMessage: async () => originalMessage(),
			lidMapping,
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(getEditedText(update)).toBe('mapped group after')
		expect(lidMapping.getLIDForPN).toHaveBeenCalledWith(DIRECT_AUTHOR_PN)
	})

	it('uses the target participant when the original key is not from the editor perspective', async () => {
		const targetKey = {
			id: ORIGINAL_ID,
			remoteJid: GROUP_JID,
			participant: DIRECT_AUTHOR_LID,
			fromMe: false
		}
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_LID,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'cross-addressed group after',
			targetKey
		})
		const lidMapping = createLidMapping()

		const update = await processEncryptedMessageEdit({
			message: createEnvelope(
				{
					remoteJid: GROUP_JID,
					participant: DIRECT_AUTHOR_PN,
					fromMe: false,
					id: ENVELOPE_ID
				},
				encrypted
			),
			secretEncryptedMessage: encrypted,
			getMessage: async () => originalMessage(),
			lidMapping,
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(getEditedText(update)).toBe('cross-addressed group after')
		expect(lidMapping.getLIDForPN).not.toHaveBeenCalled()
		expect(lidMapping.getPNForLID).not.toHaveBeenCalled()
	})

	it('decrypts repeated edits against the same original message secret', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const messageKey = {
			remoteJid: DIRECT_AUTHOR_PN,
			remoteJidAlt: DIRECT_AUTHOR_LID,
			fromMe: false,
			id: ENVELOPE_ID
		}
		const getMessage = jest.fn<SocketConfig['getMessage']>().mockResolvedValue(originalMessage())
		const options = {
			getMessage,
			lidMapping: createLidMapping(),
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		}
		const firstEncrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'first edit',
			targetKey
		})
		const secondEncrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'second edit',
			targetKey,
			timestampMs: 1_725_000_030_000
		})

		const first = await processEncryptedMessageEdit({
			...options,
			message: createEnvelope(messageKey, firstEncrypted),
			secretEncryptedMessage: firstEncrypted
		})
		const second = await processEncryptedMessageEdit({
			...options,
			message: createEnvelope(messageKey, secondEncrypted),
			secretEncryptedMessage: secondEncrypted
		})

		expect(getMessage).toHaveBeenCalledTimes(2)
		expect(getMessage.mock.calls.map(([key]) => key.id)).toEqual([ORIGINAL_ID, ORIGINAL_ID])
		expect(getEditedText(first)).toBe('first edit')
		expect(getEditedText(second)).toBe('second edit')
	})

	it('does not emit an update when the original secret is unavailable', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})
		const logger = createMockLogger()

		const update = await processEncryptedMessageEdit({
			message: createEnvelope({ remoteJid: DIRECT_AUTHOR_PN, fromMe: false, id: ENVELOPE_ID }, encrypted),
			secretEncryptedMessage: encrypted,
			getMessage: async () => undefined,
			lidMapping: createLidMapping(),
			logger,
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(update).toBeUndefined()
		expect(logger.warn).toHaveBeenCalledWith(
			{ foundOriginal: false, secretLength: undefined },
			'cannot decrypt message edit without the original message secret'
		)
	})

	it('contains getMessage failures without failing the receive path', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})
		const logger = createMockLogger()
		const lookupError = new Error('synthetic lookup failure')

		const update = await processEncryptedMessageEdit({
			message: createEnvelope({ remoteJid: DIRECT_AUTHOR_PN, fromMe: false, id: ENVELOPE_ID }, encrypted),
			secretEncryptedMessage: encrypted,
			getMessage: async () => {
				throw lookupError
			},
			lidMapping: createLidMapping(),
			logger,
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(update).toBeUndefined()
		expect(logger.warn).toHaveBeenCalledWith(
			{ err: lookupError },
			'failed to retrieve the original message for edit decryption'
		)
	})

	it('rejects an encrypted envelope with a different secret type', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})
		encrypted.secretEncType = proto.Message.SecretEncryptedMessage.SecretEncType.EVENT_EDIT
		const getMessage = jest.fn<SocketConfig['getMessage']>().mockResolvedValue(originalMessage())

		const update = await processEncryptedMessageEdit({
			message: createEnvelope({ remoteJid: DIRECT_AUTHOR_PN, fromMe: false, id: ENVELOPE_ID }, encrypted),
			secretEncryptedMessage: encrypted,
			getMessage,
			lidMapping: createLidMapping(),
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		})

		expect(update).toBeUndefined()
		expect(getMessage).not.toHaveBeenCalled()
	})

	it('rejects decrypted protocol messages that do not describe the targeted edit', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const wrongType = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey,
			protocolType: proto.Message.ProtocolMessage.Type.REVOKE
		})
		const wrongTarget = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey,
			embeddedTargetId: 'DIFFERENT-ID'
		})
		const options = {
			message: createEnvelope({ remoteJid: DIRECT_AUTHOR_PN, fromMe: false, id: ENVELOPE_ID }, wrongType),
			getMessage: async () => originalMessage(),
			lidMapping: createLidMapping(),
			logger: createMockLogger(),
			meId: LOCAL_PN,
			meLid: LOCAL_LID
		}

		expect(
			await processEncryptedMessageEdit({
				...options,
				secretEncryptedMessage: wrongType
			})
		).toBeUndefined()
		expect(
			await processEncryptedMessageEdit({
				...options,
				message: createEnvelope({ remoteJid: DIRECT_AUTHOR_PN, fromMe: false, id: ENVELOPE_ID }, wrongTarget),
				secretEncryptedMessage: wrongTarget
			})
		).toBeUndefined()
	})
})

describe('processMessage encrypted edit integration', () => {
	const createMockEventEmitter = () => {
		const emittedEvents: Array<{ event: string; data: unknown }> = []
		return {
			emittedEvents,
			on: jest.fn(),
			off: jest.fn(),
			removeAllListeners: jest.fn(),
			emit: jest.fn((event: string, data: unknown) => {
				emittedEvents.push({ event, data })
				return true
			})
		} as unknown as BaileysEventEmitter & { emittedEvents: typeof emittedEvents }
	}

	const processFixture = async ({
		message,
		getMessage
	}: {
		message: WAMessage
		getMessage: SocketConfig['getMessage']
	}) => {
		const ev = createMockEventEmitter()
		const logger = createMockLogger()
		const lidMapping = createLidMapping({
			[DIRECT_AUTHOR_PN]: DIRECT_AUTHOR_LID,
			[DIRECT_AUTHOR_LID]: DIRECT_AUTHOR_PN
		})

		await processMessage(message, {
			shouldProcessHistoryMsg: false,
			ev,
			creds: {
				me: { id: LOCAL_PN, lid: LOCAL_LID },
				accountSettings: { unarchiveChats: false }
			} as unknown as AuthenticationCreds,
			signalRepository: { lidMapping } as unknown as SignalRepositoryWithLIDStore,
			keyStore: {} as SignalKeyStoreWithTransaction,
			logger,
			options: {},
			getMessage
		})

		return { events: ev.emittedEvents, logger }
	}

	it.each([
		{
			name: 'direct message',
			messageKey: {
				remoteJid: DIRECT_AUTHOR_PN,
				remoteJidAlt: DIRECT_AUTHOR_LID,
				fromMe: false,
				id: ENVELOPE_ID
			},
			targetKey: { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true },
			authorJid: DIRECT_AUTHOR_PN,
			editedText: 'direct integration edit'
		},
		{
			name: 'group message',
			messageKey: {
				remoteJid: GROUP_JID,
				participant: DIRECT_AUTHOR_LID,
				participantAlt: DIRECT_AUTHOR_PN,
				fromMe: false,
				id: ENVELOPE_ID
			},
			targetKey: {
				id: ORIGINAL_ID,
				remoteJid: GROUP_JID,
				participant: DIRECT_AUTHOR_LID,
				fromMe: true
			},
			authorJid: DIRECT_AUTHOR_LID,
			editedText: 'group integration edit'
		},
		{
			name: 'wrapped direct message',
			messageKey: {
				remoteJid: DIRECT_AUTHOR_PN,
				remoteJidAlt: DIRECT_AUTHOR_LID,
				fromMe: false,
				id: ENVELOPE_ID
			},
			targetKey: { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true },
			authorJid: DIRECT_AUTHOR_PN,
			editedText: 'wrapped direct integration edit',
			wrapped: true
		}
	])('emits the established messages.update contract for an incoming $name edit', async fixture => {
		const encrypted = sealProtocolMessage({
			originalSenderJid: fixture.authorJid,
			editorJid: fixture.authorJid,
			editedText: fixture.editedText,
			targetKey: fixture.targetKey
		})
		const message = createEnvelope(fixture.messageKey, encrypted)
		if ('wrapped' in fixture && fixture.wrapped) {
			message.message = {
				ephemeralMessage: {
					message: message.message
				}
			}
		}

		const { events } = await processFixture({
			message,
			getMessage: async () => originalMessage()
		})
		const updateEvent = events.find(event => event.event === 'messages.update')

		expect(updateEvent?.data).toEqual([
			{
				key: { ...fixture.messageKey, id: ORIGINAL_ID },
				update: {
					message: {
						editedMessage: {
							message: { conversation: fixture.editedText }
						}
					},
					messageTimestamp: 1_725_000_000
				}
			}
		])
		expect(events.some(event => event.event === 'chats.update')).toBe(false)
	})

	it('contains unexpected edit-processing errors in the receive path', async () => {
		const targetKey = { id: ORIGINAL_ID, remoteJid: LOCAL_PN, fromMe: true }
		const encrypted = sealProtocolMessage({
			originalSenderJid: DIRECT_AUTHOR_PN,
			editorJid: DIRECT_AUTHOR_PN,
			editedText: 'after',
			targetKey
		})
		const unexpectedError = new Error('synthetic original message failure')
		const unreadableOriginal = {} as proto.IMessage
		Object.defineProperty(unreadableOriginal, 'messageContextInfo', {
			get: () => {
				throw unexpectedError
			}
		})

		const { events, logger } = await processFixture({
			message: createEnvelope(
				{
					remoteJid: DIRECT_AUTHOR_PN,
					remoteJidAlt: DIRECT_AUTHOR_LID,
					fromMe: false,
					id: ENVELOPE_ID
				},
				encrypted
			),
			getMessage: async () => unreadableOriginal
		})

		expect(events.some(event => event.event === 'messages.update')).toBe(false)
		expect(logger.warn).toHaveBeenCalledWith(
			{ err: unexpectedError, msgId: ENVELOPE_ID },
			'failed to process encrypted message edit'
		)
	})
})
