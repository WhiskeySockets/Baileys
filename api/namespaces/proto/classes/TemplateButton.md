# Class: TemplateButton

Defined in: [WAProto/index.d.ts:47759](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47759)

Represents a TemplateButton.

## Implements

- [`ITemplateButton`](../interfaces/ITemplateButton.md)

## Constructors

### new TemplateButton()

> **new TemplateButton**(`properties`?): [`TemplateButton`](TemplateButton.md)

Defined in: [WAProto/index.d.ts:47765](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47765)

Constructs a new TemplateButton.

#### Parameters

##### properties?

[`ITemplateButton`](../interfaces/ITemplateButton.md)

Properties to set

#### Returns

[`TemplateButton`](TemplateButton.md)

## Properties

### button?

> `optional` **button**: `"quickReplyButton"` \| `"urlButton"` \| `"callButton"`

Defined in: [WAProto/index.d.ts:47780](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47780)

TemplateButton button.

***

### callButton?

> `optional` **callButton**: `null` \| [`ICallButton`](../namespaces/TemplateButton/interfaces/ICallButton.md)

Defined in: [WAProto/index.d.ts:47777](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47777)

TemplateButton callButton.

#### Implementation of

[`ITemplateButton`](../interfaces/ITemplateButton.md).[`callButton`](../interfaces/ITemplateButton.md#callbutton)

***

### index?

> `optional` **index**: `null` \| `number`

Defined in: [WAProto/index.d.ts:47768](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47768)

TemplateButton index.

#### Implementation of

[`ITemplateButton`](../interfaces/ITemplateButton.md).[`index`](../interfaces/ITemplateButton.md#index)

***

### quickReplyButton?

> `optional` **quickReplyButton**: `null` \| [`IQuickReplyButton`](../namespaces/TemplateButton/interfaces/IQuickReplyButton.md)

Defined in: [WAProto/index.d.ts:47771](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47771)

TemplateButton quickReplyButton.

#### Implementation of

[`ITemplateButton`](../interfaces/ITemplateButton.md).[`quickReplyButton`](../interfaces/ITemplateButton.md#quickreplybutton)

***

### urlButton?

> `optional` **urlButton**: `null` \| [`IURLButton`](../namespaces/TemplateButton/interfaces/IURLButton.md)

Defined in: [WAProto/index.d.ts:47774](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47774)

TemplateButton urlButton.

#### Implementation of

[`ITemplateButton`](../interfaces/ITemplateButton.md).[`urlButton`](../interfaces/ITemplateButton.md#urlbutton)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47850](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47850)

Converts this TemplateButton to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`TemplateButton`](TemplateButton.md)

Defined in: [WAProto/index.d.ts:47787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47787)

Creates a new TemplateButton instance using the specified properties.

#### Parameters

##### properties?

[`ITemplateButton`](../interfaces/ITemplateButton.md)

Properties to set

#### Returns

[`TemplateButton`](TemplateButton.md)

TemplateButton instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`TemplateButton`](TemplateButton.md)

Defined in: [WAProto/index.d.ts:47813](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47813)

Decodes a TemplateButton message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`TemplateButton`](TemplateButton.md)

TemplateButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`TemplateButton`](TemplateButton.md)

Defined in: [WAProto/index.d.ts:47822](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47822)

Decodes a TemplateButton message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`TemplateButton`](TemplateButton.md)

TemplateButton

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47795](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47795)

Encodes the specified TemplateButton message. Does not implicitly [verify](TemplateButton.md#verify) messages.

#### Parameters

##### message

[`ITemplateButton`](../interfaces/ITemplateButton.md)

TemplateButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47803](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47803)

Encodes the specified TemplateButton message, length delimited. Does not implicitly [verify](TemplateButton.md#verify) messages.

#### Parameters

##### message

[`ITemplateButton`](../interfaces/ITemplateButton.md)

TemplateButton message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`TemplateButton`](TemplateButton.md)

Defined in: [WAProto/index.d.ts:47836](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47836)

Creates a TemplateButton message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`TemplateButton`](TemplateButton.md)

TemplateButton

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47857](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47857)

Gets the default type url for TemplateButton

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

Defined in: [WAProto/index.d.ts:47844](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47844)

Creates a plain object from a TemplateButton message. Also converts values to other types if specified.

#### Parameters

##### message

[`TemplateButton`](TemplateButton.md)

TemplateButton

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47829](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47829)

Verifies a TemplateButton message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
