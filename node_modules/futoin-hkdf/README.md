
  [![NPM Version](https://img.shields.io/npm/v/futoin-hkdf.svg?style=flat)](https://www.npmjs.com/package/futoin-hkdf)
  [![NPM Downloads](https://img.shields.io/npm/dm/futoin-hkdf.svg?style=flat)](https://www.npmjs.com/package/futoin-hkdf)
  [![Build Status](https://travis-ci.org/futoin/util-js-hkdf.svg)](https://travis-ci.org/futoin/util-js-hkdf)
  [![stable](https://img.shields.io/badge/stability-stable-green.svg?style=flat)](https://www.npmjs.com/package/futoin-hkdf)

  [![NPM](https://nodei.co/npm/futoin-hkdf.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/futoin-hkdf/)


# About

Node.js implementation of [RFC5869: HMAC-based Extract-and-Expand Key Derivation Function (HKDF)](https://tools.ietf.org/html/rfc5869).

The implementation is fully compliant with test vectors provided in the RFC.

There are alternative modules, but they are:
* much less performing and/or
* have quite poor code quality at the moment and/or
* are not compliant with RFC (e.g. work only with string parameters) and/or
* not working with current Node.js versions and/or
* do not support arbitrary hash functions and/or
* not reliable dependency for FutoIn Security concept in general.

Standalone HKDF `extract()` and `expand()` actions are also available for advanced usage.

**Documentation** --> [FutoIn Guide](https://futoin.org/docs/miscjs/hkdf/)

Author: [Andrey Galkin](mailto:andrey@futoin.org)

# Performance comparison

The figures in "derived keys per second".

* **futoin-hkdf** - **74 642**
    - fully compliant
* `node-hdkf`/`hdkf` modules - *57 707* (~22% slower)
    - seems to be broken by design
    - **produces wrong results with RFC test vectors**
* `ctrlpanel-hdkf` - *52 181* (~30% slower)
    - seems to be compliant
* `@stablelib/hkdf` - *39 808* (~46% slower)
    - seems to be compliant

# Installation for Node.js

Command line:
```sh
$ npm install futoin-hkdf --save
```
or:

```sh
$ yarn add futoin-hkdf --save
```

# Examples

```javascript
const hkdf = require('futoin-hkdf');

// Parameter overview
//-------------------
// initial keying material
const ikm = 'string-or-buffer';
// required output length in bytes
const length = 16;
// can be empty string or false equivalent
const salt = 'strongly-encouraged';
// optional parameter
const info = 'optional-context';
// HMAC hashing algorithm to use
const hash = 'SHA-256';

// Generic derivation
//-------------------
hkdf(ikm, length, {salt, info, hash}); // Buffer(length) - derived key
hkdf(ikm, length, {salt, info, hash}).toString('hex'); // String(2*length)

// NOTE: all optional paramaters are passed in object

// With some parameters omitted
//-------------------
hkdf(ikm, length, {salt});
hkdf(ikm, length, {info});
hkdf(ikm, length, {hash});
hkdf(ikm, length);

// Advanced usage (only if you know what you are doing)
//-------------------

// As in underlying Node.js crypto library
const lhash = hash.toLowerCase().replace( '-', '' ); // 'sha256'

hkdf.hash_length(lhash); // get hash_len
hkdf.extract(lhash, hash_len, ikm, salt); // run only step #1
hkdf.expand(lhash, hash_len. prk, length, info); // run only step #2
```

# API documentation

<a name="hkdf"></a>

## hkdf(ikm, length, salt, info, hash) ⇒ <code>Buffer</code>
HMAC-based Extract-and-Expand Key Derivation Function (HKDF)

**Kind**: global function  
**Returns**: <code>Buffer</code> - Raw buffer with derived key of @p length bytes  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ikm | <code>Buffer</code> \| <code>string</code> |  | Initial Keying Material |
| length | <code>integer</code> |  | Required byte length of output |
| salt | <code>Buffer</code> \| <code>string</code> | <code>&#x27;&#x27;</code> | Optional salt (recommended) |
| info | <code>Buffer</code> \| <code>string</code> | <code>&#x27;&#x27;</code> | Optional context (safe to skip) |
| hash | <code>string</code> | <code>&quot;&#x27;SHA-256&#x27;&quot;</code> | HMAC hash function to use |


* [hkdf(ikm, length, salt, info, hash)](#hkdf) ⇒ <code>Buffer</code>
    * [.hash_length(hash)](#hkdf.hash_length) ⇒ <code>integer</code>
    * [.extract(hash, hash_len, ikm, salt)](#hkdf.extract) ⇒ <code>Buffer</code>
    * [.expand(hash, hash_len, prk, length, info)](#hkdf.expand) ⇒ <code>Buffer</code>

<a name="hkdf.hash_length"></a>

### hkdf.hash\_length(hash) ⇒ <code>integer</code>
Get expected hash length.

**Kind**: static method of [<code>hkdf</code>](#hkdf)  
**Returns**: <code>integer</code> - hash digest byte length  
**Note**: Values are hardcoded with fallback for unknown algorithms.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | Hash algorithm (as in underlying Node.js crypto library) |

<a name="hkdf.extract"></a>

### hkdf.extract(hash, hash_len, ikm, salt) ⇒ <code>Buffer</code>
HKDF extract action.

**Kind**: static method of [<code>hkdf</code>](#hkdf)  
**Returns**: <code>Buffer</code> - A buffer with pseudorandom key  
**Note**: Values are hardcoded with fallback for unknown algorithms.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | Hash algorithm (as in underlying Node.js crypto library) |
| hash_len | <code>integer</code> | Hash digest length |
| ikm | <code>Buffer</code> \| <code>string</code> | Initial Keying Material |
| salt | <code>Buffer</code> \| <code>string</code> | Optional salt (recommended) |

<a name="hkdf.expand"></a>

### hkdf.expand(hash, hash_len, prk, length, info) ⇒ <code>Buffer</code>
HKDF expand action.

**Kind**: static method of [<code>hkdf</code>](#hkdf)  
**Returns**: <code>Buffer</code> - A buffer with output keying material  
**Note**: Values are hardcoded with fallback for unknown algorithms.  

| Param | Type | Description |
| --- | --- | --- |
| hash | <code>string</code> | Hash algorithm (as in underlying Node.js crypto library) |
| hash_len | <code>integer</code> | Hash digest length |
| prk | <code>Buffer</code> \| <code>string</code> | A buffer with pseudorandom key |
| length | <code>integer</code> | length of output keying material in octets |
| info | <code>Buffer</code> \| <code>string</code> | Optional context (safe to skip) |


