# Class: Field

Defined in: [WAProto/index.d.ts:13378](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13378)

Represents a Field.

## Implements

- [`IField`](../interfaces/IField.md)

## Constructors

### new Field()

> **new Field**(`properties`?): [`Field`](Field.md)

Defined in: [WAProto/index.d.ts:13384](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13384)

Constructs a new Field.

#### Parameters

##### properties?

[`IField`](../interfaces/IField.md)

Properties to set

#### Returns

[`Field`](Field.md)

## Properties

### isMessage?

> `optional` **isMessage**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:13396](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13396)

Field isMessage.

#### Implementation of

[`IField`](../interfaces/IField.md).[`isMessage`](../interfaces/IField.md#ismessage)

***

### maxVersion?

> `optional` **maxVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:13390](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13390)

Field maxVersion.

#### Implementation of

[`IField`](../interfaces/IField.md).[`maxVersion`](../interfaces/IField.md#maxversion)

***

### minVersion?

> `optional` **minVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:13387](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13387)

Field minVersion.

#### Implementation of

[`IField`](../interfaces/IField.md).[`minVersion`](../interfaces/IField.md#minversion)

***

### notReportableMinVersion?

> `optional` **notReportableMinVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:13393](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13393)

Field notReportableMinVersion.

#### Implementation of

[`IField`](../interfaces/IField.md).[`notReportableMinVersion`](../interfaces/IField.md#notreportableminversion)

***

### subfield

> **subfield**: `object`

Defined in: [WAProto/index.d.ts:13399](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13399)

Field subfield.

#### Index Signature

\[`k`: `string`\]: [`IField`](../interfaces/IField.md)

#### Implementation of

[`IField`](../interfaces/IField.md).[`subfield`](../interfaces/IField.md#subfield)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:13469](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13469)

Converts this Field to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`Field`](Field.md)

Defined in: [WAProto/index.d.ts:13406](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13406)

Creates a new Field instance using the specified properties.

#### Parameters

##### properties?

[`IField`](../interfaces/IField.md)

Properties to set

#### Returns

[`Field`](Field.md)

Field instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`Field`](Field.md)

Defined in: [WAProto/index.d.ts:13432](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13432)

Decodes a Field message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`Field`](Field.md)

Field

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`Field`](Field.md)

Defined in: [WAProto/index.d.ts:13441](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13441)

Decodes a Field message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`Field`](Field.md)

Field

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13414](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13414)

Encodes the specified Field message. Does not implicitly [verify](Field.md#verify) messages.

#### Parameters

##### message

[`IField`](../interfaces/IField.md)

Field message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:13422](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13422)

Encodes the specified Field message, length delimited. Does not implicitly [verify](Field.md#verify) messages.

#### Parameters

##### message

[`IField`](../interfaces/IField.md)

Field message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`Field`](Field.md)

Defined in: [WAProto/index.d.ts:13455](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13455)

Creates a Field message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`Field`](Field.md)

Field

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:13476](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13476)

Gets the default type url for Field

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

Defined in: [WAProto/index.d.ts:13463](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13463)

Creates a plain object from a Field message. Also converts values to other types if specified.

#### Parameters

##### message

[`Field`](Field.md)

Field

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:13448](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L13448)

Verifies a Field message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
