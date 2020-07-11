import fs from 'fs'
import { decryptWA } from './Utils'
import Decoder from '../Binary/Decoder'

interface BrowserMessagesInfo {
    encKey: string,
    macKey: string,
    messages: string[]
}
const file = fs.readFileSync ('./browser-messages.json', {encoding: 'utf-8'})
const json: BrowserMessagesInfo = JSON.parse (file)

const encKey = Buffer.from (json.encKey, 'base64')
const macKey = Buffer.from (json.macKey, 'base64')

const decrypt = buffer => {
    try {
        return decryptWA (buffer, macKey, encKey, new Decoder())
    } catch {
        return decryptWA (buffer, macKey, encKey, new Decoder(), true)
    }
}

json.messages.forEach ((str, i) => {
    const buffer = Buffer.from (str, 'base64')
    try {
        const [tag, json, binaryTags] = decrypt (buffer)
        console.log (
            `
            ${i}.
            messageTag: ${tag}
            output: ${JSON.stringify(json)}
            binaryTags: ${binaryTags}
            `
        )
    } catch (error) {
        console.error (`received error in decoding ${i}: ${error}`)
    }
})