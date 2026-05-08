import { describe, test, expect } from "bun:test";
import { encodeNode, decodeNode, type BinaryNode } from "../dist";

function arraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function compareINodeToDecoded(
  original: BinaryNode,
  decoded: BinaryNode,
): boolean {
  const decTag = decoded.tag;
  if (original.tag !== decTag) return false;

  // attrs
  const origAttrs = original.attrs;
  const decAttrs = decoded.attrs;
  const origKeys = Object.keys(origAttrs);
  const decKeys = Object.keys(decAttrs);
  if (origKeys.length !== decKeys.length) return false;
  for (const key of origKeys) {
    if (!(key in decAttrs) || decAttrs[key] !== origAttrs[key]) return false;
  }

  // content
  const textDecoder = new TextDecoder();
  const decContent = decoded.content;
  if (original.content === undefined) {
    if (decContent !== undefined) return false;
  } else if (typeof original.content === "string") {
    if (!(decContent instanceof Uint8Array)) return false;
    const decodedText = textDecoder.decode(decContent);
    if (decodedText !== original.content) return false;
  } else if (original.content instanceof Uint8Array) {
    if (!(decContent instanceof Uint8Array)) return false;
    if (!arraysEqual(decContent, original.content)) return false;
  }

  const origChildren = Array.isArray(original.content) ? original.content : [];
  const decChildren = Array.isArray(decoded.content) ? decoded.content : [];
  if (origChildren.length !== decChildren.length) return false;
  for (let i = 0; i < origChildren.length; i++) {
    if (!compareINodeToDecoded(origChildren[i], decChildren[i])) return false;
  }

  return true;
}

describe("Binary Marshalling", () => {
  const attributesNode: BinaryNode = {
    tag: "iq",
    attrs: {
      to: "s.whatsapp.net",
      type: "get",
      xmlns: "test-xmlns",
      id: "test-123",
    },
    content: [
      {
        tag: "query",
        attrs: {},
      },
    ],
  };

  test("should correctly encode and decode a node with attributes and children", () => {
    const binaryData = encodeNode(attributesNode);
    expect(binaryData).toBeInstanceOf(Uint8Array);
    expect(binaryData.length).toBeGreaterThan(0);

    const resultHandle: BinaryNode = decodeNode(binaryData);

    expect(resultHandle).toBeInstanceOf(Object);
    expect(resultHandle.tag).toBe("iq");

    const attrs = resultHandle.attrs;
    expect(attrs).toBeInstanceOf(Object);
    expect(Object.keys(attrs)).toHaveLength(4);
    expect(attrs["xmlns"]).toBe("test-xmlns");
    expect(attrs["to"]).toBe("s.whatsapp.net");
    expect(attrs["nonexistent"]).toBeUndefined();

    const children = resultHandle.content;
    expect(Array.isArray(children)).toBe(true);
    expect(children).toHaveLength(1);
    if (Array.isArray(children)) {
      expect(children[0]?.tag).toBe("query");
    }
  });

  describe("Content Encoding Parity", () => {
    const textDecoder = new TextDecoder();

    test("should encode a JS string as string content and decode it back", () => {
      const node: BinaryNode = {
        tag: "message",
        attrs: {},
        content: "this is a simple string",
      };

      const binaryData = encodeNode(node);
      const resultHandle = decodeNode(binaryData);

      expect(resultHandle.content).toBeInstanceOf(Uint8Array);
      const decodedText = textDecoder.decode(
        resultHandle.content as Uint8Array,
      );
      expect(decodedText).toBe("this is a simple string");
    });

    test("should encode a Uint8Array as binary content and decode it back", () => {
      const binaryPayload = new Uint8Array([10, 20, 30, 250]);
      const node: BinaryNode = {
        tag: "message",
        attrs: {},
        content: binaryPayload,
      };

      const binaryData = encodeNode(node);
      const resultHandle = decodeNode(binaryData);

      expect(resultHandle.content).toBeInstanceOf(Uint8Array);
      expect(resultHandle.content).toEqual(binaryPayload);
    });

    test("should correctly handle a string that is a known token", () => {
      const node: BinaryNode = {
        tag: "message",
        attrs: {},
        content: "receipt",
      };

      const binaryData = encodeNode(node);
      const resultHandle = decodeNode(binaryData);

      expect(resultHandle.content).toBe("receipt");
      expect(binaryData.length).toBeLessThan(10);
    });

    test("should NOT confuse a byte array with a token string", () => {
      const textEncoder = new TextEncoder();
      const binaryPayload = textEncoder.encode("receipt");

      const node: BinaryNode = {
        tag: "message",
        attrs: {},
        content: binaryPayload,
      };

      const binaryData = encodeNode(node);
      const resultHandle = decodeNode(binaryData);

      expect(resultHandle.content).toBeInstanceOf(Uint8Array);
      expect(resultHandle.content).toEqual(binaryPayload);

      expect(binaryData.length).toBeGreaterThan(5);
    });
  });
});

test("should round-trip encode and decode correctly", () => {
  const node: BinaryNode = {
    tag: "message",
    attrs: { id: "123", type: "text" },
    content: "hello world",
  };

  const binaryData = encodeNode(node);
  const decoded = decodeNode(binaryData);

  expect(compareINodeToDecoded(node, decoded)).toBe(true);
});

test("should round-trip encode and decode node with children correctly", () => {
  const node: BinaryNode = {
    tag: "iq",
    attrs: {
      to: "s.whatsapp.net",
      type: "get",
      xmlns: "test-xmlns",
      id: "test-123",
    },
    content: [
      {
        tag: "query",
        attrs: {},
      },
    ],
  };

  const binaryData = encodeNode(node);
  const decoded = decodeNode(binaryData);

  expect(compareINodeToDecoded(node, decoded)).toBe(true);
});

test("should throw error when decoding truncated binary data", () => {
  const node: BinaryNode = {
    tag: "message",
    attrs: {},
    content: "receipt",
  };

  const binaryData = encodeNode(node);
  expect(binaryData.length).toBe(5); // [0, 248, 2, 19, 7]

  // Truncate to 3 bytes
  const truncatedData = binaryData.slice(0, 3);

  expect(() => decodeNode(truncatedData)).toThrow(
    "Unexpected end of binary data",
  );
});

test("should allow attrs mutation and reassignment", () => {
  const original: BinaryNode = { tag: "test", attrs: { foo: "bar" } };
  const binary = encodeNode(original);
  const node = decodeNode(binary);

  node.attrs.baz = "qux";
  expect(node.attrs.baz).toBe("qux");

  node.attrs = { hello: "world" };
  expect(node.attrs.foo).toBeUndefined();
  expect(node.attrs.hello).toBe("world");

  const reencoded = encodeNode(node);
  const roundtrip = decodeNode(reencoded);
  expect(roundtrip.attrs.hello).toBe("world");
});

test("should allow content mutation and reassignment", () => {
  const original: BinaryNode = {
    tag: "patch",
    attrs: {},
    content: [{ tag: "item", attrs: {}, content: "old" }],
  };
  const binary = encodeNode(original);
  const node = decodeNode(binary);

  (node.content as BinaryNode[]).push({
    tag: "new-item",
    attrs: {},
    content: "added",
  });
  expect((node.content as BinaryNode[]).length).toBe(2);
  expect((node.content as BinaryNode[])[1].content).toBe("added");

  node.content = "replaced with string";
  expect(typeof node.content).toBe("string");
  expect(node.content).toBe("replaced with string");

  node.content = [
    { tag: "final", attrs: {}, content: new Uint8Array([1, 2, 3]) },
  ];
  expect((node.content as BinaryNode[])[0].content).toBeInstanceOf(Uint8Array);

  const reencoded = encodeNode(node);
  const roundtrip = decodeNode(reencoded);
  expect(Array.isArray(roundtrip.content)).toBe(true);
  expect((roundtrip.content as BinaryNode[])[0].tag).toBe("final");
  expect((roundtrip.content as BinaryNode[])[0].content).toEqual(
    new Uint8Array([1, 2, 3]),
  );
});

test("should handle binary content reassignment", () => {
  const binContent = new Uint8Array([10, 20, 30]);
  const node: BinaryNode = { tag: "enc", attrs: {}, content: binContent };
  const binary = encodeNode(node);
  const decoded = decodeNode(binary);

  decoded.content = new Uint8Array([40, 50, 60]);
  expect(decoded.content).toEqual(new Uint8Array([40, 50, 60]));

  const reencoded = encodeNode(decoded);
  const roundtrip = decodeNode(reencoded);
  expect(roundtrip.content).toEqual(new Uint8Array([40, 50, 60]));
});

test("should handle non-string attribute values during encoding (lenient conversion)", () => {
  const original: BinaryNode = {
    tag: "test-node",
    attrs: {
      // @ts-ignore
      id: 123,
      // @ts-ignore
      active: true,
      // @ts-ignore
      inactive: false,
      version: "1.0",
      // @ts-ignore
      foo: null,
      // @ts-ignore
      bar: undefined,
    },
    content: "test content",
  };

  const binary = encodeNode(original);
  const decoded = decodeNode(binary);

  const attrs = decoded.attrs;
  expect(attrs).toBeDefined();
  expect(typeof attrs.id).toBe("string");
  expect(attrs.id).toBe("123");

  expect(attrs.active).toBe("true");
  expect(attrs.inactive).toBe("false");
  expect(attrs.version).toBe("1.0");

  expect(attrs.foo).toBeUndefined();
  expect(attrs.bar).toBeUndefined();

  const reencoded = encodeNode(decoded);
  const roundtrip = decodeNode(reencoded);
  const roundtripAttrs = roundtrip.attrs;
  expect(roundtripAttrs.id).toBe("123");
  expect(roundtripAttrs.active).toBe("true");
});

test("should skip empty string values in attrs during encoding", () => {
  const original: BinaryNode = {
    tag: "empty-attrs",
    attrs: {
      emptyStr: "",
      whitespace: "   ",
      valid: "ok",
    },
    content: undefined,
  };

  const binary = encodeNode(original);
  const decoded = decodeNode(binary);

  const attrs = decoded.attrs;
  expect(attrs.emptyStr).toBeUndefined();
  expect(attrs.whitespace).toBeUndefined();
  expect(attrs.valid).toBe("ok");
});
