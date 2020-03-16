const ProtoBuf = require("protobufjs")

const WATags = {
	LIST_EMPTY: 0,
    STREAM_END: 2,
    DICTIONARY_0: 236,
    DICTIONARY_1: 237,
    DICTIONARY_2: 238,
    DICTIONARY_3: 239,
    LIST_8    : 248,
    LIST_16   : 249,
    JID_PAIR  : 250,
    HEX_8     : 251,
    BINARY_8  : 252,
    BINARY_20 : 253,
    BINARY_32 : 254,
    NIBBLE_8  : 255,
    SINGLE_BYTE_MAX: 256,
    PACKED_MAX: 254
}
const WADoubleByteTokens = []

const WASingleByteTokens = [
    null,null,null,"200","400","404","500","501","502","action","add",
    "after","archive","author","available","battery","before","body",
    "broadcast","chat","clear","code","composing","contacts","count",
    "create","debug","delete","demote","duplicate","encoding","error",
    "false","filehash","from","g.us","group","groups_v2","height","id",
    "image","in","index","invis","item","jid","kind","last","leave",
    "live","log","media","message","mimetype","missing","modify","name",
    "notification","notify","out","owner","participant","paused",
    "picture","played","presence","preview","promote","query","raw",
    "read","receipt","received","recipient","recording","relay",
    "remove","response","resume","retry","s.whatsapp.net","seconds",
    "set","size","status","subject","subscribe","t","text","to","true",
    "type","unarchive","unavailable","url","user","value","web","width",
    "mute","read_only","admin","creator","short","update","powersave",
    "checksum","epoch","block","previous","409","replaced","reason",
    "spam","modify_tag","message_info","delivery","emoji","title",
    "description","canonical-url","matched-text","star","unstar",
    "media_key","filename","identity","unread","page","page_count",
    "search","media_message","security","call_log","profile","ciphertext",
    "invite","gif","vcard","frequent","privacy","blacklist","whitelist",
    "verify","location","document","elapsed","revoke_invite","expiration",
    "unsubscribe","disable","vname","old_jid","new_jid","announcement",
    "locked","prop","label","color","call","offer","call-id",
    "quick_reply", "sticker", "pay_t", "accept", "reject", "sticker_pack",
    "invalid", "canceled", "missed", "connected", "result", "audio",
    "video", "recent"
]
const WebMessageInfo = ProtoBuf.Root.fromJSON( require("./whatsapp_message_coding.json") ).lookupType("proto.WebMessageInfo")

class WhatsAppBinaryEncoder {

	constructor () {
		this.data = []
	}
	pushByte (value) {
		
		this.data.push((value & 0xFF))
	}
	pushInt (value, n, littleEndian=false) {
		for (var i = 0; i < n;i++) {
			const curShift = littleEndian ? i : (n-1-i)
			this.data.push( (value>>(curShift*8)) & 0xFF )
		}
	}
	pushInt20 (value) {
		this.pushBytes ( [(value >> 16) & 0x0F, (value >> 8) & 0xFF, value & 0xFF] )
	}
	pushInt16 (value) {
		this.pushInt(value, 2)
	}
	pushInt32 (value) {
		this.pushInt(value, 4)
	}
	pushInt64 (value) {
		this.pushInt(value, 8)
	}
	pushBytes (bytes) {
		this.data.push.apply(this.data, bytes)
	}
	pushString (str) {
		const bytes = new TextEncoder('utf-8').encode(str)
		this.pushBytes(bytes)
	}
	writeByteLength (length) {
		if (length >= 4294967296) {
			throw "string too large to encode: " + length
		}

		if (length >= (1<<20)) {
			this.pushByte(WATags.BINARY_32)
			this.pushInt32(length)
		} else if (length >= 256) {
			this.pushByte(WATags.BINARY_20)
			this.pushInt20(length)
		} else {
			this.pushByte(WATags.BINARY_8)
			this.pushByte(length)
		}
	}
	writeStringRaw (string) {
		this.writeByteLength( string.length )
		this.pushString(string)
	}
	writeJid(left,right) {
		this.pushByte(WATags.JID_PAIR)
		if (left && left.length > 0) {
			this.writeString(left)
		} else {
			this.writeToken(WATags.LIST_EMPTY)
		}
		this.writeString(right)
	}
	writeToken (token) {
		if (token < 245) {
			this.pushByte(token)
		} else if (token <= 500) {
			throw "invalid token"
		}
	}
	writeString(token, i=null) {
		if (typeof token !== "string") {
			throw "invalid string: " + token
		}

		if (token === "c.us") {
			token = "s.whatsapp.net"
		}
		

		const tokenIndex = WASingleByteTokens.indexOf(token)
		if (!i && token === "s.whatsapp.net") {
			this.writeToken( tokenIndex )
		} else if ( tokenIndex >= 0 ) {
			if (tokenIndex < WATags.SINGLE_BYTE_MAX) {
				this.writeToken(tokenIndex)
			} else {
				const overflow = tokenIndex-WATags.SINGLE_BYTE_MAX
				const dictionaryIndex = overflow >> 8
				if (dictionaryIndex < 0 || dictionaryIndex > 3) {
					throw "double byte dict token out of range: " + token + ", " + tokenIndex
				}
				this.writeToken(WATags.DICTIONARY_0 + dictionaryIndex)
				this.writeToken(overflow % 256)
			}
		} else {
			const jidSepIndex = token.indexOf("@")

			if (jidSepIndex <= 0) {
				this.writeStringRaw(token)
			} else {
				this.writeJid(token.slice(0,jidSepIndex), token.slice(jidSepIndex+1, token.length))
			}
		}
	}
	writeAttributes (attrs) {
		if (!attrs) {
			return
		}
		Object.keys(attrs).forEach (key => {
			this.writeString( key )
			this.writeString( attrs[key] )
		})
	}
	writeListStart (listSize) {
		if (listSize === 0) {
			this.pushByte(WATags.LIST_EMPTY)
		} else if (listSize < 256) {
			this.pushBytes([WATags.LIST_8, listSize])
		} else {
			this.pushByte([WATags.LIST_16, listSize])
		}
	}
	writeChildren (children) {
		if (!children) {
			return
		}

		if (typeof children === "string") {
			this.writeString(children, true)
		} else if (typeof children === "Buffer" || typeof children === "Uint8Array") {
			this.writeByteLength(children.length)
			this.pushBytes(children)
		} else if (Array.isArray(children)) {
			this.writeListStart(children.length)
			children.forEach (c => {
				this.writeNode(c)
			})
		} else if (typeof children === "object") {
			//console.log(children)
			const buff = WebMessageInfo.encode(children).finish()
			this.writeByteLength(buff.length)
			this.pushBytes(buff)
		} else {
			throw "invalid children: " + children + " (" + (typeof children) + ")"
		}
	}
	getNumValidKeys (arr) {
		return arr ? Object.keys(arr).length : 0
	}
	writeNode (node) {
		if (!node) {
			return
		} else if (!Array.isArray(node) || node.length !== 3) {
			throw "invalid node given: " + node
		}

		const numAttributes = this.getNumValidKeys(node[1])

		this.writeListStart( 2*numAttributes + 1 + ( node[2] ? 1 : 0 ) )
		this.writeString(node[0])
		this.writeAttributes(node[1])
		this.writeChildren(node[2])
	}
	write (data) {
		this.data = new Array()
		this.writeNode(data)

		return Buffer.from(this.data)
	}
}
class WhatsAppBinaryDecoder {

	constructor () {
		this.buffer = null
		this.index = 0

	}
	checkEOS (length) {
		if (this.index+length > this.buffer.length) {
			throw "end of stream"
		}
	}
	next () {
		const value = this.buffer[this.index]
		this.index += 1
		return value
	}
	readByte () {
		this.checkEOS(1)
		return this.next()
	}

	readInt (n, littleEndian=false) {
		this.checkEOS(n)
		let val = 0
		for (var i = 0; i < n;i++) {
			const shift = (littleEndian) ? i : (n-1-i)
			val |= this.next() << (shift*8)
		}
		return val
	}
	readInt16 (littleEndian=false) {
		return this.readInt(2, littleEndian)
	}
	readInt20 () {
		this.checkEOS(3)
		return ( (this.next() & 15) << 16 ) + (this.next()<<8) + this.next()
	}
	readInt32 (littleEndian=false) {
		return this.readInt(4, littleEndian)
	}
	readInt64 (littleEndian=false) {
		return this.readInt(8, littleEndian)
	}
	unpackHex (value) {
		if (value >= 0 && value < 16) {
			return value<10 ? ('0'.charCodeAt(0)+value) : ('A'.charCodeAt(0)+value-10)
		}
		throw "invalid hex: " + value
	}
	unpackNibble(value) {
		if (value >= 0 && value <= 9) {
			return '0'.charCodeAt(0)+value
		}
		switch (value) {
			case 10:
				return '-'.charCodeAt(0)
			case 11:
				return '.'.charCodeAt(0)
			case 15:
				return '\0'.charCodeAt(0)
			default:
				throw "invalid nibble: " + value
		}
	}
	unpackByte (tag, value) {
		if (tag === WATags.NIBBLE_8) {
			return this.unpackNibble(value)
		} else if (tag === WATags.HEX_8) {
			return this.unpackHex(value)
		} else {
			throw "unknown tag: " + tag
		}
	}
	readPacked8(tag) {
		const startByte = this.readByte()
		let value = ""
		
		for (var i = 0; i < (startByte&127);i++) {
			let curByte = this.readByte()
			value += String.fromCharCode( this.unpackByte(tag, (curByte&0xF0) >> 4) )
			value += String.fromCharCode( this.unpackByte(tag, curByte&0x0F) )
		}
		if ((startByte >> 7) !== 0) {
			value = value.slice(0,-1)
		}
		return value

	}
	readRangedVarInt (min, max, description="unknown") {
		// value = 
		throw "WTF"
	}
	isListTag (tag) {
		return tag === WATags.LIST_EMPTY || tag === WATags.LIST_8 || tag === WATags.LIST_16
	}
	readListSize (tag) {
		switch (tag) {
			case WATags.LIST_EMPTY:
				return 0
			case WATags.LIST_8:
				return this.readByte()
			case WATags.LIST_16:
				return this.readInt16()
			default:
				throw "invalid tag for list size: " + tag
		}
	}
	readStringFromChars (length) {
		this.checkEOS(length)
		const value = this.buffer.slice(this.index, this.index+length)

		this.index += length
		return new TextDecoder('utf-8').decode(value)
	}
	readString (tag) {
		if (tag >= 3 && tag <= 235) {
			const token = this.getToken(tag)
			return token === "s.whatsapp.net" ? "c.us" : token
		}

		switch (tag) {
			case WATags.DICTIONARY_0:
			case WATags.DICTIONARY_1:
			case WATags.DICTIONARY_2:
			case WATags.DICTIONARY_3:
				return this.getTokenDouble( tag - WATags.DICTIONARY_0, this.readByte() )
			case WATags.LIST_EMPTY:
				return null
			case WATags.BINARY_8:
				return this.readStringFromChars( this.readByte() )
			case WATags.BINARY_20:
				return this.readStringFromChars( this.readInt20() )
			case WATags.BINARY_32:
				return this.readStringFromChars( this.readInt32() )
			case WATags.JID_PAIR:
				const i = this.readString( this.readByte() )
				const j = this.readString( this.readByte() )
				if (i && j) {
					return i + "@" + j
				}
				throw "invalid jid pair: " + i + ", " + j
			case WATags.HEX_8:
			case WATags.NIBBLE_8:
				return this.readPacked8(tag)
			default:
				throw "invalid string with tag: " + tag
		}
	}
	readAttributes (n) {
		if (n !== 0) {
			let attributes = {}
			for (var i = 0;i < n;i++) {
				const index = this.readString(this.readByte())
				const b = this.readByte()
				
				attributes[index] = this.readString(b)
			}
			return attributes
		} else {
			return null
		}
	}
	readList (tag) {
		let list = Array( this.readListSize(tag) )
		for (var i = 0;i < list.length;i++) {
			list[i] = this.readNode() 
		}
		return list
	}
	readBytes (n) {
		this.checkEOS(n)
		const value = this.buffer.slice(this.index, this.index+n)
		this.index += n
		return value
	}
	getToken (index) {
		if (index < 3 || index >= WASingleByteTokens.length) {
			throw "invalid token index: " + index
		}
		return WASingleByteTokens[index]
	}
	getTokenDouble (index1, index2) {
		const n = 256*index1 + index2
		if (n < 0 || n > WADoubleByteTokens.length) {
			throw "invalid double token index: " + n
		}
		return WADoubleByteTokens[n]
	}
	readNode () {
		const listSize = this.readListSize( this.readByte() )
		const descrTag = this.readByte()

		if (descrTag === WATags.STREAM_END) {
			throw "unexpected stream end"
		}

		const descr = this.readString(descrTag)
		if (listSize === 0 || !descr) {
			throw "invalid node"
		}
		//console.log(descr + "," + listSize)

		let attrs = this.readAttributes( (listSize-1) >> 1 )
		let content = null
		

		if (listSize%2 === 0) {
			const tag = this.readByte()
		
			if (this.isListTag(tag)) {
				content = this.readList(tag)
			} else {
				switch (tag) {
					case WATags.BINARY_8:
						content = this.readBytes( this.readByte() )
						break
					case WATags.BINARY_20:
						content = this.readBytes( this.readInt20() )
						break
					case WATags.BINARY_32:
						content = this.readBytes( this.readInt32() )
						break
					default:
						content = this.readString(tag)
						break
				}
			}
		} 
		//console.log( descr + "," + JSON.stringify(attrs) + ", " + content)
		return [descr, attrs, content]
	}

	read (buffer) {
		this.buffer = buffer
		this.index = 0
		
		let node = this.readNode()

		if (node[2]) {
			for (var i = 0; i < node[2].length;i++) {
				if (node[2][0][0] === "message") {
					node[2][i][2] = WebMessageInfo.decode( node[2][i][2] )
				}
			}
		}

		return node
	}

}

module.exports = { Encoder: WhatsAppBinaryEncoder, Decoder: WhatsAppBinaryDecoder }