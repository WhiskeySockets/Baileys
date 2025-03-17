# Class: SecurityNotificationSetting

Defined in: [WAProto/index.d.ts:45393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45393)

Represents a SecurityNotificationSetting.

## Implements

- [`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md)

## Constructors

### new SecurityNotificationSetting()

> **new SecurityNotificationSetting**(`properties`?): [`SecurityNotificationSetting`](SecurityNotificationSetting.md)

Defined in: [WAProto/index.d.ts:45399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45399)

Constructs a new SecurityNotificationSetting.

#### Parameters

##### properties?

[`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md)

Properties to set

#### Returns

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

## Properties

### showNotification?

> `optional` **showNotification**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:45402](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45402)

SecurityNotificationSetting showNotification.

#### Implementation of

[`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md).[`showNotification`](../interfaces/ISecurityNotificationSetting.md#shownotification)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45472](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45472)

Converts this SecurityNotificationSetting to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SecurityNotificationSetting`](SecurityNotificationSetting.md)

Defined in: [WAProto/index.d.ts:45409](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45409)

Creates a new SecurityNotificationSetting instance using the specified properties.

#### Parameters

##### properties?

[`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md)

Properties to set

#### Returns

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

SecurityNotificationSetting instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SecurityNotificationSetting`](SecurityNotificationSetting.md)

Defined in: [WAProto/index.d.ts:45435](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45435)

Decodes a SecurityNotificationSetting message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

SecurityNotificationSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SecurityNotificationSetting`](SecurityNotificationSetting.md)

Defined in: [WAProto/index.d.ts:45444](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45444)

Decodes a SecurityNotificationSetting message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

SecurityNotificationSetting

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45417](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45417)

Encodes the specified SecurityNotificationSetting message. Does not implicitly [verify](SecurityNotificationSetting.md#verify) messages.

#### Parameters

##### message

[`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md)

SecurityNotificationSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45425](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45425)

Encodes the specified SecurityNotificationSetting message, length delimited. Does not implicitly [verify](SecurityNotificationSetting.md#verify) messages.

#### Parameters

##### message

[`ISecurityNotificationSetting`](../interfaces/ISecurityNotificationSetting.md)

SecurityNotificationSetting message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SecurityNotificationSetting`](SecurityNotificationSetting.md)

Defined in: [WAProto/index.d.ts:45458](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45458)

Creates a SecurityNotificationSetting message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

SecurityNotificationSetting

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45479](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45479)

Gets the default type url for SecurityNotificationSetting

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

Defined in: [WAProto/index.d.ts:45466](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45466)

Creates a plain object from a SecurityNotificationSetting message. Also converts values to other types if specified.

#### Parameters

##### message

[`SecurityNotificationSetting`](SecurityNotificationSetting.md)

SecurityNotificationSetting

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45451](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45451)

Verifies a SecurityNotificationSetting message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
