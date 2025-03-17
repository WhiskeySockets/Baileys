# Class: Details

Defined in: [WAProto/index.d.ts:6708](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6708)

Represents a Details.

## Implements

- [`IDetails`](../interfaces/IDetails.md)

## Constructors

### new Details()

> **new Details**(`properties`?): [`Details`](Details.md)

Defined in: [WAProto/index.d.ts:6714](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6714)

Constructs a new Details.

#### Parameters

##### properties?

[`IDetails`](../interfaces/IDetails.md)

Properties to set

#### Returns

[`Details`](Details.md)

## Properties

### issuerSerial?

> `optional` **issuerSerial**: `null` \| `number`

Defined in: [WAProto/index.d.ts:6720](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6720)

Details issuerSerial.

#### Implementation of

[`IDetails`](../interfaces/IDetails.md).[`issuerSerial`](../interfaces/IDetails.md#issuerserial)

***

### key?

> `optional` **key**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:6723](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6723)

Details key.

#### Implementation of

[`IDetails`](../interfaces/IDetails.md).[`key`](../interfaces/IDetails.md#key)

***

### notAfter?

> `optional` **notAfter**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:6729](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6729)

Details notAfter.

#### Implementation of

[`IDetails`](../interfaces/IDetails.md).[`notAfter`](../interfaces/IDetails.md#notafter)

***

### notBefore?

> `optional` **notBefore**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:6726](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6726)

Details notBefore.

#### Implementation of

[`IDetails`](../interfaces/IDetails.md).[`notBefore`](../interfaces/IDetails.md#notbefore)

***

### serial?

> `optional` **serial**: `null` \| `number`

Defined in: [WAProto/index.d.ts:6717](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6717)

Details serial.

#### Implementation of

[`IDetails`](../interfaces/IDetails.md).[`serial`](../interfaces/IDetails.md#serial)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:6799](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6799)

Converts this Details to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Details`](Details.md)

Defined in: [WAProto/index.d.ts:6736](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6736)

Creates a new Details instance using the specified properties.

#### Parameters

##### properties?

[`IDetails`](../interfaces/IDetails.md)

Properties to set

#### Returns

[`Details`](Details.md)

Details instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Details`](Details.md)

Defined in: [WAProto/index.d.ts:6762](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6762)

Decodes a Details message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Details`](Details.md)

Details

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Details`](Details.md)

Defined in: [WAProto/index.d.ts:6771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6771)

Decodes a Details message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Details`](Details.md)

Details

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6744](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6744)

Encodes the specified Details message. Does not implicitly [verify](Details.md#verify) messages.

#### Parameters

##### message

[`IDetails`](../interfaces/IDetails.md)

Details message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:6752](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6752)

Encodes the specified Details message, length delimited. Does not implicitly [verify](Details.md#verify) messages.

#### Parameters

##### message

[`IDetails`](../interfaces/IDetails.md)

Details message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Details`](Details.md)

Defined in: [WAProto/index.d.ts:6785](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6785)

Creates a Details message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Details`](Details.md)

Details

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:6806](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6806)

Gets the default type url for Details

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

Defined in: [WAProto/index.d.ts:6793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6793)

Creates a plain object from a Details message. Also converts values to other types if specified.

#### Parameters

##### message

[`Details`](Details.md)

Details

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:6778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L6778)

Verifies a Details message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
