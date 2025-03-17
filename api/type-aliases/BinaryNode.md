# Type Alias: BinaryNode

> **BinaryNode**: `object`

Defined in: [src/WABinary/types.ts:9](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WABinary/types.ts#L9)

the binary node WA uses internally for communication

this is manipulated soley as an object and it does not have any functions.
This is done for easy serialization, to prevent running into issues with prototypes &
to maintain functional code structure

## Type declaration

### attrs

> **attrs**: `object`

#### Index Signature

\[`key`: `string`\]: `string`

### content?

> `optional` **content**: [`BinaryNode`](BinaryNode.md)[] \| `string` \| `Uint8Array`

### tag

> **tag**: `string`
