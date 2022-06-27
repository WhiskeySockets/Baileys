import { jidEncode } from '../WABinary'


export function randomJid() {
	return jidEncode(Math.floor(Math.random() * 1000000), Math.random() < 0.5 ? 's.whatsapp.net' : 'g.us')
}