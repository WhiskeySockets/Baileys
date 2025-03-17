# Type Alias: CacheStore

> **CacheStore**: `object`

Defined in: [src/Types/Socket.ts:15](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Socket.ts#L15)

## Type declaration

### del()

delete a key from the cache

#### Parameters

##### key

`string`

#### Returns

`void`

### flushAll()

flush all data

#### Returns

`void`

### get()

get a cached key and change the stats

#### Type Parameters

• **T**

#### Parameters

##### key

`string`

#### Returns

`undefined` \| `T`

### set()

set a key in the cache

#### Type Parameters

• **T**

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`void`
