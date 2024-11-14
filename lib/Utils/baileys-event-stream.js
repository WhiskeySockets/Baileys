"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAndEmitEventStream = exports.captureEventStream = void 0;
const events_1 = __importDefault(require("events"));
const fs_1 = require("fs");
const promises_1 = require("fs/promises");
const readline_1 = require("readline");
const generics_1 = require("./generics");
const make_mutex_1 = require("./make-mutex");
/**
 * Captures events from a baileys event emitter & stores them in a file
 * @param ev The event emitter to read events from
 * @param filename File to save to
 */
const captureEventStream = (ev, filename) => {
    const oldEmit = ev.emit;
    // write mutex so data is appended in order
    const writeMutex = (0, make_mutex_1.makeMutex)();
    // monkey patch eventemitter to capture all events
    ev.emit = function (...args) {
        const content = JSON.stringify({ timestamp: Date.now(), event: args[0], data: args[1] }) + '\n';
        const result = oldEmit.apply(ev, args);
        writeMutex.mutex(async () => {
            await (0, promises_1.writeFile)(filename, content, { flag: 'a' });
        });
        return result;
    };
};
exports.captureEventStream = captureEventStream;
/**
 * Read event file and emit events from there
 * @param filename filename containing event data
 * @param delayIntervalMs delay between each event emit
 */
const readAndEmitEventStream = (filename, delayIntervalMs = 0) => {
    const ev = new events_1.default();
    const fireEvents = async () => {
        // from: https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
        const fileStream = (0, fs_1.createReadStream)(filename);
        const rl = (0, readline_1.createInterface)({
            input: fileStream,
            crlfDelay: Infinity
        });
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        for await (const line of rl) {
            if (line) {
                const { event, data } = JSON.parse(line);
                ev.emit(event, data);
                delayIntervalMs && await (0, generics_1.delay)(delayIntervalMs);
            }
        }
        fileStream.close();
    };
    return {
        ev,
        task: fireEvents()
    };
};
exports.readAndEmitEventStream = readAndEmitEventStream;
