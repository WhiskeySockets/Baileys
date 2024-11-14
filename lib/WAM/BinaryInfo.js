"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryInfo = void 0;
class BinaryInfo {
    constructor(options = {}) {
        this.protocolVersion = 5;
        this.sequence = 0;
        this.events = [];
        this.buffer = [];
        Object.assign(this, options);
    }
}
exports.BinaryInfo = BinaryInfo;
