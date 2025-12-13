import {
	jidEncode,
	jidDecode,
	jidNormalizedUser,
	areJidsSameUser,
	isJidGroup,
	isJidBroadcast,
	isJidStatusBroadcast,
	isJidNewsletter,
	isJidMetaAI,
	isJidBot,
	isPnUser,
	isLidUser,
	isHostedPnUser,
	isHostedLidUser,
	transferDevice,
	getServerFromDomainType,
	S_WHATSAPP_NET,
	OFFICIAL_BIZ_JID,
	SERVER_JID,
	PSA_WID,
	STORIES_JID,
	META_AI_JID,
	WAJIDDomains,
	type FullJid,
} from '../../WABinary/jid-utils'

describe('jidEncode', () => {
	it('should encode basic user JID', () => {
		expect(jidEncode('1234567890', 's.whatsapp.net')).toBe('1234567890@s.whatsapp.net')
	})

	it('should encode group JID', () => {
		expect(jidEncode('123456789', 'g.us')).toBe('123456789@g.us')
	})

	it('should encode JID with device', () => {
		expect(jidEncode('1234567890', 's.whatsapp.net', 1)).toBe('1234567890:1@s.whatsapp.net')
	})

	it('should encode JID with agent', () => {
		expect(jidEncode('1234567890', 's.whatsapp.net', undefined, 128)).toBe('1234567890_128@s.whatsapp.net')
	})

	it('should encode JID with both device and agent', () => {
		expect(jidEncode('1234567890', 's.whatsapp.net', 2, 128)).toBe('1234567890_128:2@s.whatsapp.net')
	})

	it('should handle null user', () => {
		expect(jidEncode(null, 's.whatsapp.net')).toBe('@s.whatsapp.net')
	})

	it('should handle numeric user', () => {
		expect(jidEncode(1234567890, 's.whatsapp.net')).toBe('1234567890@s.whatsapp.net')
	})

	it('should encode broadcast JID', () => {
		expect(jidEncode('status', 'broadcast')).toBe('status@broadcast')
	})

	it('should encode newsletter JID', () => {
		expect(jidEncode('newsletter123', 'newsletter')).toBe('newsletter123@newsletter')
	})

	it('should encode call JID', () => {
		expect(jidEncode('call123', 'call')).toBe('call123@call')
	})

	it('should encode lid JID', () => {
		expect(jidEncode('lid123', 'lid')).toBe('lid123@lid')
	})

	it('should encode bot JID', () => {
		expect(jidEncode('bot123', 'bot')).toBe('bot123@bot')
	})

	it('should encode hosted JID', () => {
		expect(jidEncode('hosted123', 'hosted')).toBe('hosted123@hosted')
	})

	it('should encode hosted.lid JID', () => {
		expect(jidEncode('hostedlid123', 'hosted.lid')).toBe('hostedlid123@hosted.lid')
	})
})

describe('jidDecode', () => {
	it('should decode basic user JID', () => {
		const result = jidDecode('1234567890@s.whatsapp.net')
		expect(result).toEqual({
			user: '1234567890',
			server: 's.whatsapp.net',
			domainType: WAJIDDomains.WHATSAPP,
			device: undefined
		})
	})

	it('should decode c.us JID', () => {
		const result = jidDecode('1234567890@c.us')
		expect(result?.user).toBe('1234567890')
		expect(result?.server).toBe('c.us')
	})

	it('should decode group JID', () => {
		const result = jidDecode('123456789@g.us')
		expect(result).toEqual({
			user: '123456789',
			server: 'g.us',
			domainType: WAJIDDomains.WHATSAPP,
			device: undefined
		})
	})

	it('should decode JID with device', () => {
		const result = jidDecode('1234567890:2@s.whatsapp.net')
		expect(result?.user).toBe('1234567890')
		expect(result?.device).toBe(2)
	})

	it('should decode JID with agent', () => {
		const result = jidDecode('1234567890_128@s.whatsapp.net')
		expect(result?.user).toBe('1234567890')
		expect(result?.domainType).toBe(128)
	})

	it('should decode JID with both device and agent', () => {
		const result = jidDecode('1234567890_128:2@s.whatsapp.net')
		expect(result?.user).toBe('1234567890')
		expect(result?.device).toBe(2)
		expect(result?.domainType).toBe(128)
	})

	it('should return undefined for invalid JID', () => {
		expect(jidDecode('invalid')).toBeUndefined()
		expect(jidDecode('')).toBeUndefined()
		expect(jidDecode(undefined)).toBeUndefined()
	})

	it('should decode lid JID', () => {
		const result = jidDecode('liduser@lid')
		expect(result?.server).toBe('lid')
		expect(result?.domainType).toBe(WAJIDDomains.LID)
	})

	it('should decode hosted JID', () => {
		const result = jidDecode('hosteduser@hosted')
		expect(result?.server).toBe('hosted')
		expect(result?.domainType).toBe(WAJIDDomains.HOSTED)
	})

	it('should decode hosted.lid JID', () => {
		const result = jidDecode('hostedliduser@hosted.lid')
		expect(result?.server).toBe('hosted.lid')
		expect(result?.domainType).toBe(WAJIDDomains.HOSTED_LID)
	})

	it('should decode broadcast JID', () => {
		const result = jidDecode('status@broadcast')
		expect(result?.user).toBe('status')
		expect(result?.server).toBe('broadcast')
	})

	it('should decode newsletter JID', () => {
		const result = jidDecode('newsletter123@newsletter')
		expect(result?.user).toBe('newsletter123')
		expect(result?.server).toBe('newsletter')
	})
})

describe('jidNormalizedUser', () => {
	it('should normalize c.us to s.whatsapp.net', () => {
		expect(jidNormalizedUser('1234567890@c.us')).toBe('1234567890@s.whatsapp.net')
	})

	it('should keep s.whatsapp.net as is', () => {
		expect(jidNormalizedUser('1234567890@s.whatsapp.net')).toBe('1234567890@s.whatsapp.net')
	})

	it('should strip device from JID', () => {
		expect(jidNormalizedUser('1234567890:2@s.whatsapp.net')).toBe('1234567890@s.whatsapp.net')
	})

	it('should keep group JID as is', () => {
		expect(jidNormalizedUser('123456789@g.us')).toBe('123456789@g.us')
	})

	it('should return empty string for invalid JID', () => {
		expect(jidNormalizedUser('invalid')).toBe('')
		expect(jidNormalizedUser(undefined)).toBe('')
	})

	it('should normalize lid JID', () => {
		expect(jidNormalizedUser('user@lid')).toBe('user@lid')
	})

	it('should normalize broadcast JID', () => {
		expect(jidNormalizedUser('status@broadcast')).toBe('status@broadcast')
	})
})

describe('areJidsSameUser', () => {
	it('should return true for same user', () => {
		expect(areJidsSameUser('1234567890@s.whatsapp.net', '1234567890@c.us')).toBe(true)
	})

	it('should return true for same user with different devices', () => {
		expect(areJidsSameUser('1234567890:1@s.whatsapp.net', '1234567890:2@s.whatsapp.net')).toBe(true)
	})

	it('should return false for different users', () => {
		expect(areJidsSameUser('1234567890@s.whatsapp.net', '0987654321@s.whatsapp.net')).toBe(false)
	})

	it('should handle undefined', () => {
		expect(areJidsSameUser(undefined, undefined)).toBe(true)
		expect(areJidsSameUser('1234567890@s.whatsapp.net', undefined)).toBe(false)
	})
})

describe('JID type checks', () => {
	describe('isJidGroup', () => {
		it('should return true for group JIDs', () => {
			expect(isJidGroup('123456789@g.us')).toBe(true)
		})

		it('should return false for non-group JIDs', () => {
			expect(isJidGroup('1234567890@s.whatsapp.net')).toBe(false)
			expect(isJidGroup('status@broadcast')).toBe(false)
		})

		it('should handle undefined', () => {
			expect(isJidGroup(undefined)).toBeFalsy()
		})
	})

	describe('isJidBroadcast', () => {
		it('should return true for broadcast JIDs', () => {
			expect(isJidBroadcast('status@broadcast')).toBe(true)
			expect(isJidBroadcast('list123@broadcast')).toBe(true)
		})

		it('should return false for non-broadcast JIDs', () => {
			expect(isJidBroadcast('1234567890@s.whatsapp.net')).toBe(false)
			expect(isJidBroadcast('123456789@g.us')).toBe(false)
		})
	})

	describe('isJidStatusBroadcast', () => {
		it('should return true for status broadcast', () => {
			expect(isJidStatusBroadcast('status@broadcast')).toBe(true)
		})

		it('should return false for other broadcast JIDs', () => {
			expect(isJidStatusBroadcast('other@broadcast')).toBe(false)
		})
	})

	describe('isJidNewsletter', () => {
		it('should return true for newsletter JIDs', () => {
			expect(isJidNewsletter('newsletter123@newsletter')).toBe(true)
		})

		it('should return false for non-newsletter JIDs', () => {
			expect(isJidNewsletter('1234567890@s.whatsapp.net')).toBe(false)
		})

		it('should handle undefined', () => {
			expect(isJidNewsletter(undefined)).toBeFalsy()
		})
	})

	describe('isJidMetaAI', () => {
		it('should return true for Meta AI JIDs', () => {
			expect(isJidMetaAI('ai@bot')).toBe(true)
			expect(isJidMetaAI('assistant@bot')).toBe(true)
		})

		it('should return false for non-bot JIDs', () => {
			expect(isJidMetaAI('1234567890@s.whatsapp.net')).toBe(false)
		})

		it('should handle undefined', () => {
			expect(isJidMetaAI(undefined)).toBeFalsy()
		})
	})

	describe('isJidBot', () => {
		it('should return true for official bot JIDs', () => {
			expect(isJidBot('13135550001@c.us')).toBe(true)
			expect(isJidBot('13135550099@c.us')).toBe(true)
			expect(isJidBot('13165550001@c.us')).toBe(true)
		})

		it('should return false for non-bot JIDs', () => {
			expect(isJidBot('1234567890@c.us')).toBe(false)
			expect(isJidBot('13135550001@s.whatsapp.net')).toBe(false)
		})

		it('should handle undefined', () => {
			expect(isJidBot(undefined)).toBeFalsy()
		})
	})

	describe('isPnUser', () => {
		it('should return true for PN users', () => {
			expect(isPnUser('1234567890@s.whatsapp.net')).toBe(true)
		})

		it('should return false for non-PN users', () => {
			expect(isPnUser('1234567890@c.us')).toBe(false)
			expect(isPnUser('123456789@g.us')).toBe(false)
		})
	})

	describe('isLidUser', () => {
		it('should return true for LID users', () => {
			expect(isLidUser('user@lid')).toBe(true)
		})

		it('should return false for non-LID users', () => {
			expect(isLidUser('1234567890@s.whatsapp.net')).toBe(false)
		})
	})

	describe('isHostedPnUser', () => {
		it('should return true for hosted PN users', () => {
			expect(isHostedPnUser('user@hosted')).toBe(true)
		})

		it('should return false for non-hosted users', () => {
			expect(isHostedPnUser('1234567890@s.whatsapp.net')).toBe(false)
		})
	})

	describe('isHostedLidUser', () => {
		it('should return true for hosted LID users', () => {
			expect(isHostedLidUser('user@hosted.lid')).toBe(true)
		})

		it('should return false for non-hosted LID users', () => {
			expect(isHostedLidUser('user@lid')).toBe(false)
		})
	})
})

describe('transferDevice', () => {
	it('should transfer device from one JID to another', () => {
		const result = transferDevice('1234567890:2@s.whatsapp.net', '0987654321@s.whatsapp.net')
		expect(result).toBe('0987654321:2@s.whatsapp.net')
	})

	it('should handle source JID without device', () => {
		const result = transferDevice('1234567890@s.whatsapp.net', '0987654321@s.whatsapp.net')
		expect(result).toBe('0987654321@s.whatsapp.net')
	})

	it('should work across different servers', () => {
		const result = transferDevice('1234567890:1@s.whatsapp.net', '0987654321@c.us')
		expect(result).toBe('0987654321:1@c.us')
	})
})

describe('getServerFromDomainType', () => {
	it('should return lid for LID domain', () => {
		expect(getServerFromDomainType('s.whatsapp.net', WAJIDDomains.LID)).toBe('lid')
	})

	it('should return hosted for HOSTED domain', () => {
		expect(getServerFromDomainType('s.whatsapp.net', WAJIDDomains.HOSTED)).toBe('hosted')
	})

	it('should return hosted.lid for HOSTED_LID domain', () => {
		expect(getServerFromDomainType('s.whatsapp.net', WAJIDDomains.HOSTED_LID)).toBe('hosted.lid')
	})

	it('should return initial server for WHATSAPP domain', () => {
		expect(getServerFromDomainType('s.whatsapp.net', WAJIDDomains.WHATSAPP)).toBe('s.whatsapp.net')
	})

	it('should return initial server for undefined domain', () => {
		expect(getServerFromDomainType('g.us', undefined)).toBe('g.us')
	})
})

describe('Constants', () => {
	it('should have correct S_WHATSAPP_NET', () => {
		expect(S_WHATSAPP_NET).toBe('@s.whatsapp.net')
	})

	it('should have correct OFFICIAL_BIZ_JID', () => {
		expect(OFFICIAL_BIZ_JID).toBe('16505361212@c.us')
	})

	it('should have correct SERVER_JID', () => {
		expect(SERVER_JID).toBe('server@c.us')
	})

	it('should have correct PSA_WID', () => {
		expect(PSA_WID).toBe('0@c.us')
	})

	it('should have correct STORIES_JID', () => {
		expect(STORIES_JID).toBe('status@broadcast')
	})

	it('should have correct META_AI_JID', () => {
		expect(META_AI_JID).toBe('13135550002@c.us')
	})
})

describe('WAJIDDomains enum', () => {
	it('should have correct values', () => {
		expect(WAJIDDomains.WHATSAPP).toBe(0)
		expect(WAJIDDomains.LID).toBe(1)
		expect(WAJIDDomains.HOSTED).toBe(128)
		expect(WAJIDDomains.HOSTED_LID).toBe(129)
	})
})

describe('Edge cases', () => {
	it('should handle JID with special characters in user', () => {
		const encoded = jidEncode('user+test', 's.whatsapp.net')
		expect(encoded).toBe('user+test@s.whatsapp.net')

		const decoded = jidDecode(encoded)
		expect(decoded?.user).toBe('user+test')
	})

	it('should handle very long user IDs', () => {
		const longUser = '1'.repeat(50)
		const encoded = jidEncode(longUser, 's.whatsapp.net')
		const decoded = jidDecode(encoded)
		expect(decoded?.user).toBe(longUser)
	})

	it('should handle JID with only @ symbol', () => {
		expect(jidDecode('@s.whatsapp.net')?.user).toBe('')
	})

	it('should handle device ID of 0', () => {
		// Device 0 should not be encoded
		const encoded = jidEncode('user', 's.whatsapp.net', 0)
		expect(encoded).toBe('user@s.whatsapp.net')
	})
})
