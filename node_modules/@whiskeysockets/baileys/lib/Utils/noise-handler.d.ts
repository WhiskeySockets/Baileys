import { proto } from '../../WAProto/index.js';
import type { KeyPair } from '../Types/index.js';
import type { BinaryNode } from '../WABinary/index.js';
import type { ILogger } from './logger.js';
export declare const makeNoiseHandler: ({ keyPair: { private: privateKey, public: publicKey }, NOISE_HEADER, logger, routingInfo }: {
    keyPair: KeyPair;
    NOISE_HEADER: Uint8Array;
    logger: ILogger;
    routingInfo?: Buffer | undefined;
}) => {
    encrypt: (plaintext: Uint8Array) => Buffer<ArrayBuffer>;
    decrypt: (ciphertext: Uint8Array) => Buffer<ArrayBuffer>;
    authenticate: (data: Uint8Array) => void;
    mixIntoKey: (data: Uint8Array) => Promise<void>;
    finishInit: () => Promise<void>;
    processHandshake: ({ serverHello }: proto.HandshakeMessage, noiseKey: KeyPair) => Promise<Buffer<ArrayBuffer>>;
    encodeFrame: (data: Buffer | Uint8Array) => Buffer<ArrayBuffer>;
    decodeFrame: (newData: Buffer | Uint8Array, onFrame: (buff: Uint8Array | BinaryNode) => void) => Promise<void>;
};
//# sourceMappingURL=noise-handler.d.ts.map