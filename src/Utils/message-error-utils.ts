import { proto } from '../../WAProto/index.js'
import type { WAMessage } from '../Types'
import { MISSING_KEYS_ERROR_TEXT, NO_MESSAGE_FOUND_ERROR_TEXT } from './decode-wa-message'

export function isDecryptionFailure(msg: WAMessage): boolean {
	return msg.messageStubType === proto.WebMessageInfo.StubType.CIPHERTEXT
}

function getDecryptionErrorMessage(msg: WAMessage): string {
	return msg.messageStubParameters?.[0] ?? ''
}

export function isRecoverableDecryptionError(msg: WAMessage): boolean {
	const errorMessage = getDecryptionErrorMessage(msg)
	return errorMessage === MISSING_KEYS_ERROR_TEXT || errorMessage === NO_MESSAGE_FOUND_ERROR_TEXT
}

export function isPreKeyDecryptionError(msg: WAMessage): boolean {
	return getDecryptionErrorMessage(msg).includes('PreKey')
}

export function shouldAttemptRetry(msg: WAMessage, category: string | undefined): boolean {
	return isDecryptionFailure(msg) && category !== 'peer' && !isRecoverableDecryptionError(msg)
}
