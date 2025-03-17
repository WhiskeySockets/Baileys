# Class: DeviceConsistencyCodeMessage

Defined in: [WAProto/index.d.ts:11528](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11528)

Represents a DeviceConsistencyCodeMessage.

## Implements

- [`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md)

## Constructors

### new DeviceConsistencyCodeMessage()

> **new DeviceConsistencyCodeMessage**(`properties`?): [`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

Defined in: [WAProto/index.d.ts:11534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11534)

Constructs a new DeviceConsistencyCodeMessage.

#### Parameters

##### properties?

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md)

Properties to set

#### Returns

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

## Properties

### generation?

> `optional` **generation**: `null` \| `number`

Defined in: [WAProto/index.d.ts:11537](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11537)

DeviceConsistencyCodeMessage generation.

#### Implementation of

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md).[`generation`](../interfaces/IDeviceConsistencyCodeMessage.md#generation)

***

### signature?

> `optional` **signature**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:11540](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11540)

DeviceConsistencyCodeMessage signature.

#### Implementation of

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md).[`signature`](../interfaces/IDeviceConsistencyCodeMessage.md#signature)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:11610](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11610)

Converts this DeviceConsistencyCodeMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

Defined in: [WAProto/index.d.ts:11547](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11547)

Creates a new DeviceConsistencyCodeMessage instance using the specified properties.

#### Parameters

##### properties?

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md)

Properties to set

#### Returns

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

Defined in: [WAProto/index.d.ts:11573](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11573)

Decodes a DeviceConsistencyCodeMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

Defined in: [WAProto/index.d.ts:11582](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11582)

Decodes a DeviceConsistencyCodeMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11555)

Encodes the specified DeviceConsistencyCodeMessage message. Does not implicitly [verify](DeviceConsistencyCodeMessage.md#verify) messages.

#### Parameters

##### message

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11563](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11563)

Encodes the specified DeviceConsistencyCodeMessage message, length delimited. Does not implicitly [verify](DeviceConsistencyCodeMessage.md#verify) messages.

#### Parameters

##### message

[`IDeviceConsistencyCodeMessage`](../interfaces/IDeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

Defined in: [WAProto/index.d.ts:11596](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11596)

Creates a DeviceConsistencyCodeMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:11617](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11617)

Gets the default type url for DeviceConsistencyCodeMessage

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

Defined in: [WAProto/index.d.ts:11604](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11604)

Creates a plain object from a DeviceConsistencyCodeMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeviceConsistencyCodeMessage`](DeviceConsistencyCodeMessage.md)

DeviceConsistencyCodeMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:11589](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11589)

Verifies a DeviceConsistencyCodeMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
