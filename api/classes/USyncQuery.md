# Class: USyncQuery

Defined in: [src/WAUSync/USyncQuery.ts:13](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L13)

## Constructors

### new USyncQuery()

> **new USyncQuery**(): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:19](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L19)

#### Returns

[`USyncQuery`](USyncQuery.md)

## Properties

### context

> **context**: `string`

Defined in: [src/WAUSync/USyncQuery.ts:16](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L16)

***

### mode

> **mode**: `string`

Defined in: [src/WAUSync/USyncQuery.ts:17](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L17)

***

### protocols

> **protocols**: `USyncQueryProtocol`[]

Defined in: [src/WAUSync/USyncQuery.ts:14](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L14)

***

### users

> **users**: [`USyncUser`](USyncUser.md)[]

Defined in: [src/WAUSync/USyncQuery.ts:15](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L15)

## Methods

### parseUSyncQueryResult()

> **parseUSyncQueryResult**(`result`): `undefined` \| [`USyncQueryResult`](../type-aliases/USyncQueryResult.md)

Defined in: [src/WAUSync/USyncQuery.ts:41](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L41)

#### Parameters

##### result

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Returns

`undefined` \| [`USyncQueryResult`](../type-aliases/USyncQueryResult.md)

***

### withContactProtocol()

> **withContactProtocol**(): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:89](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L89)

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withContext()

> **withContext**(`context`): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:31](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L31)

#### Parameters

##### context

`string`

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withDeviceProtocol()

> **withDeviceProtocol**(): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:84](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L84)

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withDisappearingModeProtocol()

> **withDisappearingModeProtocol**(): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:99](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L99)

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withMode()

> **withMode**(`mode`): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:26](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L26)

#### Parameters

##### mode

`string`

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withStatusProtocol()

> **withStatusProtocol**(): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:94](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L94)

#### Returns

[`USyncQuery`](USyncQuery.md)

***

### withUser()

> **withUser**(`user`): [`USyncQuery`](USyncQuery.md)

Defined in: [src/WAUSync/USyncQuery.ts:36](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/USyncQuery.ts#L36)

#### Parameters

##### user

[`USyncUser`](USyncUser.md)

#### Returns

[`USyncQuery`](USyncQuery.md)
