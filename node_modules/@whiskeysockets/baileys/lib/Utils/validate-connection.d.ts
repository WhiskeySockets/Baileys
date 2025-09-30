import { proto } from '../../WAProto/index.js';
import type { AuthenticationCreds, SignalCreds, SocketConfig } from '../Types/index.js';
import { type BinaryNode } from '../WABinary/index.js';
export declare const generateLoginNode: (userJid: string, config: SocketConfig) => proto.IClientPayload;
export declare const generateRegistrationNode: ({ registrationId, signedPreKey, signedIdentityKey }: SignalCreds, config: SocketConfig) => proto.ClientPayload;
export declare const configureSuccessfulPairing: (stanza: BinaryNode, { advSecretKey, signedIdentityKey, signalIdentities }: Pick<AuthenticationCreds, "advSecretKey" | "signedIdentityKey" | "signalIdentities">) => {
    creds: Partial<AuthenticationCreds>;
    reply: BinaryNode;
};
export declare const encodeSignedDeviceIdentity: (account: proto.IADVSignedDeviceIdentity, includeSignatureKey: boolean) => Uint8Array<ArrayBufferLike>;
//# sourceMappingURL=validate-connection.d.ts.map