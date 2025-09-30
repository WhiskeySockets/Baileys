import type { WAMessage } from '../Types/index.js';
import type { SignalRepositoryWithLIDStore } from '../Types/Signal.js';
import { type BinaryNode } from '../WABinary/index.js';
import type { ILogger } from './logger.js';
export declare const NO_MESSAGE_FOUND_ERROR_TEXT = "Message absent from node";
export declare const MISSING_KEYS_ERROR_TEXT = "Key used already or never filled";
export declare const DECRYPTION_RETRY_CONFIG: {
    maxRetries: number;
    baseDelayMs: number;
    sessionRecordErrors: string[];
};
export declare const NACK_REASONS: {
    ParsingError: number;
    UnrecognizedStanza: number;
    UnrecognizedStanzaClass: number;
    UnrecognizedStanzaType: number;
    InvalidProtobuf: number;
    InvalidHostedCompanionStanza: number;
    MissingMessageSecret: number;
    SignalErrorOldCounter: number;
    MessageDeletedOnPeer: number;
    UnhandledError: number;
    UnsupportedAdminRevoke: number;
    UnsupportedLIDGroup: number;
    DBOperationFailed: number;
};
export declare const extractAddressingContext: (stanza: BinaryNode) => {
    addressingMode: string;
    senderAlt: string | undefined;
    recipientAlt: string | undefined;
};
/**
 * Decode the received node as a message.
 * @note this will only parse the message, not decrypt it
 */
export declare function decodeMessageNode(stanza: BinaryNode, meId: string, meLid: string): {
    fullMessage: WAMessage;
    author: string;
    sender: string;
};
export declare const decryptMessageNode: (stanza: BinaryNode, meId: string, meLid: string, repository: SignalRepositoryWithLIDStore, logger: ILogger) => {
    fullMessage: WAMessage;
    category: string | undefined;
    author: string;
    decrypt(): Promise<void>;
};
//# sourceMappingURL=decode-wa-message.d.ts.map