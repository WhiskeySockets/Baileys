# Class: OrderMessage

Defined in: [WAProto/index.d.ts:26621](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26621)

Represents an OrderMessage.

## Implements

- [`IOrderMessage`](../interfaces/IOrderMessage.md)

## Constructors

### new OrderMessage()

> **new OrderMessage**(`properties`?): [`OrderMessage`](OrderMessage.md)

Defined in: [WAProto/index.d.ts:26627](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26627)

Constructs a new OrderMessage.

#### Parameters

##### properties?

[`IOrderMessage`](../interfaces/IOrderMessage.md)

Properties to set

#### Returns

[`OrderMessage`](OrderMessage.md)

## Properties

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:26663](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26663)

OrderMessage contextInfo.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`contextInfo`](../interfaces/IOrderMessage.md#contextinfo)

***

### itemCount?

> `optional` **itemCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:26636](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26636)

OrderMessage itemCount.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`itemCount`](../interfaces/IOrderMessage.md#itemcount)

***

### message?

> `optional` **message**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26645](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26645)

OrderMessage message.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`message`](../interfaces/IOrderMessage.md#message)

***

### messageVersion?

> `optional` **messageVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:26666](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26666)

OrderMessage messageVersion.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`messageVersion`](../interfaces/IOrderMessage.md#messageversion)

***

### orderId?

> `optional` **orderId**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26630](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26630)

OrderMessage orderId.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`orderId`](../interfaces/IOrderMessage.md#orderid)

***

### orderRequestMessageId?

> `optional` **orderRequestMessageId**: `null` \| [`IMessageKey`](../../../interfaces/IMessageKey.md)

Defined in: [WAProto/index.d.ts:26669](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26669)

OrderMessage orderRequestMessageId.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`orderRequestMessageId`](../interfaces/IOrderMessage.md#orderrequestmessageid)

***

### orderTitle?

> `optional` **orderTitle**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26648](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26648)

OrderMessage orderTitle.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`orderTitle`](../interfaces/IOrderMessage.md#ordertitle)

***

### sellerJid?

> `optional` **sellerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26651](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26651)

OrderMessage sellerJid.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`sellerJid`](../interfaces/IOrderMessage.md#sellerjid)

***

### status?

> `optional` **status**: `null` \| [`OrderStatus`](../namespaces/OrderMessage/enumerations/OrderStatus.md)

Defined in: [WAProto/index.d.ts:26639](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26639)

OrderMessage status.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`status`](../interfaces/IOrderMessage.md#status)

***

### surface?

> `optional` **surface**: `null` \| [`CATALOG`](../namespaces/OrderMessage/enumerations/OrderSurface.md#catalog)

Defined in: [WAProto/index.d.ts:26642](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26642)

OrderMessage surface.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`surface`](../interfaces/IOrderMessage.md#surface)

***

### thumbnail?

> `optional` **thumbnail**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:26633](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26633)

OrderMessage thumbnail.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`thumbnail`](../interfaces/IOrderMessage.md#thumbnail)

***

### token?

> `optional` **token**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26654](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26654)

OrderMessage token.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`token`](../interfaces/IOrderMessage.md#token)

***

### totalAmount1000?

> `optional` **totalAmount1000**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:26657](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26657)

OrderMessage totalAmount1000.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`totalAmount1000`](../interfaces/IOrderMessage.md#totalamount1000)

***

### totalCurrencyCode?

> `optional` **totalCurrencyCode**: `null` \| `string`

Defined in: [WAProto/index.d.ts:26660](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26660)

OrderMessage totalCurrencyCode.

#### Implementation of

[`IOrderMessage`](../interfaces/IOrderMessage.md).[`totalCurrencyCode`](../interfaces/IOrderMessage.md#totalcurrencycode)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:26739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26739)

Converts this OrderMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`OrderMessage`](OrderMessage.md)

Defined in: [WAProto/index.d.ts:26676](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26676)

Creates a new OrderMessage instance using the specified properties.

#### Parameters

##### properties?

[`IOrderMessage`](../interfaces/IOrderMessage.md)

Properties to set

#### Returns

[`OrderMessage`](OrderMessage.md)

OrderMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`OrderMessage`](OrderMessage.md)

Defined in: [WAProto/index.d.ts:26702](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26702)

Decodes an OrderMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`OrderMessage`](OrderMessage.md)

OrderMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`OrderMessage`](OrderMessage.md)

Defined in: [WAProto/index.d.ts:26711](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26711)

Decodes an OrderMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`OrderMessage`](OrderMessage.md)

OrderMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26684](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26684)

Encodes the specified OrderMessage message. Does not implicitly [verify](OrderMessage.md#verify) messages.

#### Parameters

##### message

[`IOrderMessage`](../interfaces/IOrderMessage.md)

OrderMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:26692](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26692)

Encodes the specified OrderMessage message, length delimited. Does not implicitly [verify](OrderMessage.md#verify) messages.

#### Parameters

##### message

[`IOrderMessage`](../interfaces/IOrderMessage.md)

OrderMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`OrderMessage`](OrderMessage.md)

Defined in: [WAProto/index.d.ts:26725](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26725)

Creates an OrderMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`OrderMessage`](OrderMessage.md)

OrderMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:26746](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26746)

Gets the default type url for OrderMessage

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

Defined in: [WAProto/index.d.ts:26733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26733)

Creates a plain object from an OrderMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`OrderMessage`](OrderMessage.md)

OrderMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:26718](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L26718)

Verifies an OrderMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
