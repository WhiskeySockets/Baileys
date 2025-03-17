# Type Alias: SignalKeyStore

> **SignalKeyStore**: `object`

Defined in: [src/Types/Auth.ts:81](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Auth.ts#L81)

## Type declaration

### clear()?

clear all the data in the store

#### Returns

`Awaitable`\<`void`\>

### get()

#### Type Parameters

• **T** *extends* keyof [`SignalDataTypeMap`](SignalDataTypeMap.md)

#### Parameters

##### type

`T`

##### ids

`string`[]

#### Returns

`Awaitable`\<\{\}\>

### set()

#### Parameters

##### data

[`SignalDataSet`](SignalDataSet.md)

#### Returns

`Awaitable`\<`void`\>
