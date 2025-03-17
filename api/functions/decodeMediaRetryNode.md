# Function: decodeMediaRetryNode()

> **decodeMediaRetryNode**(`node`): `object`

Defined in: [src/Utils/messages-media.ts:722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/messages-media.ts#L722)

## Parameters

### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

## Returns

`object`

### error?

> `optional` **error**: `Boom`\<`any`\>

### key

> **key**: [`IMessageKey`](../namespaces/proto/interfaces/IMessageKey.md)

### media?

> `optional` **media**: `object`

#### media.ciphertext

> **ciphertext**: `Uint8Array`

#### media.iv

> **iv**: `Uint8Array`
