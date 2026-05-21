import { describe, expect, it } from '@jest/globals'
import { proto } from '../../../WAProto'
import { encodeNewsletterMessage } from '../../Utils/generics'
import { generateWAMessageContent } from '../../Utils/messages'

describe('encodeNewsletterMessage preserves messageContextInfo.messageSecret', () => {
    const knownSecret = new Uint8Array(32).fill(0xAB)

    it('text message: messageSecret survives encode → decode round-trip', async () => {
        const m: any = await generateWAMessageContent(
            { text: 'newsletter hello' },
            { userJid: 'me@s.whatsapp.net', messageSecret: knownSecret } as any,
        )
        expect(m.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(m.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))

        const encoded = encodeNewsletterMessage(m as proto.IMessage)
        const decoded: any = proto.Message.decode(encoded)

        expect(decoded.messageContextInfo?.messageSecret).toBeDefined()
        expect(Buffer.from(decoded.messageContextInfo.messageSecret)).toEqual(Buffer.from(knownSecret))
    })
})
