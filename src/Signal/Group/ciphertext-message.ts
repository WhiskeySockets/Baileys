export class CiphertextMessage {
	readonly UNSUPPORTED_VERSION: number = 1
	readonly CURRENT_VERSION: number = 3
	readonly WHISPER_TYPE: number = 2
	readonly PREKEY_TYPE: number = 3
	readonly SENDERKEY_TYPE: number = 4
	readonly SENDERKEY_DISTRIBUTION_TYPE: number = 5
	readonly ENCRYPTED_MESSAGE_OVERHEAD: number = 53
}
