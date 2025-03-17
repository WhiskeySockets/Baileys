# Class: USyncDeviceProtocol

Defined in: [src/WAUSync/Protocols/USyncDeviceProtocol.ts:22](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDeviceProtocol.ts#L22)

## Implements

- `USyncQueryProtocol`

## Constructors

### new USyncDeviceProtocol()

> **new USyncDeviceProtocol**(): [`USyncDeviceProtocol`](USyncDeviceProtocol.md)

#### Returns

[`USyncDeviceProtocol`](USyncDeviceProtocol.md)

## Properties

### name

> **name**: `string` = `'devices'`

Defined in: [src/WAUSync/Protocols/USyncDeviceProtocol.ts:23](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDeviceProtocol.ts#L23)

The name of the protocol

#### Implementation of

`USyncQueryProtocol.name`

## Methods

### getQueryElement()

> **getQueryElement**(): [`BinaryNode`](../type-aliases/BinaryNode.md)

Defined in: [src/WAUSync/Protocols/USyncDeviceProtocol.ts:25](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDeviceProtocol.ts#L25)

Defines what goes inside the query part of a USyncQuery

#### Returns

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Implementation of

`USyncQueryProtocol.getQueryElement`

***

### getUserElement()

> **getUserElement**(): `null` \| [`BinaryNode`](../type-aliases/BinaryNode.md)

Defined in: [src/WAUSync/Protocols/USyncDeviceProtocol.ts:34](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDeviceProtocol.ts#L34)

Defines what goes inside the user part of a USyncQuery

#### Returns

`null` \| [`BinaryNode`](../type-aliases/BinaryNode.md)

#### Implementation of

`USyncQueryProtocol.getUserElement`

***

### parser()

> **parser**(`node`): [`ParsedDeviceInfo`](../type-aliases/ParsedDeviceInfo.md)

Defined in: [src/WAUSync/Protocols/USyncDeviceProtocol.ts:41](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/WAUSync/Protocols/USyncDeviceProtocol.ts#L41)

Parse the result of the query

#### Parameters

##### node

[`BinaryNode`](../type-aliases/BinaryNode.md)

#### Returns

[`ParsedDeviceInfo`](../type-aliases/ParsedDeviceInfo.md)

Whatever the protocol is supposed to return

#### Implementation of

`USyncQueryProtocol.parser`
