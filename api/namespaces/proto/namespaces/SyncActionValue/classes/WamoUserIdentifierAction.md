# Class: WamoUserIdentifierAction

Defined in: [WAProto/index.d.ts:46680](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46680)

Represents a WamoUserIdentifierAction.

## Implements

- [`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md)

## Constructors

### new WamoUserIdentifierAction()

> **new WamoUserIdentifierAction**(`properties`?): [`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

Defined in: [WAProto/index.d.ts:46686](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46686)

Constructs a new WamoUserIdentifierAction.

#### Parameters

##### properties?

[`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md)

Properties to set

#### Returns

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

## Properties

### identifier?

> `optional` **identifier**: `null` \| `string`

Defined in: [WAProto/index.d.ts:46689](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46689)

WamoUserIdentifierAction identifier.

#### Implementation of

[`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md).[`identifier`](../interfaces/IWamoUserIdentifierAction.md#identifier)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:46759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46759)

Converts this WamoUserIdentifierAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

Defined in: [WAProto/index.d.ts:46696](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46696)

Creates a new WamoUserIdentifierAction instance using the specified properties.

#### Parameters

##### properties?

[`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md)

Properties to set

#### Returns

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

WamoUserIdentifierAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

Defined in: [WAProto/index.d.ts:46722](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46722)

Decodes a WamoUserIdentifierAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

WamoUserIdentifierAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

Defined in: [WAProto/index.d.ts:46731](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46731)

Decodes a WamoUserIdentifierAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

WamoUserIdentifierAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46704](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46704)

Encodes the specified WamoUserIdentifierAction message. Does not implicitly [verify](WamoUserIdentifierAction.md#verify) messages.

#### Parameters

##### message

[`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md)

WamoUserIdentifierAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:46712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46712)

Encodes the specified WamoUserIdentifierAction message, length delimited. Does not implicitly [verify](WamoUserIdentifierAction.md#verify) messages.

#### Parameters

##### message

[`IWamoUserIdentifierAction`](../interfaces/IWamoUserIdentifierAction.md)

WamoUserIdentifierAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

Defined in: [WAProto/index.d.ts:46745](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46745)

Creates a WamoUserIdentifierAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

WamoUserIdentifierAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:46766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46766)

Gets the default type url for WamoUserIdentifierAction

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

Defined in: [WAProto/index.d.ts:46753](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46753)

Creates a plain object from a WamoUserIdentifierAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`WamoUserIdentifierAction`](WamoUserIdentifierAction.md)

WamoUserIdentifierAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:46738](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L46738)

Verifies a WamoUserIdentifierAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
