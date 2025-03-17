# Class: UrlTrackingMap

Defined in: [WAProto/index.d.ts:48180](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48180)

Represents an UrlTrackingMap.

## Implements

- [`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md)

## Constructors

### new UrlTrackingMap()

> **new UrlTrackingMap**(`properties`?): [`UrlTrackingMap`](UrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:48186](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48186)

Constructs a new UrlTrackingMap.

#### Parameters

##### properties?

[`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md)

Properties to set

#### Returns

[`UrlTrackingMap`](UrlTrackingMap.md)

## Properties

### urlTrackingMapElements

> **urlTrackingMapElements**: [`IUrlTrackingMapElement`](../namespaces/UrlTrackingMap/interfaces/IUrlTrackingMapElement.md)[]

Defined in: [WAProto/index.d.ts:48189](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48189)

UrlTrackingMap urlTrackingMapElements.

#### Implementation of

[`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md).[`urlTrackingMapElements`](../interfaces/IUrlTrackingMap.md#urltrackingmapelements)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:48259](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48259)

Converts this UrlTrackingMap to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`UrlTrackingMap`](UrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:48196](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48196)

Creates a new UrlTrackingMap instance using the specified properties.

#### Parameters

##### properties?

[`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md)

Properties to set

#### Returns

[`UrlTrackingMap`](UrlTrackingMap.md)

UrlTrackingMap instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`UrlTrackingMap`](UrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:48222](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48222)

Decodes an UrlTrackingMap message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`UrlTrackingMap`](UrlTrackingMap.md)

UrlTrackingMap

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`UrlTrackingMap`](UrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:48231](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48231)

Decodes an UrlTrackingMap message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`UrlTrackingMap`](UrlTrackingMap.md)

UrlTrackingMap

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48204](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48204)

Encodes the specified UrlTrackingMap message. Does not implicitly [verify](UrlTrackingMap.md#verify) messages.

#### Parameters

##### message

[`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md)

UrlTrackingMap message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:48212](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48212)

Encodes the specified UrlTrackingMap message, length delimited. Does not implicitly [verify](UrlTrackingMap.md#verify) messages.

#### Parameters

##### message

[`IUrlTrackingMap`](../interfaces/IUrlTrackingMap.md)

UrlTrackingMap message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`UrlTrackingMap`](UrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:48245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48245)

Creates an UrlTrackingMap message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`UrlTrackingMap`](UrlTrackingMap.md)

UrlTrackingMap

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:48266](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48266)

Gets the default type url for UrlTrackingMap

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

Defined in: [WAProto/index.d.ts:48253](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48253)

Creates a plain object from an UrlTrackingMap message. Also converts values to other types if specified.

#### Parameters

##### message

[`UrlTrackingMap`](UrlTrackingMap.md)

UrlTrackingMap

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:48238](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L48238)

Verifies an UrlTrackingMap message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
