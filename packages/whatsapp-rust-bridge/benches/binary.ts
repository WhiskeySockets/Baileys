/**
 * What the WABinary path costs on the stanzas the socket actually moves.
 *
 * The encoder and decoder come in by path rather than through the package: the
 * bridge cannot depend on the workspace Baileys, and a copy of the flat
 * assembly here would drift from the one that runs. The baseline is
 * `baileys@7.0.0-rc.9`, the pure TypeScript implementation this replaces.
 *
 * Both sides now hand back the same plain tree, so decode compares directly.
 * That was not true of `decodeNode`, which returns a handle that materializes
 * on access and so reports a decode it has not done; the last section keeps it
 * visible for what it is.
 */
import { bench, boxplot, do_not_optimize, run, summary } from "mitata";
import {
  decodeBinaryNode as decodeOld,
  encodeBinaryNode as encodeOld,
} from "baileys";
import { deflateSync } from "node:zlib";
import { decodeBinaryNode } from "../../baileys/src/WABinary/decode.ts";
import { encodeBinaryNode } from "../../baileys/src/WABinary/encode.ts";
import { decodeNode, type BinaryNode } from "../dist/index.js";

/** `<ack>`, the smallest thing the socket sends and the one it sends most. */
const ack: BinaryNode = {
  tag: "ack",
  attrs: {
    to: "5511900000001@s.whatsapp.net",
    id: "3EB0622825A79604144A",
    class: "message",
  },
};

/** A one to one text message, inbound shape. */
const direct: BinaryNode = {
  tag: "message",
  attrs: {
    from: "5511900000001@s.whatsapp.net",
    id: "3EB0622825A79604144A",
    type: "text",
    t: "1785984009",
    notify: "someone",
  },
  content: [
    { tag: "enc", attrs: { v: "2", type: "msg", count: "0" }, content: new Uint8Array(220).fill(7) },
    { tag: "device-identity", attrs: {}, content: new Uint8Array(64).fill(9) },
  ],
};

/** A device fanout, the shape `createParticipantNodes` builds on every send. */
function fanout(devices: number): BinaryNode {
  return {
    tag: "message",
    attrs: {
      to: "120363021033254949@g.us",
      id: "3EB0622825A79604144A",
      type: "text",
      t: "1785984009",
    },
    content: [
      { tag: "enc", attrs: { v: "2", type: "skmsg", count: "0" }, content: new Uint8Array(256).fill(7) },
      {
        tag: "participants",
        attrs: {},
        content: Array.from({ length: devices }, (_, i) => ({
          tag: "to",
          attrs: { jid: `55119000${String(i).padStart(5, "0")}.${i % 4}@s.whatsapp.net` },
          content: [
            {
              tag: "enc",
              attrs: { v: "2", type: i % 3 === 0 ? "pkmsg" : "msg", count: "0" },
              content: new Uint8Array(96).fill(3),
            },
          ],
        })),
      },
      { tag: "device-identity", attrs: {}, content: new Uint8Array(64).fill(9) },
    ],
  };
}

/** An app state patch, the payload the server sends compressed. */
const appState: BinaryNode = {
  tag: "iq",
  attrs: { from: "@s.whatsapp.net", type: "result", id: "48261745", xmlns: "w:sync:app:state" },
  content: [
    {
      tag: "sync",
      attrs: {},
      content: Array.from({ length: 24 }, (_, i) => ({
        tag: "collection",
        attrs: { name: "regular_high", version: String(i), return_snapshot: "false" },
        content: [{ tag: "patch", attrs: {}, content: new Uint8Array(512).fill(i & 0xff) }],
      })),
    },
  ],
};

/** Sends arrive with a leading 0x02 and the body deflated. */
function compress(frame: Buffer): Buffer {
  return Buffer.concat([Buffer.from([0x02]), deflateSync(frame.subarray(1))]);
}

/** Reads every tag, attribute and leaf, the way the socket eventually does. */
function walk(node: BinaryNode): number {
  let seen = 0;
  do_not_optimize(node.tag);
  for (const key of Object.keys(node.attrs)) {
    do_not_optimize(node.attrs[key]);
    seen++;
  }

  const content = node.content;
  if (Array.isArray(content)) {
    for (const child of content) seen += walk(child as BinaryNode);
  } else if (content) {
    do_not_optimize((content as Uint8Array).length ?? content);
    seen++;
  }

  return seen;
}

const cases: [string, BinaryNode][] = [
  ["ack", ack],
  ["direct", direct],
  ["fanout 8", fanout(8)],
  ["fanout 64", fanout(64)],
  ["app state", appState],
];

// Both decoders get warmed before anything is timed. Without this the first
// case measured absorbs the JIT warm-up for the whole file, which is worth
// around 150ns and lands on whichever stanza happens to be first: it read as
// the small stanza being slower than it is.
for (let i = 0; i < 2000; i++) {
  for (const [, node] of cases) {
    const warm = encodeOld(node) as Buffer;
    do_not_optimize(encodeBinaryNode(node));
    do_not_optimize(await decodeBinaryNode(warm));
    do_not_optimize(await decodeOld(warm));
    do_not_optimize(walk((await decodeOld(warm)) as BinaryNode));
  }
}

for (const [name, node] of cases) {
  const frame = encodeOld(node) as Buffer;
  const packed = compress(frame);

  console.log(`\n--- ${name}: ${frame.length} byte frame, ${packed.length} compressed ---`);

  boxplot(() => {
    summary(() => {
      bench(`encode ${name} (wasm)`, () => {
        do_not_optimize(encodeBinaryNode(node));
      });

      bench(`encode ${name} (js)`, () => {
        do_not_optimize(encodeOld(node));
      });
    });

    summary(() => {
      bench(`decode ${name} (wasm)`, async () => {
        do_not_optimize(await decodeBinaryNode(frame));
      });

      bench(`decode ${name} (js)`, async () => {
        do_not_optimize(await decodeOld(frame));
      });
    });

    summary(() => {
      bench(`decode+walk ${name} (wasm)`, async () => {
        do_not_optimize(walk(await decodeBinaryNode(frame)));
      });

      bench(`decode+walk ${name} (js)`, async () => {
        do_not_optimize(walk((await decodeOld(frame)) as BinaryNode));
      });
    });

    summary(() => {
      bench(`decode ${name} compressed (wasm)`, async () => {
        do_not_optimize(await decodeBinaryNode(packed));
      });

      bench(`decode ${name} compressed (js)`, async () => {
        do_not_optimize(await decodeOld(packed));
      });
    });
  });
}

// The handle API is no longer on the Baileys path. It stays exported, and a
// caller that reads more than a couple of fields pays a crossing per field, so
// keep the cost of a full read on the record.
{
  const frame = encodeOld(fanout(8)) as Buffer;
  boxplot(() => {
    summary(() => {
      bench("decode+walk fanout 8 (wasm flat)", async () => {
        do_not_optimize(walk(await decodeBinaryNode(frame)));
      });

      bench("decode+walk fanout 8 (wasm handle)", () => {
        const handle = decodeNode(frame);
        do_not_optimize(walk(handle as unknown as BinaryNode));
        handle.free();
      });
    });
  });
}

await run();
