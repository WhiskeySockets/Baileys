'use strict';

/**
 * @file
 *
 * Copyright 2018 FutoIn Project (https://futoin.org)
 * Copyright 2018 Andrey Galkin <andrey@futoin.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { createHash, createHmac } = require( 'crypto' );

const g_digestLenCache = {};

/**
 * Get expected hash length.
 *
 * @func
 * @alias hkdf.hash_length
 * @param {string} hash - Hash algorithm (as in underlying Node.js crypto library)
 * @returns {integer} hash digest byte length
 *
 * @note Values are hardcoded with fallback for unknown algorithms.
 */
const hash_length = ( hash ) => {
    switch ( hash ) {
    case 'sha256': return 32;
    case 'sha512': return 64;
    case 'sha224': return 28;
    case 'sha384': return 48;
    case 'sha3-256': return 32;
    case 'sha3-512': return 64;
    case 'sha3-224': return 28;
    case 'sha3-384': return 48;
    case 'blake2s256': return 32;
    case 'blake2b512': return 64;
    case 'sha1': return 20;
    case 'md5': return 16;
    default: {
        let len = g_digestLenCache[hash];

        if ( len === undefined ) {
            len = createHash( hash ).digest().length;
            g_digestLenCache[hash] = len;
        }

        return len;
    }
    }
};

/**
 * HKDF extract action.
 *
 * @func
 * @alias hkdf.extract
 * @param {string} hash - Hash algorithm (as in underlying Node.js crypto library)
 * @param {integer} hash_len - Hash digest length
 * @param {Buffer|string} ikm - Initial Keying Material
 * @param {Buffer|string} salt - Optional salt (recommended)
 * @returns {Buffer} A buffer with pseudorandom key
 *
 * @note Values are hardcoded with fallback for unknown algorithms.
 */
const hkdf_extract = ( hash, hash_len, ikm, salt ) => {
    const b_ikm = Buffer.isBuffer( ikm ) ? ikm : Buffer.from( ikm );
    const b_salt = ( salt && salt.length ) ? Buffer.from( salt ) : Buffer.alloc( hash_len, 0 );

    return createHmac( hash, b_salt ).update( b_ikm ).digest();
};

/**
 * HKDF expand action.
 *
 * @func
 * @alias hkdf.expand
 * @param {string} hash - Hash algorithm (as in underlying Node.js crypto library)
 * @param {integer} hash_len - Hash digest length
 * @param {Buffer|string} prk - A buffer with pseudorandom key
 * @param {integer} length - length of output keying material in octets
 * @param {Buffer|string} info - Optional context (safe to skip)
 * @returns {Buffer} A buffer with output keying material
 *
 * @note Values are hardcoded with fallback for unknown algorithms.
 */
const hkdf_expand = ( hash, hash_len, prk, length, info ) => {
    const b_info = Buffer.from( info || '' );
    const info_len = b_info.length;

    const steps = Math.ceil( length / hash_len );

    if ( steps > 0xFF ) {
        throw new Error( `OKM length ${length} is too long for ${hash} hash` );
    }

    // use single buffer with unnecessary create/copy/move operations
    const t = Buffer.alloc( hash_len * steps + info_len + 1 );

    for ( let c = 1, start = 0, end = 0; c <= steps; ++c ) {
        // add info
        b_info.copy( t, end );
        // add counter
        t[ end + info_len ] = c;

        createHmac( hash, prk )
            // use view: T(C) = T(C-1) | info | C
            .update( t.slice( start, end + info_len + 1 ) )
            .digest()
            // put back to the same buffer
            .copy( t, end );

        start = end; // used for T(C-1) start
        end += hash_len; // used for T(C-1) end & overall end
    }

    return t.slice( 0, length );
};

/**
 * HMAC-based Extract-and-Expand Key Derivation Function (HKDF)
 *
 * @param {Buffer|string} ikm - Initial Keying Material
 * @param {integer} length - Required byte length of output
 * @param {Buffer|string} salt='' - Optional salt (recommended)
 * @param {Buffer|string} info='' - Optional context (safe to skip)
 * @param {string} hash='SHA-256' - HMAC hash function to use
 * @returns {Buffer} Raw buffer with derived key of @p length bytes
 */
function hkdf( ikm, length, { salt='', info='', hash='SHA-256' } = {} ) {
    hash = hash.toLowerCase().replace( '-', '' );

    // 0. Hash length
    const hash_len = hash_length( hash );

    // 1. extract
    const prk = hkdf_extract( hash, hash_len, ikm, salt );

    // 2. expand
    return hkdf_expand( hash, hash_len, prk, length, info );
}

Object.defineProperties( hkdf, {
    hash_length : {
        configurable: false,
        enumerable: false,
        writable: false,
        value: hash_length,
    },
    extract : {
        configurable: false,
        enumerable: false,
        writable: false,
        value: hkdf_extract,
    },
    expand : {
        configurable: false,
        enumerable: false,
        writable: false,
        value: hkdf_expand,
    },
} );

module.exports = hkdf;
