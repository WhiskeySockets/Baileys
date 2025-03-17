# Class: ClientPairingProps

Defined in: [WAProto/index.d.ts:7552](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7552)

Represents a ClientPairingProps.

## Implements

- [`IClientPairingProps`](../interfaces/IClientPairingProps.md)

## Constructors

### new ClientPairingProps()

> **new ClientPairingProps**(`properties`?): [`ClientPairingProps`](ClientPairingProps.md)

Defined in: [WAProto/index.d.ts:7558](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7558)

Constructs a new ClientPairingProps.

#### Parameters

##### properties?

[`IClientPairingProps`](../interfaces/IClientPairingProps.md)

Properties to set

#### Returns

[`ClientPairingProps`](ClientPairingProps.md)

## Properties

### isChatDbLidMigrated?

> `optional` **isChatDbLidMigrated**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7561](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7561)

ClientPairingProps isChatDbLidMigrated.

#### Implementation of

[`IClientPairingProps`](../interfaces/IClientPairingProps.md).[`isChatDbLidMigrated`](../interfaces/IClientPairingProps.md#ischatdblidmigrated)

***

### isSyncdPureLidSession?

> `optional` **isSyncdPureLidSession**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7564](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7564)

ClientPairingProps isSyncdPureLidSession.

#### Implementation of

[`IClientPairingProps`](../interfaces/IClientPairingProps.md).[`isSyncdPureLidSession`](../interfaces/IClientPairingProps.md#issyncdpurelidsession)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7634](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7634)

Converts this ClientPairingProps to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ClientPairingProps`](ClientPairingProps.md)

Defined in: [WAProto/index.d.ts:7571](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7571)

Creates a new ClientPairingProps instance using the specified properties.

#### Parameters

##### properties?

[`IClientPairingProps`](../interfaces/IClientPairingProps.md)

Properties to set

#### Returns

[`ClientPairingProps`](ClientPairingProps.md)

ClientPairingProps instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ClientPairingProps`](ClientPairingProps.md)

Defined in: [WAProto/index.d.ts:7597](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7597)

Decodes a ClientPairingProps message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ClientPairingProps`](ClientPairingProps.md)

ClientPairingProps

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ClientPairingProps`](ClientPairingProps.md)

Defined in: [WAProto/index.d.ts:7606](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7606)

Decodes a ClientPairingProps message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ClientPairingProps`](ClientPairingProps.md)

ClientPairingProps

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7579](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7579)

Encodes the specified ClientPairingProps message. Does not implicitly [verify](ClientPairingProps.md#verify) messages.

#### Parameters

##### message

[`IClientPairingProps`](../interfaces/IClientPairingProps.md)

ClientPairingProps message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7587](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7587)

Encodes the specified ClientPairingProps message, length delimited. Does not implicitly [verify](ClientPairingProps.md#verify) messages.

#### Parameters

##### message

[`IClientPairingProps`](../interfaces/IClientPairingProps.md)

ClientPairingProps message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ClientPairingProps`](ClientPairingProps.md)

Defined in: [WAProto/index.d.ts:7620](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7620)

Creates a ClientPairingProps message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ClientPairingProps`](ClientPairingProps.md)

ClientPairingProps

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7641](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7641)

Gets the default type url for ClientPairingProps

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

Defined in: [WAProto/index.d.ts:7628](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7628)

Creates a plain object from a ClientPairingProps message. Also converts values to other types if specified.

#### Parameters

##### message

[`ClientPairingProps`](ClientPairingProps.md)

ClientPairingProps

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:7613](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7613)

Verifies a ClientPairingProps message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
