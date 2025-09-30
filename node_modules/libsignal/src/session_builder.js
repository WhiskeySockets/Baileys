
'use strict';

const BaseKeyType = require('./base_key_type');
const ChainType = require('./chain_type');
const SessionRecord = require('./session_record');
const crypto = require('./crypto');
const curve = require('./curve');
const errors = require('./errors');
const queueJob = require('./queue_job');


class SessionBuilder {

    constructor(storage, protocolAddress) {
        this.addr = protocolAddress;
        this.storage = storage;
    }

    async initOutgoing(device) {
        const fqAddr = this.addr.toString();
        return await queueJob(fqAddr, async () => {
            if (!await this.storage.isTrustedIdentity(this.addr.id, device.identityKey)) {
                throw new errors.UntrustedIdentityKeyError(this.addr.id, device.identityKey);
            }
            curve.verifySignature(device.identityKey, device.signedPreKey.publicKey,
                                  device.signedPreKey.signature, true);
            const baseKey = curve.generateKeyPair();
            const devicePreKey = device.preKey && device.preKey.publicKey;
            const session = await this.initSession(true, baseKey, undefined, device.identityKey,
                                                   devicePreKey, device.signedPreKey.publicKey,
                                                   device.registrationId);
            session.pendingPreKey = {
                signedKeyId: device.signedPreKey.keyId,
                baseKey: baseKey.pubKey
            };
            if (device.preKey) {
                session.pendingPreKey.preKeyId = device.preKey.keyId;
            }
            let record = await this.storage.loadSession(fqAddr);
            if (!record) {
                record = new SessionRecord();
            } else {
                const openSession = record.getOpenSession();
                if (openSession) {
                    console.warn("Closing stale open session for new outgoing prekey bundle");
                    record.closeSession(openSession);
                }
            }
            record.setSession(session);
            await this.storage.storeSession(fqAddr, record);
        });
    }

    async initIncoming(record, message) {
        const fqAddr = this.addr.toString();
        if (!await this.storage.isTrustedIdentity(fqAddr, message.identityKey)) {
            throw new errors.UntrustedIdentityKeyError(this.addr.id, message.identityKey);
        }
        if (record.getSession(message.baseKey)) {
            // This just means we haven't replied.
            return;
        }
        const preKeyPair = await this.storage.loadPreKey(message.preKeyId);
        if (message.preKeyId && !preKeyPair) {
            throw new errors.PreKeyError('Invalid PreKey ID');
        }   
        const signedPreKeyPair = await this.storage.loadSignedPreKey(message.signedPreKeyId);
        if (!signedPreKeyPair) { 
            throw new errors.PreKeyError("Missing SignedPreKey");
        }   
        const existingOpenSession = record.getOpenSession();
        if (existingOpenSession) {
            console.warn("Closing open session in favor of incoming prekey bundle");
            record.closeSession(existingOpenSession);
        }
        record.setSession(await this.initSession(false, preKeyPair, signedPreKeyPair,
                                                 message.identityKey, message.baseKey,
                                                 undefined, message.registrationId));
        return message.preKeyId;
    }

    async initSession(isInitiator, ourEphemeralKey, ourSignedKey, theirIdentityPubKey,
                      theirEphemeralPubKey, theirSignedPubKey, registrationId) {
        if (isInitiator) {
            if (ourSignedKey) {
                throw new Error("Invalid call to initSession");
            }
            ourSignedKey = ourEphemeralKey;
        } else {
            if (theirSignedPubKey) {
                throw new Error("Invalid call to initSession");
            }
            theirSignedPubKey = theirEphemeralPubKey;
        }
        let sharedSecret;
        if (!ourEphemeralKey || !theirEphemeralPubKey) {
            sharedSecret = new Uint8Array(32 * 4);
        } else {
            sharedSecret = new Uint8Array(32 * 5);
        }
        for (var i = 0; i < 32; i++) {
            sharedSecret[i] = 0xff;
        }
        const ourIdentityKey = await this.storage.getOurIdentity();
        const a1 = curve.calculateAgreement(theirSignedPubKey, ourIdentityKey.privKey);
        const a2 = curve.calculateAgreement(theirIdentityPubKey, ourSignedKey.privKey);
        const a3 = curve.calculateAgreement(theirSignedPubKey, ourSignedKey.privKey);
        if (isInitiator) {
            sharedSecret.set(new Uint8Array(a1), 32);
            sharedSecret.set(new Uint8Array(a2), 32 * 2);
        } else {
            sharedSecret.set(new Uint8Array(a1), 32 * 2);
            sharedSecret.set(new Uint8Array(a2), 32);
        }
        sharedSecret.set(new Uint8Array(a3), 32 * 3);
        if (ourEphemeralKey && theirEphemeralPubKey) {
            const a4 = curve.calculateAgreement(theirEphemeralPubKey, ourEphemeralKey.privKey);
            sharedSecret.set(new Uint8Array(a4), 32 * 4);
        }
        const masterKey = crypto.deriveSecrets(Buffer.from(sharedSecret), Buffer.alloc(32),
                                               Buffer.from("WhisperText"));
        const session = SessionRecord.createEntry();
        session.registrationId = registrationId;
        session.currentRatchet = {
            rootKey: masterKey[0],
            ephemeralKeyPair: isInitiator ? curve.generateKeyPair() : ourSignedKey,
            lastRemoteEphemeralKey: theirSignedPubKey,
            previousCounter: 0
        };
        session.indexInfo = {
            created: Date.now(),
            used: Date.now(),
            remoteIdentityKey: theirIdentityPubKey,
            baseKey: isInitiator ? ourEphemeralKey.pubKey : theirEphemeralPubKey,
            baseKeyType: isInitiator ? BaseKeyType.OURS : BaseKeyType.THEIRS,
            closed: -1
        };
        if (isInitiator) {
            // If we're initiating we go ahead and set our first sending ephemeral key now,
            // otherwise we figure it out when we first maybeStepRatchet with the remote's
            // ephemeral key
            this.calculateSendingRatchet(session, theirSignedPubKey);
        }
        return session;
    }

    calculateSendingRatchet(session, remoteKey) {
        const ratchet = session.currentRatchet;
        const sharedSecret = curve.calculateAgreement(remoteKey, ratchet.ephemeralKeyPair.privKey);
        const masterKey = crypto.deriveSecrets(sharedSecret, ratchet.rootKey, Buffer.from("WhisperRatchet"));
        session.addChain(ratchet.ephemeralKeyPair.pubKey, {
            messageKeys: {},
            chainKey: {
                counter: -1,
                key: masterKey[1]
            },
            chainType: ChainType.SENDING
        });
        ratchet.rootKey = masterKey[0];
    }
}

module.exports = SessionBuilder;
