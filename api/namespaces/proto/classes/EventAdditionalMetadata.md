# Class: EventAdditionalMetadata

Defined in: [WAProto/index.d.ts:12924](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12924)

Represents an EventAdditionalMetadata.

## Implements

- [`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md)

## Constructors

### new EventAdditionalMetadata()

> **new EventAdditionalMetadata**(`properties`?): [`EventAdditionalMetadata`](EventAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:12930](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12930)

Constructs a new EventAdditionalMetadata.

#### Parameters

##### properties?

[`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md)

Properties to set

#### Returns

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

## Properties

### isStale?

> `optional` **isStale**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:12933](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12933)

EventAdditionalMetadata isStale.

#### Implementation of

[`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md).[`isStale`](../interfaces/IEventAdditionalMetadata.md#isstale)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13003)

Converts this EventAdditionalMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`EventAdditionalMetadata`](EventAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:12940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12940)

Creates a new EventAdditionalMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md)

Properties to set

#### Returns

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

EventAdditionalMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`EventAdditionalMetadata`](EventAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:12966](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12966)

Decodes an EventAdditionalMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

EventAdditionalMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`EventAdditionalMetadata`](EventAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:12975](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12975)

Decodes an EventAdditionalMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

EventAdditionalMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12948](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12948)

Encodes the specified EventAdditionalMetadata message. Does not implicitly [verify](EventAdditionalMetadata.md#verify) messages.

#### Parameters

##### message

[`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md)

EventAdditionalMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:12956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12956)

Encodes the specified EventAdditionalMetadata message, length delimited. Does not implicitly [verify](EventAdditionalMetadata.md#verify) messages.

#### Parameters

##### message

[`IEventAdditionalMetadata`](../interfaces/IEventAdditionalMetadata.md)

EventAdditionalMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`EventAdditionalMetadata`](EventAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:12989](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12989)

Creates an EventAdditionalMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

EventAdditionalMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13010](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13010)

Gets the default type url for EventAdditionalMetadata

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

Defined in: [WAProto/index.d.ts:12997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12997)

Creates a plain object from an EventAdditionalMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`EventAdditionalMetadata`](EventAdditionalMetadata.md)

EventAdditionalMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:12982](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L12982)

Verifies an EventAdditionalMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
