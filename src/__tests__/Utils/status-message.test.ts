import { decodeMessageNode, getStatusSessionScope } from '../../Utils/decode-wa-message'
import type { BinaryNode } from '../../WABinary'

const me = '100000000001@s.whatsapp.net'
const meLid = '100000000002@lid'

// Authored envelopes, not captured account traffic.
describe('status publication routing', () => {
	it.each([
		['status@broadcast', 'personal'],
		['120363000000001@g.us', 'group'],
		['120363000000001@newsletter', 'channel']
	])('classifies a status from %s without changing its chat', (from, statusKind) => {
		const node: BinaryNode = {
			tag: 'status',
			attrs: { from, id: 'synthetic', t: '1700000000', participant: meLid, participant_pn: me },
			content: []
		}
		const { fullMessage } = decodeMessageNode(node, me, meLid)
		expect(fullMessage).toMatchObject({ statusKind, key: { remoteJid: from } })
		if (statusKind !== 'channel') {
			expect(fullMessage.key.fromMe).toBe(true)
			expect(fullMessage.key.participantAlt).toBe(me)
			expect(fullMessage.key.remoteJidAlt).toBeUndefined()
		}
	})
})

it('keeps ordinary group messages and status mentions outside publication classification', () => {
	const { fullMessage } = decodeMessageNode(
		{ tag: 'message', attrs: { from: '120363000000001@g.us', participant: meLid, id: 'ordinary' }, content: [] },
		me,
		meLid
	)
	expect(fullMessage.statusKind).toBeUndefined()
})
it('selects status sessions only in a status context', () => {
	for (const mode of [0, 1, 2, 3] as const) {
		for (const session_scope of ['', 'status']) {
			for (const from of ['status@broadcast', '120363000000001@g.us', '200000000002@lid']) {
				const node: BinaryNode = {
					tag: 'status',
					attrs: { from },
					content: [{ tag: 'meta', attrs: { session_scope } }]
				}
				const context = from === 'status@broadcast' || (from.endsWith('@g.us') && session_scope === 'status')
				const want = context && (mode === 3 || (mode !== 0 && session_scope === 'status'))
				expect(getStatusSessionScope(node, mode)).toBe(want ? 'status' : undefined)
			}
		}
	}
})
