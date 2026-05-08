import {
  __wasmSimdActive,
  decodeNode,
  encodeNode,
  type BinaryNode,
} from "../../dist/index.js";

const node: BinaryNode = {
  tag: "message",
  attrs: {
    to: "5511999999999@s.whatsapp.net",
    from: "5511888888888-1@g.us",
    id: "ABCDEF1234567890",
    type: "text",
    t: "1700000000",
  },
  content: [
    {
      tag: "conversation",
      attrs: {},
      content: "Hello, mundo! Acentos: ção, ã, é, ü.",
    },
    {
      tag: "raw",
      attrs: { kind: "binary" },
      content: new Uint8Array([0xff, 0x00, 0x7f, 0x80, 0x12, 0x34, 0x56, 0x78]),
    },
  ],
};

const enc = encodeNode(node);
const dec = decodeNode(enc);

const hex = Array.from(enc)
  .map((b) => b.toString(16).padStart(2, "0"))
  .join("");

// Stable JSON of decoded structure (Uint8Array → hex for deterministic output).
function normalize(n: BinaryNode): unknown {
  return {
    tag: n.tag,
    attrs: n.attrs,
    content:
      typeof n.content === "string"
        ? { kind: "string", value: n.content }
        : n.content instanceof Uint8Array
          ? {
              kind: "bytes",
              value: Array.from(n.content)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join(""),
            }
          : Array.isArray(n.content)
            ? { kind: "children", value: n.content.map(normalize) }
            : { kind: "none" },
  };
}

console.log(
  JSON.stringify({
    simd: __wasmSimdActive,
    encHex: hex,
    decoded: normalize(dec),
  }),
);
