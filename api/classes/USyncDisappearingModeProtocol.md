# Class: USyncDisappearingModeProtocol

Defined in: [src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts:9](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts#L9)

## Implements

- `USyncQueryProtocol`

## Constructors

### new USyncDisappearingModeProtocol()

> **new USyncDisappearingModeProtocol**(): [`USyncDisappearingModeProtocol`](USyncDisappearingModeProtocol.md)

#### Returns

[`USyncDisappearingModeProtocol`](USyncDisappearingModeProtocol.md)

## Properties

### name

> **name**: `string` = `'disappearing_mode'`

Defined in: [src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts:10](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts#L10)

The name of the protocol

#### Implementation of

`USyncQueryProtocol.name`

## Methods

### getQueryElement()

> **getQueryElement**(): [`BinaryNode`](../type-aliases/BinaryNode.md)

Defined in: [src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts:12](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts#L12)

Defines what goes inside the query part of a USyncQuery

#### Returns

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Implementation of

`USyncQueryProtocol.getQueryElement`

***

### getUserElement()

> **getUserElement**(): `null`

Defined in: [src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts:19](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts#L19)

Defines what goes inside the user part of a USyncQuery

#### Returns

`null`

#### Implementation of

`USyncQueryProtocol.getUserElement`

***

### parser()

> **parser**(`node`): `undefined` \| [`DisappearingModeData`](../type-aliases/DisappearingModeData.md)

Defined in: [src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts:23](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDisappearingModeProtocol.ts#L23)

Parse the result of the query

#### Parameters

##### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Returns

`undefined` \| [`DisappearingModeData`](../type-aliases/DisappearingModeData.md)

Whatever the protocol is supposed to return

#### Implementation of

`USyncQueryProtocol.parser`
