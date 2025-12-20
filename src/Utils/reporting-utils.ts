import { createHmac } from 'crypto'
import { proto } from '../../WAProto/index.js'
import type { WAMessageContent, WAMessageKey } from '../Types'
import type { BinaryNode } from '../WABinary'
import { hkdf } from './crypto'

export type ReportingField = {
	f: number
	m?: boolean
	s?: ReportingField[]
}

type CompiledReportingField = {
	m?: boolean
	children?: Map<number, CompiledReportingField>
}

const reportingFields: ReportingField[] = [
	{ f: 1 },
	{
		f: 3,
		s: [{ f: 2 }, { f: 3 }, { f: 8 }, { f: 11 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 25 }]
	},
	{ f: 4, s: [{ f: 1 }, { f: 16 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 5, s: [{ f: 3 }, { f: 4 }, { f: 5 }, { f: 16 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 6, s: [{ f: 1 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 30 }] },
	{ f: 7, s: [{ f: 2 }, { f: 7 }, { f: 10 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 20 }] },
	{ f: 8, s: [{ f: 2 }, { f: 7 }, { f: 9 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 21 }] },
	{ f: 9, s: [{ f: 2 }, { f: 6 }, { f: 7 }, { f: 13 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 20 }] },
	{ f: 12, s: [{ f: 1 }, { f: 2 }, { f: 14, m: true }, { f: 15 }] },
	{ f: 18, s: [{ f: 6 }, { f: 16 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 26, s: [{ f: 4 }, { f: 5 }, { f: 8 }, { f: 13 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 28, s: [{ f: 1 }, { f: 2 }, { f: 4 }, { f: 5 }, { f: 6 }, { f: 7, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 37, s: [{ f: 1, m: true }] },
	{
		f: 49,
		s: [
			{ f: 2 },
			{ f: 3, s: [{ f: 1 }, { f: 2 }] },
			{ f: 5, s: [{ f: 21 }, { f: 22 }] },
			{ f: 8, s: [{ f: 1 }, { f: 2 }] }
		]
	},
	{ f: 53, s: [{ f: 1, m: true }] },
	{ f: 55, s: [{ f: 1, m: true }] },
	{ f: 58, s: [{ f: 1, m: true }] },
	{ f: 59, s: [{ f: 1, m: true }] },
	{
		f: 60,
		s: [
			{ f: 2 },
			{ f: 3, s: [{ f: 1 }, { f: 2 }] },
			{ f: 5, s: [{ f: 21 }, { f: 22 }] },
			{ f: 8, s: [{ f: 1 }, { f: 2 }] }
		]
	},
	{
		f: 64,
		s: [
			{ f: 2 },
			{ f: 3, s: [{ f: 1 }, { f: 2 }] },
			{ f: 5, s: [{ f: 21 }, { f: 22 }] },
			{ f: 8, s: [{ f: 1 }, { f: 2 }] }
		]
	},
	{ f: 66, s: [{ f: 2 }, { f: 6 }, { f: 7 }, { f: 13 }, { f: 17, s: [{ f: 21 }, { f: 22 }] }, { f: 20 }] },
	{ f: 74, s: [{ f: 1, m: true }] },
	{ f: 87, s: [{ f: 1, m: true }] },
	{ f: 88, s: [{ f: 1 }, { f: 2, s: [{ f: 1 }] }, { f: 3, s: [{ f: 21 }, { f: 22 }] }] },
	{ f: 92, s: [{ f: 1, m: true }] },
	{ f: 93, s: [{ f: 1, m: true }] },
	{ f: 94, s: [{ f: 1, m: true }] }
]

const compileReportingFields = (fields: readonly ReportingField[]): Map<number, CompiledReportingField> => {
	const map = new Map<number, CompiledReportingField>()
	for (const f of fields) {
		map.set(f.f, {
			m: f.m,
			children: f.s ? compileReportingFields(f.s) : undefined
		})
	}

	return map
}

const compiledReportingFields = compileReportingFields(reportingFields)
const EMPTY_MAP: Map<number, CompiledReportingField> = new Map()

const ENC_SECRET_REPORT_TOKEN = 'Report Token'

const WIRE = {
	VARINT: 0,
	FIXED64: 1,
	BYTES: 2,
	FIXED32: 5
} as const

export const shouldIncludeReportingToken = (message: proto.IMessage): boolean =>
	!message.reactionMessage &&
	!message.encReactionMessage &&
	!message.encEventResponseMessage &&
	!message.pollUpdateMessage

const generateMsgSecretKey = async (
	modificationType: string,
	origMsgId: string,
	origMsgSender: string,
	modificationSender: string,
	origMsgSecret: Uint8Array
) => {
	const useCaseSecret = Buffer.concat([
		Buffer.from(origMsgId, 'utf8'),
		Buffer.from(origMsgSender, 'utf8'),
		Buffer.from(modificationSender, 'utf8'),
		Buffer.from(modificationType, 'utf8')
	])

	return hkdf(origMsgSecret, 32, { info: useCaseSecret.toString('latin1') })
}

type FieldBytes = { num: number; bytes: Buffer }

const extractReportingTokenContent = (data: Buffer, cfg: Map<number, CompiledReportingField>): Buffer | null => {
	const out: FieldBytes[] = []
	let i = 0

	while (i < data.length) {
		const tag = decodeVarint(data, i)
		if (!tag.ok) {
			return null
		}

		const fieldNum = tag.value >> 3
		const wireType = tag.value & 0x7

		const fieldStart = i
		i += tag.bytes

		const fieldCfg = cfg.get(fieldNum)

		const pushSlice = (end: number): boolean => {
			if (end > data.length) {
				return false
			}

			out.push({ num: fieldNum, bytes: data.subarray(fieldStart, end) })
			i = end
			return true
		}

		const skip = (end: number): boolean => {
			if (end > data.length) {
				return false
			}

			i = end
			return true
		}

		if (wireType === WIRE.VARINT) {
			const v = decodeVarint(data, i)
			if (!v.ok) {
				return null
			}

			const end = i + v.bytes

			if (!fieldCfg) {
				if (!skip(end)) {
					return null
				}

				continue
			}

			if (!pushSlice(end)) {
				return null
			}

			continue
		}

		if (wireType === WIRE.FIXED64) {
			const end = i + 8

			if (!fieldCfg) {
				if (!skip(end)) {
					return null
				}

				continue
			}

			if (!pushSlice(end)) {
				return null
			}

			continue
		}

		if (wireType === WIRE.FIXED32) {
			const end = i + 4

			if (!fieldCfg) {
				if (!skip(end)) {
					return null
				}

				continue
			}

			if (!pushSlice(end)) {
				return null
			}

			continue
		}

		if (wireType === WIRE.BYTES) {
			const len = decodeVarint(data, i)
			if (!len.ok) {
				return null
			}

			const valStart = i + len.bytes
			const valEnd = valStart + len.value
			if (valEnd > data.length) {
				return null
			}

			if (!fieldCfg) {
				i = valEnd
				continue
			}

			if (fieldCfg.m || fieldCfg.children) {
				const sub = extractReportingTokenContent(data.subarray(valStart, valEnd), fieldCfg.children ?? EMPTY_MAP)
				if (sub === null) {
					return null
				}

				if (sub.length > 0) {
					const newTag = encodeVarint(tag.value)
					const newLen = encodeVarint(sub.length)
					out.push({
						num: fieldNum,
						bytes: Buffer.concat([newTag, newLen, sub])
					})
				}

				i = valEnd
				continue
			}

			out.push({ num: fieldNum, bytes: data.subarray(fieldStart, valEnd) })
			i = valEnd
			continue
		}

		return null
	}

	if (out.length === 0) {
		return Buffer.alloc(0)
	}

	out.sort((a, b) => a.num - b.num)
	return Buffer.concat(out.map(f => f.bytes))
}

type Varint = { value: number; bytes: number; ok: boolean }

const decodeVarint = (buffer: Buffer, offset: number): Varint => {
	let value = 0
	let bytes = 0
	let shift = 0

	while (offset + bytes < buffer.length) {
		const current = buffer[offset + bytes]!
		value |= (current & 0x7f) << shift
		bytes++

		if ((current & 0x80) === 0) {
			return { value, bytes, ok: true }
		}

		shift += 7

		if (shift > 35) {
			return { value: 0, bytes: 0, ok: false }
		}
	}

	return { value: 0, bytes: 0, ok: false }
}

const encodeVarint = (value: number): Buffer => {
	const parts: number[] = []
	let remaining = value >>> 0

	while (remaining > 0x7f) {
		parts.push((remaining & 0x7f) | 0x80)
		remaining >>>= 7
	}

	parts.push(remaining)
	return Buffer.from(parts)
}

export const getMessageReportingToken = async (
	msgProtobuf: Buffer,
	message: WAMessageContent,
	key: WAMessageKey
): Promise<BinaryNode | null> => {
	const msgSecret = message.messageContextInfo?.messageSecret
	if (!msgSecret || !key.id) {
		return null
	}

	const from = key.fromMe ? key.remoteJid! : key.participant || key.remoteJid!
	const to = key.fromMe ? key.participant || key.remoteJid! : key.remoteJid!

	const reportingSecret = await generateMsgSecretKey(ENC_SECRET_REPORT_TOKEN, key.id, from, to, msgSecret)

	const content = extractReportingTokenContent(msgProtobuf, compiledReportingFields)
	if (!content || content.length === 0) {
		return null
	}

	const reportingToken = createHmac('sha256', reportingSecret).update(content).digest().subarray(0, 16)

	return {
		tag: 'reporting',
		attrs: {},
		content: [
			{
				tag: 'reporting_token',
				attrs: { v: '2' },
				content: reportingToken
			}
		]
	}
}
