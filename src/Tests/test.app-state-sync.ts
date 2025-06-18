import { AccountSettings, ChatMutation, Contact, InitialAppStateSyncOptions } from '../Types'
import { unixTimestampSeconds } from '../Utils'
import { processSyncAction } from '../Utils/chat-utils'
import logger from '../Utils/logger'

describe('App State Sync Tests', () => {
	const me: Contact = { id: randomJid() }
	// case when initial sync is off
	it('should return archive=false event', () => {
		const jid = randomJid()
		const index = ['archive', jid]

		const CASES: ChatMutation[][] = [
			[
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: false,
								messageRange: {
									lastMessageTimestamp: unixTimestampSeconds()
								}
							}
						}
					}
				}
			],
			[
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: true,
								messageRange: {
									lastMessageTimestamp: unixTimestampSeconds()
								}
							}
						}
					}
				},
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: false,
								messageRange: {
									lastMessageTimestamp: unixTimestampSeconds()
								}
							}
						}
					}
				}
			]
		]

		for (const mutations of CASES) {
			const events = processSyncAction(mutations, me, undefined, logger)
			expect(events['chats.update']).toHaveLength(1)
			const event = events['chats.update']?.[0]
			expect(event.archive).toEqual(false)
		}
	})
	// case when initial sync is on
	// and unarchiveChats = true
	it('should not fire any archive event', () => {
		const jid = randomJid()
		const index = ['archive', jid]
		const now = unixTimestampSeconds()

		const CASES: ChatMutation[][] = [
			[
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: true,
								messageRange: {
									lastMessageTimestamp: now - 1
								}
							}
						}
					}
				}
			],
			[
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: false,
								messageRange: {
									lastMessageTimestamp: now + 10
								}
							}
						}
					}
				}
			],
			[
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: true,
								messageRange: {
									lastMessageTimestamp: now + 10
								}
							}
						}
					}
				},
				{
					index,
					syncAction: {
						value: {
							archiveChatAction: {
								archived: false,
								messageRange: {
									lastMessageTimestamp: now + 11
								}
							}
						}
					}
				}
			]
		]

		const ctx: InitialAppStateSyncOptions = {
			recvChats: {
				[jid]: { lastMsgRecvTimestamp: now }
			},
			accountSettings: { unarchiveChats: true }
		}

		for (const mutations of CASES) {
			const events = processSyncActions(mutations, me, ctx, logger)
			expect(events['chats.update']?.length).toBeFalsy()
		}
	})

	// case when initial sync is on
	// with unarchiveChats = true & unarchiveChats = false
	it('should fire archive=true events', () => {
		const jid = randomJid()
		const index = ['archive', jid]
		const now = unixTimestampSeconds()

		const CASES: { settings: AccountSettings; mutations: ChatMutation[] }[] = [
			{
				settings: { unarchiveChats: true },
				mutations: [
					{
						index,
						syncAction: {
							value: {
								archiveChatAction: {
									archived: true,
									messageRange: {
										lastMessageTimestamp: now
									}
								}
							}
						}
					}
				]
			},
			{
				settings: { unarchiveChats: false },
				mutations: [
					{
						index,
						syncAction: {
							value: {
								archiveChatAction: {
									archived: true,
									messageRange: {
										lastMessageTimestamp: now - 10
									}
								}
							}
						}
					}
				]
			}
		]

		for (const { mutations, settings } of CASES) {
			const ctx: InitialAppStateSyncOptions = {
				recvChats: {
					[jid]: { lastMsgRecvTimestamp: now }
				},
				accountSettings: settings
			}
			const events = processSyncActions(mutations, me, ctx, logger)
			expect(events['chats.update']).toHaveLength(1)
			const event = events['chats.update']?.[0]
			expect(event.archive).toEqual(true)
		}
	})
})
