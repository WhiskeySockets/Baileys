# Class: DeleteChatAction

Defined in: [WAProto/index.d.ts:42165](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42165)

Represents a DeleteChatAction.

## Implements

- [`IDeleteChatAction`](../interfaces/IDeleteChatAction.md)

## Constructors

### new DeleteChatAction()

> **new DeleteChatAction**(`properties`?): [`DeleteChatAction`](DeleteChatAction.md)

Defined in: [WAProto/index.d.ts:42171](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42171)

Constructs a new DeleteChatAction.

#### Parameters

##### properties?

[`IDeleteChatAction`](../interfaces/IDeleteChatAction.md)

Properties to set

#### Returns

[`DeleteChatAction`](DeleteChatAction.md)

## Properties

### messageRange?

> `optional` **messageRange**: `null` \| [`ISyncActionMessageRange`](../interfaces/ISyncActionMessageRange.md)

Defined in: [WAProto/index.d.ts:42174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42174)

DeleteChatAction messageRange.

#### Implementation of

[`IDeleteChatAction`](../interfaces/IDeleteChatAction.md).[`messageRange`](../interfaces/IDeleteChatAction.md#messagerange)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42244](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42244)

Converts this DeleteChatAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeleteChatAction`](DeleteChatAction.md)

Defined in: [WAProto/index.d.ts:42181](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42181)

Creates a new DeleteChatAction instance using the specified properties.

#### Parameters

##### properties?

[`IDeleteChatAction`](../interfaces/IDeleteChatAction.md)

Properties to set

#### Returns

[`DeleteChatAction`](DeleteChatAction.md)

DeleteChatAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeleteChatAction`](DeleteChatAction.md)

Defined in: [WAProto/index.d.ts:42207](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42207)

Decodes a DeleteChatAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeleteChatAction`](DeleteChatAction.md)

DeleteChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeleteChatAction`](DeleteChatAction.md)

Defined in: [WAProto/index.d.ts:42216](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42216)

Decodes a DeleteChatAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeleteChatAction`](DeleteChatAction.md)

DeleteChatAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42189](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42189)

Encodes the specified DeleteChatAction message. Does not implicitly [verify](DeleteChatAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteChatAction`](../interfaces/IDeleteChatAction.md)

DeleteChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42197)

Encodes the specified DeleteChatAction message, length delimited. Does not implicitly [verify](DeleteChatAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteChatAction`](../interfaces/IDeleteChatAction.md)

DeleteChatAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeleteChatAction`](DeleteChatAction.md)

Defined in: [WAProto/index.d.ts:42230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42230)

Creates a DeleteChatAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeleteChatAction`](DeleteChatAction.md)

DeleteChatAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42251)

Gets the default type url for DeleteChatAction

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

Defined in: [WAProto/index.d.ts:42238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42238)

Creates a plain object from a DeleteChatAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeleteChatAction`](DeleteChatAction.md)

DeleteChatAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42223](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42223)

Verifies a DeleteChatAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
