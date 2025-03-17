# Class: SessionStructure

Defined in: [WAProto/index.d.ts:39096](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39096)

Represents a SessionStructure.

## Implements

- [`ISessionStructure`](../interfaces/ISessionStructure.md)

## Constructors

### new SessionStructure()

> **new SessionStructure**(`properties`?): [`SessionStructure`](SessionStructure.md)

Defined in: [WAProto/index.d.ts:39102](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39102)

Constructs a new SessionStructure.

#### Parameters

##### properties?

[`ISessionStructure`](../interfaces/ISessionStructure.md)

Properties to set

#### Returns

[`SessionStructure`](SessionStructure.md)

## Properties

### aliceBaseKey?

> `optional` **aliceBaseKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39141](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39141)

SessionStructure aliceBaseKey.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`aliceBaseKey`](../interfaces/ISessionStructure.md#alicebasekey)

***

### localIdentityPublic?

> `optional` **localIdentityPublic**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39108](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39108)

SessionStructure localIdentityPublic.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`localIdentityPublic`](../interfaces/ISessionStructure.md#localidentitypublic)

***

### localRegistrationId?

> `optional` **localRegistrationId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39135](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39135)

SessionStructure localRegistrationId.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`localRegistrationId`](../interfaces/ISessionStructure.md#localregistrationid)

***

### needsRefresh?

> `optional` **needsRefresh**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:39138](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39138)

SessionStructure needsRefresh.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`needsRefresh`](../interfaces/ISessionStructure.md#needsrefresh)

***

### pendingKeyExchange?

> `optional` **pendingKeyExchange**: `null` \| [`IPendingKeyExchange`](../namespaces/SessionStructure/interfaces/IPendingKeyExchange.md)

Defined in: [WAProto/index.d.ts:39126](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39126)

SessionStructure pendingKeyExchange.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`pendingKeyExchange`](../interfaces/ISessionStructure.md#pendingkeyexchange)

***

### pendingPreKey?

> `optional` **pendingPreKey**: `null` \| [`IPendingPreKey`](../namespaces/SessionStructure/interfaces/IPendingPreKey.md)

Defined in: [WAProto/index.d.ts:39129](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39129)

SessionStructure pendingPreKey.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`pendingPreKey`](../interfaces/ISessionStructure.md#pendingprekey)

***

### previousCounter?

> `optional` **previousCounter**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39117](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39117)

SessionStructure previousCounter.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`previousCounter`](../interfaces/ISessionStructure.md#previouscounter)

***

### receiverChains

> **receiverChains**: [`IChain`](../namespaces/SessionStructure/interfaces/IChain.md)[]

Defined in: [WAProto/index.d.ts:39123](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39123)

SessionStructure receiverChains.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`receiverChains`](../interfaces/ISessionStructure.md#receiverchains)

***

### remoteIdentityPublic?

> `optional` **remoteIdentityPublic**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39111](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39111)

SessionStructure remoteIdentityPublic.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`remoteIdentityPublic`](../interfaces/ISessionStructure.md#remoteidentitypublic)

***

### remoteRegistrationId?

> `optional` **remoteRegistrationId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39132](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39132)

SessionStructure remoteRegistrationId.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`remoteRegistrationId`](../interfaces/ISessionStructure.md#remoteregistrationid)

***

### rootKey?

> `optional` **rootKey**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:39114](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39114)

SessionStructure rootKey.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`rootKey`](../interfaces/ISessionStructure.md#rootkey)

***

### senderChain?

> `optional` **senderChain**: `null` \| [`IChain`](../namespaces/SessionStructure/interfaces/IChain.md)

Defined in: [WAProto/index.d.ts:39120](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39120)

SessionStructure senderChain.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`senderChain`](../interfaces/ISessionStructure.md#senderchain)

***

### sessionVersion?

> `optional` **sessionVersion**: `null` \| `number`

Defined in: [WAProto/index.d.ts:39105](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39105)

SessionStructure sessionVersion.

#### Implementation of

[`ISessionStructure`](../interfaces/ISessionStructure.md).[`sessionVersion`](../interfaces/ISessionStructure.md#sessionversion)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:39211](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39211)

Converts this SessionStructure to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`SessionStructure`](SessionStructure.md)

Defined in: [WAProto/index.d.ts:39148](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39148)

Creates a new SessionStructure instance using the specified properties.

#### Parameters

##### properties?

[`ISessionStructure`](../interfaces/ISessionStructure.md)

Properties to set

#### Returns

[`SessionStructure`](SessionStructure.md)

SessionStructure instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`SessionStructure`](SessionStructure.md)

Defined in: [WAProto/index.d.ts:39174](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39174)

Decodes a SessionStructure message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`SessionStructure`](SessionStructure.md)

SessionStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`SessionStructure`](SessionStructure.md)

Defined in: [WAProto/index.d.ts:39183](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39183)

Decodes a SessionStructure message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`SessionStructure`](SessionStructure.md)

SessionStructure

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39156](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39156)

Encodes the specified SessionStructure message. Does not implicitly [verify](SessionStructure.md#verify) messages.

#### Parameters

##### message

[`ISessionStructure`](../interfaces/ISessionStructure.md)

SessionStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:39164](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39164)

Encodes the specified SessionStructure message, length delimited. Does not implicitly [verify](SessionStructure.md#verify) messages.

#### Parameters

##### message

[`ISessionStructure`](../interfaces/ISessionStructure.md)

SessionStructure message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`SessionStructure`](SessionStructure.md)

Defined in: [WAProto/index.d.ts:39197](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39197)

Creates a SessionStructure message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`SessionStructure`](SessionStructure.md)

SessionStructure

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:39218](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39218)

Gets the default type url for SessionStructure

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

Defined in: [WAProto/index.d.ts:39205](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39205)

Creates a plain object from a SessionStructure message. Also converts values to other types if specified.

#### Parameters

##### message

[`SessionStructure`](SessionStructure.md)

SessionStructure

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:39190](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L39190)

Verifies a SessionStructure message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
