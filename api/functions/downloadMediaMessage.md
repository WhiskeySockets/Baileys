# Function: downloadMediaMessage()

> **downloadMediaMessage**\<`Type`\>(`message`, `type`, `options`, `ctx`?): `Promise`\<`Type` *extends* `"buffer"` ? `Buffer`\<`ArrayBufferLike`\> : `Transform`\>

Defined in: [src/Utils/messages.ts:857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/messages.ts#L857)

Downloads the given message. Throws an error if it's not a media message

## Type Parameters

• **Type** *extends* `"stream"` \| `"buffer"`

## Parameters

### message

[`IWebMessageInfo`](../namespaces/proto/interfaces/IWebMessageInfo.md)

### type

`Type`

### options

[`MediaDownloadOptions`](../type-aliases/MediaDownloadOptions.md)

### ctx?

`DownloadMediaMessageContext`

## Returns

`Promise`\<`Type` *extends* `"buffer"` ? `Buffer`\<`ArrayBufferLike`\> : `Transform`\>
