import { USyncQueryProtocol } from '../../Types/USync'
import { BinaryNode, getBinaryNodeChild, getBinaryNodeChildren, getBinaryNodeChildString } from '../../WABinary'
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
			attrs: { },
			content: [{ tag: 'profile', attrs: { v: '1' } }]
		}
	}

	getUserElement(user: USyncUser): BinaryNode {
		return {
			tag: 'bot',
			attrs: { },
			content: [{ tag: 'profile', attrs: { 'persona_id': user.personaId } }]
		}
	}

	parser(node: BinaryNode): BotProfileInfo {
	  const botNode = getBinaryNodeChild(node, 'bot')
	  const profile = getBinaryNodeChild(botNode, 'profile')

		const commandsNode = getBinaryNodeChild(profile, 'commands')
		const promptsNode = getBinaryNodeChild(profile, 'prompts')

		const commands: BotProfileCommand[] = []
		const prompts: string[] = []

		for(const command of getBinaryNodeChildren(commandsNode, 'command')) {
		  commands.push({
				name: getBinaryNodeChildString(command, 'name')!,
				description: getBinaryNodeChildString(command, 'description')!
			})
		}

		for(const prompt of getBinaryNodeChildren(promptsNode, 'prompt')) {
		  prompts.push(`${getBinaryNodeChildString(prompt, 'emoji')!} ${getBinaryNodeChildString(prompt, 'text')!}`)
		}


		return {
		  isDefault: !!getBinaryNodeChild(profile, 'default'),
		  jid: node.attrs.jid,
			name: getBinaryNodeChildString(profile, 'name')!,
			attributes: getBinaryNodeChildString(profile, 'attributes')!,
			description: getBinaryNodeChildString(profile, 'description')!,
			category: getBinaryNodeChildString(profile, 'category')!,
			personaId: profile!.attrs['persona_id'],
			commandsDescription: getBinaryNodeChildString(commandsNode, 'description')!,
			commands,
			prompts
		}
	}
}
