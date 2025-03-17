# Function: normalizeMessageContent()

> **normalizeMessageContent**(`content`): `undefined` \| [`IMessage`](../namespaces/proto/interfaces/IMessage.md)

Defined in: [src/Utils/messages.ts:652](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/messages.ts#L652)

Normalizes ephemeral, view once messages to regular message content
Eg. image messages in ephemeral messages, in view once messages etc.

## Parameters

### content

`undefined` | `null` | [`IMessage`](../namespaces/proto/interfaces/IMessage.md)

## Returns

`undefined` \| [`IMessage`](../namespaces/proto/interfaces/IMessage.md)
