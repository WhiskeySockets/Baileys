# Class: ProloguePayload

Defined in: [WAProto/index.d.ts:37473](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37473)

Represents a ProloguePayload.

## Implements

- [`IProloguePayload`](../interfaces/IProloguePayload.md)

## Constructors

### new ProloguePayload()

> **new ProloguePayload**(`properties`?): [`ProloguePayload`](ProloguePayload.md)

Defined in: [WAProto/index.d.ts:37479](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37479)

Constructs a new ProloguePayload.

#### Parameters

##### properties?

[`IProloguePayload`](../interfaces/IProloguePayload.md)

Properties to set

#### Returns

[`ProloguePayload`](ProloguePayload.md)

## Properties

### commitment?

> `optional` **commitment**: `null` \| [`ICompanionCommitment`](../interfaces/ICompanionCommitment.md)

Defined in: [WAProto/index.d.ts:37485](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37485)

ProloguePayload commitment.

#### Implementation of

[`IProloguePayload`](../interfaces/IProloguePayload.md).[`commitment`](../interfaces/IProloguePayload.md#commitment)

***

### companionEphemeralIdentity?

> `optional` **companionEphemeralIdentity**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:37482](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37482)

ProloguePayload companionEphemeralIdentity.

#### Implementation of

[`IProloguePayload`](../interfaces/IProloguePayload.md).[`companionEphemeralIdentity`](../interfaces/IProloguePayload.md#companionephemeralidentity)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:37555](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37555)

Converts this ProloguePayload to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ProloguePayload`](ProloguePayload.md)

Defined in: [WAProto/index.d.ts:37492](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37492)

Creates a new ProloguePayload instance using the specified properties.

#### Parameters

##### properties?

[`IProloguePayload`](../interfaces/IProloguePayload.md)

Properties to set

#### Returns

[`ProloguePayload`](ProloguePayload.md)

ProloguePayload instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ProloguePayload`](ProloguePayload.md)

Defined in: [WAProto/index.d.ts:37518](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37518)

Decodes a ProloguePayload message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ProloguePayload`](ProloguePayload.md)

ProloguePayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ProloguePayload`](ProloguePayload.md)

Defined in: [WAProto/index.d.ts:37527](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37527)

Decodes a ProloguePayload message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ProloguePayload`](ProloguePayload.md)

ProloguePayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37500](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37500)

Encodes the specified ProloguePayload message. Does not implicitly [verify](ProloguePayload.md#verify) messages.

#### Parameters

##### message

[`IProloguePayload`](../interfaces/IProloguePayload.md)

ProloguePayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:37508](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37508)

Encodes the specified ProloguePayload message, length delimited. Does not implicitly [verify](ProloguePayload.md#verify) messages.

#### Parameters

##### message

[`IProloguePayload`](../interfaces/IProloguePayload.md)

ProloguePayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ProloguePayload`](ProloguePayload.md)

Defined in: [WAProto/index.d.ts:37541](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37541)

Creates a ProloguePayload message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ProloguePayload`](ProloguePayload.md)

ProloguePayload

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:37562](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37562)

Gets the default type url for ProloguePayload

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

Defined in: [WAProto/index.d.ts:37549](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37549)

Creates a plain object from a ProloguePayload message. Also converts values to other types if specified.

#### Parameters

##### message

[`ProloguePayload`](ProloguePayload.md)

ProloguePayload

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:37534](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L37534)

Verifies a ProloguePayload message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
