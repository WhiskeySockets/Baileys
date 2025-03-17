# Class: CloudAPIThreadControlNotification

Defined in: [WAProto/index.d.ts:19862](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19862)

Represents a CloudAPIThreadControlNotification.

## Implements

- [`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

## Constructors

### new CloudAPIThreadControlNotification()

> **new CloudAPIThreadControlNotification**(`properties`?): [`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:19868](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19868)

Constructs a new CloudAPIThreadControlNotification.

#### Parameters

##### properties?

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

Properties to set

#### Returns

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

## Properties

### consumerLid?

> `optional` **consumerLid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19877](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19877)

CloudAPIThreadControlNotification consumerLid.

#### Implementation of

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md).[`consumerLid`](../interfaces/ICloudAPIThreadControlNotification.md#consumerlid)

***

### consumerPhoneNumber?

> `optional` **consumerPhoneNumber**: `null` \| `string`

Defined in: [WAProto/index.d.ts:19880](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19880)

CloudAPIThreadControlNotification consumerPhoneNumber.

#### Implementation of

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md).[`consumerPhoneNumber`](../interfaces/ICloudAPIThreadControlNotification.md#consumerphonenumber)

***

### senderNotificationTimestampMs?

> `optional` **senderNotificationTimestampMs**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:19874](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19874)

CloudAPIThreadControlNotification senderNotificationTimestampMs.

#### Implementation of

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md).[`senderNotificationTimestampMs`](../interfaces/ICloudAPIThreadControlNotification.md#sendernotificationtimestampms)

***

### status?

> `optional` **status**: `null` \| [`CloudAPIThreadControl`](../namespaces/CloudAPIThreadControlNotification/enumerations/CloudAPIThreadControl.md)

Defined in: [WAProto/index.d.ts:19871](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19871)

CloudAPIThreadControlNotification status.

#### Implementation of

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md).[`status`](../interfaces/ICloudAPIThreadControlNotification.md#status)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:19950](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19950)

Converts this CloudAPIThreadControlNotification to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:19887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19887)

Creates a new CloudAPIThreadControlNotification instance using the specified properties.

#### Parameters

##### properties?

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

Properties to set

#### Returns

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:19913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19913)

Decodes a CloudAPIThreadControlNotification message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:19922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19922)

Decodes a CloudAPIThreadControlNotification message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19895](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19895)

Encodes the specified CloudAPIThreadControlNotification message. Does not implicitly [verify](CloudAPIThreadControlNotification.md#verify) messages.

#### Parameters

##### message

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:19903](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19903)

Encodes the specified CloudAPIThreadControlNotification message, length delimited. Does not implicitly [verify](CloudAPIThreadControlNotification.md#verify) messages.

#### Parameters

##### message

[`ICloudAPIThreadControlNotification`](../interfaces/ICloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

Defined in: [WAProto/index.d.ts:19936](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19936)

Creates a CloudAPIThreadControlNotification message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:19957](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19957)

Gets the default type url for CloudAPIThreadControlNotification

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

Defined in: [WAProto/index.d.ts:19944](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19944)

Creates a plain object from a CloudAPIThreadControlNotification message. Also converts values to other types if specified.

#### Parameters

##### message

[`CloudAPIThreadControlNotification`](CloudAPIThreadControlNotification.md)

CloudAPIThreadControlNotification

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:19929](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L19929)

Verifies a CloudAPIThreadControlNotification message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
