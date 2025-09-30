import { proto } from '../../WAProto/index.js';
import type { LIDMappingStore } from '../Signal/lid-mapping.js';
type DecryptGroupSignalOpts = {
    group: string;
    authorJid: string;
    msg: Uint8Array;
};
type ProcessSenderKeyDistributionMessageOpts = {
    item: proto.Message.ISenderKeyDistributionMessage;
    authorJid: string;
};
type DecryptSignalProtoOpts = {
    jid: string;
    type: 'pkmsg' | 'msg';
    ciphertext: Uint8Array;
};
type EncryptMessageOpts = {
    jid: string;
    data: Uint8Array;
};
type EncryptGroupMessageOpts = {
    group: string;
    data: Uint8Array;
    meId: string;
};
type PreKey = {
    keyId: number;
    publicKey: Uint8Array;
};
type SignedPreKey = PreKey & {
    signature: Uint8Array;
};
type E2ESession = {
    registrationId: number;
    identityKey: Uint8Array;
    signedPreKey: SignedPreKey;
    preKey: PreKey;
};
type E2ESessionOpts = {
    jid: string;
    session: E2ESession;
};
export type SignalRepository = {
    decryptGroupMessage(opts: DecryptGroupSignalOpts): Promise<Uint8Array>;
    processSenderKeyDistributionMessage(opts: ProcessSenderKeyDistributionMessageOpts): Promise<void>;
    decryptMessage(opts: DecryptSignalProtoOpts): Promise<Uint8Array>;
    encryptMessage(opts: EncryptMessageOpts): Promise<{
        type: 'pkmsg' | 'msg';
        ciphertext: Uint8Array;
    }>;
    encryptGroupMessage(opts: EncryptGroupMessageOpts): Promise<{
        senderKeyDistributionMessage: Uint8Array;
        ciphertext: Uint8Array;
    }>;
    injectE2ESession(opts: E2ESessionOpts): Promise<void>;
    validateSession(jid: string): Promise<{
        exists: boolean;
        reason?: string;
    }>;
    jidToSignalProtocolAddress(jid: string): string;
    migrateSession(fromJid: string, toJid: string): Promise<{
        migrated: number;
        skipped: number;
        total: number;
    }>;
    validateSession(jid: string): Promise<{
        exists: boolean;
        reason?: string;
    }>;
    deleteSession(jids: string[]): Promise<void>;
};
export interface SignalRepositoryWithLIDStore extends SignalRepository {
    lidMapping: LIDMappingStore;
}
export {};
//# sourceMappingURL=Signal.d.ts.map