import NodeCache from '@cacheable/node-cache'
import { areJidsSameUser, type BinaryNode, getBinaryNodeChild, jidDecode } from '../WABinary'
import { isStringNullOrEmpty } from './generics'
import type { ILogger } from './logger'

export type IdentityChangeResult =
	| { action: 'no_identity_node' }
	| { action: 'invalid_notification' }
	| { action: 'skipped_companion_device'; device: number }
	| { action: 'skipped_self_primary' }
	| { action: 'debounced' }
	| { action: 'skipped_offline' }
	| { action: 'skipped_no_session' }
	| { action: 'session_refreshed' }
	| { action: 'session_refresh_failed'; error: unknown }

export type IdentityChangeContext = {
	meId: string | undefined
	meLid: string | undefined
	validateSession: (jid: string) => Promise<{ exists: boolean; reason?: string }>
	hasSessionRecord?: (jid: string) => Promise<boolean>
	deleteSession: (jids: string[]) => Promise<void>
	assertSessions: (jids: string[], force?: boolean) => Promise<boolean>
	debounceCache: NodeCache<boolean>
	isOfflineResumeComplete: boolean
	logger: ILogger
}

export async function handleIdentityChange(
	node: BinaryNode,
	ctx: IdentityChangeContext
): Promise<IdentityChangeResult> {
	const from = node.attrs.from
	if (!from) {
		return { action: 'invalid_notification' }
	}

	const identityNode = getBinaryNodeChild(node, 'identity')
	if (!identityNode) {
		return { action: 'no_identity_node' }
	}

	ctx.logger.info({ jid: from }, 'identity changed')

	const decoded = jidDecode(from)
	if (decoded?.device && decoded.device !== 0) {
		ctx.logger.debug({ jid: from, device: decoded.device }, 'ignoring identity change from companion device')
		return { action: 'skipped_companion_device', device: decoded.device }
	}

	const isSelfPrimary = ctx.meId && (areJidsSameUser(from, ctx.meId) || (ctx.meLid && areJidsSameUser(from, ctx.meLid)))
	if (isSelfPrimary) {
		ctx.logger.info({ jid: from }, 'self primary identity changed')
		return { action: 'skipped_self_primary' }
	}

	if (ctx.debounceCache.get(from)) {
		ctx.logger.debug({ jid: from }, 'skipping identity assert (debounced)')
		return { action: 'debounced' }
	}

	ctx.debounceCache.set(from, true)

	const isOfflineNotification = !isStringNullOrEmpty(node.attrs.offline)
	const isOfflineProcessing = isOfflineNotification && !ctx.isOfflineResumeComplete
	const hasSessionRecord = ctx.hasSessionRecord
		? await ctx.hasSessionRecord(from)
		: (await ctx.validateSession(from)).exists

	if (!hasSessionRecord) {
		ctx.logger.debug({ jid: from }, 'no old session, skipping session refresh')
		return { action: 'skipped_no_session' }
	}

	ctx.logger.debug({ jid: from }, 'old session exists, will refresh session')

	if (isOfflineProcessing) {
		ctx.logger.debug({ jid: from }, 'offline processing in progress, clearing session without refresh')
		try {
			await ctx.deleteSession([from])
		} catch (error) {
			ctx.logger.warn({ error, jid: from }, 'failed to clear session during offline processing')
		}

		return { action: 'skipped_offline' }
	}

	try {
		await ctx.deleteSession([from])
		await ctx.assertSessions([from], true)
		return { action: 'session_refreshed' }
	} catch (error) {
		ctx.logger.warn({ error, jid: from }, 'failed to assert sessions after identity change')
		return { action: 'session_refresh_failed', error }
	}
}
