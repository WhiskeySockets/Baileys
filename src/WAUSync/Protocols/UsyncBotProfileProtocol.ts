import type { USyncQueryProtocol } from '../../Types/USync'
import { type BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString } from '../../WABinary'
import { USyncUser } from '../USyncUser'

export type BotProfileCommand = {
	name: string
	description: string
}

export type BotProfileInfo = {
	jid: string
	name: string
	attributes: string
	description: string
	category: string
	isDefault: boolean
	prompts: string[]
	personaId: string
	commands: BotProfileCommand[]
	commandsDescription: string
}

export class USyncBotProfileProtocol implements USyncQueryProtocol {
	name = 'bot'

	getQueryElement(): BinaryNode {
		return {
			tag: 'bot',
			attrs: {},
			content: [{ tag: 'profile', attrs: { v: '1' } }]
		}
	}

	getUserElement(user: USyncUser): BinaryNode {
		return {
			tag: 'bot',
			attrs: {},
			content: [{ tag: 'profile', attrs: { persona_id: user.personaId! } }]
		}
	}

	parser(node: BinaryNode): BotProfileInfo | null {
		// USyncQuery passes this protocol's own <bot> node, so <profile> is a direct child.
		// The server returns an empty <bot/> for bots without a public profile.
		const profile = getBinaryNodeChild(node, 'profile')
		if (!profile) {
			return null
		}

		const commandsNode = getBinaryNodeChild(profile, 'commands')
		const promptsNode = getBinaryNodeChild(profile, 'prompts')

		const commands: BotProfileCommand[] = []
		const prompts: string[] = []

		for (const command of getBinaryNodeChildren(commandsNode, 'command')) {
			commands.push({
				name: getBinaryNodeChildString(command, 'name')!,
				description: getBinaryNodeChildString(command, 'description')!
			})
		}

		for (const prompt of getBinaryNodeChildren(promptsNode, 'prompt')) {
			prompts.push(`${getBinaryNodeChildString(prompt, 'emoji')!} ${getBinaryNodeChildString(prompt, 'text')!}`)
		}

		return {
			isDefault: !!getBinaryNodeChild(profile, 'default'),
			jid: node.attrs.jid!,
			name: getBinaryNodeChildString(profile, 'name')!,
			attributes: getBinaryNodeChildString(profile, 'attributes')!,
			description: getBinaryNodeChildString(profile, 'description')!,
			category: getBinaryNodeChildString(profile, 'category')!,
			personaId: profile.attrs['persona_id']!,
			commandsDescription: getBinaryNodeChildString(commandsNode, 'description')!,
			commands,
			prompts
		}
	}
}
