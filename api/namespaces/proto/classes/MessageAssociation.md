# Class: MessageAssociation

Defined in: [WAProto/index.d.ts:33126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33126)

Represents a MessageAssociation.

## Implements

- [`IMessageAssociation`](../interfaces/IMessageAssociation.md)

## Constructors

### new MessageAssociation()

> **new MessageAssociation**(`properties`?): [`MessageAssociation`](MessageAssociation.md)

Defined in: [WAProto/index.d.ts:33132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33132)

Constructs a new MessageAssociation.

#### Parameters

##### properties?

[`IMessageAssociation`](../interfaces/IMessageAssociation.md)

Properties to set

#### Returns

[`MessageAssociation`](MessageAssociation.md)

## Properties

### associationType?

> `optional` **associationType**: `null` \| [`AssociationType`](../namespaces/MessageAssociation/enumerations/AssociationType.md)

Defined in: [WAProto/index.d.ts:33135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33135)

MessageAssociation associationType.

#### Implementation of

[`IMessageAssociation`](../interfaces/IMessageAssociation.md).[`associationType`](../interfaces/IMessageAssociation.md#associationtype)

***

### messageIndex?

> `optional` **messageIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:33141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33141)

MessageAssociation messageIndex.

#### Implementation of

[`IMessageAssociation`](../interfaces/IMessageAssociation.md).[`messageIndex`](../interfaces/IMessageAssociation.md#messageindex)

***

### parentMessageKey?

> `optional` **parentMessageKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:33138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33138)

MessageAssociation parentMessageKey.

#### Implementation of

[`IMessageAssociation`](../interfaces/IMessageAssociation.md).[`parentMessageKey`](../interfaces/IMessageAssociation.md#parentmessagekey)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:33211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33211)

Converts this MessageAssociation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`MessageAssociation`](MessageAssociation.md)

Defined in: [WAProto/index.d.ts:33148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33148)

Creates a new MessageAssociation instance using the specified properties.

#### Parameters

##### properties?

[`IMessageAssociation`](../interfaces/IMessageAssociation.md)

Properties to set

#### Returns

[`MessageAssociation`](MessageAssociation.md)

MessageAssociation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`MessageAssociation`](MessageAssociation.md)

Defined in: [WAProto/index.d.ts:33174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33174)

Decodes a MessageAssociation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`MessageAssociation`](MessageAssociation.md)

MessageAssociation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`MessageAssociation`](MessageAssociation.md)

Defined in: [WAProto/index.d.ts:33183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33183)

Decodes a MessageAssociation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`MessageAssociation`](MessageAssociation.md)

MessageAssociation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:33156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33156)

Encodes the specified MessageAssociation message. Does not implicitly [verify](MessageAssociation.md#verify) messages.

#### Parameters

##### message

[`IMessageAssociation`](../interfaces/IMessageAssociation.md)

MessageAssociation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:33164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33164)

Encodes the specified MessageAssociation message, length delimited. Does not implicitly [verify](MessageAssociation.md#verify) messages.

#### Parameters

##### message

[`IMessageAssociation`](../interfaces/IMessageAssociation.md)

MessageAssociation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`MessageAssociation`](MessageAssociation.md)

Defined in: [WAProto/index.d.ts:33197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33197)

Creates a MessageAssociation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`MessageAssociation`](MessageAssociation.md)

MessageAssociation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:33218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33218)

Gets the default type url for MessageAssociation

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

Defined in: [WAProto/index.d.ts:33205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33205)

Creates a plain object from a MessageAssociation message. Also converts values to other types if specified.

#### Parameters

##### message

[`MessageAssociation`](MessageAssociation.md)

MessageAssociation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:33190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L33190)

Verifies a MessageAssociation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
