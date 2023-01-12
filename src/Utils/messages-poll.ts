// original code: https://gist.github.com/PurpShell/44433d21631ff0aefbea57f7b5e31139

/**
 * Create crypto instance.
 * @description If your nodejs crypto module doesn't have WebCrypto, you must install `@peculiar/webcrypto` first
 * @return {Crypto}
 */
export const getCrypto = (): Crypto => {
	const c = require('crypto')

	return 'subtle' in (c?.webcrypto || {}) ? c.webcrypto : new (require('@peculiar/webcrypto').Crypto)()
}

/**
     * Compare the SHA-256 hashes of the poll options from the update to find the original choices
     * @param options Options from the poll creation message
     * @param pollOptionHashes hash from `decryptPollMessageRaw()`
     * @return {Promise<string[]>} the original option, can be empty when none are currently selected
     */
export const comparePollMessage = async(options: string[], pollOptionHashes: string[]): Promise<string[]> => {
	const selectedOptions: string[] = []
	const crypto = getCrypto()
	for(const option of options) {
		const hash = Buffer
			.from(
				await crypto.subtle.digest(
					'SHA-256',
					(new TextEncoder).encode(option)
				)
			)
			.toString('hex').toUpperCase()

		if(pollOptionHashes.findIndex(h => h === hash) > -1) {
			selectedOptions.push(option)
		}
	}

	;
	return selectedOptions
}

/**
     * Raw method to decrypt the message after gathering all information
     * @description Use `decryptPollMessage()` instead, only use this if you know what you are doing
     * @param encPayload Encryption payload/contents want to decrypt, you can get it from `pollUpdateMessage.vote.encPayload`
     * @param encIv Encryption iv (used to decrypt the payload), you can get it from `pollUpdateMessage.vote.encIv`
     * @param additionalData poll Additional data to decrypt poll message
     * @param decryptionKey Generated decryption key to decrypt the poll message
     * @return {Promise<Uint8Array>}
     */
const decryptPollMessageInternal = async(
	encPayload: Uint8Array,
	encIv: Uint8Array,
	additionalData: Uint8Array,
	decryptionKey: Uint8Array,
): Promise<Uint8Array> => {
	const crypto = getCrypto()

	const tagSize_multiplier = 16
	const encoded = encPayload
	const key = await crypto.subtle.importKey('raw', decryptionKey, 'AES-GCM', false, ['encrypt', 'decrypt'])
	const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: encIv, additionalData: additionalData, tagLength: 8 * tagSize_multiplier }, key, encoded)
	return new Uint8Array(decrypted).slice(2) // remove 2 bytes (OA20)(space+newline)
}

/**
     * Decode the message from `decryptPollMessageInternal()`
     * @param decryptedMessage the message from `decrpytPollMessageInternal()`
     * @return {string}
     */
export const decodePollMessage = (decryptedMessage: Uint8Array): string => {
	const n = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70]
	const outarr: number[] = []

	for(let i = 0; i < decryptedMessage.length; i++) {
		const val = decryptedMessage[i]
		outarr.push(n[val >> 4], n[15 & val])
	}

	return String.fromCharCode(...outarr)
}

/**
     * raw function to decrypt a poll message update
     * @param encPayload Encryption payload/contents want to decrypt, you can get it from `pollUpdateMessage.vote.encPayload`
     * @param encIv Encryption iv (used to decrypt the payload), you can get it from `pollUpdateMessage.vote.encIv`
     * @param encKey Encryption key (used to decrypt the payload), you need to store/save the encKey. If you want get the encKey, you could get it from `Message.messageContextInfo.messageSecret`, only available on poll creation message.
     * @param pollMsgSender sender The sender's jid of poll message, you can use `pollUpdateMessage.pollCreationMessageKey.participant` (Note: you need to normalize the jid first)
     * @param pollMsgId The ID of poll message, you can use `pollUpdateMessage.pollMessageCreationKey.id`
     * @param voteMsgSender The poll voter's jid, you can use `Message.key.remoteJid`, `Message.key.participant`, or `Message.participant`. (Note: you need to normalize the jid first)
     * @return {Promise<string[]>} The option or empty array if something went wrong OR everything was unticked
     */
export const decryptPollMessageRaw = async(
	encKey: Uint8Array,
	encPayload: Uint8Array,
	encIv: Uint8Array,
	pollMsgSender: string,
	pollMsgId: string,
	voteMsgSender: string
): Promise<string[]> => {
	const enc = new TextEncoder()
	const crypto = getCrypto()

	const stanzaId = enc.encode(pollMsgId)
	const parentMsgOriginalSender = enc.encode(pollMsgSender)
	const modificationSender = enc.encode(voteMsgSender)
	const modificationType = enc.encode('Poll Vote')
	const pad = new Uint8Array([1])

	const signMe = new Uint8Array([...stanzaId, ...parentMsgOriginalSender, ...modificationSender, ...modificationType, pad] as any)

	const createSignKey = async(n: Uint8Array = new Uint8Array(32)) => {
		return (await crypto.subtle.importKey('raw', n,
			{ 'name': 'HMAC', 'hash': 'SHA-256' }, false, ['sign']
		))
	}

	const sign = async(n: Uint8Array, key: CryptoKey) => {
		return (await crypto.subtle.sign({ 'name': 'HMAC', 'hash': 'SHA-256' }, key, n))
	}

	let key = await createSignKey()

	const temp = await sign(encKey, key)

	key = await createSignKey(new Uint8Array(temp))

	const decryptionKey = new Uint8Array(await sign(signMe, key))

	const additionalData = enc.encode(`${pollMsgId}\u0000${voteMsgSender}`)

	const decryptedMessage = await decryptPollMessageInternal(encPayload, encIv, additionalData, decryptionKey)

	const pollOptionHash = decodePollMessage(decryptedMessage)

	// '0A20' in hex represents unicode " " and "\n" thus declaring the end of one option
	// we want multiple hashes to make it easier to iterate and understand for your use cases
	return pollOptionHash.split('0A20') || []
}
