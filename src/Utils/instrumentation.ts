import type { SendInstrumentation, SendInstrumentationEvent } from '../Types'

export const emitSendInstrumentation = async (
	sendInstrumentation: SendInstrumentation | undefined,
	event: SendInstrumentationEvent
) => {
	if (!sendInstrumentation) {
		return
	}

	try {
		await sendInstrumentation(event)
	} catch {
		// Instrumentation must never break message delivery.
	}
}

export const measureSendInstrumentation = async <T>(
	sendInstrumentation: SendInstrumentation | undefined,
	event: Omit<SendInstrumentationEvent, 'status' | 'durationMs'>,
	work: () => Promise<T> | T
) => {
	const startedAt = Date.now()

	try {
		const result = await work()
		await emitSendInstrumentation(sendInstrumentation, {
			...event,
			status: 'success',
			durationMs: Date.now() - startedAt
		})
		return result
	} catch (error) {
		await emitSendInstrumentation(sendInstrumentation, {
			...event,
			status: 'failure',
			durationMs: Date.now() - startedAt
		})
		throw error
	}
}
