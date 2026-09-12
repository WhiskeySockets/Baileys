import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url'

import { CONFIG } from './config.js'
import { sessionManager } from './core/session-manager.js'
import { campaignWorker } from './core/campaign-worker.js'

import { deviceRoutes } from './routes/devices.js'
import { messageRoutes } from './routes/messages.js'
import { contactRoutes } from './routes/contacts.js'
import { webhookRoutes } from './routes/webhooks.js'
import { chatRoutes } from './routes/chats.js'
import { campaignRoutes } from './routes/campaigns.js'
import { groupRoutes } from './routes/groups.js'
import { labelRoutes } from './routes/labels.js'
import { quickReplyRoutes } from './routes/quick-replies.js'
import { autoReplyRoutes } from './routes/autoreplies.js'
import { syncRoutes } from './routes/sync.js'
import { dealRoutes } from './routes/deals.js'
import { templateRoutes } from './routes/templates.js'
import { chatbotRoutes } from './routes/chatbots.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function bootstrap() {
	const app = fastify({
		logger: {
			level: 'warn',
		},
	})

	// Enable CORS for all origins
	await app.register(cors, {
		origin: true,
	})

	// Serve the Web Dashboard
	const publicDir = path.resolve(__dirname, '../public')
	await app.register(fastifyStatic, {
		root: publicDir,
		prefix: '/',
	})

	// Register API Routes
	app.register(deviceRoutes, { prefix: '/api/v1/devices' })
	app.register(messageRoutes, { prefix: '/api/v1/messages' })
	app.register(contactRoutes, { prefix: '/api/v1/contacts' })
	app.register(webhookRoutes, { prefix: '/api/v1/webhooks' })
	app.register(chatRoutes, { prefix: '/api/v1/chat' })
	app.register(campaignRoutes, { prefix: '/api/v1/campaigns' })
	app.register(groupRoutes, { prefix: '/api/v1/devices' })
	app.register(labelRoutes, { prefix: '/api/v1/devices' })
	app.register(quickReplyRoutes, { prefix: '/api/v1/devices' })
	app.register(autoReplyRoutes, { prefix: '/api/v1/devices' })
	app.register(syncRoutes, { prefix: '/api/v1/sync' })
	app.register(dealRoutes, { prefix: '/api/v1/deals' })
	app.register(templateRoutes, { prefix: '/api/v1/templates' })
	app.register(chatbotRoutes, { prefix: '/api/v1/chatbots' })

	// Health check endpoint
	app.get('/health', async () => ({
		status: 'ok',
		platform: 'Wassenger-Baileys Gateway',
		modules: [
			'devices',
			'messages',
			'chats_team_inbox',
			'campaigns_broadcasts',
			'groups',
			'labels',
			'quick_replies',
			'autoreplies',
			'deals_crm',
			'templates',
			'chatbots',
			'webhooks',
		],
		time: new Date().toISOString(),
	}))

	// Initialize active device sessions & campaign worker
	await sessionManager.init()
	campaignWorker.start()

	// Start server
	try {
		await app.listen({ port: CONFIG.PORT, host: CONFIG.HOST })
		console.log(`\n========================================================`)
		console.log(`🚀 Wassenger-like WhatsApp Gateway is LIVE!`)
		console.log(`🌐 Web Dashboard:  http://localhost:${CONFIG.PORT}`)
		console.log(`📡 REST API Base:  http://localhost:${CONFIG.PORT}/api/v1`)
		console.log(`📋 API Docs/Health: http://localhost:${CONFIG.PORT}/health`)
		console.log(`========================================================\n`)
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

bootstrap()
