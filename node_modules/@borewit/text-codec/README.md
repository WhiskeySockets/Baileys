[![CI](https://github.com/Borewit/text-codec/actions/workflows/ci.yml/badge.svg)](https://github.com/Borewit/text-codec/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/%40borewit%2Ftext-codec.svg)](https://www.npmjs.com/package/@borewit/text-codec)
[![npm downloads](http://img.shields.io/npm/dm/@borewit/text-codec.svg)](https://npmcharts.com/compare/@borewit/text-codec?interval=30)
![bundlejs](https://deno.bundlejs.com/?q=@borewit/text-codec&badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?logo=open-source-initiative&logoColor=white)](LICENSE.txt)

# `@borewit/text-codec`

A **lightweight alternative implementation** of `TextEncoder` / `TextDecoder` supporting common encodings missing in some JavaScript engines and Node.js builds.  
Works in environments like **Hermes** (React Native) or **Small-ICU Node.js** where only UTF-8 and UTF-16LE are available.

| Encoding                  | Hermes — **Encode** | Hermes — **Decode** | Small-ICU Node.js — **Encode** | Small-ICU Node.js — **Decode** |
|---------------------------|---------------------|---------------------|--------------------------------|--------------------------------|
| **utf-8** / `utf8`        | ➕                   | Native              | Native                         | Native                         |
| **utf-16le**              | ➕                   | ➕                   | Native                         | Native                         |
| **ascii**                 | ➕                   | ➕                   | ➕                              | ➕                              |
| **latin1** / `iso-8859-1` | ➕                   | ➕                   | ➕                              | Native (sometimes)             |
| **windows-1252**          | ➕                   | ➕                   | ➕                              | ➕                              |

**Legend:**
- **Native** — Supported natively by the JavaScript engine.
- **➕** — Support added by this module.
- **Native (sometimes)** — Available in some builds (e.g., certain Small-ICU Node.js builds).
---

When your project needs to handle encodings like `latin1` / `iso-8859-1` or `windows-1252` in these environments,
native `TextDecoder` / `TextEncoder` may throw an error or return incorrect results.

## ✨ Features

- Decoding and encoding
- Lightweight
- Typed

### Supported encodings:
- `utf-8` / `utf8`
- `utf-16le`
- `ascii`
- `latin1` / `iso-8859-1`
- `windows-1252`

---

## 📦 Installation

```sh
npm install @borewit/text-codec
```


# 📚 API Documentation

## `textDecode(bytes, encoding): string`

Decodes binary data into a JavaScript string using the specified encoding.

**Parameters**
- `bytes` (`Uint8Array`) — The binary data to decode.
- `encoding` (`SupportedEncoding`, optional) — Encoding type. Defaults to `"utf-8"`.  

**Returns**
- `string` — The decoded text.

**Example**
```js
import { textDecode } from "@borewit/text-encode";

const bytes = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
const text = textDecode(bytes, "ascii");
console.log(text); // "Hello"
```
Encodes a JavaScript string into binary form using the specified encoding.

## `textEncode(input, encoding): Uint8Array`

**Parameters**

- `input` (`string`) — The string to encode.
- `encoding` (`SupportedEncoding`, optional) — Encoding type. Defaults to `"utf-8"`.

**Returns**

`Uint8Array` — The encoded binary data.

Example:
```js
import { textEncode } from "@borewit/text-encode";

const bytes = textEncode("Hello", "utf-16le");
console.log(bytes); // Uint8Array([...])
```

## 📜 Licence

This project is licensed under the [MIT License](LICENSE.txt). Feel free to use, modify, and distribute as needed.
 