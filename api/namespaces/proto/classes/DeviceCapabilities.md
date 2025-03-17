# Class: DeviceCapabilities

Defined in: [WAProto/index.d.ts:11318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11318)

Represents a DeviceCapabilities.

## Implements

- [`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md)

## Constructors

### new DeviceCapabilities()

> **new DeviceCapabilities**(`properties`?): [`DeviceCapabilities`](DeviceCapabilities.md)

Defined in: [WAProto/index.d.ts:11324](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11324)

Constructs a new DeviceCapabilities.

#### Parameters

##### properties?

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md)

Properties to set

#### Returns

[`DeviceCapabilities`](DeviceCapabilities.md)

## Properties

### chatLockSupportLevel?

> `optional` **chatLockSupportLevel**: `null` \| [`ChatLockSupportLevel`](../namespaces/DeviceCapabilities/enumerations/ChatLockSupportLevel.md)

Defined in: [WAProto/index.d.ts:11327](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11327)

DeviceCapabilities chatLockSupportLevel.

#### Implementation of

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md).[`chatLockSupportLevel`](../interfaces/IDeviceCapabilities.md#chatlocksupportlevel)

***

### lidMigration?

> `optional` **lidMigration**: `null` \| [`ILIDMigration`](../namespaces/DeviceCapabilities/interfaces/ILIDMigration.md)

Defined in: [WAProto/index.d.ts:11330](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11330)

DeviceCapabilities lidMigration.

#### Implementation of

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md).[`lidMigration`](../interfaces/IDeviceCapabilities.md#lidmigration)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:11400](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11400)

Converts this DeviceCapabilities to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeviceCapabilities`](DeviceCapabilities.md)

Defined in: [WAProto/index.d.ts:11337](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11337)

Creates a new DeviceCapabilities instance using the specified properties.

#### Parameters

##### properties?

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md)

Properties to set

#### Returns

[`DeviceCapabilities`](DeviceCapabilities.md)

DeviceCapabilities instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeviceCapabilities`](DeviceCapabilities.md)

Defined in: [WAProto/index.d.ts:11363](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11363)

Decodes a DeviceCapabilities message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeviceCapabilities`](DeviceCapabilities.md)

DeviceCapabilities

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeviceCapabilities`](DeviceCapabilities.md)

Defined in: [WAProto/index.d.ts:11372](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11372)

Decodes a DeviceCapabilities message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeviceCapabilities`](DeviceCapabilities.md)

DeviceCapabilities

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11345](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11345)

Encodes the specified DeviceCapabilities message. Does not implicitly [verify](DeviceCapabilities.md#verify) messages.

#### Parameters

##### message

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md)

DeviceCapabilities message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11353](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11353)

Encodes the specified DeviceCapabilities message, length delimited. Does not implicitly [verify](DeviceCapabilities.md#verify) messages.

#### Parameters

##### message

[`IDeviceCapabilities`](../interfaces/IDeviceCapabilities.md)

DeviceCapabilities message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeviceCapabilities`](DeviceCapabilities.md)

Defined in: [WAProto/index.d.ts:11386](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11386)

Creates a DeviceCapabilities message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeviceCapabilities`](DeviceCapabilities.md)

DeviceCapabilities

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:11407](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11407)

Gets the default type url for DeviceCapabilities

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

Defined in: [WAProto/index.d.ts:11394](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11394)

Creates a plain object from a DeviceCapabilities message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeviceCapabilities`](DeviceCapabilities.md)

DeviceCapabilities

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:11379](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11379)

Verifies a DeviceCapabilities message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
