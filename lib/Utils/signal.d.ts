import { SignalRepository } from '../Types';
import { AuthenticationCreds, AuthenticationState, KeyPair, SignalIdentity, SignalKeyStore, SignedKeyPair } from '../Types/Auth';
import { BinaryNode, JidWithDevice } from '../WABinary';
export declare const createSignalIdentity: (wid: string, accountSignatureKey: Uint8Array) => SignalIdentity;
export declare const getPreKeys: ({ get }: SignalKeyStore, min: number, limit: number) => Promise<{
    [id: string]: KeyPair;
}>;
export declare const generateOrGetPreKeys: (creds: AuthenticationCreds, range: number) => {
    newPreKeys: {
        [id: number]: KeyPair;
    };
    lastPreKeyId: number;
    preKeysRange: readonly [number, number];
};
export declare const xmppSignedPreKey: (key: SignedKeyPair) => BinaryNode;
export declare const xmppPreKey: (pair: KeyPair, id: number) => BinaryNode;
export declare const parseAndInjectE2ESessions: (node: BinaryNode, repository: SignalRepository) => Promise<void>;
export declare const extractDeviceJids: (result: BinaryNode, myJid: string, excludeZeroDevices: boolean) => JidWithDevice[];
/**
 * get the next N keys for upload or processing
 * @param count number of pre-keys to get or generate
 */
export declare const getNextPreKeys: ({ creds, keys }: AuthenticationState, count: number) => Promise<{
    update: Partial<AuthenticationCreds>;
    preKeys: {
        [id: string]: KeyPair;
    };
}>;
export declare const getNextPreKeysNode: (state: AuthenticationState, count: number) => Promise<{
    update: Partial<AuthenticationCreds>;
    node: BinaryNode;
}>;
