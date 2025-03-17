# Class: SubscriptionAction

Defined in: [WAProto/index.d.ts:45863](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45863)

Represents a SubscriptionAction.

## Implements

- [`ISubscriptionAction`](../interfaces/ISubscriptionAction.md)

## Constructors

### new SubscriptionAction()

> **new SubscriptionAction**(`properties`?): [`SubscriptionAction`](SubscriptionAction.md)

Defined in: [WAProto/index.d.ts:45869](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45869)

Constructs a new SubscriptionAction.

#### Parameters

##### properties?

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md)

Properties to set

#### Returns

[`SubscriptionAction`](SubscriptionAction.md)

## Properties

### expirationDate?

> `optional` **expirationDate**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:45878](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45878)

SubscriptionAction expirationDate.

#### Implementation of

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md).[`expirationDate`](../interfaces/ISubscriptionAction.md#expirationdate)

***

### isAutoRenewing?

> `optional` **isAutoRenewing**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:45875](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45875)

SubscriptionAction isAutoRenewing.

#### Implementation of

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md).[`isAutoRenewing`](../interfaces/ISubscriptionAction.md#isautorenewing)

***

### isDeactivated?

> `optional` **isDeactivated**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:45872](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45872)

SubscriptionAction isDeactivated.

#### Implementation of

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md).[`isDeactivated`](../interfaces/ISubscriptionAction.md#isdeactivated)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:45948](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45948)

Converts this SubscriptionAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SubscriptionAction`](SubscriptionAction.md)

Defined in: [WAProto/index.d.ts:45885](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45885)

Creates a new SubscriptionAction instance using the specified properties.

#### Parameters

##### properties?

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md)

Properties to set

#### Returns

[`SubscriptionAction`](SubscriptionAction.md)

SubscriptionAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SubscriptionAction`](SubscriptionAction.md)

Defined in: [WAProto/index.d.ts:45911](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45911)

Decodes a SubscriptionAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SubscriptionAction`](SubscriptionAction.md)

SubscriptionAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SubscriptionAction`](SubscriptionAction.md)

Defined in: [WAProto/index.d.ts:45920](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45920)

Decodes a SubscriptionAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SubscriptionAction`](SubscriptionAction.md)

SubscriptionAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45893)

Encodes the specified SubscriptionAction message. Does not implicitly [verify](SubscriptionAction.md#verify) messages.

#### Parameters

##### message

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md)

SubscriptionAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:45901](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45901)

Encodes the specified SubscriptionAction message, length delimited. Does not implicitly [verify](SubscriptionAction.md#verify) messages.

#### Parameters

##### message

[`ISubscriptionAction`](../interfaces/ISubscriptionAction.md)

SubscriptionAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SubscriptionAction`](SubscriptionAction.md)

Defined in: [WAProto/index.d.ts:45934](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45934)

Creates a SubscriptionAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SubscriptionAction`](SubscriptionAction.md)

SubscriptionAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:45955](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45955)

Gets the default type url for SubscriptionAction

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

Defined in: [WAProto/index.d.ts:45942](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45942)

Creates a plain object from a SubscriptionAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`SubscriptionAction`](SubscriptionAction.md)

SubscriptionAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:45927](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L45927)

Verifies a SubscriptionAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
