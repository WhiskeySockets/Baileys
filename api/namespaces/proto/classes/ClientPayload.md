# Class: ClientPayload

Defined in: [WAProto/index.d.ts:7733](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7733)

Represents a ClientPayload.

## Implements

- [`IClientPayload`](../interfaces/IClientPayload.md)

## Constructors

### new ClientPayload()

> **new ClientPayload**(`properties`?): [`ClientPayload`](ClientPayload.md)

Defined in: [WAProto/index.d.ts:7739](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7739)

Constructs a new ClientPayload.

#### Parameters

##### properties?

[`IClientPayload`](../interfaces/IClientPayload.md)

Properties to set

#### Returns

[`ClientPayload`](ClientPayload.md)

## Properties

### connectAttemptCount?

> `optional` **connectAttemptCount**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7775](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7775)

ClientPayload connectAttemptCount.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`connectAttemptCount`](../interfaces/IClientPayload.md#connectattemptcount)

***

### connectReason?

> `optional` **connectReason**: `null` \| [`ConnectReason`](../namespaces/ClientPayload/enumerations/ConnectReason.md)

Defined in: [WAProto/index.d.ts:7766](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7766)

ClientPayload connectReason.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`connectReason`](../interfaces/IClientPayload.md#connectreason)

***

### connectType?

> `optional` **connectType**: `null` \| [`ConnectType`](../namespaces/ClientPayload/enumerations/ConnectType.md)

Defined in: [WAProto/index.d.ts:7763](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7763)

ClientPayload connectType.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`connectType`](../interfaces/IClientPayload.md#connecttype)

***

### device?

> `optional` **device**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7778](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7778)

ClientPayload device.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`device`](../interfaces/IClientPayload.md#device)

***

### devicePairingData?

> `optional` **devicePairingData**: `null` \| [`IDevicePairingRegistrationData`](../namespaces/ClientPayload/interfaces/IDevicePairingRegistrationData.md)

Defined in: [WAProto/index.d.ts:7781](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7781)

ClientPayload devicePairingData.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`devicePairingData`](../interfaces/IClientPayload.md#devicepairingdata)

***

### dnsSource?

> `optional` **dnsSource**: `null` \| [`IDNSSource`](../namespaces/ClientPayload/interfaces/IDNSSource.md)

Defined in: [WAProto/index.d.ts:7772](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7772)

ClientPayload dnsSource.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`dnsSource`](../interfaces/IClientPayload.md#dnssource)

***

### fbAppId?

> `optional` **fbAppId**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:7802](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7802)

ClientPayload fbAppId.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`fbAppId`](../interfaces/IClientPayload.md#fbappid)

***

### fbCat?

> `optional` **fbCat**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:7787](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7787)

ClientPayload fbCat.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`fbCat`](../interfaces/IClientPayload.md#fbcat)

***

### fbDeviceId?

> `optional` **fbDeviceId**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:7805](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7805)

ClientPayload fbDeviceId.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`fbDeviceId`](../interfaces/IClientPayload.md#fbdeviceid)

***

### fbUserAgent?

> `optional` **fbUserAgent**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:7790](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7790)

ClientPayload fbUserAgent.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`fbUserAgent`](../interfaces/IClientPayload.md#fbuseragent)

***

### interopData?

> `optional` **interopData**: `null` \| [`IInteropData`](../namespaces/ClientPayload/interfaces/IInteropData.md)

Defined in: [WAProto/index.d.ts:7820](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7820)

ClientPayload interopData.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`interopData`](../interfaces/IClientPayload.md#interopdata)

***

### iosAppExtension?

> `optional` **iosAppExtension**: `null` \| [`IOSAppExtension`](../namespaces/ClientPayload/enumerations/IOSAppExtension.md)

Defined in: [WAProto/index.d.ts:7799](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7799)

ClientPayload iosAppExtension.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`iosAppExtension`](../interfaces/IClientPayload.md#iosappextension)

***

### lc?

> `optional` **lc**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7796](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7796)

ClientPayload lc.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`lc`](../interfaces/IClientPayload.md#lc)

***

### memClass?

> `optional` **memClass**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7817](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7817)

ClientPayload memClass.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`memClass`](../interfaces/IClientPayload.md#memclass)

***

### oc?

> `optional` **oc**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7793](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7793)

ClientPayload oc.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`oc`](../interfaces/IClientPayload.md#oc)

***

### paddingBytes?

> `optional` **paddingBytes**: `null` \| `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [WAProto/index.d.ts:7811](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7811)

ClientPayload paddingBytes.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`paddingBytes`](../interfaces/IClientPayload.md#paddingbytes)

***

### passive?

> `optional` **passive**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7745](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7745)

ClientPayload passive.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`passive`](../interfaces/IClientPayload.md#passive)

***

### product?

> `optional` **product**: `null` \| [`Product`](../namespaces/ClientPayload/enumerations/Product.md)

Defined in: [WAProto/index.d.ts:7784](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7784)

ClientPayload product.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`product`](../interfaces/IClientPayload.md#product)

***

### pull?

> `optional` **pull**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7808](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7808)

ClientPayload pull.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`pull`](../interfaces/IClientPayload.md#pull)

***

### pushName?

> `optional` **pushName**: `null` \| `string`

Defined in: [WAProto/index.d.ts:7754](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7754)

ClientPayload pushName.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`pushName`](../interfaces/IClientPayload.md#pushname)

***

### sessionId?

> `optional` **sessionId**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7757](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7757)

ClientPayload sessionId.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`sessionId`](../interfaces/IClientPayload.md#sessionid)

***

### shards

> **shards**: `number`[]

Defined in: [WAProto/index.d.ts:7769](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7769)

ClientPayload shards.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`shards`](../interfaces/IClientPayload.md#shards)

***

### shortConnect?

> `optional` **shortConnect**: `null` \| `boolean`

Defined in: [WAProto/index.d.ts:7760](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7760)

ClientPayload shortConnect.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`shortConnect`](../interfaces/IClientPayload.md#shortconnect)

***

### trafficAnonymization?

> `optional` **trafficAnonymization**: `null` \| [`TrafficAnonymization`](../namespaces/ClientPayload/enumerations/TrafficAnonymization.md)

Defined in: [WAProto/index.d.ts:7823](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7823)

ClientPayload trafficAnonymization.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`trafficAnonymization`](../interfaces/IClientPayload.md#trafficanonymization)

***

### userAgent?

> `optional` **userAgent**: `null` \| [`IUserAgent`](../namespaces/ClientPayload/interfaces/IUserAgent.md)

Defined in: [WAProto/index.d.ts:7748](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7748)

ClientPayload userAgent.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`userAgent`](../interfaces/IClientPayload.md#useragent)

***

### username?

> `optional` **username**: `null` \| `number` \| `Long`

Defined in: [WAProto/index.d.ts:7742](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7742)

ClientPayload username.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`username`](../interfaces/IClientPayload.md#username)

***

### webInfo?

> `optional` **webInfo**: `null` \| [`IWebInfo`](../namespaces/ClientPayload/interfaces/IWebInfo.md)

Defined in: [WAProto/index.d.ts:7751](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7751)

ClientPayload webInfo.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`webInfo`](../interfaces/IClientPayload.md#webinfo)

***

### yearClass?

> `optional` **yearClass**: `null` \| `number`

Defined in: [WAProto/index.d.ts:7814](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7814)

ClientPayload yearClass.

#### Implementation of

[`IClientPayload`](../interfaces/IClientPayload.md).[`yearClass`](../interfaces/IClientPayload.md#yearclass)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [WAProto/index.d.ts:7893](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7893)

Converts this ClientPayload to JSON.

#### Returns

`object`

JSON object

***

### create()

> `static` **create**(`properties`?): [`ClientPayload`](ClientPayload.md)

Defined in: [WAProto/index.d.ts:7830](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7830)

Creates a new ClientPayload instance using the specified properties.

#### Parameters

##### properties?

[`IClientPayload`](../interfaces/IClientPayload.md)

Properties to set

#### Returns

[`ClientPayload`](ClientPayload.md)

ClientPayload instance

***

### decode()

> `static` **decode**(`reader`, `length`?): [`ClientPayload`](ClientPayload.md)

Defined in: [WAProto/index.d.ts:7856](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7856)

Decodes a ClientPayload message from the specified reader or buffer.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

##### length?

`number`

Message length if known beforehand

#### Returns

[`ClientPayload`](ClientPayload.md)

ClientPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### decodeDelimited()

> `static` **decodeDelimited**(`reader`): [`ClientPayload`](ClientPayload.md)

Defined in: [WAProto/index.d.ts:7865](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7865)

Decodes a ClientPayload message from the specified reader or buffer, length delimited.

#### Parameters

##### reader

Reader or buffer to decode from

`Uint8Array`\<`ArrayBufferLike`\> | `Reader`

#### Returns

[`ClientPayload`](ClientPayload.md)

ClientPayload

#### Throws

If the payload is not a reader or valid buffer

#### Throws

If required fields are missing

***

### encode()

> `static` **encode**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7838](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7838)

Encodes the specified ClientPayload message. Does not implicitly [verify](ClientPayload.md#verify) messages.

#### Parameters

##### message

[`IClientPayload`](../interfaces/IClientPayload.md)

ClientPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### encodeDelimited()

> `static` **encodeDelimited**(`message`, `writer`?): `Writer`

Defined in: [WAProto/index.d.ts:7846](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7846)

Encodes the specified ClientPayload message, length delimited. Does not implicitly [verify](ClientPayload.md#verify) messages.

#### Parameters

##### message

[`IClientPayload`](../interfaces/IClientPayload.md)

ClientPayload message or plain object to encode

##### writer?

`Writer`

Writer to encode to

#### Returns

`Writer`

Writer

***

### fromObject()

> `static` **fromObject**(`object`): [`ClientPayload`](ClientPayload.md)

Defined in: [WAProto/index.d.ts:7879](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7879)

Creates a ClientPayload message from a plain object. Also converts values to their respective internal types.

#### Parameters

##### object

Plain object

#### Returns

[`ClientPayload`](ClientPayload.md)

ClientPayload

***

### getTypeUrl()

> `static` **getTypeUrl**(`typeUrlPrefix`?): `string`

Defined in: [WAProto/index.d.ts:7900](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7900)

Gets the default type url for ClientPayload

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

Defined in: [WAProto/index.d.ts:7887](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7887)

Creates a plain object from a ClientPayload message. Also converts values to other types if specified.

#### Parameters

##### message

[`ClientPayload`](ClientPayload.md)

ClientPayload

##### options?

`IConversionOptions`

Conversion options

#### Returns

`object`

Plain object

***

### verify()

> `static` **verify**(`message`): `null` \| `string`

Defined in: [WAProto/index.d.ts:7872](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/WAProto/index.d.ts#L7872)

Verifies a ClientPayload message.

#### Parameters

##### message

Plain object to verify

#### Returns

`null` \| `string`

`null` if valid, otherwise the reason why it is not
