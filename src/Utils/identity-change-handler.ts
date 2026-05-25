/**
 * Identity Change Handler
 *
 * Handles WhatsApp identity change notifications which occur when a contact's
 * encryption keys change. This typically happens when:
 * - User reinstalls WhatsApp
 * - User changes devices
 * - User's phone number verification expires and is re-verified
 *
 * This module centralizes the identity change logic to:
 * - Prevent duplicate session refreshes via debouncing
 * - Skip unnecessary refreshes for companion devices
 * - Handle offline notification scenarios correctly
 * - Provide clear result types for monitoring and debugging
 *
 * @module identity-change-handler
 * @see https://github.com/WhiskeySockets/Baileys/issues/2132
 */

import NodeCache from '@cacheable/node-cache'
import { areJidsSameUser, type BinaryNode, getBinaryNodeChild, jidDecode } from '../WABinary'
import { isStringNullOrEmpty } from './generics'
import type { ILogger } from './logger'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result type for identity change handling operations.
 * Each action variant indicates a specific outcome with relevant context.
 */
export type IdentityChangeResult =
	| { action: 'no_identity_node' }
	| { action: 'invalid_notification' }
	| { action: 'skipped_companion_device'; device: number }
	| { action: 'skipped_self_primary' }
	| { action: 'debounced' }
	| { action: 'skipped_in_flight' }
	| { action: 'skipped_offline' }
	| { action: 'session_refreshed'; hadExistingSession: boolean }
	| { action: 'session_refresh_failed'; error: unknown }

/**
 * Context required for identity change handling.
 * Provides access to session management and logging capabilities.
 */
export type IdentityChangeContext = {
	/** Current user's phone number JID (e.g., "5511999999999@s.whatsapp.net") */
	meId: string | undefined
	/** Current user's LID (Logical ID) if available */
	meLid: string | undefined
	/** Function to validate if a session exists for a JID */
	validateSession: (jid: string) => Promise<{ exists: boolean; reason?: string }>
	/** Function to assert/refresh sessions for given JIDs */
	assertSessions: (jids: string[], force?: boolean) => Promise<boolean>
	/** Cache for debouncing identity change processing */
	debounceCache: NodeCache<boolean>
	/**
	 * Stage 3 (upstream #2573 M11): tracks identity-change refreshes currently
	 * in flight, keyed by jid. A long-running `assertSessions` previously
	 * outlived the debounce TTL — a second identity change for the same jid
	 * could race a parallel refresh and overwrite each other.
	 *
	 * Two-level dedup (InfiniteAPI hybrid): `debounceCache` continues to gate
	 * rapid successive notifications within the TTL window; `inFlightRefreshes`
	 * additionally gates async-bound concurrent refreshes that outlive the TTL.
	 * Marker MUST be released in `finally` so a failed assertSessions doesn't
	 * leak a permanently-stuck jid.
	 *
	 * **Optional** to preserve backward compatibility — `IdentityChangeContext`
	 * is exported via `Utils/index.ts` so adding a required field would break
	 * external consumers that construct the context object themselves
	 * (Copilot review on PR #459). When omitted, the in-flight guard is
	 * silently skipped (graceful degradation) — the `debounceCache` continues
	 * to provide the TTL-based dedup. To get the strong M11 guarantee, callers
	 * SHOULD pass a Set instance reused across invocations for the same socket
	 * lifetime — `messages-recv.ts` does this via `identityInFlightRefreshes`.
	 */
	inFlightRefreshes?: Set<string>
	/** Logger instance for debugging and monitoring */
	logger: ILogger
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

/**
 * Handles an identity change notification from WhatsApp.
 *
 * This function processes identity change events with the following logic:
 *
 * 1. **Validation**: Ensures the notification has required fields (from, identity node)
 * 2. **Companion Device Filter**: Skips notifications from companion devices (device > 0)
 *    as they don't require session refresh
 * 3. **Self-Primary Skip**: Skips notifications for the current user's own identity
 * 4. **Debouncing**: Prevents duplicate processing for the same JID within TTL window
 * 5. **Offline Handling**: Skips refresh during offline notification processing
 * 6. **Session Refresh**: Attempts to refresh/create the session with force flag
 *
 * **Important**: Identity change notifications signal that we need to rebuild the session,
 * regardless of whether an existing session exists. This is critical for cases where
 * the local session was cleared (e.g., after key reset or device restore).
 *
 * @param node - The binary node containing the identity change notification
 * @param ctx - Context object with required dependencies
 * @returns Promise resolving to the result of the identity change handling
 *
 * @example
 * ```typescript
 * const result = await handleIdentityChange(notificationNode, {
 *   meId: '5511999999999@s.whatsapp.net',
 *   meLid: undefined,
 *   validateSession: async (jid) => authState.keys.get('session', [jid]),
 *   assertSessions: async (jids, force) => assertSession(jids, force),
 *   debounceCache: new NodeCache({ stdTTL: 5 }),
 *   inFlightRefreshes: new Set<string>(),
 *   logger: pino()
 * })
 *
 * switch (result.action) {
 *   case 'session_refreshed':
 *     console.log('Session refreshed, had existing:', result.hadExistingSession)
 *     break
 *   case 'session_refresh_failed':
 *     console.error('Failed to refresh session:', result.error)
 *     break
 *   // ... handle other cases
 * }
 * ```
 */
export async function handleIdentityChange(
	node: BinaryNode,
	ctx: IdentityChangeContext
): Promise<IdentityChangeResult> {
	const from = node.attrs.from
	if (!from) {
		return { action: 'invalid_notification' }
	}

	// Check for identity node presence
	const identityNode = getBinaryNodeChild(node, 'identity')
	if (!identityNode) {
		return { action: 'no_identity_node' }
	}

	ctx.logger.info({ jid: from }, 'identity changed')

	// Skip companion devices - they don't need session refresh
	const decoded = jidDecode(from)
	if (decoded?.device && decoded.device !== 0) {
		ctx.logger.debug({ jid: from, device: decoded.device }, 'ignoring identity change from companion device')
		return { action: 'skipped_companion_device', device: decoded.device }
	}

	// Skip self-primary identity changes
	// FIX: Check meId and meLid independently to handle cases where only meLid exists
	const matchesMeId = ctx.meId && areJidsSameUser(from, ctx.meId)
	const matchesMeLid = ctx.meLid && areJidsSameUser(from, ctx.meLid)
	if (matchesMeId || matchesMeLid) {
		ctx.logger.info({ jid: from }, 'self primary identity changed')
		return { action: 'skipped_self_primary' }
	}

	// Debounce to prevent duplicate processing
	// Check early but don't set yet - we only want to debounce actual refresh attempts
	if (ctx.debounceCache.get(from)) {
		ctx.logger.debug({ jid: from }, 'skipping identity assert (debounced)')
		return { action: 'debounced' }
	}

	// Stage 3 (upstream #2573 M11): even if the debounce TTL has elapsed, a
	// previous refresh for this jid may still be running. Skip rather than
	// racing it. This catches the case where assertSessions takes longer than
	// the debounce TTL (e.g. slow network, retry storms) and would otherwise
	// overlap with a new identity-change notification for the same jid.
	// Optional Set (see IdentityChangeContext JSDoc) — if absent, this guard
	// degrades gracefully and only the debounceCache TTL provides dedup.
	if (ctx.inFlightRefreshes?.has(from)) {
		ctx.logger.debug({ jid: from }, 'skipping identity assert (refresh already in flight)')
		return { action: 'skipped_in_flight' }
	}

	// Skip refresh during offline notification processing
	// Offline notifications are processed in batch and shouldn't trigger immediate refreshes
	// FIX: Check this BEFORE setting debounce cache to avoid incorrect debouncing
	const isOfflineNotification = !isStringNullOrEmpty(node.attrs.offline)
	if (isOfflineNotification) {
		ctx.logger.debug({ jid: from }, 'skipping session refresh during offline processing')
		return { action: 'skipped_offline' }
	}

	// Check if we have an existing session (for logging purposes only)
	// FIX: We no longer skip refresh when no session exists - identity change is the
	// signal to rebuild the session, which is critical after key reset or device restore
	const hasExistingSession = await ctx.validateSession(from)

	if (hasExistingSession.exists) {
		ctx.logger.debug({ jid: from }, 'existing session found, will refresh')
	} else {
		ctx.logger.debug({ jid: from }, 'no existing session, will create new session')
	}

	// FIX: Set debounce cache only immediately before the actual refresh attempt
	// This ensures we don't incorrectly debounce when we exit early (offline, etc.)
	ctx.debounceCache.set(from, true)

	// Stage 3 M11: mark in-flight BEFORE assertSessions, release in finally.
	// If assertSessions throws, the finally still runs — no stuck marker.
	// Optional chaining: if no Set was provided (backward-compat path), the
	// add/delete become no-ops and the in-flight guard above is also skipped.
	ctx.inFlightRefreshes?.add(from)

	// Attempt session refresh/creation
	try {
		await ctx.assertSessions([from], true)
		return { action: 'session_refreshed', hadExistingSession: hasExistingSession.exists }
	} catch (error) {
		ctx.logger.warn({ error, jid: from }, 'failed to assert sessions after identity change')
		return { action: 'session_refresh_failed', error }
	} finally {
		ctx.inFlightRefreshes?.delete(from)
	}
}
