import type { BaileysEventEmitter, BaileysEventMap } from '../Types/index.js';
import type { ILogger } from './logger.js';
/**
 * A map that contains a list of all events that have been triggered
 *
 * Note, this can contain different type of events
 * this can make processing events extremely efficient -- since everything
 * can be done in a single transaction
 */
type BaileysEventData = Partial<BaileysEventMap>;
type BaileysBufferableEventEmitter = BaileysEventEmitter & {
    /** Use to process events in a batch */
    process(handler: (events: BaileysEventData) => void | Promise<void>): () => void;
    /**
     * starts buffering events, call flush() to release them
     * */
    buffer(): void;
    /** buffers all events till the promise completes */
    createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): (...args: A) => Promise<T>;
    /**
     * flushes all buffered events
     * @returns returns true if the flush actually happened, otherwise false
     */
    flush(): boolean;
    /** is there an ongoing buffer */
    isBuffering(): boolean;
};
/**
 * The event buffer logically consolidates different events into a single event
 * making the data processing more efficient.
 */
export declare const makeEventBuffer: (logger: ILogger) => BaileysBufferableEventEmitter;
export {};
//# sourceMappingURL=event-buffer.d.ts.map