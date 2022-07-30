
import type { Agent } from 'https'
import type NodeCache from 'node-cache'
import type { Logger } from 'pino'
import type { URL } from 'url'
import { MediaConnInfo } from './Message'

export type WAVersion = [number, number, number]
export type WABrowserDescription = [string, string, string]

export type CommonSocketConfig = {
    /** the WS url to connect to WA */
    waWebSocketUrl: string | URL
    /** Fails the connection if the socket times out in this interval */
	connectTimeoutMs: number
    /** Default timeout for queries, undefined for no timeout */
    defaultQueryTimeoutMs: number | undefined
    /** ping-pong interval for WS connection */
    keepAliveIntervalMs: number
    /** proxy agent */
	agent?: Agent
    /** pino logger */
	logger: Logger
    /** version to connect with */
    version: WAVersion
    /** override browser config */
	browser: WABrowserDescription
	/** agent used for fetch requests -- uploading/downloading media */
	fetchAgent?: Agent
    /** should the QR be printed in the terminal */
    printQRInTerminal: boolean
    /** should events be emitted for actions done by this socket connection */
    emitOwnEvents: boolean
    /** provide a cache to store media, so does not have to be re-uploaded */
    mediaCache?: NodeCache
    /** custom upload hosts to upload media to */
    customUploadHosts: MediaConnInfo['hosts']
    /** time to wait between sending new retry requests */
    retryRequestDelayMs: number
    /** time to wait for the generation of the next QR in ms */
    qrTimeout?: number;
}
