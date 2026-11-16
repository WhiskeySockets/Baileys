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

it('keeps ordinary group messages outside publication classification', () => {
	const { fullMessage } = decodeMessageNode(
		{ tag: 'message', attrs: { from: '120363000000001@g.us', participant: meLid, id: 'ordinary' }, content: [] },
		me,
		meLid
	)
	expect(fullMessage.statusKind).toBeUndefined()
})
it.each([
	[0, 'status@broadcast', 'status', 'status', undefined],
	[1, 'status@broadcast', 'status', 'status', 'status'],
	[2, 'status@broadcast', 'status', 'status', 'status'],
	[3, 'status@broadcast', '', 'message', 'status'],
	[1, 'status@broadcast', '', 'status', undefined],
	[0, '120363000000001@g.us', 'status', 'status', undefined],
	[1, '120363000000001@g.us', 'status', 'status', 'status'],
	[2, '120363000000001@g.us', 'status', 'status', 'status'],
	[3, '120363000000001@g.us', '', 'status', undefined],
	[3, '120363000000001@g.us', 'status', 'message', undefined],
	[3, '200000000002@lid', 'status', 'status', undefined],
	[3, '120363000000001@newsletter', 'status', 'status', undefined]
] as const)('selects mode %s for %s with scope %s on %s as %s', (mode, from, session_scope, tag, expected) => {
	const node: BinaryNode = { tag, attrs: { from }, content: [{ tag: 'meta', attrs: { session_scope } }] }
	expect(getStatusSessionScope(node, mode)).toBe(expected)
})
