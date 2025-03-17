# Function: configureSuccessfulPairing()

> **configureSuccessfulPairing**(`stanza`, `__namedParameters`): `object`

Defined in: [src/Utils/validate-connection.ts:112](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/validate-connection.ts#L112)

## Parameters

### stanza

[`BinaryNode`](../type-aliases/BinaryNode.md)

### \_\_namedParameters

`Pick`\<[`AuthenticationCreds`](../type-aliases/AuthenticationCreds.md), `"signedIdentityKey"` \| `"advSecretKey"` \| `"signalIdentities"`\>

## Returns

`object`

### creds

> **creds**: `Partial`\<[`AuthenticationCreds`](../type-aliases/AuthenticationCreds.md)\> = `authUpdate`

### reply

> **reply**: [`BinaryNode`](../type-aliases/BinaryNode.md)
