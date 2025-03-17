# Class: PaymentInfo

Defined in: [WAProto/index.d.ts:35904](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35904)

Represents a PaymentInfo.

## Implements

- [`IPaymentInfo`](../interfaces/IPaymentInfo.md)

## Constructors

### new PaymentInfo()

> **new PaymentInfo**(`properties`?): [`PaymentInfo`](PaymentInfo.md)

Defined in: [WAProto/index.d.ts:35910](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35910)

Constructs a new PaymentInfo.

#### Parameters

##### properties?

[`IPaymentInfo`](../interfaces/IPaymentInfo.md)

Properties to set

#### Returns

[`PaymentInfo`](PaymentInfo.md)

## Properties

### amount1000?

> `optional` **amount1000**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:35916](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35916)

PaymentInfo amount1000.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`amount1000`](../interfaces/IPaymentInfo.md#amount1000)

***

### currency?

> `optional` **currency**: `null` \| `string`

Defined in: [WAProto/index.d.ts:35937](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35937)

PaymentInfo currency.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`currency`](../interfaces/IPaymentInfo.md#currency)

***

### currencyDeprecated?

> `optional` **currencyDeprecated**: `null` \| [`Currency`](../namespaces/PaymentInfo/enumerations/Currency.md)

Defined in: [WAProto/index.d.ts:35913](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35913)

PaymentInfo currencyDeprecated.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`currencyDeprecated`](../interfaces/IPaymentInfo.md#currencydeprecated)

***

### exchangeAmount?

> `optional` **exchangeAmount**: `null` \| [`IMoney`](../interfaces/IMoney.md)

Defined in: [WAProto/index.d.ts:35949](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35949)

PaymentInfo exchangeAmount.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`exchangeAmount`](../interfaces/IPaymentInfo.md#exchangeamount)

***

### expiryTimestamp?

> `optional` **expiryTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:35931](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35931)

PaymentInfo expiryTimestamp.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`expiryTimestamp`](../interfaces/IPaymentInfo.md#expirytimestamp)

***

### futureproofed?

> `optional` **futureproofed**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:35934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35934)

PaymentInfo futureproofed.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`futureproofed`](../interfaces/IPaymentInfo.md#futureproofed)

***

### primaryAmount?

> `optional` **primaryAmount**: `null` \| [`IMoney`](../interfaces/IMoney.md)

Defined in: [WAProto/index.d.ts:35946](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35946)

PaymentInfo primaryAmount.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`primaryAmount`](../interfaces/IPaymentInfo.md#primaryamount)

***

### receiverJid?

> `optional` **receiverJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:35919](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35919)

PaymentInfo receiverJid.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`receiverJid`](../interfaces/IPaymentInfo.md#receiverjid)

***

### requestMessageKey?

> `optional` **requestMessageKey**: `null` \| [`IMessageKey`](../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:35928](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35928)

PaymentInfo requestMessageKey.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`requestMessageKey`](../interfaces/IPaymentInfo.md#requestmessagekey)

***

### status?

> `optional` **status**: `null` \| [`Status`](../namespaces/PaymentInfo/enumerations/Status.md)

Defined in: [WAProto/index.d.ts:35922](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35922)

PaymentInfo status.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`status`](../interfaces/IPaymentInfo.md#status)

***

### transactionTimestamp?

> `optional` **transactionTimestamp**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:35925](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35925)

PaymentInfo transactionTimestamp.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`transactionTimestamp`](../interfaces/IPaymentInfo.md#transactiontimestamp)

***

### txnStatus?

> `optional` **txnStatus**: `null` \| [`TxnStatus`](../namespaces/PaymentInfo/enumerations/TxnStatus.md)

Defined in: [WAProto/index.d.ts:35940](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35940)

PaymentInfo txnStatus.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`txnStatus`](../interfaces/IPaymentInfo.md#txnstatus)

***

### useNoviFiatFormat?

> `optional` **useNoviFiatFormat**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:35943](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35943)

PaymentInfo useNoviFiatFormat.

#### Implementation of

[`IPaymentInfo`](../interfaces/IPaymentInfo.md).[`useNoviFiatFormat`](../interfaces/IPaymentInfo.md#usenovifiatformat)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:36019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36019)

Converts this PaymentInfo to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`PaymentInfo`](PaymentInfo.md)

Defined in: [WAProto/index.d.ts:35956](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35956)

Creates a new PaymentInfo instance using the specified properties.

#### Parameters

##### properties?

[`IPaymentInfo`](../interfaces/IPaymentInfo.md)

Properties to set

#### Returns

[`PaymentInfo`](PaymentInfo.md)

PaymentInfo instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`PaymentInfo`](PaymentInfo.md)

Defined in: [WAProto/index.d.ts:35982](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35982)

Decodes a PaymentInfo message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`PaymentInfo`](PaymentInfo.md)

PaymentInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`PaymentInfo`](PaymentInfo.md)

Defined in: [WAProto/index.d.ts:35991](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35991)

Decodes a PaymentInfo message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`PaymentInfo`](PaymentInfo.md)

PaymentInfo

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35964](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35964)

Encodes the specified PaymentInfo message. Does not implicitly [verify](PaymentInfo.md#verify) messages.

#### Parameters

##### message

[`IPaymentInfo`](../interfaces/IPaymentInfo.md)

PaymentInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:35972](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35972)

Encodes the specified PaymentInfo message, length delimited. Does not implicitly [verify](PaymentInfo.md#verify) messages.

#### Parameters

##### message

[`IPaymentInfo`](../interfaces/IPaymentInfo.md)

PaymentInfo message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`PaymentInfo`](PaymentInfo.md)

Defined in: [WAProto/index.d.ts:36005](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36005)

Creates a PaymentInfo message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`PaymentInfo`](PaymentInfo.md)

PaymentInfo

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:36026](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36026)

Gets the default type url for PaymentInfo

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

Defined in: [WAProto/index.d.ts:36013](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L36013)

Creates a plain object from a PaymentInfo message. Also converts values to other types if specified.

#### Parameters

##### message

[`PaymentInfo`](PaymentInfo.md)

PaymentInfo

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:35998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L35998)

Verifies a PaymentInfo message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
