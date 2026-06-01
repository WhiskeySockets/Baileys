/**
 * Regression: the blanket `if (!message.key.fromMe) return` guard added by
 * `1d7549df1f` ("add guard for protocolMessage processing") dropped every
 * inbound protocol message — including legitimate REVOKE / MESSAGE_EDIT /
 * EPHEMERAL_SETTING / GROUP_MEMBER_LABEL_CHANGE messages from other users.
 *
 * The fix narrows the guard to the protocol message types that should only
 * ever originate from our own device, mirroring whatsmeow's
 * `handleProtocolMessage` scope. See
 * https://github.com/tulir/whatsmeow/blob/8d3700152a/message.go#L842-L845
 */
import { EventEmitter } from 'events'
import P from 'pino'
import { proto } from '../../../WAProto/index.js'
import type { AuthenticationCreds, BaileysEventEmitter, WAMessage } from '../../Types'
import { initAuthCreds } from '../../Utils/auth-utils'
import processMessage from '../../Utils/process-message'

const silent = P({ level: 'silent' })

const credsWithMe = (): AuthenticationCreds => ({
	...initAuthCreds(),
	me: { id: 'me@s.whatsapp.net' } as any
})

const makeContext = () => {
	const events = new EventEmitter() as unknown as BaileysEventEmitter
	const updates: any[] = []
	;(events as any).on('messages.update', (upd: any) => updates.push(upd))

	return {
		updates,
		ctx: {
			shouldProcessHistoryMsg: false,
			placeholderResendCache: undefined,
			ev: events,
			creds: credsWithMe(),
			keyStore: {} as any,
			signalRepository: {} as any,
			logger: silent,
			options: {},
			getMessage: async () => undefined
		}
	}
}

const protocolMessage = (
	type: proto.Message.ProtocolMessage.Type,
	extra: Partial<proto.Message.IProtocolMessage> = {}
): proto.IMessage => ({
	protocolMessage: {
		type,
		key: { id: 'target-msg-id', remoteJid: 'chat@s.whatsapp.net', fromMe: false },
		...extra
	}
})

const inbound = (id: string, fromMe: boolean, message: proto.IMessage): WAMessage => ({
	key: {
		remoteJid: 'chat@s.whatsapp.net',
		fromMe,
		id,
		participant: 'sender@s.whatsapp.net'
	},
	message,
	messageTimestamp: 1675888000
})

describe('processMessage — protocolMessage guard (regression for blanket fromMe drop)', () => {
	it('processes inbound REVOKE from a non-self sender (emits messages.update)', async () => {
		const { ctx, updates } = makeContext()
		const msg = inbound('msg-1', false, protocolMessage(proto.Message.ProtocolMessage.Type.REVOKE))

		await processMessage(msg, ctx as any)

		expect(updates).toHaveLength(1)
		expect(updates[0][0].update.messageStubType).toBeDefined()
	})

	it('processes inbound MESSAGE_EDIT from a non-self sender (emits messages.update)', async () => {
		const { ctx, updates } = makeContext()
		const editedMessage = { conversation: 'edited' } as proto.IMessage
		const msg = inbound(
			'msg-2',
			false,
			protocolMessage(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT, { editedMessage })
		)

		await processMessage(msg, ctx as any)

		expect(updates).toHaveLength(1)
		expect(updates[0][0].update.message?.editedMessage).toBeDefined()
	})

	it('drops a spoofed HISTORY_SYNC_NOTIFICATION from a non-self sender', async () => {
		const { ctx } = makeContext()
		const msg = inbound(
			'msg-3',
			false,
			protocolMessage(proto.Message.ProtocolMessage.Type.HISTORY_SYNC_NOTIFICATION, {
				historySyncNotification: {} as any
			})
		)

		// Should NOT throw / NOT process the history sync. processedHistoryMessages stays empty.
		const credsBefore = ctx.creds.processedHistoryMessages?.length ?? 0
		await processMessage(msg, ctx as any)
		expect(ctx.creds.processedHistoryMessages?.length ?? 0).toBe(credsBefore)
	})

	it('drops a spoofed APP_STATE_SYNC_KEY_SHARE from a non-self sender', async () => {
		const events = new EventEmitter() as unknown as BaileysEventEmitter
		const credUpdates: any[] = []
		;(events as any).on('creds.update', (u: any) => credUpdates.push(u))

		const ctx = {
			shouldProcessHistoryMsg: false,
			placeholderResendCache: undefined,
			ev: events,
			creds: credsWithMe(),
			keyStore: { set: async () => {}, get: async () => ({}), transaction: async (w: any) => w() } as any,
			signalRepository: {} as any,
			logger: silent,
			options: {},
			getMessage: async () => undefined
		}

		const msg = inbound(
			'msg-4',
			false,
			protocolMessage(proto.Message.ProtocolMessage.Type.APP_STATE_SYNC_KEY_SHARE, {
				appStateSyncKeyShare: { keys: [] } as any
			})
		)

		await processMessage(msg, ctx as any)

		// No creds.update fired — the spoofed key share was rejected.
		expect(credUpdates.filter(u => u.myAppStateKeyId !== undefined)).toHaveLength(0)
	})
})
