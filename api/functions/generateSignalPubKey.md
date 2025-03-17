# Function: generateSignalPubKey()

> **generateSignalPubKey**(`pubKey`): `Uint8Array`\<`ArrayBufferLike`\> \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [src/Utils/crypto.ts:10](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/crypto.ts#L10)

prefix version byte to the pub keys, required for some curve crypto functions

## Parameters

### pubKey

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

## Returns

`Uint8Array`\<`ArrayBufferLike`\> \| `Buffer`\<`ArrayBufferLike`\>
