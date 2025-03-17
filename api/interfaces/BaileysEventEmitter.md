# Interface: BaileysEventEmitter

Defined in: [src/Types/Events.ts:96](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Events.ts#L96)

## Methods

### emit()

> **emit**\<`T`\>(`event`, `arg`): `boolean`

Defined in: [src/Types/Events.ts:100](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Events.ts#L100)

#### Type Parameters

• **T** *extends* keyof [`BaileysEventMap`](../type-aliases/BaileysEventMap.md)

#### Parameters

##### event

`T`

##### arg

[`BaileysEventMap`](../type-aliases/BaileysEventMap.md)\[`T`\]

#### Returns

`boolean`

***

### off()

> **off**\<`T`\>(`event`, `listener`): `void`

Defined in: [src/Types/Events.ts:98](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Events.ts#L98)

#### Type Parameters

• **T** *extends* keyof [`BaileysEventMap`](../type-aliases/BaileysEventMap.md)

#### Parameters

##### event

`T`

##### listener

(`arg`) => `void`

#### Returns

`void`

***

### on()

> **on**\<`T`\>(`event`, `listener`): `void`

Defined in: [src/Types/Events.ts:97](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Events.ts#L97)

#### Type Parameters

• **T** *extends* keyof [`BaileysEventMap`](../type-aliases/BaileysEventMap.md)

#### Parameters

##### event

`T`

##### listener

(`arg`) => `void`

#### Returns

`void`

***

### removeAllListeners()

> **removeAllListeners**\<`T`\>(`event`): `void`

Defined in: [src/Types/Events.ts:99](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Types/Events.ts#L99)

#### Type Parameters

• **T** *extends* keyof [`BaileysEventMap`](../type-aliases/BaileysEventMap.md)

#### Parameters

##### event

`T`

#### Returns

`void`
