import { createHmac } from 'crypto'
import { proto } from '../../WAProto/index.js'
import reportingFieldsData from '../Defaults/reportingfields.json' assert { type: 'json' }
import type { WAMessageContent, WAMessageKey } from '../Types'
import type { BinaryNode } from '../WABinary'
import { hkdf } from './crypto'

export type ReportingField = {
	f: number
	m?: boolean
	s?: ReportingField[]
}

const reportingFields = reportingFieldsData as ReportingField[]

const ENC_SECRET_REPORT_TOKEN = 'Report Token'

export const shouldIncludeReportingToken = (message: proto.IMessage) =>
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
		Buffer.from(origMsgId),
		Buffer.from(origMsgSender),
		Buffer.from(modificationSender),
		Buffer.from(modificationType)
	])

	return hkdf(origMsgSecret, 32, { info: useCaseSecret.toString('latin1') })
}

const extractReportingTokenContent = (data: Buffer, config: ReportingField[]): Buffer => {
	const wireVarint = 0
	const wireBytes = 2

	type Field = { num: number; bytes: Buffer }
	const fields: Field[] = []

	let i = 0
	while (i < data.length) {
		const tagData = decodeVarint(data, i)
		if (tagData.bytes === 0) {
			break
		}

		const fieldNum = tagData.value >> 3
		const wireType = tagData.value & 0x7
		const fieldCfg = config.find(f => f.f === fieldNum)

		const fieldStart = i
		i += tagData.bytes

		if (!fieldCfg) {
			switch (wireType) {
				case wireVarint:
					i += decodeVarint(data, i).bytes
					break
				case 1:
					i += 8
					break
				case wireBytes: {
					const lenData = decodeVarint(data, i)
					i += lenData.bytes + lenData.value
					break
				}

				case 5:
					i += 4
					break
				default:
					return Buffer.alloc(0)
			}

			continue
		}

		switch (wireType) {
			case wireVarint: {
				const varint = decodeVarint(data, i)
				const varintEnd = i + varint.bytes
				fields.push({ num: fieldNum, bytes: data.subarray(fieldStart, varintEnd) })
				i = varintEnd
				break
			}

			case 1: {
				const end = i + 8
				fields.push({ num: fieldNum, bytes: data.subarray(fieldStart, end) })
				i = end
				break
			}

			case 5: {
				const end = i + 4
				fields.push({ num: fieldNum, bytes: data.subarray(fieldStart, end) })
				i = end
				break
			}

			case wireBytes: {
				const lenData = decodeVarint(data, i)
				const valStart = i + lenData.bytes
				const valEnd = valStart + lenData.value

				if (fieldCfg.m || fieldCfg.s) {
					const sub = extractReportingTokenContent(data.subarray(valStart, valEnd), fieldCfg.s || [])
					if (sub.length > 0) {
						const newLen = encodeVarint(sub.length)
						const newTag = encodeVarint(tagData.value)
						const final = Buffer.concat([newTag, newLen, sub])
						fields.push({ num: fieldNum, bytes: final })
					}
				} else {
					fields.push({ num: fieldNum, bytes: data.subarray(fieldStart, valEnd) })
				}

				i = valEnd
				break
			}

			default:
				return Buffer.alloc(0)
		}
	}

	fields.sort((a, b) => a.num - b.num)
	return Buffer.concat(fields.map(f => f.bytes))
}

const decodeVarint = (buffer: Buffer, offset: number) => {
	let value = 0
	let bytes = 0
	let shift = 0
	while (offset + bytes < buffer.length) {
		const current = buffer[offset + bytes]!
		value |= (current & 0x7f) << shift
		bytes++
		if ((current & 0x80) === 0) {
			return { value, bytes }
		}

		shift += 7
	}

	return { value: 0, bytes: 0 }
}

const encodeVarint = (value: number) => {
	const parts: number[] = []
	let remaining = value
	while (remaining > 0x7f) {
		parts.push((remaining & 0x7f) | 0x80)
		remaining >>= 7
	}

	parts.push(remaining)
	return Buffer.from(parts)
}

export const getMessageReportingToken = async (
	msgProtobuf: Buffer,
	message: WAMessageContent,
	key: WAMessageKey
): Promise<BinaryNode | null> => {
	if (!message.messageContextInfo?.messageSecret || !key.id) {
		return null
	}

	const from = key.fromMe ? key.remoteJid! : key.participant || key.remoteJid!
	const to = key.fromMe ? key.participant || key.remoteJid! : key.remoteJid!

	const reportingSecret = await generateMsgSecretKey(
		ENC_SECRET_REPORT_TOKEN,
		key.id,
		from,
		to,
		message.messageContextInfo.messageSecret
	)

	const content = extractReportingTokenContent(msgProtobuf, reportingFields)
	if (content.length === 0) {
		return null
	}

	const hmac = createHmac('sha256', reportingSecret).update(content)
	const reportingToken = hmac.digest().subarray(0, 16)

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
