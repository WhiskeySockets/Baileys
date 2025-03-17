# Function: encryptMediaRetryRequest()

> **encryptMediaRetryRequest**(`key`, `mediaKey`, `meId`): `Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>

Defined in: [src/Utils/messages-media.ts:676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/messages-media.ts#L676)

Generate a binary node that will request the phone to re-upload the media & return the newly uploaded URL

## Parameters

### key

[`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)

### mediaKey

`Uint8Array`\<`ArrayBufferLike`\> | `Buffer`\<`ArrayBufferLike`\>

### meId

`string`

## Returns

`Promise`\<[`BinaryNode`](../type-aliases/BinaryNode.md)\>
