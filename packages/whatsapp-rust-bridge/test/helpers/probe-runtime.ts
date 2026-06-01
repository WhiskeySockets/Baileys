import {
  __wasmSimdActive,
  decodeNode,
  encodeNode,
  hkdf,
  md5,
  type BinaryNode,
} from "../../dist/index.js";

const node: BinaryNode = {
  tag: "iq",
  attrs: { id: "abc-123", to: "s.whatsapp.net", type: "get" },
  content: [
    { tag: "ping", attrs: {}, content: undefined },
    { tag: "data", attrs: { fmt: "raw" }, content: new Uint8Array([1, 2, 3, 4, 5]) },
  ],
};

const encoded = encodeNode(node);
const decoded = decodeNode(encoded);

const decodedAttrsOk =
  decoded.tag === "iq" &&
  decoded.attrs.id === "abc-123" &&
  decoded.attrs.to === "s.whatsapp.net" &&
  decoded.attrs.type === "get";

const md5Result = md5(new Uint8Array([0x61, 0x62, 0x63])); // "abc" → 900150983cd24fb0d6963f7d28e17f72
const md5Hex = Array.from(md5Result).map((b) => b.toString(16).padStart(2, "0")).join("");

const hkdfResult = hkdf(new Uint8Array([1, 2, 3]), 32, new Uint8Array(0));

console.log(
  JSON.stringify({
    simdActive: __wasmSimdActive,
    encodedLen: encoded.length,
    decodedTag: decoded.tag,
    decodedAttrsOk,
    md5Hex,
    hkdfLen: hkdfResult.length,
  }),
);
