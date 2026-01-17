import { Boom } from '@hapi/boom'
import type { LTHashState, WAPatchName } from '../Types'
import type { BinaryNode } from '../WABinary'
import type { ChatMutationMap } from './chat-utils'

/**
 * Custom error class for missing app-state-sync-key errors.
 * Matches WhatsApp Web's SyncdMissingKeyError pattern.
 */
export class SyncdMissingKeyError extends Boom {
	/** The key ID that was not found */
	readonly keyId: string

	constructor(keyId: string, data?: object) {
		super(`failed to find key "${keyId}" to decode mutation`, {
			statusCode: 404,
			data: { keyId, ...data }
		})
		this.keyId = keyId
		// Maintain proper prototype chain for instanceof checks
		Object.setPrototypeOf(this, SyncdMissingKeyError.prototype)
	}
}

/** Message pattern that identifies a missing sync key error */
const MISSING_KEY_MESSAGE_PATTERN = 'failed to find key'

/**
 * Check if an error message indicates a missing sync key error.
 */
function hasMissingKeyMessage(message: string | undefined): boolean {
	return message?.includes(MISSING_KEY_MESSAGE_PATTERN) ?? false
}

/**
 * Type guard to check if an error is a missing sync key error.
 *
 * Matches errors that are:
 * - `SyncdMissingKeyError` instances (preferred)
 * - `Boom` errors with 404 status AND missing-key message pattern
 * - Plain `Error` objects with missing-key message pattern
 *
 * This is intentionally strict to avoid false positives from other 404 errors
 * (e.g., profile picture not found, resource not found, etc.)
 */
export function isSyncdMissingKeyError(error: unknown): error is SyncdMissingKeyError | Boom | Error {
	// Direct instance check - most reliable
	if (error instanceof SyncdMissingKeyError) {
		return true
	}

	// Legacy Boom errors - require BOTH 404 status AND message pattern
	if (error instanceof Boom) {
		const is404 = error.output?.statusCode === 404
		const hasPattern = hasMissingKeyMessage(error.message)
		return is404 && hasPattern
	}

	// Plain Error fallback - check message pattern only
	if (error instanceof Error) {
		return hasMissingKeyMessage(error.message)
	}

	return false
}

/**
 * Manages collections that are blocked waiting for app-state-sync-keys.
 * Mirrors WhatsApp Web's WAWebSyncdCollectionsStateMachine blocked state handling.
 */
export class BlockedCollectionsManager {
	private readonly blocked = new Set<WAPatchName>()

	/**
	 * Mark a collection as blocked (waiting for keys)
	 */
	block(collection: WAPatchName): void {
		this.blocked.add(collection)
	}

	/**
	 * Check if a collection is blocked
	 */
	isBlocked(collection: WAPatchName): boolean {
		return this.blocked.has(collection)
	}

	/**
	 * Get all blocked collections and clear the blocked set.
	 * Returns empty array if no collections are blocked.
	 */
	flush(): WAPatchName[] {
		if (this.blocked.size === 0) {
			return []
		}

		const collections = Array.from(this.blocked)
		this.blocked.clear()
		return collections
	}

	/**
	 * Get count of blocked collections
	 */
	get size(): number {
		return this.blocked.size
	}

	/**
	 * Check if there are any blocked collections
	 */
	get hasBlocked(): boolean {
		return this.blocked.size > 0
	}

	/**
	 * Get blocked collections without clearing (for logging/debugging)
	 */
	getBlocked(): readonly WAPatchName[] {
		return Array.from(this.blocked)
	}
}

// ============================================================================
// Sync Error Classification
// ============================================================================

/**
 * Classification of sync errors for determining retry behavior.
 */
export enum SyncErrorAction {
	/** Error is due to missing key - block collection and wait for keys */
	BLOCK_ON_KEY = 'BLOCK_ON_KEY',
	/** Error is retriable - reset state and try again */
	RETRY = 'RETRY',
	/** Error is irrecoverable - stop trying this collection */
	ABORT = 'ABORT'
}

/**
 * Result of classifying a sync error.
 */
export interface SyncErrorClassification {
	action: SyncErrorAction
	error: unknown
	errorMessage: string
	errorStack?: string
}

/**
 * Classify a sync error to determine the appropriate action.
 *
 * @param error - The error that occurred during sync
 * @param attemptCount - Number of attempts made so far for this collection
 * @param maxAttempts - Maximum retry attempts allowed
 * @returns Classification with recommended action
 */
export function classifySyncError(
	error: unknown,
	attemptCount: number,
	maxAttempts: number
): SyncErrorClassification {
	const errorMessage = error instanceof Error ? error.message : String(error)
	const errorStack = error instanceof Error ? error.stack : undefined

	// Check for missing key error first
	if (isSyncdMissingKeyError(error)) {
		return {
			action: SyncErrorAction.BLOCK_ON_KEY,
			error,
			errorMessage,
			errorStack
		}
	}

	// Check for irrecoverable errors
	const isTypeError = error instanceof Error && error.name === 'TypeError'
	const maxAttemptsReached = attemptCount >= maxAttempts

	if (isTypeError || maxAttemptsReached) {
		return {
			action: SyncErrorAction.ABORT,
			error,
			errorMessage,
			errorStack
		}
	}

	// Default: retriable error
	return {
		action: SyncErrorAction.RETRY,
		error,
		errorMessage,
		errorStack
	}
}

// ============================================================================
// Collection Sync Node Preparation
// ============================================================================

/**
 * State information for a collection being synced.
 */
export interface CollectionSyncState {
	name: WAPatchName
	state: LTHashState
	isNewSync: boolean
}

/**
 * Prepare a sync query node for a collection.
 *
 * @param name - Collection name
 * @param state - Current LT hash state for the collection
 * @returns Binary node for the sync query
 */
export function prepareCollectionSyncNode(name: WAPatchName, state: LTHashState): BinaryNode {
	return {
		tag: 'collection',
		attrs: {
			name,
			version: state.version.toString(),
			// return snapshot if being synced from scratch (version 0)
			return_snapshot: (!state.version).toString()
		}
	}
}

/**
 * Prepare sync query nodes for multiple collections.
 *
 * @param collections - Array of collection sync states
 * @returns Array of binary nodes for the sync query
 */
export function prepareCollectionSyncNodes(collections: readonly CollectionSyncState[]): BinaryNode[] {
	return collections.map(({ name, state }) => prepareCollectionSyncNode(name, state))
}

