import { __testing } from '../../Socket/messages-recv'
import type { BinaryNode } from '../../WABinary'

describe('resolveRetryParticipant', () => {
        const resolve = __testing.resolveRetryParticipant

        it('returns existing participant when it already includes a device id', () => {
                const retryNode: BinaryNode = {
                        tag: 'retry',
                        attrs: {
                                count: '1',
                                participant: 'user:2@s.whatsapp.net'
                        },
                        content: undefined
                }

                const result = resolve('user:1@s.whatsapp.net', 'group@g.us', retryNode)
                expect(result.jid).toBe('user:1@s.whatsapp.net')
                expect(result.hasDevice).toBe(true)
        })

        it('falls back to retry sender when participant lacks device id', () => {
                const retryNode: BinaryNode = {
                        tag: 'retry',
                        attrs: {
                                count: '1',
                                from: 'user:4@s.whatsapp.net'
                        },
                        content: undefined
                }

                const result = resolve('user@s.whatsapp.net', 'group@g.us', retryNode)
                expect(result.jid).toBe('user:4@s.whatsapp.net')
                expect(result.hasDevice).toBe(true)
        })

        it('returns fallback without device id when none is available', () => {
                const retryNode: BinaryNode = {
                        tag: 'retry',
                        attrs: {
                                count: '1'
                        },
                        content: undefined
                }

                const result = resolve('user@s.whatsapp.net', 'group@g.us', retryNode)
                expect(result.jid).toBe('user@s.whatsapp.net')
                expect(result.hasDevice).toBe(false)
        })
})
