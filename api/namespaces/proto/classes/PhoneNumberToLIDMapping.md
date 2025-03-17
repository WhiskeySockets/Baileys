# Class: PhoneNumberToLIDMapping

Defined in: [WAProto/index.d.ts:36101](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36101)

Represents a PhoneNumberToLIDMapping.

## Implements

- [`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md)

## Constructors

### new PhoneNumberToLIDMapping()

> **new PhoneNumberToLIDMapping**(`properties`?): [`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

Defined in: [WAProto/index.d.ts:36107](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36107)

Constructs a new PhoneNumberToLIDMapping.

#### Parameters

##### properties?

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md)

Properties to set

#### Returns

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

## Properties

### lidJid?

> `optional` **lidJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:36113](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36113)

PhoneNumberToLIDMapping lidJid.

#### Implementation of

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md).[`lidJid`](../interfaces/IPhoneNumberToLIDMapping.md#lidjid)

***

### pnJid?

> `optional` **pnJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:36110](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36110)

PhoneNumberToLIDMapping pnJid.

#### Implementation of

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md).[`pnJid`](../interfaces/IPhoneNumberToLIDMapping.md#pnjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36183)

Converts this PhoneNumberToLIDMapping to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

Defined in: [WAProto/index.d.ts:36120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36120)

Creates a new PhoneNumberToLIDMapping instance using the specified properties.

#### Parameters

##### properties?

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md)

Properties to set

#### Returns

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

Defined in: [WAProto/index.d.ts:36146](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36146)

Decodes a PhoneNumberToLIDMapping message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

Defined in: [WAProto/index.d.ts:36155](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36155)

Decodes a PhoneNumberToLIDMapping message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36128](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36128)

Encodes the specified PhoneNumberToLIDMapping message. Does not implicitly [verify](PhoneNumberToLIDMapping.md#verify) messages.

#### Parameters

##### message

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:36136](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36136)

Encodes the specified PhoneNumberToLIDMapping message, length delimited. Does not implicitly [verify](PhoneNumberToLIDMapping.md#verify) messages.

#### Parameters

##### message

[`IPhoneNumberToLIDMapping`](../interfaces/IPhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

Defined in: [WAProto/index.d.ts:36169](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36169)

Creates a PhoneNumberToLIDMapping message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36190)

Gets the default type url for PhoneNumberToLIDMapping

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

Defined in: [WAProto/index.d.ts:36177](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36177)

Creates a plain object from a PhoneNumberToLIDMapping message. Also converts values to other types if specified.

#### Parameters

##### message

[`PhoneNumberToLIDMapping`](PhoneNumberToLIDMapping.md)

PhoneNumberToLIDMapping

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:36162](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36162)

Verifies a PhoneNumberToLIDMapping message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
