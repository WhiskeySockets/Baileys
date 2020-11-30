import { strict as assert } from 'assert'
import Encoder from '../Binary/Encoder'
import Decoder from '../Binary/Decoder'

describe('Binary Coding Tests', () => {
    const testVectors: [string, Object][] = [
        [
            'f806092f5a0a10f804f80234fc6c0a350a1b39313735323938373131313740732e77686174736170702e6e657410011a143345423030393637354537454433374141424632122b0a292a7069616e6f20726f6f6d2074696d696e6773206172653a2a0a20363a3030414d2d31323a3030414d18b3faa7f3052003f80234fc4c0a410a1b39313735323938373131313740732e77686174736170702e6e657410001a20304643454335333330463634393239433645394132434646443242433845414418bdfaa7f305c00101f80234fc930a350a1b39313735323938373131313740732e77686174736170702e6e657410011a14334542303033433742353339414644303937353312520a50536f727279206672656e2c204920636f756c646e277420756e6465727374616e6420274c69627261272e2054797065202768656c702720746f206b6e6f77207768617420616c6c20492063616e20646f18c1faa7f3052003f80234fc540a410a1b39313735323938373131313740732e77686174736170702e6e657410001a20413132333042384436423041314437393345433241453245413043313638443812090a076c69627261727918c2faa7f305',
            [
                'action',
                { last: 'true', add: 'before' },
                [
                    [
                        'message',
                        null,
                        {
                            key: { remoteJid: '917529871117@s.whatsapp.net', fromMe: true, id: '3EB009675E7ED37AABF2' },
                            message: { conversation: '*piano room timings are:*\n 6:00AM-12:00AM' },
                            messageTimestamp: '1584004403',
                            status: 'DELIVERY_ACK',
                        },
                    ],
                    [
                        'message',
                        null,
                        {
                            key: {
                                remoteJid: '917529871117@s.whatsapp.net',
                                fromMe: false,
                                id: '0FCEC5330F64929C6E9A2CFFD2BC8EAD',
                            },
                            messageTimestamp: '1584004413',
                            messageStubType: 'REVOKE',
                        },
                    ],
                    [
                        'message',
                        null,
                        {
                            key: { remoteJid: '917529871117@s.whatsapp.net', fromMe: true, id: '3EB003C7B539AFD09753' },
                            message: {
                                conversation:
                                    "Sorry fren, I couldn't understand 'Libra'. Type 'help' to know what all I can do",
                            },
                            messageTimestamp: '1584004417',
                            status: 'DELIVERY_ACK',
                        },
                    ],
                    [
                        'message',
                        null,
                        {
                            key: {
                                remoteJid: '917529871117@s.whatsapp.net',
                                fromMe: false,
                                id: 'A1230B8D6B0A1D793EC2AE2EA0C168D8',
                            },
                            message: { conversation: 'library' },
                            messageTimestamp: '1584004418',
                        },
                    ],
                ],
            ],
        ],
        [
            'f8063f2dfafc0831323334353637385027fc0431323334f801f80228fc0701020304050607',
            [
                'picture', 
                {jid: '12345678@c.us', id: '1234'}, 
                [['image', null, Buffer.from([1,2,3,4,5,6,7])]]
            ]
        ]
    ]
    const encoder = new Encoder()
    const decoder = new Decoder()

    it('should decode strings', () => {
        testVectors.forEach(pair => {
            const buff = Buffer.from(pair[0], 'hex')
            const decoded = decoder.read(buff)
            //console.log((decoded[2][0][2]))
            assert.deepStrictEqual(decoded, pair[1])

            const encoded = encoder.write(decoded)
            assert.deepStrictEqual(encoded, buff)
        })
        console.log('all coding tests passed')
    })
})
