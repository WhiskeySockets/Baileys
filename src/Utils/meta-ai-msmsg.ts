import { proto } from '../../WAProto/index.js'
import { aesDecryptGCM, hkdf } from './crypto'
import { unpadRandomMax16 } from './generics'

const BOT_MESSAGE_INFO = 'Bot Message'
const KEY_LENGTH = 32
const AUTH_TAG_LENGTH = 16

const MSG_ID_HEX_RE = /^[0-9A-Fa-f]{32}$/

export interface MsmsgMessageKey {
	participant: string
	meId: string
	meLid?: string
	conversationJid?: string
	senderJid?: string
	botType?: string | null
	botEditTargetId?: string | null
	metaTargetId?: string | null
	stanzaId?: string
	targetId?: string
	targetIdCandidates?: string[]
}

interface IdCandidate {
	messageId: string
	idSource: string
	idSources: string[]
}

interface JidCandidate {
	source: string
	jid: string
	value: Buffer
}

interface DecryptionStrategy {
	mode: '2step'
	idSource: string
	idSources: string[]
	infoSource: string
	aadSource: string
	authTagLayout: 'trailing'
	messageId: string
	info: Buffer
	aad: Buffer
	attemptLabel: string
}

const toBuffer = (value: Uint8Array | Buffer | string): Buffer => {
	if (Buffer.isBuffer(value)) return value
	if (value instanceof Uint8Array) return Buffer.from(value.buffer, value.byteOffset, value.byteLength)
	return Buffer.from(value)
}

const normalizeLidJid = (jid: string | undefined): string | undefined => {
	if (!jid || !jid.endsWith('@lid') || !jid.includes(':')) return jid
	return `${jid.split(':')[0]}@lid`
}

const buildMessageIdRepresentations = (messageId: string): { label: string; value: Buffer }[] => {
	const ascii = Buffer.from(messageId)
	const binary = MSG_ID_HEX_RE.test(messageId) ? Buffer.from(messageId, 'hex') : ascii
	return [
		{ label: 'msgIdAscii', value: ascii },
		...(binary.equals(ascii) ? [] : [{ label: 'msgIdBinary', value: binary }])
	]
}

const pushUnique = (items: DecryptionStrategy[], seen: Set<string>, item: DecryptionStrategy): void => {
	const key = JSON.stringify([
		item.messageId,
		item.idSource,
		item.idSources,
		item.infoSource,
		item.aadSource,
		item.info.toString('hex'),
		item.aad.toString('hex')
	])
	if (!seen.has(key)) {
		seen.add(key)
		items.push(item)
	}
}

const getCandidateIds = (messageKey: MsmsgMessageKey): IdCandidate[] => {
	const orderedCandidates: { source: string; messageId: string | null | undefined }[] = [
		messageKey.botType === 'full'
			? { source: 'stanzaId', messageId: messageKey.stanzaId }
			: { source: 'botEditTargetId', messageId: messageKey.botEditTargetId },
		{ source: 'targetId', messageId: messageKey.targetId },
		{ source: 'metaTargetId', messageId: messageKey.metaTargetId },
		{ source: 'stanzaId', messageId: messageKey.stanzaId }
	]

	const targetIdCandidates = Array.isArray(messageKey.targetIdCandidates) ? messageKey.targetIdCandidates : []
	for (let index = 0; index < targetIdCandidates.length; index++) {
		orderedCandidates.push({ source: `targetIdCandidates[${index}]`, messageId: targetIdCandidates[index] })
	}

	const grouped = new Map<string, IdCandidate>()
	for (const candidate of orderedCandidates) {
		if (!candidate.messageId) continue
		const messageId = String(candidate.messageId)
		const existing = grouped.get(messageId)
		if (existing) {
			if (!existing.idSources.includes(candidate.source)) {
				existing.idSources.push(candidate.source)
			}
		} else {
			grouped.set(messageId, { messageId, idSource: candidate.source, idSources: [candidate.source] })
		}
	}

	return Array.from(grouped.values())
}

const getJidCandidates = (messageKey: MsmsgMessageKey): JidCandidate[] => {
	const ordered: { source: string; jid: string | undefined }[] = [
		{ source: 'meId', jid: messageKey.meId },
		{ source: 'conversationJid', jid: messageKey.conversationJid },
		{ source: 'senderJid', jid: messageKey.senderJid },
		{ source: 'meLidNormalized', jid: normalizeLidJid(messageKey.meLid) }
	]

	const seen = new Set<string>()
	const candidates: JidCandidate[] = []
	for (const candidate of ordered) {
		if (!candidate.jid) continue
		const jid = String(candidate.jid)
		if (!seen.has(jid)) {
			seen.add(jid)
			candidates.push({ source: candidate.source, jid, value: Buffer.from(jid) })
		}
	}

	return candidates
}

export const buildMsmsgDecryptionStrategies = (messageKey: MsmsgMessageKey): DecryptionStrategy[] => {
	const botJid = String(messageKey.participant || '')
	const botJidBuffer = Buffer.from(botJid)
	const targetIds = getCandidateIds(messageKey)
	const jidCandidates = getJidCandidates(messageKey)
	const primaryJid = jidCandidates[0]
	if (!primaryJid) return []
	const alternateJid = jidCandidates.find(
		candidate => candidate.source !== primaryJid.source && candidate.jid !== botJid
	)
	const strategies: DecryptionStrategy[] = []
	const seen = new Set<string>()

	for (const idCandidate of targetIds) {
		const idForms = buildMessageIdRepresentations(idCandidate.messageId)
		for (const idForm of idForms) {
			pushUnique(strategies, seen, {
				mode: '2step',
				idSource: idCandidate.idSource,
				idSources: idCandidate.idSources,
				infoSource: `${idForm.label}+meId+botJid`,
				aadSource: `${idForm.label}+0+botJid`,
				authTagLayout: 'trailing',
				messageId: idCandidate.messageId,
				info: Buffer.concat([idForm.value, primaryJid.value, botJidBuffer, new Uint8Array(0)]),
				aad: Buffer.concat([idForm.value, Buffer.from([0]), botJidBuffer]),
				attemptLabel: `${idCandidate.idSource}:${idForm.label}:primary`
			})

			if (alternateJid) {
				pushUnique(strategies, seen, {
					mode: '2step',
					idSource: idCandidate.idSource,
					idSources: idCandidate.idSources,
					infoSource: `${idForm.label}+${alternateJid.source}+botJid`,
					aadSource: `${idForm.label}+0+${alternateJid.source}`,
					authTagLayout: 'trailing',
					messageId: idCandidate.messageId,
					info: Buffer.concat([idForm.value, alternateJid.value, botJidBuffer, new Uint8Array(0)]),
					aad: Buffer.concat([idForm.value, Buffer.from([0]), alternateJid.value]),
					attemptLabel: `${idCandidate.idSource}:${idForm.label}:${alternateJid.source}`
				})
			}
		}
	}

	return strategies.slice(0, 12)
}

const assertRequired = (value: unknown, label: string): void => {
	if (
		!value ||
		(value instanceof Uint8Array && value.byteLength === 0)
	) {
		throw new Error(`Missing required ${label} for msmsg decryption`)
	}
}

const decryptWithStrategy = (
	messageSecret: Uint8Array | Buffer,
	msMsg: proto.IMessageSecretMessage,
	strategy: DecryptionStrategy
): Buffer => {
	const baseSecret = Buffer.from(hkdf(toBuffer(messageSecret), KEY_LENGTH, { info: BOT_MESSAGE_INFO }))
	const key = Buffer.from(hkdf(baseSecret, KEY_LENGTH, { info: strategy.info }))
	const payload = toBuffer(msMsg.encPayload as Uint8Array)
	const ciphertextWithTag = Buffer.concat([payload.slice(0, -AUTH_TAG_LENGTH), payload.slice(-AUTH_TAG_LENGTH)])
	return aesDecryptGCM(ciphertextWithTag, key, toBuffer(msMsg.encIv as Uint8Array), strategy.aad)
}

export const decodeDecryptedMsmsgMessage = (decrypted: Uint8Array | Buffer): proto.IMessage => {
	const messageBuffer = toBuffer(decrypted)
	try {
		const unpadded = Buffer.from(unpadRandomMax16(messageBuffer))
		const decoded = proto.Message.decode(unpadded)
		const hasContent = Object.keys(decoded).some(key => key !== 'messageContextInfo' && decoded[key as keyof typeof decoded] != null)
		if (hasContent) return decoded
	} catch {
		// fall through to unpadded decode below
	}
	return proto.Message.decode(messageBuffer)
}

export const decryptMsmsgBotMessage = async (
	messageSecret: Uint8Array | Buffer,
	messageKey: MsmsgMessageKey,
	msMsg: proto.IMessageSecretMessage
): Promise<Buffer> => {
	assertRequired(messageSecret, 'messageSecret')
	assertRequired(messageKey.participant, 'participant')
	assertRequired(messageKey.meId, 'meId')
	assertRequired(msMsg.encIv, 'encIv')
	assertRequired(msMsg.encPayload, 'encPayload')

	if (getCandidateIds(messageKey).length === 0) {
		throw new Error('Missing required target message id for msmsg decryption')
	}

	const strategies = buildMsmsgDecryptionStrategies(messageKey)
	const attemptedStrategies: object[] = []
	let lastError: unknown

	for (const strategy of strategies) {
		const attempt = {
			idSource: strategy.idSource,
			idSources: strategy.idSources,
			infoSource: strategy.infoSource,
			aadSource: strategy.aadSource,
			messageId: strategy.messageId
		}
		try {
			return decryptWithStrategy(messageSecret, msMsg, strategy)
		} catch (error) {
			attemptedStrategies.push(attempt)
			lastError = error
		}
	}

	const error = Object.assign(new Error('Failed to decrypt msmsg with bounded deterministic strategies'), {
		attemptedStrategies,
		cause: lastError
	})
	throw error
}

export const decodeRichResponseMessage = (richMsg: proto.IAIRichResponseMessage | null | undefined): string => {
	try {
		if (!richMsg) return ''
		if (Array.isArray(richMsg.submessages) && richMsg.submessages.length > 0) {
			const sub = richMsg.submessages
				.map((s: proto.IAIRichResponseSubMessage) => s.messageText)
				.filter(Boolean)
				.join('\n')
			if (sub) return sub
		}
		const data = (richMsg as any).unifiedResponse?.data
		if (!data) return ''
		const json = JSON.parse(Buffer.from(data, 'base64').toString('utf8'))
		const texts: string[] = []
		for (const section of json.sections || []) {
			const prim = section?.view_model?.primitive
			if (prim?.text) texts.push(prim.text)
			if (prim?.header) texts.push(prim.header)
			for (const sub of section?.view_model?.items || []) {
				if (sub?.primitive?.text) texts.push(sub.primitive.text)
			}
		}
		return texts.join('\n')
	} catch {
		return ''
	}
}
