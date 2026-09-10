import { store } from '../db/store.js'
import { sessionManager } from './session-manager.js'
import { webhookDispatcher } from './webhook-dispatcher.js'

export class AutoResponder {
	async handleInbound(deviceId: string, fromJid: string, text: string) {
		if (!text) return

		const rules = store.getAutoReplies(deviceId).filter(r => r.active)
		if (rules.length === 0) return

		const cleanText = text.trim().toLowerCase()
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
