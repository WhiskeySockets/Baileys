import { describe, expect, it } from '@jest/globals'
import { jest } from '@jest/globals'
import { proto } from '../../../WAProto'
import { generateWAMessageContent } from '../../Utils/messages'
import type {
    AnyMessageContent,
    MessageContentGenerationOptions,
    WAMediaUploadFunction,
    WAMessageContent,
} from '../../Types/Message'

describe('messageSecret option — proto.Message wire round-trip', () => {
    const knownSecret = new Uint8Array(32).fill(0xAB)

    // Stub upload that returns the minimal shape prepareWAMessageMedia expects.
    // Typed against the public WAMediaUploadFunction signature so the test
    // catches drift if the contract changes.
    const makeUploadStub = (): WAMediaUploadFunction =>
        jest.fn<WAMediaUploadFunction>(async (_encFilePath, _opts) => ({
            mediaUrl: 'https://example.com/uploaded',
            directPath: '/v/t62.7117-24/x',
        }))

    it('text DM: messageSecret survives proto.Message.encode → decode', async () => {
        const content: AnyMessageContent = { text: 'wire-test' }
        const options: MessageContentGenerationOptions = {
            messageSecret: knownSecret,
            // Text path doesn't upload; the stub satisfies the required type.
            upload: makeUploadStub(),
        }
        const m: WAMessageContent = await generateWAMessageContent(content, options)

        // Sanity check pre-encode
        expect(m.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(m.messageContextInfo!.messageSecret as Uint8Array)).toEqual(Buffer.from(knownSecret))

        // This is the exact encoder Baileys' send pipeline uses to produce
        // wire bytes before encryption — verify the field survives.
        const encoded = proto.Message.encode(m as proto.IMessage).finish()
        const decoded: proto.IMessage = proto.Message.decode(encoded)

        expect(decoded.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(decoded.messageContextInfo!.messageSecret as Uint8Array)).toEqual(Buffer.from(knownSecret))
    })

    it('image DM: messageSecret survives proto.Message.encode → decode', async () => {
        const content: AnyMessageContent = { image: Buffer.alloc(16), caption: 'wire-test' }
        const options: MessageContentGenerationOptions = {
            messageSecret: knownSecret,
            upload: makeUploadStub(),
        }
        const m: WAMessageContent = await generateWAMessageContent(content, options)

        expect(m.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(m.messageContextInfo!.messageSecret as Uint8Array)).toEqual(Buffer.from(knownSecret))

        const encoded = proto.Message.encode(m as proto.IMessage).finish()
        const decoded: proto.IMessage = proto.Message.decode(encoded)

        expect(decoded.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(decoded.messageContextInfo!.messageSecret as Uint8Array)).toEqual(Buffer.from(knownSecret))
    })
})
