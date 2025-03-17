# Class: USyncStatusProtocol

Defined in: [src/WAUSync/Protocols/USyncStatusProtocol.ts:9](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncStatusProtocol.ts#L9)

## Implements

- `USyncQueryProtocol`

## Constructors

### new USyncStatusProtocol()

> **new USyncStatusProtocol**(): [`USyncStatusProtocol`](USyncStatusProtocol.md)

#### Returns

[`USyncStatusProtocol`](USyncStatusProtocol.md)

## Properties

### name

> **name**: `string` = `'status'`

Defined in: [src/WAUSync/Protocols/USyncStatusProtocol.ts:10](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncStatusProtocol.ts#L10)

The name of the protocol

#### Implementation of

`USyncQueryProtocol.name`

## Methods

### getQueryElement()

> **getQueryElement**(): [`BinaryNode`](../type-aliases/BinaryNode.md)

Defined in: [src/WAUSync/Protocols/USyncStatusProtocol.ts:12](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncStatusProtocol.ts#L12)

Defines what goes inside the query part of a USyncQuery

#### Returns

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Implementation of

`USyncQueryProtocol.getQueryElement`

***

### getUserElement()

> **getUserElement**(): `null`

Defined in: [src/WAUSync/Protocols/USyncStatusProtocol.ts:19](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncStatusProtocol.ts#L19)

Defines what goes inside the user part of a USyncQuery

#### Returns

`null`

#### Implementation of

`USyncQueryProtocol.getUserElement`

***

### parser()

> **parser**(`node`): `undefined` \| [`StatusData`](../type-aliases/StatusData.md)

Defined in: [src/WAUSync/Protocols/USyncStatusProtocol.ts:23](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncStatusProtocol.ts#L23)

Parse the result of the query

#### Parameters

##### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Returns

`undefined` \| [`StatusData`](../type-aliases/StatusData.md)

Whatever the protocol is supposed to return

#### Implementation of

`USyncQueryProtocol.parser`
