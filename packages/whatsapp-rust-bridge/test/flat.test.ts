import { describe, expect, it } from "@jest/globals";
import {
  decodeNode,
  decodeNodeFlat,
  encodeNode,
  encodeNodeFlat,
  tokenTable,
  type BinaryNode,
  type FlatNode,
} from "../dist/index.js";
import {
  decodeBinaryNode as legacyDecode,
  encodeBinaryNode as legacyEncode,
} from "./helpers/legacy-wire";

/**
 * The flat codec is the only path Baileys takes, and it hands its sections
 * back as borrowed views into WASM memory rather than as copies. Nothing
 * covered it before, so these pin both what it produces and the borrow window
 * that makes it fast.
 *
 * Frames for the structural cases come from the bridge's own encoder, which
 * `parity.test.ts` already holds against recorded rc.9 output; the parity case
 * here uses a recorded stanza directly.
 */
const TOKEN_BASE = 1 << 24;
const TOKENS = tokenTable() as (string | undefined)[];

/** Mirrors the assembly in Baileys, which is the only consumer. */
function build(flat: FlatNode): BinaryNode {
  const { bytes, words, stringsAt, offsetsAt, offsetCount, blobsAt, blobBytes } =
    flat;

  const pool: string[] = [];
  for (let i = 0; i < offsetCount - 1; i++) {
    pool.push(
      bytes.toString(
        "utf8",
        stringsAt + words[offsetsAt + i]!,
        stringsAt + words[offsetsAt + i + 1]!
      )
    );
  }

  const blobs = blobBytes
    ? Buffer.from(bytes.subarray(blobsAt, blobsAt + blobBytes))
    : bytes;
  const str = (index: number) =>
    index >= TOKEN_BASE ? TOKENS[index - TOKEN_BASE]! : pool[index]!;

  let cursor = flat.layoutAt;
  const read = (): BinaryNode => {
    const tag = str(words[cursor++]!);
    const attrCount = words[cursor++]!;
    const attrs: { [key: string]: string } = {};
    for (let i = 0; i < attrCount; i++) {
      attrs[str(words[cursor++]!)] = str(words[cursor++]!);
    }

    const kind = words[cursor++];
    let content: BinaryNode["content"];
    if (kind === 1) {
      const at = words[cursor++]!;
      content = blobs.subarray(at, at + words[cursor++]!);
    } else if (kind === 2) {
      content = str(words[cursor++]!);
    } else if (kind === 3) {
      const count = words[cursor++]!;
      content = Array.from({ length: count }, () => read());
    }

    return { tag, attrs, content };
  };

  return read();
}

const frameOf = (node: BinaryNode) => (encodeNode(node) as Uint8Array).subarray(1);
const roundTrip = (node: BinaryNode) => build(decodeNodeFlat(frameOf(node)));

/** The strings a decode had to ship, which is what interning is there to cut. */
function poolOf(flat: FlatNode): string[] {
  const out: string[] = [];
  for (let i = 0; i < flat.offsetCount - 1; i++) {
    out.push(
      flat.bytes.toString(
        "utf8",
        flat.stringsAt + flat.words[flat.offsetsAt + i]!,
        flat.stringsAt + flat.words[flat.offsetsAt + i + 1]!
      )
    );
  }

  return out;
}

/** A stanza `legacy-wire-vectors.json` already holds rc.9 output for. */
const recorded: BinaryNode = {
  tag: "message",
  attrs: {
    from: "559984726662@s.whatsapp.net",
    type: "text",
    id: "A14AFA49C4D9AEDA69F01ADDF2289D71",
    category: "peer",
    t: "1764814152",
  },
  content: [
    { tag: "meta", attrs: { appdata: "default" } },
    {
      tag: "enc",
      attrs: { v: "2", type: "pkmsg" },
      content: Buffer.from(
        "331221 05e61413ed86dae878cd6fbd799d58613dc565cd8637312c3eaa2aa0bdd088b470".replace(/ /g, ""),
        "hex"
      ),
    },
  ],
};

describe("flat codec", () => {
  it("decodes a recorded stanza to what rc.9 decoded it to", async () => {
    const frame = legacyEncode(recorded) as Uint8Array;
    const mine = build(decodeNodeFlat(frame.subarray(1)));

    expect(JSON.parse(JSON.stringify(mine))).toEqual(
      JSON.parse(JSON.stringify(await legacyDecode(frame)))
    );
  });

  it("round trips each content kind", () => {
    expect(roundTrip({ tag: "a", attrs: {} }).content).toBeUndefined();
    // The wire format has no string leaf for arbitrary text, only for tokens,
    // so text comes back as its bytes. Round tripping it has to preserve them.
    expect(
      Buffer.from(
        roundTrip({ tag: "a", attrs: {}, content: "olá, acentuação" })
          .content as Uint8Array
      ).toString("utf8")
    ).toBe("olá, acentuação");
    expect(
      Buffer.from(
        roundTrip({ tag: "a", attrs: {}, content: Buffer.from("bytes") })
          .content as Uint8Array
      ).toString()
    ).toBe("bytes");
    expect(
      (
        roundTrip({ tag: "a", attrs: {}, content: [{ tag: "b", attrs: {} }] })
          .content as BinaryNode[]
      )[0]!.tag
    ).toBe("b");
  });

  it("refers to known tags by token index rather than shipping their bytes", () => {
    // `message` and `type` are tokens; the jid is not. Only the jid reaches
    // the string pool, which is what keeps the pool small on real stanzas.
    const flat = decodeNodeFlat(
      frameOf({
        tag: "message",
        attrs: { type: "text", from: "5511900000001@s.whatsapp.net" },
      })
    );

    expect(poolOf(flat)).toEqual(["5511900000001@s.whatsapp.net"]);
    expect(flat.words[flat.layoutAt]).toBeGreaterThanOrEqual(TOKEN_BASE);
  });

  it("gives a repeated value one pool entry", () => {
    const repeated = "regular_high_not_a_token";
    const flat = decodeNodeFlat(
      frameOf({
        tag: "sync",
        attrs: {},
        content: [1, 2, 3].map(i => ({
          tag: "collection",
          attrs: { name: repeated, version: String(i) },
        })),
      })
    );

    // Three collections carry the same name. `collection`, `name`, `version`
    // and the versions themselves are all tokens, so the name is the only
    // thing the pool has to hold, and it holds it once.
    expect(poolOf(flat)).toEqual([repeated]);
  });

  it("keeps deduplicating after a decode that grew the table", () => {
    const repeated = "a_value_that_is_not_a_token";
    decodeNodeFlat(
      frameOf({
        tag: "sync",
        attrs: {},
        content: Array.from({ length: 64 }, (_, i) => ({
          tag: "c",
          attrs: { k: `distinct_value_${i}` },
        })),
      })
    );

    // Entries age out by round rather than being cleared, so a stale hit from
    // the wide decode must not be mistaken for this decode's own.
    const flat = decodeNodeFlat(
      frameOf({
        tag: "sync",
        attrs: {},
        content: [1, 2].map(() => ({ tag: "c", attrs: { k: repeated } })),
      })
    );

    // `k` is not a token, so it lands in the pool alongside the value; both
    // appear twice in the stanza and once here.
    expect(poolOf(flat)).toEqual(["k", repeated]);
    expect((build(flat).content as BinaryNode[]).map(child => child.attrs.k)).toEqual([
      repeated,
      repeated,
    ]);
  });

  it("reuses the sections, so a read has to happen before the next call", () => {
    const first = decodeNodeFlat(frameOf({ tag: "a", attrs: { x: "first_value" } }));
    const tree = build(first);

    const second = decodeNodeFlat(frameOf({ tag: "b", attrs: { y: "second_value" } }));

    // The same object comes back, now describing the second frame.
    expect(second).toBe(first);
    expect(build(second).tag).toBe("b");
    // What was read out beforehand is unaffected.
    expect(tree).toEqual({ tag: "a", attrs: { x: "first_value" }, content: undefined });
  });

  it("hands back byte content that survives later decodes", () => {
    const payload = Buffer.alloc(256, 0xab);
    const held = build(decodeNodeFlat(frameOf({ tag: "a", attrs: {}, content: payload })))
      .content as Buffer;

    for (let i = 0; i < 8; i++) {
      decodeNodeFlat(frameOf({ tag: "b", attrs: {}, content: Buffer.alloc(4096, i) }));
    }

    expect(Buffer.compare(held, payload)).toBe(0);
  });

  it("owns the frame it encodes", () => {
    const node: BinaryNode = { tag: "a", attrs: {}, content: Buffer.alloc(64, 1) };
    const first = encodeNodeFlat(flatten(node));

    encodeNodeFlat(flatten({ tag: "z", attrs: {}, content: Buffer.alloc(4096, 9) }));

    // Unlike a decode, the frame outlives the call: the socket holds it.
    expect(Buffer.compare(first, Buffer.from(encodeNode(node) as Uint8Array))).toBe(0);
  });

  it("rejects a frame it cannot parse", () => {
    expect(() => decodeNodeFlat(new Uint8Array(0))).toThrow();
    expect(() => decodeNodeFlat(Uint8Array.from([0xff, 0xff, 0xff]))).toThrow();
    expect(() => encodeNodeFlat(new Uint8Array(4))).toThrow();
  });
});

/** The buffer shape `encodeNodeFlat` reads, mirroring the Baileys encoder. */
function flatten(root: BinaryNode): Buffer {
  const layout: number[] = [];
  const strings: Buffer[] = [];
  const offsets = [0];
  const blobs: Buffer[] = [];
  let stringLen = 0;
  let blobLen = 0;

  const intern = (value: string) => {
    const index = offsets.length - 1;
    const bytes = Buffer.from(value, "utf8");
    strings.push(bytes);
    stringLen += bytes.length;
    offsets.push(stringLen);
    return index;
  };

  const push = (node: BinaryNode) => {
    layout.push(intern(node.tag));
    const keys = Object.keys(node.attrs);
    layout.push(keys.length);
    for (const key of keys) layout.push(intern(key), intern(String(node.attrs[key])));

    const content = node.content;
    if (content === undefined || content === null) layout.push(0);
    else if (typeof content === "string") layout.push(2, intern(content));
    else if (Array.isArray(content)) {
      layout.push(3, content.length);
      for (const child of content) push(child);
    } else {
      const bytes = Buffer.isBuffer(content) ? content : Buffer.from(content);
      layout.push(1, blobLen, bytes.length);
      blobs.push(bytes);
      blobLen += bytes.length;
    }
  };

  push(root);

  const pad = (4 - (stringLen % 4)) % 4;
  const out = Buffer.allocUnsafe(
    16 + stringLen + pad + offsets.length * 4 + layout.length * 4 + blobLen
  );
  out.writeUInt32LE(stringLen, 0);
  out.writeUInt32LE(offsets.length, 4);
  out.writeUInt32LE(layout.length, 8);
  out.writeUInt32LE(blobLen, 12);

  let at = 16;
  for (const bytes of strings) {
    bytes.copy(out, at);
    at += bytes.length;
  }

  out.fill(0, at, at + pad);
  at += pad;
  for (const offset of offsets) {
    out.writeUInt32LE(offset, at);
    at += 4;
  }

  for (const value of layout) {
    out.writeUInt32LE(value >>> 0, at);
    at += 4;
  }

  for (const bytes of blobs) {
    bytes.copy(out, at);
    at += bytes.length;
  }

  return out;
}

describe("flat codec regressions", () => {
  it("keeps the `@` on a server-only jid", () => {
    // The core renders a jid with no user as a bare server name. Callers match
    // `@s.whatsapp.net`, and the prekey-count notification is routed by that
    // comparison, so dropping the `@` sends it down the identity-change branch.
    const frame = frameOf({ tag: "iq", attrs: { from: "@s.whatsapp.net", type: "result" } });
    expect(build(decodeNodeFlat(frame)).attrs.from).toBe("@s.whatsapp.net");
    expect(decodeNode(encodeNode({ tag: "iq", attrs: { from: "@s.whatsapp.net" } })).attrs.from).toBe(
      "@s.whatsapp.net"
    );
  });

  it("leaves a bare server name alone, since it is a token and not a pair", () => {
    const frame = frameOf({ tag: "iq", attrs: { to: "s.whatsapp.net" } });
    expect(build(decodeNodeFlat(frame)).attrs.to).toBe("s.whatsapp.net");
  });

  it("rejects a header whose section length overflows", () => {
    const buf = Buffer.alloc(64);
    buf.writeUInt32LE(0, 0);
    // On wasm32 a count this large wraps when multiplied by four, so a bounds
    // check on the wrapped span would pass and the section would then be read
    // far past the buffer.
    buf.writeUInt32LE(0x40000001, 4);
    buf.writeUInt32LE(1, 8);
    buf.writeUInt32LE(0, 12);
    expect(() => encodeNodeFlat(buf)).toThrow();

    const layoutOverflow = Buffer.alloc(64);
    layoutOverflow.writeUInt32LE(0, 0);
    layoutOverflow.writeUInt32LE(1, 4);
    layoutOverflow.writeUInt32LE(0x40000001, 8);
    layoutOverflow.writeUInt32LE(0, 12);
    expect(() => encodeNodeFlat(layoutOverflow)).toThrow();
  });

  it("serializes what a setter wrote, not what was parsed", () => {
    const handle = decodeNode(encodeNode({ tag: "a", attrs: { x: "1" }, content: "hi" }));
    handle.attrs = { x: "written" } as never;
    handle.content = "written" as never;

    // The getters already reported the new values; `toJSON` walked the parsed
    // node and reported the old ones, so `JSON.stringify` saw a stale tree.
    expect(JSON.parse(JSON.stringify(handle))).toEqual({
      tag: "a",
      attrs: { x: "written" },
      content: "written",
    });
  });

  it("still serializes the parsed node when nobody wrote to it", () => {
    const handle = decodeNode(encodeNode({ tag: "a", attrs: { x: "1" }, content: "hi" }));
    const json = handle.toJSON() as { tag: string; attrs: Record<string, string> };
    expect(json.tag).toBe("a");
    expect(json.attrs).toEqual({ x: "1" });
  });
});
