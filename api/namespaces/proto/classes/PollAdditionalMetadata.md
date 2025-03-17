# Class: PollAdditionalMetadata

Defined in: [WAProto/index.d.ts:36556](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36556)

Represents a PollAdditionalMetadata.

## Implements

- [`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md)

## Constructors

### new PollAdditionalMetadata()

> **new PollAdditionalMetadata**(`properties`?): [`PollAdditionalMetadata`](PollAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:36562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36562)

Constructs a new PollAdditionalMetadata.

#### Parameters

##### properties?

[`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md)

Properties to set

#### Returns

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

## Properties

### pollInvalidated?

> `optional` **pollInvalidated**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:36565](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36565)

PollAdditionalMetadata pollInvalidated.

#### Implementation of

[`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md).[`pollInvalidated`](../interfaces/IPollAdditionalMetadata.md#pollinvalidated)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36635](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36635)

Converts this PollAdditionalMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PollAdditionalMetadata`](PollAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:36572](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36572)

Creates a new PollAdditionalMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md)

Properties to set

#### Returns

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

PollAdditionalMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PollAdditionalMetadata`](PollAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:36598](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36598)

Decodes a PollAdditionalMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

PollAdditionalMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PollAdditionalMetadata`](PollAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:36607](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36607)

Decodes a PollAdditionalMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

PollAdditionalMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36580](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36580)

Encodes the specified PollAdditionalMetadata message. Does not implicitly [verify](PollAdditionalMetadata.md#verify) messages.

#### Parameters

##### message

[`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md)

PollAdditionalMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36588](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36588)

Encodes the specified PollAdditionalMetadata message, length delimited. Does not implicitly [verify](PollAdditionalMetadata.md#verify) messages.

#### Parameters

##### message

[`IPollAdditionalMetadata`](../interfaces/IPollAdditionalMetadata.md)

PollAdditionalMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PollAdditionalMetadata`](PollAdditionalMetadata.md)

Defined in: [WAProto/index.d.ts:36621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36621)

Creates a PollAdditionalMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

PollAdditionalMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36642](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36642)

Gets the default type url for PollAdditionalMetadata

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

Defined in: [WAProto/index.d.ts:36629](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36629)

Creates a plain object from a PollAdditionalMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`PollAdditionalMetadata`](PollAdditionalMetadata.md)

PollAdditionalMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36614](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36614)

Verifies a PollAdditionalMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
