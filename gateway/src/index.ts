import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import path from 'path'
import { fileURLToPath } from 'url'

import { CONFIG } from './config.js'
import { sessionManager } from './core/session-manager.js'
import { deviceRoutes } from './routes/devices.js'
import { messageRoutes } from './routes/messages.js'
import { contactRoutes } from './routes/contacts.js'
import { webhookRoutes } from './routes/webhooks.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function bootstrap() {
	const app = fastify({
		logger: {
			level: 'info',
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

	// Health check endpoint
	app.get('/health', async () => ({
		status: 'ok',
		platform: 'Wassenger-Baileys Gateway',
		time: new Date().toISOString(),
	}))

	// Initialize active device sessions
	await sessionManager.init()

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
