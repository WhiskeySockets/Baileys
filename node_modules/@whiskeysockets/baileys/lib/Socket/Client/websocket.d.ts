import WebSocket from 'ws';
import { AbstractSocketClient } from './types.js';
export declare class WebSocketClient extends AbstractSocketClient {
    protected socket: WebSocket | null;
    get isOpen(): boolean;
    get isClosed(): boolean;
    get isClosing(): boolean;
    get isConnecting(): boolean;
    connect(): Promise<void>;
    close(): Promise<void>;
    send(str: string | Uint8Array, cb?: (err?: Error) => void): boolean;
}
//# sourceMappingURL=websocket.d.ts.map