# Function: getStream()

> **getStream**(`item`, `opts`?): `Promise`\<\{ `stream`: `Readable`; `type`: `"buffer"`; \} \| \{ `stream`: `Readable`; `type`: `"readable"`; \} \| \{ `stream`: `Readable`; `type`: `"remote"`; \} \| \{ `stream`: `ReadStream`; `type`: `"file"`; \}\>

Defined in: [src/Utils/messages-media.ts:272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/messages-media.ts#L272)

## Parameters

### item

[`WAMediaUpload`](../type-aliases/WAMediaUpload.md)

### opts?

`AxiosRequestConfig`\<`any`\>

## Returns

`Promise`\<\{ `stream`: `Readable`; `type`: `"buffer"`; \} \| \{ `stream`: `Readable`; `type`: `"readable"`; \} \| \{ `stream`: `Readable`; `type`: `"remote"`; \} \| \{ `stream`: `ReadStream`; `type`: `"file"`; \}\>
