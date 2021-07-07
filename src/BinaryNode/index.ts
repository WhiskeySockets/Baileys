import decode from './decode'
import encode from './encode'
import { BinaryNode as BinaryNodeType } from './types'

export default class BinaryNode extends BinaryNodeType {
	toBuffer = () => encode(this, [])
	static from = (buffer: Buffer) => decode(buffer, () => new BinaryNode(), { index: 0 })
}