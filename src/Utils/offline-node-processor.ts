import type { BinaryNode } from '../WABinary'

export type MessageType = 'message' | 'call' | 'receipt' | 'notification'

type OfflineNode = {
	type: MessageType
	node: BinaryNode
}

export type OfflineNodeProcessorDeps = {
	isWsOpen: () => boolean
	onUnexpectedError: (error: Error, msg: string) => void
	yieldToEventLoop: () => Promise<void>
}

/**
 * Creates a processor for offline stanza nodes that:
 * - Queues nodes for sequential processing
 * - Yields to the event loop periodically to avoid blocking
 * - Catches handler errors to prevent the processing loop from crashing
 *
 * NOTE: InfiniteAPI uses batchSize=25 (vs upstream default 10) — a deliberate
 * tuning from PR #239 (3d9d7baf) that reduces event-loop yields per second
 * during offline drain. Do NOT lower it without re-benchmarking.
 */
export function makeOfflineNodeProcessor(
	nodeProcessorMap: Map<MessageType, (node: BinaryNode) => Promise<void>>,
	deps: OfflineNodeProcessorDeps,
	batchSize = 25
) {
	const nodes: OfflineNode[] = []
	let isProcessing = false

	const enqueue = (type: MessageType, node: BinaryNode) => {
		nodes.push({ type, node })

		if (isProcessing) {
			return
		}

		isProcessing = true

		const promise = async () => {
			let processedInBatch = 0

			try {
				while (nodes.length && deps.isWsOpen()) {
					const { type, node } = nodes.shift()!

					const nodeProcessor = nodeProcessorMap.get(type)

					if (!nodeProcessor) {
						deps.onUnexpectedError(new Error(`unknown offline node type: ${type}`), 'processing offline node')
						continue
					}

					// Catch per-node so a single handler failure doesn't kill the whole
					// offline drain loop (the crash window this extraction fixes).
					await nodeProcessor(node).catch(err =>
						deps.onUnexpectedError(err instanceof Error ? err : new Error(String(err)), `processing offline ${type}`)
					)
					processedInBatch++

					// Yield to event loop after processing a batch
					// This prevents blocking the event loop for too long when there are many offline nodes
					if (processedInBatch >= batchSize) {
						processedInBatch = 0
						await deps.yieldToEventLoop()
					}
				}
			} finally {
				// Always release the flag — even if the loop throws — otherwise the queue would
				// stall, since draining only restarts (in enqueue) while isProcessing is false.
				isProcessing = false
			}
		}

		promise().catch(error =>
			deps.onUnexpectedError(error instanceof Error ? error : new Error(String(error)), 'processing offline nodes')
		)
	}

	return { enqueue }
}
