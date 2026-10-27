import { decodeNode, encodeNode, type BinaryNode } from "../dist/index.js";
import { run, bench, do_not_optimize, boxplot, summary } from "mitata";
import {
  encodeBinaryNode as encodeBinaryNodeOld,
  decodeBinaryNode as decodeBinaryNodeOld,
} from "baileys";
import { deflateSync } from "node:zlib";

const testNode: BinaryNode = {
  tag: "message",
  attrs: {
    to: "1234567890@s.whatsapp.net",
    from: "1234567890-123456@g.us",
    participant: "2345678901@s.whatsapp.net",
    id: "3EB0622825A79604144A",
    type: "text",
    t: String(Math.floor(Date.now() / 1000)),
  },
  content: [
    {
      tag: "conversation",
      attrs: {},
      content:
        "Hello from a benchmark test! This is a slightly longer message to ensure the test is not trivial.",
    },
    {
      tag: "ephemeral_setting",
      attrs: {
        timestamp: String(Date.now()),
        expiration: "604800",
      },
      content: undefined,
    },
  ],
};

const legacyEncoded = encodeBinaryNodeOld(testNode);
const compressedEncoded = Buffer.concat([
  Buffer.from([0x02]),
  deflateSync(legacyEncoded.subarray(1)),
]);

const touchHotPath = (node: BinaryNode) => {
  const attrs = node.attrs;
  do_not_optimize(attrs.id);
  do_not_optimize(attrs.from);
  do_not_optimize(attrs.participant);

  const content = node.content;
  if (Array.isArray(content)) {
    const first = content[0];
    if (first) {
      do_not_optimize(first.tag);
      const firstAttrs = first.attrs;
      do_not_optimize(firstAttrs);
      do_not_optimize(first.content);
    }
    const second = content[1];
    if (second) {
      const secondAttrs = second.attrs;
      do_not_optimize(secondAttrs.timestamp);
      do_not_optimize(secondAttrs.expiration);
      do_not_optimize(second.content);
    }
  } else {
    do_not_optimize(content);
  }

  const attrsAgain = node.attrs;
  do_not_optimize(attrsAgain.id);
  const contentAgain = node.content;
  do_not_optimize(contentAgain);
  const attrsThird = node.attrs;
  do_not_optimize(attrsThird.from);
};

boxplot(() => {
  summary(() => {
    bench("encodeNode Rust WASM", () => {
      const result = encodeNode(testNode);
      do_not_optimize(result);
    }).gc("inner");

    bench("encodeNode Old Baileys", () => {
      const result = encodeBinaryNodeOld(testNode);
      do_not_optimize(result);
    }).gc("inner");
  });

  summary(() => {
    bench("decodeNode Rust WASM", () => {
      const handle = decodeNode(legacyEncoded);
      do_not_optimize(handle);
    }).gc("inner");

    bench("decodeNode Old Baileys", async () => {
      const handle = await decodeBinaryNodeOld(legacyEncoded);
      do_not_optimize(handle);
    }).gc("inner");
  });

  summary(() => {
    bench("decode and attrs Rust WASM", () => {
      const handle = decodeNode(legacyEncoded);
      touchHotPath(handle);
    }).gc("inner");

    bench("decode and attrs Old Baileys", async () => {
      const handle = await decodeBinaryNodeOld(legacyEncoded);
      touchHotPath(handle);
    }).gc("inner");
  });

  summary(() => {
    bench("decode and attrs (compressed) Rust WASM", () => {
      const handle = decodeNode(compressedEncoded);
      touchHotPath(handle);
    }).gc("inner");

    bench("decode and attrs (compressed) Old Baileys", async () => {
      const handle = await decodeBinaryNodeOld(compressedEncoded);
      touchHotPath(handle);
    }).gc("inner");
  });
});

await run();
