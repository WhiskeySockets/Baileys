# Function: generateOrGetPreKeys()

> **generateOrGetPreKeys**(`creds`, `range`): `object`

Defined in: [src/Utils/signal.ts:29](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/signal.ts#L29)

## Parameters

### creds

[`AuthenticationCreds`](../type-aliases/AuthenticationCreds.md)

### range

`number`

## Returns

`object`

### lastPreKeyId

> **lastPreKeyId**: `number`

### newPreKeys

> **newPreKeys**: `object`

#### Index Signature

\[`id`: `number`\]: [`KeyPair`](../type-aliases/KeyPair.md)

### preKeysRange

> **preKeysRange**: readonly \[`number`, `number`\]
