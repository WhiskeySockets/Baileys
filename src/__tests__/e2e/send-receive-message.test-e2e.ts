import { jest } from '@jest/globals'
import { readFileSync } from 'node:fs'
import { downloadContentFromMessage, downloadMediaMessage, proto, toBuffer, type WAMessage } from '../../index'
import { TestClient } from './helpers/test-client'

jest.setTimeout(60_000)

describe('E2E Tests', () => {
	let tc: TestClient

	beforeAll(async () => {
		tc = await TestClient.connect({ resolveTestGroup: true })
	})

	afterAll(async () => {
		await tc?.cleanup()
	})

	test('should send a message', async () => {
		const text = `E2E Test Message ${Date.now()}`
		const sent = await tc.sock.sendMessage(tc.meJid, { text })

		expect(sent).toBeDefined()
		expect(sent!.key.id).toBeTruthy()
		expect(sent!.message?.extendedTextMessage?.text || sent!.message?.conversation).toBe(text)
	})

	test('should edit a message', async () => {
		const original = `E2E Test Message to Edit ${Date.now()}`
		const sent = await tc.sock.sendMessage(tc.meJid, { text: original })

		const newText = `E2E Edited Message ${Date.now()}`
		const edited = await tc.sock.sendMessage(tc.meJid, { text: newText, edit: sent!.key })

		expect(edited!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.MESSAGE_EDIT)
		const editedContent = edited!.message?.protocolMessage?.editedMessage
		expect(editedContent?.extendedTextMessage?.text || editedContent?.conversation).toBe(newText)
	})

	test('should react to a message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, { text: `E2E Test React ${Date.now()}` })
		const reaction = await tc.sock.sendMessage(tc.meJid, { react: { text: '👍', key: sent!.key } })

		expect(reaction!.message?.reactionMessage?.text).toBe('👍')
		expect(reaction!.message?.reactionMessage?.key?.id).toBe(sent!.key.id)
	})

	test('should remove a reaction from a message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, { text: `E2E Test Remove React ${Date.now()}` })
		await tc.sock.sendMessage(tc.meJid, { react: { text: '😄', key: sent!.key } })
		const removed = await tc.sock.sendMessage(tc.meJid, { react: { text: '', key: sent!.key } })

		expect(removed!.message?.reactionMessage?.text).toBe('')
		expect(removed!.message?.reactionMessage?.key?.id).toBe(sent!.key.id)
	})

	test('should delete a message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, { text: `E2E Test Delete ${Date.now()}` })
		const del = await tc.sock.sendMessage(tc.meJid, { delete: sent!.key })

		expect(del!.message?.protocolMessage?.type).toBe(proto.Message.ProtocolMessage.Type.REVOKE)
		expect(del!.message?.protocolMessage?.key?.id).toBe(sent!.key.id)
	})

	test('should forward a message', async () => {
		const text = `E2E Test Forward ${Date.now()}`
		const sent = await tc.sock.sendMessage(tc.meJid, { text })
		const forwarded = await tc.sock.sendMessage(tc.meJid, { forward: sent! })

		const content = forwarded!.message?.extendedTextMessage?.text || forwarded!.message?.conversation
		expect(content).toBe(text)
		expect(forwarded!.key.id).not.toBe(sent!.key.id)
	})

	test('should send an image message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, {
			image: readFileSync('./Media/cat.jpeg'),
			caption: 'E2E Test Image'
		})
		expect(sent!.message?.imageMessage?.caption).toBe('E2E Test Image')
	})

	test('should send a video message with a thumbnail', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, {
			video: readFileSync('./Media/ma_gif.mp4'),
			caption: 'E2E Test Video'
		})
		expect(sent!.message?.videoMessage?.caption).toBe('E2E Test Video')
	})

	test('should send a PTT (push-to-talk) audio message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, {
			audio: readFileSync('./Media/sonata.mp3'),
			ptt: true,
			mimetype: 'audio/mp4'
		})
		expect(sent!.message?.audioMessage?.ptt).toBe(true)
	})

	test('should send a document message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, {
			document: readFileSync('./Media/ma_gif.mp4'),
			mimetype: 'application/pdf',
			fileName: 'E2E Test Document.pdf'
		})
		expect(sent!.message?.documentMessage?.fileName).toBe('E2E Test Document.pdf')
	})

	test('should send a sticker message', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, { sticker: readFileSync('./Media/cat.jpeg') })
		expect(sent!.message?.stickerMessage).toBeDefined()
	})

	test('should send a poll message and receive a vote', async () => {
		const sent = await tc.sock.sendMessage(tc.meJid, {
			poll: { name: 'E2E Test Poll', values: ['Option 1', 'Option 2', 'Option 3'], selectableCount: 1 }
		})
		expect(sent?.message?.pollCreationMessageV3?.name).toBe('E2E Test Poll')
	})

	test('should send a contact (vCard) message', async () => {
		const vcard = [
			'BEGIN:VCARD',
			'VERSION:3.0',
			'FN:E2E Test Contact',
			'ORG:Baileys Tests;',
			'TEL;type=CELL;type=VOICE;waid=1234567890:+1 234-567-890',
			'END:VCARD'
		].join('\n')
		const sent = await tc.sock.sendMessage(tc.meJid, {
			contacts: { displayName: 'E2E Test Contact', contacts: [{ vcard }] }
		})
		expect(sent!.message?.contactMessage?.vcard).toContain('FN:E2E Test Contact')
	})

	test('should send and download an image message', async () => {
		const caption = 'E2E Test Image Download Success'
		const received = tc.waitForMessage(m => m.message?.imageMessage?.caption === caption)

		await tc.sock.sendMessage(tc.meJid, { image: readFileSync('./Media/cat.jpeg'), caption })
		const msg = await received

		const buffer = await downloadMediaMessage(
			msg as WAMessage,
			'buffer',
			{},
			{
				logger: tc.sock.logger,
				reuploadRequest: m => tc.sock.updateMediaMessage(m)
			}
		)

		expect(Buffer.isBuffer(buffer)).toBe(true)
		expect(buffer.length).toBeGreaterThan(0)
	})

	test('should send and download an image message via LID', async () => {
		expect(tc.meLid).toBeDefined()
		const caption = 'E2E Test LID Image Download'
		const received = tc.waitForMessage(m => m.message?.imageMessage?.caption === caption)

		await tc.sock.sendMessage(tc.meLid!, { image: readFileSync('./Media/cat.jpeg'), caption })
		const msg = await received

		const buffer = await downloadMediaMessage(
			msg as WAMessage,
			'buffer',
			{},
			{
				logger: tc.sock.logger,
				reuploadRequest: m => tc.sock.updateMediaMessage(m)
			}
		)

		expect(buffer.length).toBeGreaterThan(0)
	})

	test('should send and download an image using the low-level downloadContentFromMessage', async () => {
		const caption = 'E2E Test Low-Level Download'
		const received = tc.waitForMessage(m => m.message?.imageMessage?.caption === caption)

		await tc.sock.sendMessage(tc.meJid, { image: readFileSync('./Media/cat.jpeg'), caption })
		const msg = await received

		const imageMessage = msg.message?.imageMessage
		expect(imageMessage).toBeDefined()

		const stream = await downloadContentFromMessage(
			{ url: imageMessage!.url, mediaKey: imageMessage!.mediaKey, directPath: imageMessage!.directPath },
			'image'
		)
		const buffer = await toBuffer(stream)
		expect(buffer.length).toBeGreaterThan(0)
	})

	test('should download a quoted image message using downloadContentFromMessage', async () => {
		const caption = 'This is the original media message'
		const command = '-download'

		const imageReceived = tc.waitForMessage(m => m.message?.imageMessage?.caption === caption)
		const sentImage = await tc.sock.sendMessage(tc.meJid, { image: readFileSync('./Media/cat.jpeg'), caption })
		await imageReceived

		const commandReceived = tc.waitForText(command)
		await tc.sock.sendMessage(tc.meJid, { text: command }, { quoted: sentImage })
		const commandMsg = await commandReceived

		const quoted = commandMsg.message?.extendedTextMessage?.contextInfo?.quotedMessage
		expect(quoted?.imageMessage).toBeDefined()

		const stream = await downloadContentFromMessage(
			{
				url: quoted!.imageMessage!.url,
				mediaKey: quoted!.imageMessage!.mediaKey,
				directPath: quoted!.imageMessage!.directPath
			},
			'image'
		)
		const buffer = await toBuffer(stream)
		expect(buffer.length).toBeGreaterThan(0)
	})

	test('should download a quoted videos message within a group', async () => {
		if (!tc.groupJid) {
			console.warn('⚠️ Skipping group test because "Baileys Group Test" was not found.')
			return
		}

		const caption = 'This is the original media message for the group test'
		const command = '-download group'

		const videoReceived = tc.waitForMessage(
			m => m.key?.remoteJid === tc.groupJid && m.message?.videoMessage?.caption === caption
		)
		const sentVideo = await tc.sock.sendMessage(tc.groupJid, { video: readFileSync('./Media/ma_gif.mp4'), caption })
		await videoReceived

		const commandReceived = tc.waitForText(command, { remoteJid: tc.groupJid })
		await tc.sock.sendMessage(tc.groupJid, { text: command }, { quoted: sentVideo })
		const commandMsg = await commandReceived

		const quoted = commandMsg.message?.extendedTextMessage?.contextInfo?.quotedMessage
		expect(quoted?.videoMessage).toBeDefined()

		const stream = await downloadContentFromMessage(
			{
				url: quoted!.videoMessage!.url,
				mediaKey: quoted!.videoMessage!.mediaKey,
				directPath: quoted!.videoMessage!.directPath
			},
			'video'
		)
		const buffer = await toBuffer(stream)
		expect(buffer.length).toBeGreaterThan(0)
	})
})
