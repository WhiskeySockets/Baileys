export type MessageRelayOptions = MinimalRelayOptions & {
	/** only send to a specific participant; used when a message decryption fails for a single user */
	participant?: { jid: string; count: number }
	/** additional attributes to add to the WA binary node */
	additionalAttributes?: { [_: string]: string }
	additionalNodes?: BinaryNode[]
	/** should we use the devices cache, or fetch afresh from the server; default assumed to be "true" */
	useUserDevicesCache?: boolean
	/** jid list of participants for status@broadcast */
	statusJidList?: string[]
	/**
	 * noSelfSync: per-call override for the default socket behavior.
	 * - true  = do not fan out/sync this message to the sender's own other devices
	 * - false = allow sync to the sender's other devices (normal behavior)
	 * - undefined = use the global socket default
	 */
	noSelfSync?: boolean
}

export type MiscMessageGenerationOptions = MinimalRelayOptions & {
	/** optional, if you want to manually set the timestamp of the message */
	timestamp?: Date
	/** the message you want to quote */
	quoted?: WAMessage
	/** disappearing messages settings */
	ephemeralExpiration?: number | string
	/** timeout for media upload to WA server */
	mediaUploadTimeoutMs?: number
	/** jid list of participants for status@broadcast */
	statusJidList?: string[]
	/** backgroundcolor for status */
	backgroundColor?: string
	/** font type for status */
	font?: number
	/** if it is broadcast */
	broadcast?: boolean
	/**
	 * noSelfSync: per-call override for the default socket behavior.
	 * - true  = do not fan out/sync this message to the sender's own other devices
	 * - false = allow sync to the sender's other devices (normal behavior)
	 * - undefined = use the global socket default
	 */
	noSelfSync?: boolean
}

export type MessageGenerationOptionsFromContent = MiscMessageGenerationOptions & {
	userJid: string
}
