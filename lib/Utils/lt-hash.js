"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LT_HASH_ANTI_TAMPERING = void 0;
const crypto_1 = require("./crypto");
/**
 * LT Hash is a summation based hash algorithm that maintains the integrity of a piece of data
 * over a series of mutations. You can add/remove mutations and it'll return a hash equal to
 * if the same series of mutations was made sequentially.
 */
const o = 128;
class d {
    constructor(e) {
        this.salt = e;
    }
    add(e, t) {
        var r = this;
        for (const item of t) {
            e = r._addSingle(e, item);
        }
        return e;
    }
    subtract(e, t) {
        var r = this;
        for (const item of t) {
            e = r._subtractSingle(e, item);
        }
        return e;
    }
    subtractThenAdd(e, t, r) {
        var n = this;
        return n.add(n.subtract(e, r), t);
    }
    _addSingle(e, t) {
        var r = this;
        const n = new Uint8Array((0, crypto_1.hkdf)(Buffer.from(t), o, { info: r.salt })).buffer;
        return r.performPointwiseWithOverflow(e, n, ((e, t) => e + t));
    }
    _subtractSingle(e, t) {
        var r = this;
        const n = new Uint8Array((0, crypto_1.hkdf)(Buffer.from(t), o, { info: r.salt })).buffer;
        return r.performPointwiseWithOverflow(e, n, ((e, t) => e - t));
    }
    performPointwiseWithOverflow(e, t, r) {
        const n = new DataView(e), i = new DataView(t), a = new ArrayBuffer(n.byteLength), s = new DataView(a);
        for (let e = 0; e < n.byteLength; e += 2) {
            s.setUint16(e, r(n.getUint16(e, !0), i.getUint16(e, !0)), !0);
        }
        return a;
    }
}
exports.LT_HASH_ANTI_TAMPERING = new d('WhatsApp Patch Integrity');
