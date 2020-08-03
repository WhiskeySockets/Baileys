import fs from 'fs'
import { decryptWA } from './Utils'
import Decoder from '../Binary/Decoder'

interface BrowserMessagesInfo {
    encKey: string,
    macKey: string,
    harFilePath: string
}
interface WSMessage {
    type: 'send' | 'receive',
    data: string
}
const file = fs.readFileSync ('./browser-messages.json', {encoding: 'utf-8'})
const json: BrowserMessagesInfo = JSON.parse (file)

const encKey = Buffer.from (json.encKey, 'base64')
const macKey = Buffer.from (json.macKey, 'base64')

const harFile = JSON.parse ( fs.readFileSync( json.harFilePath , {encoding: 'utf-8'}))
const entries = harFile['log']['entries']
let wsMessages: WSMessage[] = []
entries.forEach ((e, i) => {    
    if ('_webSocketMessages' in e) {
        wsMessages.push (...e['_webSocketMessages'])
    }
})
const decrypt = buffer => {
    try {
        return decryptWA (buffer, macKey, encKey, new Decoder())
    } catch {
        return decryptWA (buffer, macKey, encKey, new Decoder(), true)
    }
}

console.log ('parsing ' + wsMessages.length + ' messages')
const list = wsMessages.map ((item, i) => {
    const buffer = Buffer.from (item.data, 'base64')
    try {

        const [tag, json, binaryTags] = decrypt (buffer)
        return {tag, json: JSON.stringify(json), binaryTags}
    } catch (error) {
        try {
            const [tag, json, binaryTags] = decrypt (item.data)
            return {tag, json: JSON.stringify(json), binaryTags}
        } catch (error) {
            console.log ('error in decoding: ' + item.data + ': ' + error)
            return null
        }
        
    }
})
const str = JSON.stringify (list, null, '\t')
fs.writeFileSync ('decoded-ws.json', str)