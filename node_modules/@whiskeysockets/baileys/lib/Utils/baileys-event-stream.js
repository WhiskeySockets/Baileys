import EventEmitter from 'events';
import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline';
import { delay } from './generics.js';
import { makeMutex } from './make-mutex.js';
/**
 * Captures events from a baileys event emitter & stores them in a file
 * @param ev The event emitter to read events from
 * @param filename File to save to
 */
export const captureEventStream = (ev, filename) => {
    const oldEmit = ev.emit;
    // write mutex so data is appended in order
    const writeMutex = makeMutex();
    // monkey patch eventemitter to capture all events
    ev.emit = function (...args) {
        const content = JSON.stringify({ timestamp: Date.now(), event: args[0], data: args[1] }) + '\n';
        const result = oldEmit.apply(ev, args);
        writeMutex.mutex(async () => {
            await writeFile(filename, content, { flag: 'a' });
        });
        return result;
    };
};
/**
 * Read event file and emit events from there
 * @param filename filename containing event data
 * @param delayIntervalMs delay between each event emit
 */
export const readAndEmitEventStream = (filename, delayIntervalMs = 0) => {
    const ev = new EventEmitter();
    const fireEvents = async () => {
        // from: https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
        const fileStream = createReadStream(filename);
        const rl = createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        for await (const line of rl) {
            if (line) {
                const { event, data } = JSON.parse(line);
                ev.emit(event, data);
                delayIntervalMs && (await delay(delayIntervalMs));
            }
        }
        fileStream.close();
    };
    return {
        ev,
        task: fireEvents()
    };
};
//# sourceMappingURL=baileys-event-stream.js.map