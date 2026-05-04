import type { SendInstrumentation, SendInstrumentationEvent } from '../Types'

export const emitTelemetry = async (telemetry: SendInstrumentation | undefined, event: SendInstrumentationEvent) => {
	if (!telemetry) {
		return
	}

	try {
		await telemetry(event)
	} catch {
		// telemetry must never break send-path behavior
	}
}

export const measureTelemetry = async <T>(
	telemetry: SendInstrumentation | undefined,
	event: Omit<SendInstrumentationEvent, 'status' | 'durationMs'>,
	work: () => Promise<T> | T
) => {
	const startedAt = Date.now()
	await emitTelemetry(telemetry, { ...event, status: 'start' })

	try {
		const result = await work()
		await emitTelemetry(telemetry, { ...event, status: 'success', durationMs: Date.now() - startedAt })
		return result
	} catch (error) {
		await emitTelemetry(telemetry, { ...event, status: 'failure', durationMs: Date.now() - startedAt })
		throw error
	}
}
