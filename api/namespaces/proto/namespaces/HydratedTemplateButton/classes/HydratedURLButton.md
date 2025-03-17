# Class: HydratedURLButton

Defined in: [WAProto/index.d.ts:14986](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14986)

Represents a HydratedURLButton.

## Implements

- [`IHydratedURLButton`](../interfaces/IHydratedURLButton.md)

## Constructors

### new HydratedURLButton()

> **new HydratedURLButton**(`properties`?): [`HydratedURLButton`](HydratedURLButton.md)

Defined in: [WAProto/index.d.ts:14992](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14992)

Constructs a new HydratedURLButton.

#### Parameters

##### properties?

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md)

Properties to set

#### Returns

[`HydratedURLButton`](HydratedURLButton.md)

## Properties

### consentedUsersUrl?

> `optional` **consentedUsersUrl**: `null` \| `string`

Defined in: [WAProto/index.d.ts:15001](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15001)

HydratedURLButton consentedUsersUrl.

#### Implementation of

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md).[`consentedUsersUrl`](../interfaces/IHydratedURLButton.md#consentedusersurl)

***

### displayText?

> `optional` **displayText**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14995](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14995)

HydratedURLButton displayText.

#### Implementation of

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md).[`displayText`](../interfaces/IHydratedURLButton.md#displaytext)

***

### url?

> `optional` **url**: `null` \| `string`

Defined in: [WAProto/index.d.ts:14998](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L14998)

HydratedURLButton url.

#### Implementation of

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md).[`url`](../interfaces/IHydratedURLButton.md#url)

***

### webviewPresentation?

> `optional` **webviewPresentation**: `null` \| [`WebviewPresentationType`](../namespaces/HydratedURLButton/enumerations/WebviewPresentationType.md)

Defined in: [WAProto/index.d.ts:15004](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15004)

HydratedURLButton webviewPresentation.

#### Implementation of

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md).[`webviewPresentation`](../interfaces/IHydratedURLButton.md#webviewpresentation)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15074](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15074)

Converts this HydratedURLButton to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`HydratedURLButton`](HydratedURLButton.md)

Defined in: [WAProto/index.d.ts:15011](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15011)

Creates a new HydratedURLButton instance using the specified properties.

#### Parameters

##### properties?

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md)

Properties to set

#### Returns

[`HydratedURLButton`](HydratedURLButton.md)

HydratedURLButton instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`HydratedURLButton`](HydratedURLButton.md)

Defined in: [WAProto/index.d.ts:15037](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15037)

Decodes a HydratedURLButton message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`HydratedURLButton`](HydratedURLButton.md)

HydratedURLButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`HydratedURLButton`](HydratedURLButton.md)

Defined in: [WAProto/index.d.ts:15046](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15046)

Decodes a HydratedURLButton message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`HydratedURLButton`](HydratedURLButton.md)

HydratedURLButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15019](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15019)

Encodes the specified HydratedURLButton message. Does not implicitly [verify](HydratedURLButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md)

HydratedURLButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15027](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15027)

Encodes the specified HydratedURLButton message, length delimited. Does not implicitly [verify](HydratedURLButton.md#verify) messages.

#### Parameters

##### message

[`IHydratedURLButton`](../interfaces/IHydratedURLButton.md)

HydratedURLButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`HydratedURLButton`](HydratedURLButton.md)

Defined in: [WAProto/index.d.ts:15060](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15060)

Creates a HydratedURLButton message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`HydratedURLButton`](HydratedURLButton.md)

HydratedURLButton

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15081](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15081)

Gets the default type url for HydratedURLButton

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

Defined in: [WAProto/index.d.ts:15068](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15068)

Creates a plain object from a HydratedURLButton message. Also converts values to other types if specified.

#### Parameters

##### message

[`HydratedURLButton`](HydratedURLButton.md)

HydratedURLButton

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15053](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15053)

Verifies a HydratedURLButton message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
