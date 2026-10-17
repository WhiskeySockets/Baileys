import { Boom } from '@hapi/boom'
import { proto } from '../../../WAProto/index.js'
import type { MessageContentGenerationOptions } from '../../Types'
import type { ILogger } from '../../Utils/logger'
import { buildStatusMentionContent, generateWAMessageContent, generateWAMessageFromContent } from '../../Utils/messages'

const makeTestLogger = (): ILogger =>
	({
		level: 'silent',
		child: () => makeTestLogger(),
		trace: () => {},
		debug: () => {},
		info: () => {},
		warn: () => {},
		error: () => {},
		fatal: () => {}
	}) as unknown as ILogger

const makeOptions = (): MessageContentGenerationOptions => ({
	logger: makeTestLogger(),
	upload: async () => ({ mediaUrl: 'https://mmg.whatsapp.net/media', directPath: '/v/test' }),
	options: {}
})

describe('interactive message content', () => {
	it('builds a native flow message with quick reply and URL buttons', async () => {
		const message = await generateWAMessageContent(
			{
				text: 'Pick one',
				nativeFlow: [
					{ id: 'yes', text: 'Yes', icon: 'check' },
					{ url: 'https://example.com', text: 'Open' }
				]
			},
			makeOptions()
		)

		const buttons = message.interactiveMessage?.nativeFlowMessage?.buttons
		expect(buttons).toHaveLength(2)
		expect(buttons?.[0]?.name).toBe('quick_reply')
		expect(JSON.parse(buttons![0]!.buttonParamsJson!)).toMatchObject({ display_text: 'Yes', id: 'yes' })
		expect(buttons?.[1]?.name).toBe('cta_url')
		expect(message.interactiveMessage?.body?.text).toBe('Pick one')
	})

	it('builds a buttons message with a text header', async () => {
		const message = await generateWAMessageContent({ text: 'Choose', buttons: [{ id: 'a', text: 'A' }] }, makeOptions())

		expect(message.buttonsMessage?.headerType).toBe(proto.Message.ButtonsMessage.HeaderType.EMPTY)
		expect(message.buttonsMessage?.contentText).toBe('Choose')
		expect(message.buttonsMessage?.buttons?.[0]).toMatchObject({
			buttonId: 'a',
			buttonText: { displayText: 'A' }
		})
	})

	it('builds a list message', async () => {
		const message = await generateWAMessageContent(
			{
				text: 'Choose a row',
				buttonText: 'Open',
				title: 'Menu',
				sections: [{ title: 'Rows', rows: [{ rowId: '1', title: 'One' }] }]
			},
			makeOptions()
		)

		expect(message.listMessage?.listType).toBe(proto.Message.ListMessage.ListType.SINGLE_SELECT)
		expect(message.listMessage?.description).toBe('Choose a row')
		expect(message.listMessage?.sections?.[0]?.rows?.[0]?.rowId).toBe('1')
	})

	it('builds a hydrated four row template', async () => {
		const message = await generateWAMessageContent(
			{
				text: 'Template body',
				templateButtons: [
					{ id: 'reply', text: 'Reply' },
					{ url: 'https://example.com', text: 'Visit' }
				]
			},
			makeOptions()
		)

		const template = message.templateMessage?.hydratedFourRowTemplate
		expect(template?.hydratedContentText).toBe('Template body')
		expect(template?.hydratedButtons?.[0]?.quickReplyButton?.id).toBe('reply')
		expect(template?.hydratedButtons?.[1]?.urlButton?.url).toBe('https://example.com')
	})

	it('counts album media', async () => {
		const message = await generateWAMessageContent(
			{
				album: [{ image: Buffer.from('one') }, { video: Buffer.from('two') }, { image: Buffer.from('three') }]
			},
			makeOptions()
		)

		expect(message.albumMessage).toMatchObject({ expectedImageCount: 2, expectedVideoCount: 1 })
	})

	it('rejects an album with fewer than two media items', async () => {
		await expect(
			generateWAMessageContent({ album: [{ image: Buffer.from('one') }] }, makeOptions())
		).rejects.toBeInstanceOf(Boom)
	})

	it('wraps a group status and tags the context info', async () => {
		const message = await generateWAMessageContent({ text: 'status', groupStatus: true }, makeOptions())

		expect(message.groupStatusMessageV2?.message?.extendedTextMessage?.contextInfo?.isGroupStatus).toBe(true)
	})

	it('supports view once v2 and lottie wrappers', async () => {
		const viewOnce = await generateWAMessageContent({ text: 'once', viewOnceV2: true }, makeOptions())
		expect(viewOnce.viewOnceMessageV2?.message?.extendedTextMessage?.text).toBe('once')

		const lottie = await generateWAMessageContent({ text: 'sticker', ephemeral: true, isLottie: true }, makeOptions())
		expect(lottie.lottieStickerMessage?.message?.ephemeralMessage?.message?.extendedTextMessage?.text).toBe('sticker')
	})

	it('keeps a raw message untouched', async () => {
		const raw = { conversation: 'raw text' }
		const message = await generateWAMessageContent({ raw }, makeOptions())
		expect(message).toEqual(raw)
	})
})

describe('poll and payment content', () => {
	it('builds a quiz poll', async () => {
		const message = await generateWAMessageContent(
			{
				poll: {
					name: 'Quiz',
					values: ['a', 'b'],
					pollType: proto.Message.PollType.QUIZ,
					correctAnswer: 'a'
				}
			},
			makeOptions()
		)

		expect(message.pollCreationMessageV5?.pollType).toBe(proto.Message.PollType.QUIZ)
		expect(message.pollCreationMessageV5?.correctAnswer?.optionName).toBe('a')
	})

	it('builds a poll result snapshot', async () => {
		const message = await generateWAMessageContent(
			{ pollResult: { name: 'Poll', votes: [{ name: 'a', voteCount: '2' }] } },
			makeOptions()
		)

		expect(message.pollResultSnapshotMessage?.pollVotes?.[0]).toMatchObject({ optionName: 'a', optionVoteCount: 2 })
	})

	it('builds a poll update', async () => {
		const message = await generateWAMessageContent(
			{
				pollUpdate: {
					key: { remoteJid: '123@s.whatsapp.net', id: 'poll', fromMe: false },
					vote: { encPayload: Buffer.from('payload'), encIv: Buffer.from('iv') }
				}
			},
			makeOptions()
		)

		expect(message.pollUpdateMessage?.pollCreationMessageKey?.id).toBe('poll')
		expect(message.pollUpdateMessage?.vote?.encPayload).toBeDefined()
	})

	it('builds payment invite and order messages', async () => {
		const invite = await generateWAMessageContent(
			{ paymentInviteServiceType: proto.Message.PaymentInviteMessage.ServiceType.UPI },
			makeOptions()
		)
		expect(invite.paymentInviteMessage?.serviceType).toBe(proto.Message.PaymentInviteMessage.ServiceType.UPI)

		const order = await generateWAMessageContent(
			{ orderText: 'two coffees', thumbnail: Buffer.from('thumb') },
			makeOptions()
		)
		expect(order.orderMessage).toMatchObject({ message: 'two coffees', itemCount: 1 })
		expect(order.orderMessage?.thumbnail).toBeDefined()
	})

	it('builds a request payment message from text', async () => {
		const message = await generateWAMessageContent(
			{ requestPaymentFrom: '123@s.whatsapp.net', text: 'dinner', amount1000: 5000 },
			makeOptions()
		)

		expect(message.requestPaymentMessage?.requestFrom).toBe('123@s.whatsapp.net')
		expect(message.requestPaymentMessage?.amount1000).toBe(5000)
		expect(message.requestPaymentMessage?.noteMessage?.extendedTextMessage?.text).toBe('dinner')
	})

	it('builds keep and flow reply messages', async () => {
		const keep = await generateWAMessageContent(
			{ keep: { remoteJid: '123@s.whatsapp.net', id: 'm', fromMe: false }, type: proto.KeepType.KEEP_FOR_ALL },
			makeOptions()
		)
		expect(keep.keepInChatMessage?.keepType).toBe(proto.KeepType.KEEP_FOR_ALL)

		const flow = await generateWAMessageContent(
			{ flowReply: { text: 'done', name: 'flow', paramsJson: '{"a":1}' } },
			makeOptions()
		)
		expect(flow.interactiveResponseMessage?.nativeFlowResponseMessage?.name).toBe('flow')
	})

	it('adds a direct external ad reply to text messages', async () => {
		const message = await generateWAMessageContent(
			{ text: 'ad', externalAdReply: { title: 'Ad', url: 'https://example.com', thumbnail: Buffer.from('thumb') } },
			makeOptions()
		)

		expect(message.extendedTextMessage?.contextInfo?.externalAdReply?.title).toBe('Ad')
		expect(message.extendedTextMessage?.contextInfo?.externalAdReply?.thumbnailUrl).toContain('https://example.com')
	})
})

describe('carousel cards and wrappers', () => {
	it('builds a carousel message', async () => {
		const message = await generateWAMessageContent(
			{
				text: 'Our menu',
				footer: 'Tap a card',
				cards: [
					{
						image: Buffer.from('card'),
						caption: 'Card one',
						nativeFlow: [{ id: 'one', text: 'Pick one' }]
					},
					{
						image: Buffer.from('card2'),
						caption: 'Card two',
						nativeFlow: [{ url: 'https://example.com', text: 'Open' }]
					}
				]
			},
			makeOptions()
		)

		expect(message.interactiveMessage?.carouselMessage?.cards).toHaveLength(2)
		expect(message.interactiveMessage?.body?.text).toBe('Our menu')
		expect(message.interactiveMessage?.footer?.text).toBe('Tap a card')
	})

	it('wraps an interactive message as a template', async () => {
		const message = await generateWAMessageContent(
			{ text: 'body', nativeFlow: [{ id: 'a', text: 'A' }], interactiveAsTemplate: true },
			makeOptions()
		)

		expect(message.templateMessage?.interactiveMessageTemplate?.nativeFlowMessage?.buttons).toHaveLength(1)
	})

	it('wraps ephemeral and view once v2 content', async () => {
		const ephemeral = await generateWAMessageContent({ text: 'gone', ephemeral: true }, makeOptions())
		expect(ephemeral.ephemeralMessage?.message?.extendedTextMessage?.text).toBe('gone')

		const viewOnce = await generateWAMessageContent({ text: 'once', viewOnceV2Extension: true }, makeOptions())
		expect(viewOnce.viewOnceMessageV2Extension?.message?.extendedTextMessage?.text).toBe('once')
	})
})

describe('newsletter quoting', () => {
	const quoted = {
		key: { remoteJid: '123@newsletter', id: 'quoted-id', fromMe: false },
		message: { conversation: 'original' }
	}

	it('includes the quoted message when replying in a newsletter', () => {
		const msg = generateWAMessageFromContent(
			'123@newsletter',
			{ conversation: 'reply' },
			{ userJid: 'me@s.whatsapp.net', quoted: quoted as never }
		)

		const contextInfo = msg.message?.extendedTextMessage?.contextInfo
		expect(contextInfo?.stanzaId).toBe('quoted-id')
		expect(contextInfo?.quotedMessage?.conversation).toBe('original')
		expect(contextInfo?.remoteJid).toBeUndefined()
	})

	it('sets the remote chat when quoting in a regular chat', () => {
		const msg = generateWAMessageFromContent(
			'123@s.whatsapp.net',
			{ conversation: 'reply' },
			{
				userJid: 'me@s.whatsapp.net',
				quoted: { ...quoted, key: { ...quoted.key, remoteJid: '456@s.whatsapp.net' } } as never
			}
		)

		expect(msg.message?.extendedTextMessage?.contextInfo?.remoteJid).toBe('456@s.whatsapp.net')
	})
})

describe('status mentions', () => {
	const statusKey = { remoteJid: 'status@broadcast', id: 'status-id', fromMe: true }

	it('wraps a status mention for a single chat', () => {
		const content = buildStatusMentionContent(statusKey, false)
		expect(content.statusMentionMessage?.message?.protocolMessage).toMatchObject({
			type: 25,
			key: { id: 'status-id' }
		})
		expect(content.messageContextInfo?.messageSecret).toBeDefined()
	})

	it('wraps a group status mention', () => {
		const content = buildStatusMentionContent(statusKey, true)
		expect(content.groupStatusMentionMessage?.message?.protocolMessage?.key?.id).toBe('status-id')
		expect(content.statusMentionMessage).toBeUndefined()
	})
})
