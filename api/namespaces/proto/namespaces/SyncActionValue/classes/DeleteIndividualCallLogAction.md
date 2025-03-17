# Class: DeleteIndividualCallLogAction

Defined in: [WAProto/index.d.ts:42265](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42265)

Represents a DeleteIndividualCallLogAction.

## Implements

- [`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md)

## Constructors

### new DeleteIndividualCallLogAction()

> **new DeleteIndividualCallLogAction**(`properties`?): [`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

Defined in: [WAProto/index.d.ts:42271](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42271)

Constructs a new DeleteIndividualCallLogAction.

#### Parameters

##### properties?

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md)

Properties to set

#### Returns

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

## Properties

### isIncoming?

> `optional` **isIncoming**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:42277](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42277)

DeleteIndividualCallLogAction isIncoming.

#### Implementation of

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md).[`isIncoming`](../interfaces/IDeleteIndividualCallLogAction.md#isincoming)

***

### peerJid?

> `optional` **peerJid**: `null` \| `string`

Defined in: [WAProto/index.d.ts:42274](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42274)

DeleteIndividualCallLogAction peerJid.

#### Implementation of

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md).[`peerJid`](../interfaces/IDeleteIndividualCallLogAction.md#peerjid)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:42347](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42347)

Converts this DeleteIndividualCallLogAction to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

Defined in: [WAProto/index.d.ts:42284](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42284)

Creates a new DeleteIndividualCallLogAction instance using the specified properties.

#### Parameters

##### properties?

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md)

Properties to set

#### Returns

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

Defined in: [WAProto/index.d.ts:42310](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42310)

Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

Defined in: [WAProto/index.d.ts:42319](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42319)

Decodes a DeleteIndividualCallLogAction message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42292](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42292)

Encodes the specified DeleteIndividualCallLogAction message. Does not implicitly [verify](DeleteIndividualCallLogAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:42300](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42300)

Encodes the specified DeleteIndividualCallLogAction message, length delimited. Does not implicitly [verify](DeleteIndividualCallLogAction.md#verify) messages.

#### Parameters

##### message

[`IDeleteIndividualCallLogAction`](../interfaces/IDeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

Defined in: [WAProto/index.d.ts:42333](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42333)

Creates a DeleteIndividualCallLogAction message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:42354](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42354)

Gets the default type url for DeleteIndividualCallLogAction

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

Defined in: [WAProto/index.d.ts:42341](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42341)

Creates a plain object from a DeleteIndividualCallLogAction message. Also converts values to other types if specified.

#### Parameters

##### message

[`DeleteIndividualCallLogAction`](DeleteIndividualCallLogAction.md)

DeleteIndividualCallLogAction

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:42326](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L42326)

Verifies a DeleteIndividualCallLogAction message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
