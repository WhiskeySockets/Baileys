# Class: DeleteMessageForMeAction

Defined in: [WAProto/index.d.ts:42368](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42368)

Represents a DeleteMessageForMeAction.

## Implements

- [`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md)

## Constructors

### new DeleteMessageForMeAction()

> **new DeleteMessageForMeAction**(`properties`?): [`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

Defined in: [WAProto/index.d.ts:42374](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42374)

Constructs a new DeleteMessageForMeAction.

#### Parameters

##### properties?

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md)

Properties to set

#### Returns

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

## Properties

### deleteMedia?

> `optional` **deleteMedia**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:42377](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42377)

DeleteMessageForMeAction deleteMedia.

#### Implementation of

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md).[`deleteMedia`](../interfaces/IDeleteMessageForMeAction.md#deletemedia)

***

### messageTimestamp?

> `optional` **messageTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:42380](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42380)

DeleteMessageForMeAction messageTimestamp.

#### Implementation of

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md).[`messageTimestamp`](../interfaces/IDeleteMessageForMeAction.md#messagetimestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42450](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42450)

Converts this DeleteMessageForMeAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

Defined in: [WAProto/index.d.ts:42387](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42387)

Creates a new DeleteMessageForMeAction instance using the specified properties.

#### Parameters

##### properties?

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md)

Properties to set

#### Returns

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

DeleteMessageForMeAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

Defined in: [WAProto/index.d.ts:42413](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42413)

Decodes a DeleteMessageForMeAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

DeleteMessageForMeAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

Defined in: [WAProto/index.d.ts:42422](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42422)

Decodes a DeleteMessageForMeAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

DeleteMessageForMeAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42395](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42395)

Encodes the specified DeleteMessageForMeAction message. Does not implicitly [verify](DeleteMessageForMeAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md)

DeleteMessageForMeAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42403](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42403)

Encodes the specified DeleteMessageForMeAction message, length delimited. Does not implicitly [verify](DeleteMessageForMeAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteMessageForMeAction`](../interfaces/IDeleteMessageForMeAction.md)

DeleteMessageForMeAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

Defined in: [WAProto/index.d.ts:42436](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42436)

Creates a DeleteMessageForMeAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

DeleteMessageForMeAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42457](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42457)

Gets the default type url for DeleteMessageForMeAction

#### Parameters

##### typeUrlPrefix?

`string`

your custom typeUrlPrefix(default "type.googleapis.com")

#### Returns

`string`

The default type url

***

### toObject()

> `static` **toObject**(`message`, `options`?): `object`

Defined in: [WAProto/index.d.ts:42444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42444)

Creates a plain object from a DeleteMessageForMeAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeleteMessageForMeAction`](DeleteMessageForMeAction.md)

DeleteMessageForMeAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42429](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42429)

Verifies a DeleteMessageForMeAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
