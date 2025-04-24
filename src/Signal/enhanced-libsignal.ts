import * as libsignal from 'libsignal'
import { GroupCipher, GroupSessionBuilder, SenderKeyDistributionMessage, SenderKeyName, SenderKeyRecord } from '../../WASignalGroup'
import { SignalAuthState, SignalKeyStoreWithTransaction } from '../Types'
import { SignalRepository } from '../Types/Signal'
import { addEnhancedTransactionCapability, generateSignalPubKey } from '../Utils'
import { jidDecode } from '../WABinary'
import logger from '../Utils/logger'

/**
 * Enhanced version of the libsignal repository that uses the enhanced signal store
 * with improved locking mechanisms to prevent race conditions and data corruption.
 * 
 * @param auth The signal authentication state
 * @returns A signal repository with enhanced storage capabilities
 */
export function makeEnhancedLibSignalRepository(auth: SignalAuthState): SignalRepository {
    // Apply enhanced transaction capability to the key store
    const enhancedKeys = addEnhancedTransactionCapability(
        auth.keys,
        logger,
        {
            maxCommitRetries: 5,
            delayBetweenTriesMs: 100
        }
    ) as SignalKeyStoreWithTransaction
    
    // Create a new auth state with the enhanced key store
    const enhancedAuth: SignalAuthState = {
        creds: auth.creds,
        keys: enhancedKeys
    }
    
    // Create the signal storage with the enhanced auth state
    const storage = signalStorage(enhancedAuth)
    
    return {
        decryptGroupMessage({ group, authorJid, msg }) {
            const senderName = jidToSignalSenderKeyName(group, authorJid)
            const cipher = new GroupCipher(storage, senderName)

            return cipher.decrypt(msg)
        },
        async processSenderKeyDistributionMessage({ item, authorJid }) {
            const builder = new GroupSessionBuilder(storage)
            const senderName = jidToSignalSenderKeyName(item.groupId!, authorJid)

            const senderMsg = new SenderKeyDistributionMessage(null, null, null, null, item.axolotlSenderKeyDistributionMessage)
            
            // Use transaction to ensure atomicity
            return (enhancedAuth.keys as SignalKeyStoreWithTransaction).transaction(async () => {
                const { [senderName]: senderKey } = await enhancedAuth.keys.get('sender-key', [senderName])
                if(!senderKey) {
                    await storage.storeSenderKey(senderName, new SenderKeyRecord())
                }

                await builder.process(senderName, senderMsg)
            })
        },
        async decryptMessage({ jid, type, ciphertext }) {
            const addr = jidToSignalProtocolAddress(jid)
            const session = new libsignal.SessionCipher(storage, addr)
            
            // Use transaction to ensure atomicity
            return (enhancedAuth.keys as SignalKeyStoreWithTransaction).transaction(async () => {
                let result: Buffer
                switch (type) {
                case 'pkmsg':
                    result = await session.decryptPreKeyWhisperMessage(ciphertext)
                    break
                case 'msg':
                    result = await session.decryptWhisperMessage(ciphertext)
                    break
                }

                return result
            })
        },
        async encryptMessage({ jid, data }) {
            const addr = jidToSignalProtocolAddress(jid)
            const cipher = new libsignal.SessionCipher(storage, addr)

            // Use transaction to ensure atomicity
            return (enhancedAuth.keys as SignalKeyStoreWithTransaction).transaction(async () => {
                const { type: sigType, body } = await cipher.encrypt(data)
                const type = sigType === 3 ? 'pkmsg' : 'msg'
                return { type, ciphertext: Buffer.from(body, 'binary') }
            })
        },
        async encryptGroupMessage({ group, meId, data }) {
            const senderName = jidToSignalSenderKeyName(group, meId)
            const builder = new GroupSessionBuilder(storage)

            // Use transaction to ensure atomicity
            return (enhancedAuth.keys as SignalKeyStoreWithTransaction).transaction(async () => {
                const { [senderName]: senderKey } = await enhancedAuth.keys.get('sender-key', [senderName])
                if(!senderKey) {
                    await storage.storeSenderKey(senderName, new SenderKeyRecord())
                }

                const senderKeyDistributionMessage = await builder.create(senderName)
                const session = new GroupCipher(storage, senderName)
                const ciphertext = await session.encrypt(data)

                return {
                    ciphertext,
                    senderKeyDistributionMessage: senderKeyDistributionMessage.serialize(),
                }
            })
        },
        async injectE2ESession({ jid, session }) {
            const cipher = new libsignal.SessionBuilder(storage, jidToSignalProtocolAddress(jid))
            
            // Use transaction to ensure atomicity
            return (enhancedAuth.keys as SignalKeyStoreWithTransaction).transaction(async () => {
                await cipher.initOutgoing(session)
            })
        },
        jidToSignalProtocolAddress(jid) {
            return jidToSignalProtocolAddress(jid).toString()
        },
    }
}

const jidToSignalProtocolAddress = (jid: string) => {
    const { user, device } = jidDecode(jid)!
    return new libsignal.ProtocolAddress(user, device || 0)
}

const jidToSignalSenderKeyName = (group: string, user: string): string => {
    return new SenderKeyName(group, jidToSignalProtocolAddress(user)).toString()
}

function signalStorage({ creds, keys }: SignalAuthState) {
    return {
        loadSession: async(id: string) => {
            const { [id]: sess } = await keys.get('session', [id])
            if(sess) {
                return libsignal.SessionRecord.deserialize(sess)
            }
        },
        storeSession: async(id, session) => {
            await keys.set({ 'session': { [id]: session.serialize() } })
        },
        isTrustedIdentity: () => {
            return true
        },
        loadPreKey: async(id: number | string) => {
            const keyId = id.toString()
            const { [keyId]: key } = await keys.get('pre-key', [keyId])
            if(key) {
                return {
                    privKey: Buffer.from(key.private),
                    pubKey: Buffer.from(key.public)
                }
            }
        },
        removePreKey: (id: number) => keys.set({ 'pre-key': { [id]: null } }),
        loadSignedPreKey: () => {
            const key = creds.signedPreKey
            return {
                privKey: Buffer.from(key.keyPair.private),
                pubKey: Buffer.from(key.keyPair.public)
            }
        },
        loadSenderKey: async(keyId: string) => {
            const { [keyId]: key } = await keys.get('sender-key', [keyId])
            if(key) {
                return new SenderKeyRecord(key)
            }
        },
        storeSenderKey: async(keyId, key) => {
            await keys.set({ 'sender-key': { [keyId]: key.serialize() } })
        },
        getOurRegistrationId: () => (
            creds.registrationId
        ),
        getOurIdentity: () => {
            const { signedIdentityKey } = creds
            return {
                privKey: Buffer.from(signedIdentityKey.private),
                pubKey: generateSignalPubKey(signedIdentityKey.public),
            }
        }
    }
}