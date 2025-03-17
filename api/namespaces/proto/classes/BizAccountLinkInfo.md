# Class: BizAccountLinkInfo

Defined in: [WAProto/index.d.ts:2997](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L2997)

Represents a BizAccountLinkInfo.

## Implements

- [`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md)

## Constructors

### new BizAccountLinkInfo()

> **new BizAccountLinkInfo**(`properties`?): [`BizAccountLinkInfo`](BizAccountLinkInfo.md)

Defined in: [WAProto/index.d.ts:3003](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3003)

Constructs a new BizAccountLinkInfo.

#### Parameters

##### properties?

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md)

Properties to set

#### Returns

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

## Properties

### accountType?

> `optional` **accountType**: `null` \| [`ENTERPRISE`](../namespaces/BizAccountLinkInfo/enumerations/AccountType.md#enterprise)

Defined in: [WAProto/index.d.ts:3018](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3018)

BizAccountLinkInfo accountType.

#### Implementation of

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md).[`accountType`](../interfaces/IBizAccountLinkInfo.md#accounttype)

***

### hostStorage?

> `optional` **hostStorage**: `null` \| [`HostStorageType`](../namespaces/BizAccountLinkInfo/enumerations/HostStorageType.md)

Defined in: [WAProto/index.d.ts:3015](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3015)

BizAccountLinkInfo hostStorage.

#### Implementation of

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md).[`hostStorage`](../interfaces/IBizAccountLinkInfo.md#hoststorage)

***

### issueTime?

> `optional` **issueTime**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:3012](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3012)

BizAccountLinkInfo issueTime.

#### Implementation of

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md).[`issueTime`](../interfaces/IBizAccountLinkInfo.md#issuetime)

***

### whatsappAcctNumber?

> `optional` **whatsappAcctNumber**: `null` \| `string`

Defined in: [WAProto/index.d.ts:3009](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3009)

BizAccountLinkInfo whatsappAcctNumber.

#### Implementation of

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md).[`whatsappAcctNumber`](../interfaces/IBizAccountLinkInfo.md#whatsappacctnumber)

***

### whatsappBizAcctFbid?

> `optional` **whatsappBizAcctFbid**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:3006](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3006)

BizAccountLinkInfo whatsappBizAcctFbid.

#### Implementation of

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md).[`whatsappBizAcctFbid`](../interfaces/IBizAccountLinkInfo.md#whatsappbizacctfbid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:3088](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3088)

Converts this BizAccountLinkInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`BizAccountLinkInfo`](BizAccountLinkInfo.md)

Defined in: [WAProto/index.d.ts:3025](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3025)

Creates a new BizAccountLinkInfo instance using the specified properties.

#### Parameters

##### properties?

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md)

Properties to set

#### Returns

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

BizAccountLinkInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`BizAccountLinkInfo`](BizAccountLinkInfo.md)

Defined in: [WAProto/index.d.ts:3051](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3051)

Decodes a BizAccountLinkInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

BizAccountLinkInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`BizAccountLinkInfo`](BizAccountLinkInfo.md)

Defined in: [WAProto/index.d.ts:3060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3060)

Decodes a BizAccountLinkInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

BizAccountLinkInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3033](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3033)

Encodes the specified BizAccountLinkInfo message. Does not implicitly [verify](BizAccountLinkInfo.md#verify) messages.

#### Parameters

##### message

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md)

BizAccountLinkInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:3041](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3041)

Encodes the specified BizAccountLinkInfo message, length delimited. Does not implicitly [verify](BizAccountLinkInfo.md#verify) messages.

#### Parameters

##### message

[`IBizAccountLinkInfo`](../interfaces/IBizAccountLinkInfo.md)

BizAccountLinkInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`BizAccountLinkInfo`](BizAccountLinkInfo.md)

Defined in: [WAProto/index.d.ts:3074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3074)

Creates a BizAccountLinkInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

BizAccountLinkInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:3095](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3095)

Gets the default type url for BizAccountLinkInfo

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

Defined in: [WAProto/index.d.ts:3082](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3082)

Creates a plain object from a BizAccountLinkInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`BizAccountLinkInfo`](BizAccountLinkInfo.md)

BizAccountLinkInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:3067](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L3067)

Verifies a BizAccountLinkInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
