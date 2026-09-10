import { FastifyPluginAsync } from 'fastify'
import { store, TemplateRecord } from '../db/store.js'
import { sessionManager } from '../core/session-manager.js'

export const templateRoutes: FastifyPluginAsync = async fastify => {
	// List templates
	fastify.get('/', async () => {
		const templates = store.getTemplates()
		return { success: true, count: templates.length, templates }
	})

	// Create template
	fastify.post<{
		Body: {
			name: string
			category: TemplateRecord['category']
			language?: string
			body: string
			header?: string
			footer?: string
			buttons?: TemplateRecord['buttons']
		}
	}>('/', async (req, reply) => {
		const { name, category = 'MARKETING', language = 'en_US', body, header, footer, buttons = [] } = req.body

		if (!name || !body) {
			return reply.status(400).send({ error: 'name and body are required' })
		}

		// Extract variables like {{1}}, {{name}}
		const matches = body.match(/\{\{([^}]+)\}\}/g) || []
		const variables = Array.from(new Set(matches.map(m => m.replace(/[{}]/g, '').trim())))

		const newTemplate: TemplateRecord = {
			id: `tpl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			name,
			category,
			language,
			body,
			header,
			footer,
			buttons,
			variables,
			createdAt: new Date().toISOString(),
		}

		store.saveTemplate(newTemplate)
		return reply.status(201).send({ success: true, template: newTemplate })
	})

	// Send message using a template
	fastify.post<{
		Params: { id: string }
		Body: {
			deviceId: string
			phone: string
			parameters?: Record<string, string>
		}
	}>('/:id/send', async (req, reply) => {
		const template = store.getTemplate(req.params.id)
		if (!template) {
			return reply.status(404).send({ error: 'Template not found' })
		}

		const { deviceId, phone, parameters = {} } = req.body
		if (!deviceId || !phone) {
			return reply.status(400).send({ error: 'deviceId and phone are required' })
		}

		// Render text with variable replacement
		let renderedText = template.body
		for (const [key, val] of Object.entries(parameters)) {
			renderedText = renderedText.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), String(val))
		}

		if (template.header) {
			renderedText = `*${template.header}*\n\n${renderedText}`
		}
		if (template.footer) {
			renderedText = `${renderedText}\n\n_${template.footer}_`
		}

		// If template has buttons, format them cleanly as selectable options
		if (template.buttons && template.buttons.length > 0) {
			renderedText += '\n'
			template.buttons.forEach((btn, idx) => {
				renderedText += `\n[${idx + 1}] ${btn.text}${btn.value ? ` (${btn.value})` : ''}`
			})
		}

		const result = await sessionManager.sendMessage(deviceId, phone, renderedText)
		return { success: true, messageId: result.id, renderedText }
	})

	// Delete template
	fastify.delete<{
		Params: { id: string }
	}>('/:id', async (req, reply) => {
		const template = store.getTemplate(req.params.id)
		if (!template) {
			return reply.status(404).send({ error: 'Template not found' })
		}

		store.deleteTemplate(req.params.id)
		return { success: true, message: 'Template deleted' }
	})
}
