export type SocketConfig = {
	/** the WS url to connect to WA */
	waWebSocketUrl: string | URL
	/** Fails the connection if the socket times out in this interval */
	connectTimeoutMs: number
	/** Default timeout for queries, undefined for no timeout */
	defaultQueryTimeoutMs: number | undefined
	/** ping-pong interval for WS connection */
	keepAliveIntervalMs: number
	/** should baileys use the mobile api instead of the multi device api
	 * @deprecated This feature has been removed
	 */
	mobile?: boolean
	/** proxy agent */
	agent?: Agent
	/** logger */
	logger: ILogger
	/** version to connect with */
	version: WAVersion
	/** override browser config */
	browser: WABrowserDescription
	/** Initial pushName carried in the registration ClientPayload (used by mock servers for deterministic phone assignment). */
	pushName?: string
	/** agent used for fetch requests -- uploading/downloading media */
	fetchAgent?: Agent
	/** should the QR be printed in the terminal
	 * @deprecated This feature has been removed
	 */
	printQRInTerminal?: boolean
	/** should events be emitted for actions done by this socket connection */
	emitOwnEvents: boolean
	/** Skip emitting `messages.upsert` for the sender's own message when `noSelfSync` is true.
	 * This only suppresses the local self-sync fanout behavior, not the general emitOwnEvents toggle.
	 */
	noSelfSync: boolean
	/** custom upload hosts to upload media to */
	customUploadHosts: MediaConnInfo['hosts']
