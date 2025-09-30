# curve25519-js

Curve25519 signatures with X25519 keys.


## Installation

```
npm i curve25519-js
```

## Usage

```js
import { sharedKey } from 'curve25519-js';

const ALICE_PRIV = '77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a';
const BOB_PUB = 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f';

const alicePriv = Uint8Array.from(Buffer.from(ALICE_PRIV, 'hex'));

const bobPub = Uint8Array.from(Buffer.from(BOB_PUB, 'hex'));

const secret = sharedKey(alicePriv, bobPub);

console.log('Secret:', Buffer.from(secret).toString('hex'))
```

## Functions

### generateKeyPair
Generates a new key pair from the given 32-byte secret seed (which should be generated with a CSPRNG) and returns it as object:
```ts
generateKeyPair(seed: Uint8Array(32)): { 
  private: Uint8Array(32);
  public: Uint8Array(32);
}
```
The returned keys can be used for signing and key agreement.

### sign

Signs the given message using the private key and returns signature.

```ts
sign(secretKey: Uint8Array(32), message: any, [random: Uint8Array(64)]): Uint8Array(64)
```

Optional random data argument (which must have 64 random bytes) turns on
hash separation and randomization to make signatures non-deterministic.

### verify

Verifies the given signature for the message using the given private key.
Returns `true` if the signature is valid, `false` otherwise.

```ts
verify(publicKey: Uint8Array(32), message: any, signature: Uint8Array(64)): boolean
```

### signMessage

Signs the given message using the private key and returns
a signed message (signature concatenated with the message copy).

```ts
signMessage(secretKey: Uint8Array(32), message: any, [random: Uint8Array(64)]): any
```

Optional random data argument (which must have 64 random bytes) turns on
hash separation and randomization to make signatures non-deterministic.

### openMessage

Verifies signed message with the public key and returns the original message
without signature if it's correct or `null` if verification fails.

```ts
openMessage(publicKey: Uint8Array(32), signedMessage: any): Message | null
```


### sharedKey
Returns a raw shared key between own private key and peer's public key (in other words, this is an ECC Diffie-Hellman function X25519, performing scalar multiplication).

The result should not be used directly as a key, but should be processed with a one-way function (e.g. HSalsa20 as in NaCl, or any secure cryptographic hash function, such as SHA-256, or key derivation function, such as HKDF).
```ts
sharedKey(privateKey: Uint8Array(32), publicKey: Uint8Array(32)): Uint8Array(32)
```

## How is it different from Ed25519?
Axlsign allows calculating key agreement and signing using just a single X25519 key instead of two different X25519 and Ed25519 keys.

It uses keys in X25519 format (Montgomery), while Ed25519 uses keys in a different representation (Twisted Edwards). Internally, it converts keys to the correct format, but since such conversion would lose a sign bit, it also embeds the sign bit from public key into signature during signing, and puts it back into the key during verification.

Note: if signing and performing key agreement with a single key is needed, but using keys in X25519 format is not a requrement, a better choice is to use Ed25519 keys, and then convert them to X25519 keys for key agreement (e.g. using <https://github.com/dchest/ed2curve-js>). This allows using only an external conversion functions without changing signature algorithms and formats.

## Credits

Re-written in 2019 with TypeScript support by Harvey Connor.

Written in 2016 by Dmitry Chestnykh.
You can use it under MIT or CC0 license.

Curve25519 signatures idea and math by Trevor Perrin
<https://moderncrypto.org/mail-archive/curves/2014/000205.html>

Derived from TweetNaCl.js <https://tweetnacl.js.org>.
Ported in 2014 by Dmitry Chestnykh and Devi Mandiri. Public domain.
Implementation derived from TweetNaCl version 20140427
<http://tweetnacl.cr.yp.to>