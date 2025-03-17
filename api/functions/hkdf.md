# Function: hkdf()

> **hkdf**(`buffer`, `expandedLength`, `info`): `Promise`\<`Buffer`\<`ArrayBufferLike`\>\>

Defined in: [src/Utils/crypto.ts:127](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/crypto.ts#L127)

## Parameters

### buffer

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

### expandedLength

`number`

### info

#### info?

`string`

#### salt?

`Buffer`\<`ArrayBufferLike`\>

## Returns

`Promise`\<`Buffer`\<`ArrayBufferLike`\>\>
