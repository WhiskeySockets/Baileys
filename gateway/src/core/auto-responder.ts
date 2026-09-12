import { store } from '../db/store.js'
import { sessionManager } from './session-manager.js'
import { webhookDispatcher } from './webhook-dispatcher.js'

export class AutoResponder {
	async handleInbound(deviceId: string, fromJid: string, text: string) {
		if (!text) return

		const cleanText = text.trim().toLowerCase()

		// 1. Check Chatbot Flows
		const bots = store.getChatbots(deviceId).filter(b => b.active)
		for (const bot of bots) {
			const matches = bot.triggerKeywords.some(keyword => {
				if (bot.matchType === 'exact') return cleanText === keyword
				return cleanText.includes(keyword)
			})

			if (matches) {
				console.log(`[Chatbot Flow] Triggered "${bot.name}" for ${fromJid}`)
				const phone = fromJid.split('@')[0]
				const chat = store.getChat(deviceId, fromJid)

				for (const step of bot.steps) {
					if (step.type === 'reply') {
						const sock = sessionManager.getSession(deviceId)
						if (sock) {
							try {
								await sock.sendPresenceUpdate('composing', fromJid)
								await new Promise(r => setTimeout(r, 1200))
								await sock.sendPresenceUpdate('paused', fromJid)
							} catch (e) {}
						}
						await sessionManager.sendMessage(deviceId, fromJid, { text: step.content })
					} else if (step.type === 'tag' && chat) {
						if (!chat.labels.includes(step.content)) {
							chat.labels.push(step.content)
							store.saveChat(chat)
						}
					} else if (step.type === 'assign' && chat) {
						chat.owner = step.content
						store.saveChat(chat)
					} else if (step.type === 'deal_stage') {
						const deals = store.getDeals(deviceId).filter(d => d.contactPhone === phone)
						if (deals.length > 0) {
							deals[0].stage = step.content as any
							deals[0].updatedAt = new Date().toISOString()
							store.saveDeal(deals[0])
						} else {
							store.saveDeal({
								id: `deal_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
								deviceId,
								contactPhone: phone,
								contactName: chat?.name || phone,
								title: `Opportunity from WhatsApp Bot`,
								value: 500,
								currency: 'USD',
								stage: (step.content as any) || 'lead',
								assignedTo: chat?.owner || 'Unassigned',
								tags: chat?.labels || [],
								createdAt: new Date().toISOString(),
								updatedAt: new Date().toISOString(),
							})
						}
					}
				}

				webhookDispatcher.dispatch('chatbot:triggered', {
					deviceId,
					from: fromJid,
					flowName: bot.name,
					stepsCount: bot.steps.length,
				})

				return // Flow handled the interaction
			}
		}

		// 2. Check Standard Auto-Replies
		const rules = store.getAutoReplies(deviceId).filter(r => r.active)
		if (rules.length === 0) return

		let matchedRule = rules.find(r => {
			if (r.matchType === 'exact') {
				return cleanText === r.keyword.trim().toLowerCase()
			} else if (r.matchType === 'contains') {
				return cleanText.includes(r.keyword.trim().toLowerCase())
			} else if (r.matchType === 'regex') {
				try {
					const regex = new RegExp(r.keyword, 'i')
					return regex.test(cleanText)
				} catch (e) {
					return false
				}
			}
			return false
		})

		// Fallback to default rule if no keyword matched
		if (!matchedRule) {
			matchedRule = rules.find(r => r.matchType === 'default')
		}

		if (matchedRule) {
			console.log(`[AutoResponder] Triggered rule "${matchedRule.keyword}" for ${fromJid}`)

			// Simulate typing presence and small realistic delay
			const sock = sessionManager.getSession(deviceId)
			if (sock) {
				try {
					await sock.sendPresenceUpdate('composing', fromJid)
					await new Promise(r => setTimeout(r, 1500))
					await sock.sendPresenceUpdate('paused', fromJid)
				} catch (e) {}
			}

			await sessionManager.sendMessage(deviceId, fromJid, { text: matchedRule.reply })

			webhookDispatcher.dispatch('autoreply:triggered', {
				deviceId,
				from: fromJid,
				keyword: matchedRule.keyword,
				reply: matchedRule.reply,
			})
		}
	}
}

export const autoResponder = new AutoResponder()
