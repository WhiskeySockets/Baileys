
import { AxiosRequestConfig } from 'axios'
import type { Agent } from 'https'
import type NodeCache from 'node-cache'
import type { Logger } from 'pino'
import type { URL } from 'url'
import { proto } from '../../WAProto'
import { AuthenticationState, TransactionCapabilityOptions } from './Auth'
import { MediaConnInfo } from './Message'

export type WAVersion = [number, number, number]
export type WABrowserDescription = [string, string, string]

export type MessageRetryMap = { [msgId: string]: number }

export type SocketConfig = {
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
    /** provide an auth state object to maintain the auth state */
    auth: AuthenticationState
    /** By default true, should history messages be downloaded and processed */
    downloadHistory: boolean
    /** transaction capability options for SignalKeyStore */
    transactionOpts: TransactionCapabilityOptions
    /** provide a cache to store a user's device list */
    userDevicesCache?: NodeCache
    /** marks the client as online whenever the socket successfully connects */
    markOnlineOnConnect: boolean
    /**
     * map to store the retry counts for failed messages;
     * used to determine whether to retry a message or not */
    msgRetryCounterMap?: MessageRetryMap
    /** width for link preview images */
    linkPreviewImageThumbnailWidth: number
    /** Should Baileys ask the phone for full history, will be received async */
    syncFullHistory: boolean
    /** Should baileys fire init queries automatically, default true */
    fireInitQueries: boolean
    /**
     * generate a high quality link preview,
     * entails uploading the jpegThumbnail to WA
     * */
    generateHighQualityLinkPreview: boolean

    /** options for axios */
    options: AxiosRequestConfig<any>
    /**
     * fetch a message from your store
     * implement this so that messages failed to send (solves the "this message can take a while" issue) can be retried
     * */
    getMessage: (key: proto.IMessageKey) => Promise<proto.IMessage | undefined>
}
