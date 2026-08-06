/**
 * What decoding a stanza costs end to end, which is the question the WABinary
 * migration turns on.
 *
 * The existing binary bench measures `decodeNode` alone, where WASM wins, and a
 * partial touch of the result. Neither is what the socket does: it walks the
 * whole tree of every stanza it receives. A handle that materializes lazily
 * moves that cost out of the decode and into the walk, so only measuring both
 * together compares like with like.
 */
import { bench, boxplot, do_not_optimize, run, summary } from "mitata";
import { decodeBinaryNode, encodeBinaryNode } from "baileys";
import { decodeNode, decodeNodeFlat, encodeNode, type BinaryNode } from "../dist/index.js";

/** A group message stanza, the shape the receive path sees most. */
function stanza(participants: number): BinaryNode {
  return {
    tag: "message",
    attrs: {
      from: "120363021033254949@g.us",
      participant: "5511900000001@s.whatsapp.net",
      id: "3EB0622825A79604144A",
      type: "text",
      t: "1785984009",
      notify: "someone",
    },
    content: [
      {
        tag: "enc",
        attrs: { v: "2", type: "skmsg", count: "0" },
        content: new Uint8Array(256).fill(7),
      },
      {
        tag: "participants",
        attrs: {},
        content: Array.from({ length: participants }, (_, i) => ({
          tag: "to",
          attrs: { jid: `55119000${String(i).padStart(5, "0")}@s.whatsapp.net` },
          content: [
            {
              tag: "enc",
              attrs: { v: "2", type: i % 3 === 0 ? "pkmsg" : "msg" },
              content: new Uint8Array(96).fill(3),
            },
          ],
        })),
      },
      { tag: "device-identity", attrs: {}, content: new Uint8Array(64).fill(9) },
    ],
  };
}

/** Assembles the tree from the single buffer the bridge hands over. */
function buildFromFlat(buf: Uint8Array): BinaryNode {
  const header = new Uint32Array(buf.buffer, buf.byteOffset, 4);
  const stringBytes = header[0]!;
  const offsetCount = header[1]!;
  const layoutCount = header[2]!;

  let at = 16;
  const strings = Buffer.from(buf.buffer, buf.byteOffset + at, stringBytes);
  at += stringBytes;
  at += (4 - (at % 4)) % 4;
  const offsets = new Uint32Array(buf.buffer, buf.byteOffset + at, offsetCount);
  at += offsetCount * 4;
  const layout = new Uint32Array(buf.buffer, buf.byteOffset + at, layoutCount);
  at += layoutCount * 4;
  const blobs = Buffer.from(buf.buffer, buf.byteOffset + at, buf.byteLength - at);

  const pool = new Array<string>(offsetCount - 1);
  for (let i = 0; i < pool.length; i++) {
    pool[i] = strings.toString("utf8", offsets[i], offsets[i + 1]);
  }

  let cursor = 0;
  const read = (): BinaryNode => {
    const tag = pool[layout[cursor++]!]!;
    const attrCount = layout[cursor++]!;
    const attrs: Record<string, string> = {};
    for (let i = 0; i < attrCount; i++) {
      attrs[pool[layout[cursor++]!]!] = pool[layout[cursor++]!]!;
    }

    const kind = layout[cursor++];
    let content: BinaryNode["content"];
    if (kind === 1) {
      const off = layout[cursor++]!;
      content = blobs.subarray(off, off + layout[cursor++]!);
    } else if (kind === 2) {
      content = pool[layout[cursor++]!]!;
    } else if (kind === 3) {
      const n = layout[cursor++]!;
      const children = new Array<BinaryNode>(n);
      for (let i = 0; i < n; i++) children[i] = read();
      content = children;
    }

    return { tag, attrs, content };
  };

  return read();
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

for (const participants of [1, 8, 64]) {
  const node = stanza(participants);
  const frame = encodeBinaryNode(node) as Uint8Array;

  console.log(`\n--- ${participants} participant(s), ${frame.length} byte frame ---`);

  boxplot(() => {
    summary(() => {
      bench(`js: decode + walk (${participants}p)`, async () => {
        const decoded = (await decodeBinaryNode(frame)) as BinaryNode;
        do_not_optimize(walk(decoded));
      });

      bench(`wasm getters: decode + walk (${participants}p)`, () => {
        const handle = decodeNode(frame);
        do_not_optimize(walk(handle as unknown as BinaryNode));
      });

      bench(`wasm toJSON: decode + walk (${participants}p)`, () => {
        const handle = decodeNode(frame);
        do_not_optimize(walk(handle.toJSON() as BinaryNode));
      });

      bench(`wasm flat: decode + walk (${participants}p)`, () => {
        do_not_optimize(walk(buildFromFlat(decodeNodeFlat(frame))));
      });

      bench(`wasm getters + free (${participants}p)`, () => {
        const handle = decodeNode(frame);
        do_not_optimize(walk(handle as unknown as BinaryNode));
        handle.free();
      });
    });
  });

  boxplot(() => {
    summary(() => {
      bench(`js: encode (${participants}p)`, () => {
        do_not_optimize(encodeBinaryNode(node));
      });

      bench(`wasm: encode (${participants}p)`, () => {
        do_not_optimize(encodeNode(node));
      });
    });
  });
}

await run();
