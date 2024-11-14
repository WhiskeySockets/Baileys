import type { BaileysEventEmitter } from '../Types';
/**
 * Captures events from a baileys event emitter & stores them in a file
 * @param ev The event emitter to read events from
 * @param filename File to save to
 */
export declare const captureEventStream: (ev: BaileysEventEmitter, filename: string) => void;
/**
 * Read event file and emit events from there
 * @param filename filename containing event data
 * @param delayIntervalMs delay between each event emit
 */
export declare const readAndEmitEventStream: (filename: string, delayIntervalMs?: number) => {
    ev: BaileysEventEmitter;
    task: Promise<void>;
};
