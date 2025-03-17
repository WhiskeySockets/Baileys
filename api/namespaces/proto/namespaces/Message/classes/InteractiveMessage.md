# Class: InteractiveMessage

Defined in: [WAProto/index.d.ts:23248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23248)

Represents an InteractiveMessage.

## Implements

- [`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

## Constructors

### new InteractiveMessage()

> **new InteractiveMessage**(`properties`?): [`InteractiveMessage`](InteractiveMessage.md)

Defined in: [WAProto/index.d.ts:23254](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23254)

Constructs a new InteractiveMessage.

#### Parameters

##### properties?

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

Properties to set

#### Returns

[`InteractiveMessage`](InteractiveMessage.md)

## Properties

### body?

> `optional` **body**: `null` \| [`IBody`](../namespaces/InteractiveMessage/interfaces/IBody.md)

Defined in: [WAProto/index.d.ts:23260](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23260)

InteractiveMessage body.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`body`](../interfaces/IInteractiveMessage.md#body)

***

### carouselMessage?

> `optional` **carouselMessage**: `null` \| [`ICarouselMessage`](../namespaces/InteractiveMessage/interfaces/ICarouselMessage.md)

Defined in: [WAProto/index.d.ts:23281](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23281)

InteractiveMessage carouselMessage.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`carouselMessage`](../interfaces/IInteractiveMessage.md#carouselmessage)

***

### collectionMessage?

> `optional` **collectionMessage**: `null` \| [`ICollectionMessage`](../namespaces/InteractiveMessage/interfaces/ICollectionMessage.md)

Defined in: [WAProto/index.d.ts:23275](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23275)

InteractiveMessage collectionMessage.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`collectionMessage`](../interfaces/IInteractiveMessage.md#collectionmessage)

***

### contextInfo?

> `optional` **contextInfo**: `null` \| [`IContextInfo`](../../../interfaces/IContextInfo.md)

Defined in: [WAProto/index.d.ts:23266](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23266)

InteractiveMessage contextInfo.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`contextInfo`](../interfaces/IInteractiveMessage.md#contextinfo)

***

### footer?

> `optional` **footer**: `null` \| [`IFooter`](../namespaces/InteractiveMessage/interfaces/IFooter.md)

Defined in: [WAProto/index.d.ts:23263](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23263)

InteractiveMessage footer.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`footer`](../interfaces/IInteractiveMessage.md#footer)

***

### header?

> `optional` **header**: `null` \| [`IHeader`](../namespaces/InteractiveMessage/interfaces/IHeader.md)

Defined in: [WAProto/index.d.ts:23257](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23257)

InteractiveMessage header.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`header`](../interfaces/IInteractiveMessage.md#header)

***

### interactiveMessage?

> `optional` **interactiveMessage**: `"shopStorefrontMessage"` \| `"collectionMessage"` \| `"nativeFlowMessage"` \| `"carouselMessage"`

Defined in: [WAProto/index.d.ts:23284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23284)

InteractiveMessage interactiveMessage.

***

### nativeFlowMessage?

> `optional` **nativeFlowMessage**: `null` \| [`INativeFlowMessage`](../namespaces/InteractiveMessage/interfaces/INativeFlowMessage.md)

Defined in: [WAProto/index.d.ts:23278](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23278)

InteractiveMessage nativeFlowMessage.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`nativeFlowMessage`](../interfaces/IInteractiveMessage.md#nativeflowmessage)

***

### shopStorefrontMessage?

> `optional` **shopStorefrontMessage**: `null` \| [`IShopMessage`](../namespaces/InteractiveMessage/interfaces/IShopMessage.md)

Defined in: [WAProto/index.d.ts:23272](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23272)

InteractiveMessage shopStorefrontMessage.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`shopStorefrontMessage`](../interfaces/IInteractiveMessage.md#shopstorefrontmessage)

***

### urlTrackingMap?

> `optional` **urlTrackingMap**: `null` \| [`IUrlTrackingMap`](../../../interfaces/IUrlTrackingMap.md)

Defined in: [WAProto/index.d.ts:23269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23269)

InteractiveMessage urlTrackingMap.

#### Implementation of

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md).[`urlTrackingMap`](../interfaces/IInteractiveMessage.md#urltrackingmap)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:23354](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23354)

Converts this InteractiveMessage to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`InteractiveMessage`](InteractiveMessage.md)

Defined in: [WAProto/index.d.ts:23291](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23291)

Creates a new InteractiveMessage instance using the specified properties.

#### Parameters

##### properties?

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

Properties to set

#### Returns

[`InteractiveMessage`](InteractiveMessage.md)

InteractiveMessage instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`InteractiveMessage`](InteractiveMessage.md)

Defined in: [WAProto/index.d.ts:23317](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23317)

Decodes an InteractiveMessage message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`InteractiveMessage`](InteractiveMessage.md)

InteractiveMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`InteractiveMessage`](InteractiveMessage.md)

Defined in: [WAProto/index.d.ts:23326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23326)

Decodes an InteractiveMessage message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`InteractiveMessage`](InteractiveMessage.md)

InteractiveMessage

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23299](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23299)

Encodes the specified InteractiveMessage message. Does not implicitly [verify](InteractiveMessage.md#verify) messages.

#### Parameters

##### message

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

InteractiveMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:23307](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23307)

Encodes the specified InteractiveMessage message, length delimited. Does not implicitly [verify](InteractiveMessage.md#verify) messages.

#### Parameters

##### message

[`IInteractiveMessage`](../interfaces/IInteractiveMessage.md)

InteractiveMessage message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`InteractiveMessage`](InteractiveMessage.md)

Defined in: [WAProto/index.d.ts:23340](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23340)

Creates an InteractiveMessage message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`InteractiveMessage`](InteractiveMessage.md)

InteractiveMessage

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:23361](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23361)

Gets the default type url for InteractiveMessage

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

Defined in: [WAProto/index.d.ts:23348](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23348)

Creates a plain object from an InteractiveMessage message. Also converts values to other types if specified.

#### Parameters

##### message

[`InteractiveMessage`](InteractiveMessage.md)

InteractiveMessage

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:23333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L23333)

Verifies an InteractiveMessage message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
