# Type Alias: MessageRelayOptions

> **MessageRelayOptions**: `MinimalRelayOptions` & `object`

Defined in: [src/Types/Message.ts:207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Message.ts#L207)

## Type declaration

### additionalAttributes?

> `optional` **additionalAttributes**: `object`

additional attributes to add to the WA binary node

#### Index Signature

\[`_`: `string`\]: `string`

### additionalNodes?

> `optional` **additionalNodes**: [`BinaryNode`](BinaryNode.md)[]

### participant?

> `optional` **participant**: `object`

only send to a specific participant; used when a message decryption fails for a single user

#### participant.count

> **count**: `number`

#### participant.jid

> **jid**: `string`

### statusJidList?

> `optional` **statusJidList**: `string`[]

jid list of participants for status@broadcast

### useUserDevicesCache?

> `optional` **useUserDevicesCache**: `boolean`

should we use the devices cache, or fetch afresh from the server; default assumed to be "true"
