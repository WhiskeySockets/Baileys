import { Boom } from '@hapi/boom'
import BinaryNode from "../BinaryNode"
import { aesDecrypt, hmacSign } from "./generics"
import { DisconnectReason, WATag } from "../Types"

export const decodeWAMessage = (
    message: string | Buffer, 
    auth: { macKey: Buffer, encKey: Buffer }, 
    fromMe: boolean=false
) => {

    let commaIndex = message.indexOf(',') // all whatsapp messages have a tag and a comma, followed by the actual message
    if (commaIndex < 0) throw new Boom('invalid message', { data: message }) // if there was no comma, then this message must be not be valid
    
    if (message[commaIndex+1] === ',') commaIndex += 1
    let data = message.slice(commaIndex+1, message.length)
    
    // get the message tag.
    // If a query was done, the server will respond with the same message tag we sent the query with
    const messageTag: string = message.slice(0, commaIndex).toString()
    let json: any
    let tags: WATag
    if (data.length > 0) {
        if (typeof data === 'string') {
            json = JSON.parse(data) // parse the JSON
        } else {
            const { macKey, encKey } = auth || {}
            if (!macKey || !encKey) {
                throw new Boom('recieved encrypted buffer when auth creds unavailable', { data: message, statusCode: DisconnectReason.badSession })
            }
            /* 
                If the data recieved was not a JSON, then it must be an encrypted message.
                Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
            */
            if (fromMe) {
                tags = [data[0], data[1]]
                data = data.slice(2, data.length)
            }
            
            const checksum = data.slice(0, 32) // the first 32 bytes of the buffer are the HMAC sign of the message
            data = data.slice(32, data.length) // the actual message
            const computedChecksum = hmacSign(data, macKey) // compute the sign of the message we recieved using our macKey
            
            if (checksum.equals(computedChecksum)) {
                // the checksum the server sent, must match the one we computed for the message to be valid
                const decrypted = aesDecrypt(data, encKey) // decrypt using AES
                json = BinaryNode.from(decrypted) // decode the binary message into a JSON array
            } else {
                throw new Boom('Bad checksum', {
                    data: {
                        received: checksum.toString('hex'),
                        computed: computedChecksum.toString('hex'),
                        data: data.slice(0, 80).toString(),
                        tag: messageTag,
                        message: message.slice(0, 80).toString()
                    },
                    statusCode: DisconnectReason.badSession
                })
            }
        }   
    }
    return [messageTag, json, tags] as const
}