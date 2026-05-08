import { describe, it, expect } from "bun:test";
import { getEnabledFeatures } from "../dist";
import fs from "node:fs";

const features = getEnabledFeatures();

// 1x1 red PNG pixel (base64)
const SAMPLE_IMAGE =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAABAAAAAQBPJcTWAAAADElEQVR4nGP8x8AAAAMCAQBFsWYPAAAAAElFTkSuQmCC";

// Only load image assets if the feature is enabled
const PNG_BUFFER = features.image
  ? fs.readFileSync("assets/image.png")
  : new Uint8Array();
const WEBP_BUFFER = features.image
  ? fs.readFileSync("assets/static.webp")
  : new Uint8Array();

// Conditionally import image functions (they won't exist if feature is disabled)
const imageFns = features.image
  ? await import("../dist").then((m) => ({
      extractImageThumb: m.extractImageThumb,
      generateProfilePicture: m.generateProfilePicture,
      getImageDimensions: m.getImageDimensions,
      convertToWebP: m.convertToWebP,
      processImage: m.processImage,
    }))
  : {
      extractImageThumb: null,
      generateProfilePicture: null,
      getImageDimensions: null,
      convertToWebP: null,
      processImage: null,
    };

const {
  extractImageThumb,
  generateProfilePicture,
  getImageDimensions,
  convertToWebP,
  processImage,
} = imageFns as {
  extractImageThumb: typeof import("../dist").extractImageThumb;
  generateProfilePicture: typeof import("../dist").generateProfilePicture;
  getImageDimensions: typeof import("../dist").getImageDimensions;
  convertToWebP: typeof import("../dist").convertToWebP;
  processImage: typeof import("../dist").processImage;
};

// Magic bytes for format detection
const MAGIC = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF, also check bytes 8-11 for WEBP
} as const;

function hasPrefix(buffer: Uint8Array, prefix: readonly number[]): boolean {
  return prefix.every((byte, i) => buffer[i] === byte);
}

function isValidFormat(
  buffer: Uint8Array,
  format: "jpeg" | "png" | "webp"
): boolean {
  if (format === "webp") {
    // Check RIFF header and WEBP signature at offset 8
    return (
      buffer.length >= 12 &&
      hasPrefix(buffer, MAGIC.webp) &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
    );
  }
  return hasPrefix(buffer, MAGIC[format]);
}

describe.if(features.image)("Image Utils", () => {
  const imageBuffer = Buffer.from(SAMPLE_IMAGE, "base64");

  it("extracts an image thumbnail", () => {
    const result = extractImageThumb(imageBuffer, 32);

    expect(result).toBeDefined();
    expect(result.original).toBeDefined();
    expect(result.original.width).toBe(1);
    expect(result.original.height).toBe(1);

    expect(result.buffer).toBeInstanceOf(Uint8Array);
    expect(result.buffer.length).toBeGreaterThan(0);
  });

  it("generates a square profile picture", () => {
    const targetWidth = 64;
    const result = generateProfilePicture(imageBuffer, targetWidth);

    expect(result).toBeDefined();
    expect(result.img).toBeInstanceOf(Uint8Array);
    expect(result.img.length).toBeGreaterThan(0);
  });

  it("throws on invalid image data", () => {
    const invalidBuffer = new Uint8Array([0, 1, 2, 3]);
    expect(() => extractImageThumb(invalidBuffer, 32)).toThrow();
  });
});

describe.if(features.image)("getImageDimensions", () => {
  it("returns correct dimensions for PNG", () => {
    const dims = getImageDimensions(PNG_BUFFER);
    expect(dims.width).toBe(1000);
    expect(dims.height).toBe(1000);
  });

  it("returns correct dimensions for WebP", () => {
    const dims = getImageDimensions(WEBP_BUFFER);
    expect(dims.width).toBeGreaterThan(0);
    expect(dims.height).toBeGreaterThan(0);
  });

  it("throws on invalid data", () => {
    expect(() => getImageDimensions(new Uint8Array([1, 2, 3]))).toThrow();
  });
});

describe.if(features.image)("convertToWebP", () => {
  it("converts PNG to valid WebP", () => {
    const result = convertToWebP(PNG_BUFFER);
    expect(isValidFormat(result, "webp")).toBe(true);
  });

  it("converts WebP to WebP (passthrough)", () => {
    const result = convertToWebP(WEBP_BUFFER);
    expect(isValidFormat(result, "webp")).toBe(true);
  });
});

describe.if(features.image)("processImage", () => {
  it("resizes to exact dimensions", () => {
    const result = processImage(PNG_BUFFER, {
      width: 100,
      height: 100,
      format: "jpeg",
    });
    expect(result.width).toBe(100);
    expect(result.height).toBe(100);
    expect(isValidFormat(result.buffer, "jpeg")).toBe(true);
  });

  it("preserves aspect ratio with width only", () => {
    const result = processImage(PNG_BUFFER, {
      width: 500,
      height: undefined,
      format: "png",
    });
    expect(result.width).toBe(500);
    expect(result.height).toBe(500); // 1000x1000 -> 500x500
    expect(isValidFormat(result.buffer, "png")).toBe(true);
  });

  it("converts between formats", () => {
    const formats = ["jpeg", "png", "webp"] as const;
    for (const format of formats) {
      const result = processImage(PNG_BUFFER, { width: 50, height: 50, format });
      expect(isValidFormat(result.buffer, format)).toBe(true);
    }
  });
});
