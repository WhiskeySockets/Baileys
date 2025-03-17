# Function: aesEncryptGCM()

> **aesEncryptGCM**(`plaintext`, `key`, `iv`, `additionalData`): `Buffer`\<`ArrayBuffer`\>

Defined in: [src/Utils/crypto.ts:57](https://github.com/WhiskeySockets/Baileys/blob/2fdabb7f387029b680a2c5e056c7022c25b0f110/src/Utils/crypto.ts#L57)

encrypt AES 256 GCM;
where the tag tag is suffixed to the ciphertext

## Parameters

### plaintext

`Uint8Array`

### key

`Uint8Array`

### iv

`Uint8Array`

### additionalData

`Uint8Array`

## Returns

`Buffer`\<`ArrayBuffer`\>
