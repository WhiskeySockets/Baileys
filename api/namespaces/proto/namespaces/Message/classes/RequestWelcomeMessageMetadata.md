# Class: RequestWelcomeMessageMetadata

Defined in: [WAProto/index.d.ts:30580](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30580)

Represents a RequestWelcomeMessageMetadata.

## Implements

- [`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

## Constructors

### new RequestWelcomeMessageMetadata()

> **new RequestWelcomeMessageMetadata**(`properties`?): [`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30586](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30586)

Constructs a new RequestWelcomeMessageMetadata.

#### Parameters

##### properties?

[`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

Properties to set

#### Returns

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

## Properties

### localChatState?

> `optional` **localChatState**: `null` \| [`LocalChatState`](../namespaces/RequestWelcomeMessageMetadata/enumerations/LocalChatState.md)

Defined in: [WAProto/index.d.ts:30589](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30589)

RequestWelcomeMessageMetadata localChatState.

#### Implementation of

[`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md).[`localChatState`](../interfaces/IRequestWelcomeMessageMetadata.md#localchatstate)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:30659](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30659)

Converts this RequestWelcomeMessageMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30596)

Creates a new RequestWelcomeMessageMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

Properties to set

#### Returns

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30622](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30622)

Decodes a RequestWelcomeMessageMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30631](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30631)

Decodes a RequestWelcomeMessageMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30604)

Encodes the specified RequestWelcomeMessageMetadata message. Does not implicitly [verify](RequestWelcomeMessageMetadata.md#verify) messages.

#### Parameters

##### message

[`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:30612](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30612)

Encodes the specified RequestWelcomeMessageMetadata message, length delimited. Does not implicitly [verify](RequestWelcomeMessageMetadata.md#verify) messages.

#### Parameters

##### message

[`IRequestWelcomeMessageMetadata`](../interfaces/IRequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

Defined in: [WAProto/index.d.ts:30645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30645)

Creates a RequestWelcomeMessageMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:30666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30666)

Gets the default type url for RequestWelcomeMessageMetadata

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

Defined in: [WAProto/index.d.ts:30653](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30653)

Creates a plain object from a RequestWelcomeMessageMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`RequestWelcomeMessageMetadata`](RequestWelcomeMessageMetadata.md)

RequestWelcomeMessageMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:30638](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L30638)

Verifies a RequestWelcomeMessageMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
