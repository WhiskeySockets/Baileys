# Class: DNSSource

Defined in: [WAProto/index.d.ts:7946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7946)

Represents a DNSSource.

## Implements

- [`IDNSSource`](../interfaces/IDNSSource.md)

## Constructors

### new DNSSource()

> **new DNSSource**(`properties`?): [`DNSSource`](DNSSource.md)

Defined in: [WAProto/index.d.ts:7952](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7952)

Constructs a new DNSSource.

#### Parameters

##### properties?

[`IDNSSource`](../interfaces/IDNSSource.md)

Properties to set

#### Returns

[`DNSSource`](DNSSource.md)

## Properties

### appCached?

> `optional` **appCached**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7958](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7958)

DNSSource appCached.

#### Implementation of

[`IDNSSource`](../interfaces/IDNSSource.md).[`appCached`](../interfaces/IDNSSource.md#appcached)

***

### dnsMethod?

> `optional` **dnsMethod**: `null` \| [`DNSResolutionMethod`](../namespaces/DNSSource/enumerations/DNSResolutionMethod.md)

Defined in: [WAProto/index.d.ts:7955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7955)

DNSSource dnsMethod.

#### Implementation of

[`IDNSSource`](../interfaces/IDNSSource.md).[`dnsMethod`](../interfaces/IDNSSource.md#dnsmethod)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:8028](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8028)

Converts this DNSSource to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DNSSource`](DNSSource.md)

Defined in: [WAProto/index.d.ts:7965](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7965)

Creates a new DNSSource instance using the specified properties.

#### Parameters

##### properties?

[`IDNSSource`](../interfaces/IDNSSource.md)

Properties to set

#### Returns

[`DNSSource`](DNSSource.md)

DNSSource instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DNSSource`](DNSSource.md)

Defined in: [WAProto/index.d.ts:7991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7991)

Decodes a DNSSource message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DNSSource`](DNSSource.md)

DNSSource

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DNSSource`](DNSSource.md)

Defined in: [WAProto/index.d.ts:8000](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8000)

Decodes a DNSSource message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DNSSource`](DNSSource.md)

DNSSource

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7973](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7973)

Encodes the specified DNSSource message. Does not implicitly [verify](DNSSource.md#verify) messages.

#### Parameters

##### message

[`IDNSSource`](../interfaces/IDNSSource.md)

DNSSource message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7981](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7981)

Encodes the specified DNSSource message, length delimited. Does not implicitly [verify](DNSSource.md#verify) messages.

#### Parameters

##### message

[`IDNSSource`](../interfaces/IDNSSource.md)

DNSSource message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DNSSource`](DNSSource.md)

Defined in: [WAProto/index.d.ts:8014](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8014)

Creates a DNSSource message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DNSSource`](DNSSource.md)

DNSSource

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:8035](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8035)

Gets the default type url for DNSSource

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

Defined in: [WAProto/index.d.ts:8022](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8022)

Creates a plain object from a DNSSource message. Also converts values to other types if specified.

#### Parameters

##### message

[`DNSSource`](DNSSource.md)

DNSSource

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:8007](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L8007)

Verifies a DNSSource message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
