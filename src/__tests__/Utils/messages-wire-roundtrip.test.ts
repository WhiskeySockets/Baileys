import { describe, expect, it } from '@jest/globals'
import { jest } from '@jest/globals'
import { proto } from '../../../WAProto'
import { generateWAMessageContent } from '../../Utils/messages'

describe('messageSecret option — proto.Message wire round-trip', () => {
    const knownSecret = new Uint8Array(32).fill(0xAB)

    // Stub upload that returns the minimal shape prepareWAMessageMedia expects
    const makeUploadStub = () =>
        jest.fn().mockResolvedValue({
            mediaUrl: 'https://example.com/uploaded',
            directPath: '/v/t62.7117-24/x',
        }) as any

    it('text DM: messageSecret survives proto.Message.encode → decode', async () => {
        const m: any = await generateWAMessageContent(
            { text: 'wire-test' },
            { userJid: 'me@s.whatsapp.net', messageSecret: knownSecret } as any,
        )

        // Sanity check pre-encode
        expect(m.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))

        // This is the exact encoder Baileys' send pipeline uses to produce
        // wire bytes before encryption — verify the field survives.
        const encoded = proto.Message.encode(m as proto.IMessage).finish()
        const decoded: any = proto.Message.decode(encoded)

        expect(decoded.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(decoded.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
    })

    it('image DM: messageSecret survives proto.Message.encode → decode', async () => {
        const m: any = await generateWAMessageContent(
            { image: Buffer.alloc(16), caption: 'wire-test' } as any,
            {
                userJid: 'me@s.whatsapp.net',
                messageSecret: knownSecret,
                upload: makeUploadStub(),
            } as any,
        )

        expect(m.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))

        const encoded = proto.Message.encode(m as proto.IMessage).finish()
        const decoded: any = proto.Message.decode(encoded)

        expect(decoded.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(decoded.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
    })
})
