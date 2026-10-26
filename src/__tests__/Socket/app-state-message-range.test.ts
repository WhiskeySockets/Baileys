import { decodePatches, newLTHashState } from '../../Utils/chat-utils'
import { toNumber } from '../../Utils/generics'
import { encodedAction, modification, silentLogger } from './app-state-fixtures'

describe('lastMessages timestamps survive app-state protobuf serialization', () => {
	it.each(['read', 'archive'] as const)(
		'%s maps the messageTimestamp input to the SyncActionMessage timestamp field',
		async kind => {
			const { patch } = await encodedAction(modification(kind, true))
			const decoded = await decodePatches(
				'regular_low',
				[patch],
				newLTHashState(),
				async () => ({ keyData: Buffer.alloc(32, 7) }),
				{},
				undefined,
				silentLogger
			)
			const action = Object.values(decoded.mutationMap)[0]?.syncAction.value
			const range =
				kind === 'read' ? action?.markChatAsReadAction?.messageRange : action?.archiveChatAction?.messageRange
			expect(range?.messages?.[0]?.key?.id).toBe('fictional-last')
			expect(toNumber(range?.messages?.[0]?.timestamp)).toBe(1700000000)
		}
	)
})
