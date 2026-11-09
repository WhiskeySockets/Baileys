import { buildReceiptAddressing } from '../../Utils/receipt-addressing'

const ME_DEVICE_LID = '111111111111111:2@lid'
const PEER_ID = '5511888888888@s.whatsapp.net'
const PEER_LID = '222222222222222@lid'
const GROUP_ID = '120363000000000000@g.us'
const BOT_ID = '13135550002@bot'

describe('buildReceiptAddressing', () => {
	it('sends a sender receipt for a PN chat to our device, naming the chat as recipient', () => {
		expect(buildReceiptAddressing(PEER_ID, ME_DEVICE_LID, 'sender')).toEqual({
			recipient: PEER_ID,
			to: ME_DEVICE_LID
		})
	})

	it('sends a sender receipt for a LID chat to our device, naming the chat as recipient', () => {
		expect(buildReceiptAddressing(PEER_LID, ME_DEVICE_LID, 'sender')).toEqual({
			recipient: PEER_LID,
			to: ME_DEVICE_LID
		})
	})

	it('sends a sender receipt for a bot chat to our device, naming the bot as recipient', () => {
		expect(buildReceiptAddressing(BOT_ID, ME_DEVICE_LID, 'sender')).toEqual({
			recipient: BOT_ID,
			to: ME_DEVICE_LID
		})
	})

	it('sends a sender receipt for a group to the group with the participant', () => {
		expect(buildReceiptAddressing(GROUP_ID, ME_DEVICE_LID, 'sender')).toEqual({
			to: GROUP_ID,
			participant: ME_DEVICE_LID
		})
	})

	it('sends a plain delivery receipt from a bot to the bot', () => {
		expect(buildReceiptAddressing(BOT_ID, undefined, undefined)).toEqual({ to: BOT_ID })
	})

	it('sends a read receipt for a 1:1 chat to the chat', () => {
		expect(buildReceiptAddressing(PEER_ID, undefined, 'read')).toEqual({ to: PEER_ID })
	})
})
