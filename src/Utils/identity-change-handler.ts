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
	| { action: 'skipped_offline' }
	| { action: 'skipped_no_session' }
	| { action: 'session_refreshed' }
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
 * 5. **Session Check**: Verifies an existing session exists before attempting refresh
 * 6. **Offline Handling**: Skips refresh during offline notification processing
 * 7. **Session Refresh**: Attempts to refresh the session with force flag
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
 *   logger: pino()
 * })
 *
 * switch (result.action) {
 *   case 'session_refreshed':
 *     console.log('Session successfully refreshed')
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
		ctx.logger.debug(
			{ jid: from, device: decoded.device },
			'ignoring identity change from companion device'
		)
		return { action: 'skipped_companion_device', device: decoded.device }
	}

	// Skip self-primary identity changes
	const isSelfPrimary = ctx.meId && (
		areJidsSameUser(from, ctx.meId) ||
		(ctx.meLid && areJidsSameUser(from, ctx.meLid))
	)
	if (isSelfPrimary) {
		ctx.logger.info({ jid: from }, 'self primary identity changed')
		return { action: 'skipped_self_primary' }
	}

	// Debounce to prevent duplicate processing
	if (ctx.debounceCache.get(from)) {
		ctx.logger.debug({ jid: from }, 'skipping identity assert (debounced)')
		return { action: 'debounced' }
	}

	// Mark as processing in debounce cache
	ctx.debounceCache.set(from, true)

	// Check if we have an existing session to refresh
	const hasExistingSession = await ctx.validateSession(from)
	if (!hasExistingSession.exists) {
		ctx.logger.debug({ jid: from }, 'no old session, skipping session refresh')
		return { action: 'skipped_no_session' }
	}

	ctx.logger.debug({ jid: from }, 'old session exists, will refresh session')

	// Skip refresh during offline notification processing
	// Offline notifications are processed in batch and shouldn't trigger immediate refreshes
	const isOfflineNotification = !isStringNullOrEmpty(node.attrs.offline)
	if (isOfflineNotification) {
		ctx.logger.debug({ jid: from }, 'skipping session refresh during offline processing')
		return { action: 'skipped_offline' }
	}

	// Attempt session refresh
	try {
		await ctx.assertSessions([from], true)
		return { action: 'session_refreshed' }
	} catch (error) {
		ctx.logger.warn(
			{ error, jid: from },
			'failed to assert sessions after identity change'
		)
		return { action: 'session_refresh_failed', error }
	}
}
