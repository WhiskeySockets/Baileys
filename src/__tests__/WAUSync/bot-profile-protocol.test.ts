import type { BinaryNode } from '../../WABinary'
import { USyncQuery } from '../../WAUSync'

const text = (tag: string, content: string): BinaryNode => ({ tag, attrs: {}, content })

// Shape of a real <usync> bot-profile reply: one <user> per queried bot, whose <bot> child
// either wraps a <profile> or is empty when the bot has no public profile.
const botProfileReply = (users: BinaryNode[]): BinaryNode => ({
	tag: 'iq',
	attrs: { from: '@s.whatsapp.net', type: 'result', id: '1' },
	content: [
		{
			tag: 'usync',
			attrs: { context: 'interactive', mode: 'query', sid: '1', last: 'true', index: '0' },
			content: [
				{ tag: 'result', attrs: {}, content: [{ tag: 'bot', attrs: {} }] },
				{ tag: 'list', attrs: {}, content: users }
			]
		}
	]
})

const metaAiUser: BinaryNode = {
	tag: 'user',
	attrs: { jid: '867051314767696@bot' },
	content: [
		{
			tag: 'bot',
			attrs: {},
			content: [
				{
					tag: 'profile',
					attrs: { persona_id: '867051314767696$1516093456810924', pn_jid: '13135550002@s.whatsapp.net' },
					content: [
						text('default', 'true'),
						text('name', 'Meta AI'),
						text('attributes', ''),
						text('description', 'Ask me anything'),
						text('category', ''),
						{
							tag: 'commands',
							attrs: {},
							content: [
								text('description', 'Commands'),
								{ tag: 'command', attrs: {}, content: [text('name', '/imagine'), text('description', 'Create images')] }
							]
						},
						{
							tag: 'prompts',
							attrs: {},
							content: [{ tag: 'prompt', attrs: {}, content: [text('emoji', '[idea]'), text('text', 'Give me ideas')] }]
						}
					]
				}
			]
		}
	]
}

const botWithoutProfile: BinaryNode = {
	tag: 'user',
	attrs: { jid: '1807055946647697@bot' },
	content: [{ tag: 'bot', attrs: {} }]
}

describe('USyncBotProfileProtocol', () => {
	it('parses the <profile> that is a direct child of the <bot> protocol node', () => {
		const query = new USyncQuery().withBotProfileProtocol()
		const result = query.parseUSyncQueryResult(botProfileReply([metaAiUser]))

		expect(result?.list).toHaveLength(1)
		expect(result?.list[0]).toMatchObject({
			id: '867051314767696@bot',
			bot: {
				isDefault: true,
				name: 'Meta AI',
				description: 'Ask me anything',
				personaId: '867051314767696$1516093456810924',
				commandsDescription: 'Commands',
				commands: [{ name: '/imagine', description: 'Create images' }],
				prompts: ['[idea] Give me ideas']
			}
		})
	})

	it('omits bots without a public profile instead of throwing', () => {
		const query = new USyncQuery().withBotProfileProtocol()
		const result = query.parseUSyncQueryResult(botProfileReply([metaAiUser, botWithoutProfile]))

		expect(result?.list.map(user => user.id)).toEqual(['867051314767696@bot', '1807055946647697@bot'])
		expect(result?.list[0]?.bot).toBeDefined()
		expect(result?.list[1]).toEqual({ id: '1807055946647697@bot' })
	})
})
