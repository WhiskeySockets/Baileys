import { LTHashAntiTampering } from 'whatsapp-rust-bridge'

/**
 * LT Hash is a summation based hash algorithm that maintains the integrity of a piece of data
 * over a series of mutations. You can add/remove mutations and it'll return a hash equal to
 * if the same series of mutations was made sequentially.
 */
export const LT_HASH_ANTI_TAMPERING = new LTHashAntiTampering()
