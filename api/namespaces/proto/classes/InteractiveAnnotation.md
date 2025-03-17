# Class: InteractiveAnnotation

Defined in: [WAProto/index.d.ts:15224](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15224)

Represents an InteractiveAnnotation.

## Implements

- [`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md)

## Constructors

### new InteractiveAnnotation()

> **new InteractiveAnnotation**(`properties`?): [`InteractiveAnnotation`](InteractiveAnnotation.md)

Defined in: [WAProto/index.d.ts:15230](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15230)

Constructs a new InteractiveAnnotation.

#### Parameters

##### properties?

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md)

Properties to set

#### Returns

[`InteractiveAnnotation`](InteractiveAnnotation.md)

## Properties

### action?

> `optional` **action**: `"location"` \| `"newsletter"` \| `"embeddedAction"` \| `"tapAction"`

Defined in: [WAProto/index.d.ts:15254](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15254)

InteractiveAnnotation action.

***

### embeddedAction?

> `optional` **embeddedAction**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:15248](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15248)

InteractiveAnnotation embeddedAction.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`embeddedAction`](../interfaces/IInteractiveAnnotation.md#embeddedaction)

***

### embeddedContent?

> `optional` **embeddedContent**: `null` \| [`IEmbeddedContent`](../interfaces/IEmbeddedContent.md)

Defined in: [WAProto/index.d.ts:15239](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15239)

InteractiveAnnotation embeddedContent.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`embeddedContent`](../interfaces/IInteractiveAnnotation.md#embeddedcontent)

***

### location?

> `optional` **location**: `null` \| [`ILocation`](../interfaces/ILocation.md)

Defined in: [WAProto/index.d.ts:15242](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15242)

InteractiveAnnotation location.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`location`](../interfaces/IInteractiveAnnotation.md#location)

***

### newsletter?

> `optional` **newsletter**: `null` \| [`IForwardedNewsletterMessageInfo`](../namespaces/ContextInfo/interfaces/IForwardedNewsletterMessageInfo.md)

Defined in: [WAProto/index.d.ts:15245](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15245)

InteractiveAnnotation newsletter.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`newsletter`](../interfaces/IInteractiveAnnotation.md#newsletter)

***

### polygonVertices

> **polygonVertices**: [`IPoint`](../interfaces/IPoint.md)[]

Defined in: [WAProto/index.d.ts:15233](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15233)

InteractiveAnnotation polygonVertices.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`polygonVertices`](../interfaces/IInteractiveAnnotation.md#polygonvertices)

***

### shouldSkipConfirmation?

> `optional` **shouldSkipConfirmation**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:15236](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15236)

InteractiveAnnotation shouldSkipConfirmation.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`shouldSkipConfirmation`](../interfaces/IInteractiveAnnotation.md#shouldskipconfirmation)

***

### tapAction?

> `optional` **tapAction**: `null` \| [`ITapLinkAction`](../interfaces/ITapLinkAction.md)

Defined in: [WAProto/index.d.ts:15251](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15251)

InteractiveAnnotation tapAction.

#### Implementation of

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md).[`tapAction`](../interfaces/IInteractiveAnnotation.md#tapaction)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:15324](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15324)

Converts this InteractiveAnnotation to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`InteractiveAnnotation`](InteractiveAnnotation.md)

Defined in: [WAProto/index.d.ts:15261](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15261)

Creates a new InteractiveAnnotation instance using the specified properties.

#### Parameters

##### properties?

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md)

Properties to set

#### Returns

[`InteractiveAnnotation`](InteractiveAnnotation.md)

InteractiveAnnotation instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`InteractiveAnnotation`](InteractiveAnnotation.md)

Defined in: [WAProto/index.d.ts:15287](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15287)

Decodes an InteractiveAnnotation message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`InteractiveAnnotation`](InteractiveAnnotation.md)

InteractiveAnnotation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`InteractiveAnnotation`](InteractiveAnnotation.md)

Defined in: [WAProto/index.d.ts:15296](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15296)

Decodes an InteractiveAnnotation message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`InteractiveAnnotation`](InteractiveAnnotation.md)

InteractiveAnnotation

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15269](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15269)

Encodes the specified InteractiveAnnotation message. Does not implicitly [verify](InteractiveAnnotation.md#verify) messages.

#### Parameters

##### message

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md)

InteractiveAnnotation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:15277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15277)

Encodes the specified InteractiveAnnotation message, length delimited. Does not implicitly [verify](InteractiveAnnotation.md#verify) messages.

#### Parameters

##### message

[`IInteractiveAnnotation`](../interfaces/IInteractiveAnnotation.md)

InteractiveAnnotation message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`InteractiveAnnotation`](InteractiveAnnotation.md)

Defined in: [WAProto/index.d.ts:15310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15310)

Creates an InteractiveAnnotation message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`InteractiveAnnotation`](InteractiveAnnotation.md)

InteractiveAnnotation

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:15331](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15331)

Gets the default type url for InteractiveAnnotation

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

Defined in: [WAProto/index.d.ts:15318](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15318)

Creates a plain object from an InteractiveAnnotation message. Also converts values to other types if specified.

#### Parameters

##### message

[`InteractiveAnnotation`](InteractiveAnnotation.md)

InteractiveAnnotation

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:15303](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L15303)

Verifies an InteractiveAnnotation message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
