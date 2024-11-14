"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSocketClient = void 0;
const events_1 = require("events");
class AbstractSocketClient extends events_1.EventEmitter {
    constructor(url, config) {
        super();
        this.url = url;
        this.config = config;
        this.setMaxListeners(0);
    }
}
exports.AbstractSocketClient = AbstractSocketClient;
