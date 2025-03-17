# Function: makeNoiseHandler()

> **makeNoiseHandler**(`__namedParameters`): `object`

Defined in: [src/Utils/noise-handler.ts:16](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/noise-handler.ts#L16)

## Parameters

### \_\_namedParameters

#### keyPair

[`KeyPair`](../type-aliases/KeyPair.md)

#### logger

`ILogger`

#### NOISE_HEADER

`Uint8Array`

#### routingInfo?

`Buffer`\<`ArrayBufferLike`\>

## Returns

`object`

### authenticate()

> **authenticate**: (`data`) => `void`

#### Parameters

##### data

`Uint8Array`

#### Returns

`void`

### decodeFrame()

> **decodeFrame**: (`newData`, `onFrame`) => `Promise`\<`void`\>

#### Parameters

##### newData

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

##### onFrame

(`buff`) => `void`

#### Returns

`Promise`\<`void`\>

### decrypt()

> **decrypt**: (`ciphertext`) => `Buffer`\<`ArrayBuffer`\>

#### Parameters

##### ciphertext

`Uint8Array`

#### Returns

`Buffer`\<`ArrayBuffer`\>

### encodeFrame()

> **encodeFrame**: (`data`) => `Buffer`\<`ArrayBuffer`\>

#### Parameters

##### data

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`Buffer`\<`ArrayBuffer`\>

### encrypt()

> **encrypt**: (`plaintext`) => `Buffer`\<`ArrayBuffer`\>

#### Parameters

##### plaintext

`Uint8Array`

#### Returns

`Buffer`\<`ArrayBuffer`\>

### finishInit()

> **finishInit**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### mixIntoKey()

> **mixIntoKey**: (`data`) => `Promise`\<`void`\>

#### Parameters

##### data

`Uint8Array`

#### Returns

`Promise`\<`void`\>

### processHandshake()

> **processHandshake**: (`__namedParameters`, `noiseKey`) => `Promise`\<`Buffer`\<`ArrayBuffer`\>\>

#### Parameters

##### \_\_namedParameters

[`HandshakeMessage`](../namespaces/proto/classes/HandshakeMessage.md)

##### noiseKey

[`KeyPair`](../type-aliases/KeyPair.md)

#### Returns

`Promise`\<`Buffer`\<`ArrayBuffer`\>\>
