import { SenderChainKey } from './sender_chain_key'
import { SenderKeyMessage } from './sender_key_message'
import * as proto from '../Proto'

export class SenderKeyState {
    MAX_MESSAGE_KEYS = 2000;

    constructor(
        private id?: number,
        private iteration?: number,
        private chainKey?: Uint8Array,
        private signatureKeyPair?: proto.SenderKeyStateStructureSenderSigningKey,
        private signatureKeyPublic?: Uint8Array,
        private signatureKeyPrivate?: Uint8Array,
        private senderKeyStateStructure: proto.SenderKeyStateStructure = {}
    ) {
        if (senderKeyStateStructure) {
            this.senderKeyStateStructure = senderKeyStateStructure;
        } else {
            if (signatureKeyPair) {
                signatureKeyPublic = signatureKeyPair.public;
                signatureKeyPrivate = signatureKeyPair.private;
            }

            chainKey = typeof chainKey === 'string' ? Buffer.from(chainKey, 'base64') : chainKey;


            const senderChainKeyStructure: proto.SenderKeyStateStructureSenderChainKey = {}
            senderChainKeyStructure.iteration = iteration;
            senderChainKeyStructure.seed = chainKey;
            this.senderKeyStateStructure.senderChainKey = senderChainKeyStructure;

            const signingKeyStructure: proto.SenderKeyStateStructureSenderSigningKey = {}


            signingKeyStructure.public =
                typeof signatureKeyPublic === 'string' ?
                Buffer.from(signatureKeyPublic, 'base64') :
                signatureKeyPublic!;
            if (signatureKeyPrivate) {
                signingKeyStructure.private =
                    typeof signatureKeyPrivate === 'string' ?
                    Buffer.from(signatureKeyPrivate, 'base64') :
                    signatureKeyPrivate;
            }
            // @TODO FIX THIS
            // this.senderKeyStateStructure.senderChainKey = id;
            // this.senderChainKey = senderChainKeyStructure;
            this.senderKeyStateStructure.senderSigningKey = signingKeyStructure;
        }
        this.senderKeyStateStructure.senderMessageKeys =
            this.senderKeyStateStructure.senderMessageKeys || [];
    }

    SenderKeyState(senderKeyStateStructure) {
        this.senderKeyStateStructure = senderKeyStateStructure;
    }

    getKeyId() {
        return this.senderKeyStateStructure.senderKeyId;
    }

    getSenderChainKey() {
        if(!this.senderKeyStateStructure.senderChainKey) {
            throw new Error('No sender chain key')
        }

        return new SenderChainKey(
            this.senderKeyStateStructure.senderChainKey.iteration,
            this.senderKeyStateStructure.senderChainKey.seed
        );
    }

    setSenderChainKey(chainKey) {
        this.senderKeyStateStructure.senderChainKey = {
            iteration: chainKey.getIteration(),
            seed: chainKey.getSeed()
        };
    }

    getSigningKeyPublic() {
        return typeof this.senderKeyStateStructure.senderSigningKey?.public === 'string' ?
            Buffer.from(this.senderKeyStateStructure.senderSigningKey.public, 'base64') :
            this.senderKeyStateStructure.senderSigningKey?.public;
    }

    getSigningKeyPrivate() {
        return typeof this.senderKeyStateStructure.senderSigningKey?.private === 'string' ?
            Buffer.from(this.senderKeyStateStructure.senderSigningKey.private, 'base64') :
            this.senderKeyStateStructure.senderSigningKey?.private;
    }

    hasSenderMessageKey(iteration) {
        const list = this.senderKeyStateStructure.senderMessageKeys;

        if(!list) {
            return false
        }

        for (let o = 0; o < list.length; o++) {
            const senderMessageKey = list[o];
            if (senderMessageKey.iteration === iteration) return true;
        }
        return false;
    }

    addSenderMessageKey(senderMessageKey) {
        // const senderMessageKeyStructure = protobufs.SenderKeyStateStructure.create({
        //     iteration: senderMessageKey.getIteration(),
        //     seed: senderMessageKey.getSeed(),
        // });

        this.senderKeyStateStructure.senderMessageKeys?.push({
            iteration: senderMessageKey.getIteration(),
            seed: senderMessageKey.getSeed(),
        });


        if (this.senderKeyStateStructure.senderMessageKeys &&this.senderKeyStateStructure.senderMessageKeys.length > this.MAX_MESSAGE_KEYS) {
            this.senderKeyStateStructure.senderMessageKeys.shift();
        }
    }

    removeSenderMessageKey(iteration?: number) {
        let result: proto.SenderKeyStateStructureSenderMessageKey | undefined;

        this.senderKeyStateStructure.senderMessageKeys = this.senderKeyStateStructure.senderMessageKeys?.filter(
            senderMessageKey => {
                if (senderMessageKey.iteration === iteration) result = senderMessageKey;
                return senderMessageKey.iteration !== iteration;
            }
        );

        if (result) {
            // @TODO FIX THIS
            // @ts-ignore
            return new SenderKeyMessage(result.iteration, result.seed);
        }
        return null;
    }

    getStructure() {
        return this.senderKeyStateStructure;
    }
}