# Variable: Curve

> `const` **Curve**: `object`

Defined in: [src/Utils/crypto.ts:16](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/crypto.ts#L16)

## Type declaration

### generateKeyPair()

> **generateKeyPair**: () => [`KeyPair`](../type-aliases/KeyPair.md)

#### Returns

[`KeyPair`](../type-aliases/KeyPair.md)

### sharedKey()

> **sharedKey**: (`privateKey`, `publicKey`) => `Buffer`\<`any`\>

#### Parameters

##### privateKey

`Uint8Array`

##### publicKey

`Uint8Array`

#### Returns

`Buffer`\<`any`\>

### sign()

> **sign**: (`privateKey`, `buf`) => `any`

#### Parameters

##### privateKey

`Uint8Array`

##### buf

`Uint8Array`

#### Returns

`any`

### verify()

> **verify**: (`pubKey`, `message`, `signature`) => `boolean`

#### Parameters

##### pubKey

`Uint8Array`

##### message

`Uint8Array`

##### signature

`Uint8Array`

#### Returns

`boolean`
