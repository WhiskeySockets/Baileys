# Class: SyncdPatch

Defined in: [WAProto/index.d.ts:47108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47108)

Represents a SyncdPatch.

## Implements

- [`ISyncdPatch`](../interfaces/ISyncdPatch.md)

## Constructors

### new SyncdPatch()

> **new SyncdPatch**(`properties`?): [`SyncdPatch`](SyncdPatch.md)

Defined in: [WAProto/index.d.ts:47114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47114)

Constructs a new SyncdPatch.

#### Parameters

##### properties?

[`ISyncdPatch`](../interfaces/ISyncdPatch.md)

Properties to set

#### Returns

[`SyncdPatch`](SyncdPatch.md)

## Properties

### clientDebugData?

> `optional` **clientDebugData**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:47141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47141)

SyncdPatch clientDebugData.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`clientDebugData`](../interfaces/ISyncdPatch.md#clientdebugdata)

***

### deviceIndex?

> `optional` **deviceIndex**: `null` \| `number`

Defined in: [WAProto/index.d.ts:47138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47138)

SyncdPatch deviceIndex.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`deviceIndex`](../interfaces/ISyncdPatch.md#deviceindex)

***

### exitCode?

> `optional` **exitCode**: `null` \| [`IExitCode`](../interfaces/IExitCode.md)

Defined in: [WAProto/index.d.ts:47135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47135)

SyncdPatch exitCode.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`exitCode`](../interfaces/ISyncdPatch.md#exitcode)

***

### externalMutations?

> `optional` **externalMutations**: `null` \| [`IExternalBlobReference`](../interfaces/IExternalBlobReference.md)

Defined in: [WAProto/index.d.ts:47123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47123)

SyncdPatch externalMutations.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`externalMutations`](../interfaces/ISyncdPatch.md#externalmutations)

***

### keyId?

> `optional` **keyId**: `null` \| [`IKeyId`](../interfaces/IKeyId.md)

Defined in: [WAProto/index.d.ts:47132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47132)

SyncdPatch keyId.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`keyId`](../interfaces/ISyncdPatch.md#keyid)

***

### mutations

> **mutations**: [`ISyncdMutation`](../interfaces/ISyncdMutation.md)[]

Defined in: [WAProto/index.d.ts:47120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47120)

SyncdPatch mutations.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`mutations`](../interfaces/ISyncdPatch.md#mutations)

***

### patchMac?

> `optional` **patchMac**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:47129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47129)

SyncdPatch patchMac.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`patchMac`](../interfaces/ISyncdPatch.md#patchmac)

***

### snapshotMac?

> `optional` **snapshotMac**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:47126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47126)

SyncdPatch snapshotMac.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`snapshotMac`](../interfaces/ISyncdPatch.md#snapshotmac)

***

### version?

> `optional` **version**: `null` \| [`ISyncdVersion`](../interfaces/ISyncdVersion.md)

Defined in: [WAProto/index.d.ts:47117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47117)

SyncdPatch version.

#### Implementation of

[`ISyncdPatch`](../interfaces/ISyncdPatch.md).[`version`](../interfaces/ISyncdPatch.md#version)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:47211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47211)

Converts this SyncdPatch to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SyncdPatch`](SyncdPatch.md)

Defined in: [WAProto/index.d.ts:47148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47148)

Creates a new SyncdPatch instance using the specified properties.

#### Parameters

##### properties?

[`ISyncdPatch`](../interfaces/ISyncdPatch.md)

Properties to set

#### Returns

[`SyncdPatch`](SyncdPatch.md)

SyncdPatch instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SyncdPatch`](SyncdPatch.md)

Defined in: [WAProto/index.d.ts:47174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47174)

Decodes a SyncdPatch message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SyncdPatch`](SyncdPatch.md)

SyncdPatch

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SyncdPatch`](SyncdPatch.md)

Defined in: [WAProto/index.d.ts:47183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47183)

Decodes a SyncdPatch message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SyncdPatch`](SyncdPatch.md)

SyncdPatch

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47156)

Encodes the specified SyncdPatch message. Does not implicitly [verify](SyncdPatch.md#verify) messages.

#### Parameters

##### message

[`ISyncdPatch`](../interfaces/ISyncdPatch.md)

SyncdPatch message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:47164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47164)

Encodes the specified SyncdPatch message, length delimited. Does not implicitly [verify](SyncdPatch.md#verify) messages.

#### Parameters

##### message

[`ISyncdPatch`](../interfaces/ISyncdPatch.md)

SyncdPatch message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SyncdPatch`](SyncdPatch.md)

Defined in: [WAProto/index.d.ts:47197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47197)

Creates a SyncdPatch message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SyncdPatch`](SyncdPatch.md)

SyncdPatch

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:47218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47218)

Gets the default type url for SyncdPatch

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

Defined in: [WAProto/index.d.ts:47205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47205)

Creates a plain object from a SyncdPatch message. Also converts values to other types if specified.

#### Parameters

##### message

[`SyncdPatch`](SyncdPatch.md)

SyncdPatch

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:47190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L47190)

Verifies a SyncdPatch message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
