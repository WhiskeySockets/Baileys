# Class: DeviceListMetadata

Defined in: [WAProto/index.d.ts:11649](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11649)

Represents a DeviceListMetadata.

## Implements

- [`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md)

## Constructors

### new DeviceListMetadata()

> **new DeviceListMetadata**(`properties`?): [`DeviceListMetadata`](DeviceListMetadata.md)

Defined in: [WAProto/index.d.ts:11655](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11655)

Constructs a new DeviceListMetadata.

#### Parameters

##### properties?

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md)

Properties to set

#### Returns

[`DeviceListMetadata`](DeviceListMetadata.md)

## Properties

### receiverAccountType?

> `optional` **receiverAccountType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:11670](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11670)

DeviceListMetadata receiverAccountType.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`receiverAccountType`](../interfaces/IDeviceListMetadata.md#receiveraccounttype)

***

### recipientKeyHash?

> `optional` **recipientKeyHash**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:11673](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11673)

DeviceListMetadata recipientKeyHash.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`recipientKeyHash`](../interfaces/IDeviceListMetadata.md#recipientkeyhash)

***

### recipientKeyIndexes

> **recipientKeyIndexes**: `number`[]

Defined in: [WAProto/index.d.ts:11679](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11679)

DeviceListMetadata recipientKeyIndexes.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`recipientKeyIndexes`](../interfaces/IDeviceListMetadata.md#recipientkeyindexes)

***

### recipientTimestamp?

> `optional` **recipientTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:11676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11676)

DeviceListMetadata recipientTimestamp.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`recipientTimestamp`](../interfaces/IDeviceListMetadata.md#recipienttimestamp)

***

### senderAccountType?

> `optional` **senderAccountType**: `null` \| [`ADVEncryptionType`](../enumerations/ADVEncryptionType.md)

Defined in: [WAProto/index.d.ts:11667](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11667)

DeviceListMetadata senderAccountType.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`senderAccountType`](../interfaces/IDeviceListMetadata.md#senderaccounttype)

***

### senderKeyHash?

> `optional` **senderKeyHash**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:11658](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11658)

DeviceListMetadata senderKeyHash.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`senderKeyHash`](../interfaces/IDeviceListMetadata.md#senderkeyhash)

***

### senderKeyIndexes

> **senderKeyIndexes**: `number`[]

Defined in: [WAProto/index.d.ts:11664](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11664)

DeviceListMetadata senderKeyIndexes.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`senderKeyIndexes`](../interfaces/IDeviceListMetadata.md#senderkeyindexes)

***

### senderTimestamp?

> `optional` **senderTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:11661](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11661)

DeviceListMetadata senderTimestamp.

#### Implementation of

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md).[`senderTimestamp`](../interfaces/IDeviceListMetadata.md#sendertimestamp)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:11749](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11749)

Converts this DeviceListMetadata to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeviceListMetadata`](DeviceListMetadata.md)

Defined in: [WAProto/index.d.ts:11686](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11686)

Creates a new DeviceListMetadata instance using the specified properties.

#### Parameters

##### properties?

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md)

Properties to set

#### Returns

[`DeviceListMetadata`](DeviceListMetadata.md)

DeviceListMetadata instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeviceListMetadata`](DeviceListMetadata.md)

Defined in: [WAProto/index.d.ts:11712](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11712)

Decodes a DeviceListMetadata message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeviceListMetadata`](DeviceListMetadata.md)

DeviceListMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeviceListMetadata`](DeviceListMetadata.md)

Defined in: [WAProto/index.d.ts:11721](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11721)

Decodes a DeviceListMetadata message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeviceListMetadata`](DeviceListMetadata.md)

DeviceListMetadata

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11694](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11694)

Encodes the specified DeviceListMetadata message. Does not implicitly [verify](DeviceListMetadata.md#verify) messages.

#### Parameters

##### message

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md)

DeviceListMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:11702](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11702)

Encodes the specified DeviceListMetadata message, length delimited. Does not implicitly [verify](DeviceListMetadata.md#verify) messages.

#### Parameters

##### message

[`IDeviceListMetadata`](../interfaces/IDeviceListMetadata.md)

DeviceListMetadata message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeviceListMetadata`](DeviceListMetadata.md)

Defined in: [WAProto/index.d.ts:11735](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11735)

Creates a DeviceListMetadata message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeviceListMetadata`](DeviceListMetadata.md)

DeviceListMetadata

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:11756](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11756)

Gets the default type url for DeviceListMetadata

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

Defined in: [WAProto/index.d.ts:11743](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11743)

Creates a plain object from a DeviceListMetadata message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeviceListMetadata`](DeviceListMetadata.md)

DeviceListMetadata

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:11728](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L11728)

Verifies a DeviceListMetadata message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
