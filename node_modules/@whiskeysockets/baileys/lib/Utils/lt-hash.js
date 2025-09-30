import { hkdf } from './crypto.js';
/**
 * LT Hash is a summation based hash algorithm that maintains the integrity of a piece of data
 * over a series of mutations. You can add/remove mutations and it'll return a hash equal to
 * if the same series of mutations was made sequentially.
 */
const o = 128;
class LTHash {
    constructor(e) {
        this.salt = e;
    }
    async add(e, t) {
        for (const item of t) {
            e = await this._addSingle(e, item);
        }
        return e;
    }
    async subtract(e, t) {
        for (const item of t) {
            e = await this._subtractSingle(e, item);
        }
        return e;
    }
    async subtractThenAdd(e, addList, subtractList) {
        const subtracted = await this.subtract(e, subtractList);
        return this.add(subtracted, addList);
    }
    async _addSingle(e, t) {
        const derived = new Uint8Array(await hkdf(Buffer.from(t), o, { info: this.salt })).buffer;
        return this.performPointwiseWithOverflow(e, derived, (a, b) => a + b);
    }
    async _subtractSingle(e, t) {
        const derived = new Uint8Array(await hkdf(Buffer.from(t), o, { info: this.salt })).buffer;
        return this.performPointwiseWithOverflow(e, derived, (a, b) => a - b);
    }
    performPointwiseWithOverflow(e, t, op) {
        const n = new DataView(e);
        const i = new DataView(t);
        const out = new ArrayBuffer(n.byteLength);
        const s = new DataView(out);
        for (let offset = 0; offset < n.byteLength; offset += 2) {
            s.setUint16(offset, op(n.getUint16(offset, true), i.getUint16(offset, true)), true);
        }
        return out;
    }
}
export const LT_HASH_ANTI_TAMPERING = new LTHash('WhatsApp Patch Integrity');
//# sourceMappingURL=lt-hash.js.map