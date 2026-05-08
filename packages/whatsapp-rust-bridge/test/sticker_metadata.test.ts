import { describe, it, expect } from "bun:test";
import { getEnabledFeatures } from "../dist";
import { readFileSync } from "fs";
import { join } from "path";

const features = getEnabledFeatures();

// Only load assets if the feature is enabled
const STATIC_WEBP = features.sticker
  ? readFileSync(join(__dirname, "../assets/static.webp"))
  : new Uint8Array();
const ANIMATED_WEBP = features.sticker
  ? readFileSync(join(__dirname, "../assets/animated.webp"))
  : new Uint8Array();

// Conditionally import sticker functions (they won't exist if feature is disabled)
const stickerFns = features.sticker
  ? await import("../dist").then((m) => ({
      addStickerMetadata: m.addStickerMetadata,
      getStickerMetadata: m.getStickerMetadata,
    }))
  : { addStickerMetadata: null, getStickerMetadata: null };

const { addStickerMetadata, getStickerMetadata } = stickerFns as {
  addStickerMetadata: typeof import("../dist").addStickerMetadata;
  getStickerMetadata: typeof import("../dist").getStickerMetadata;
};

describe.if(features.sticker)("Sticker Metadata", () => {
  describe("addStickerMetadata", () => {
    it("adds metadata to a static WebP image", () => {
      const result = addStickerMetadata(STATIC_WEBP, {
        packName: "Test Pack",
        publisher: "Test Author",
      });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(STATIC_WEBP.length);

      // Verify RIFF/WEBP header is intact
      const header = new TextDecoder().decode(result.slice(0, 4));
      expect(header).toBe("RIFF");
      const webpMarker = new TextDecoder().decode(result.slice(8, 12));
      expect(webpMarker).toBe("WEBP");
    });

    it("adds metadata to an animated WebP image", () => {
      const result = addStickerMetadata(ANIMATED_WEBP, {
        packName: "Animated Pack",
        publisher: "Animation Author",
        emojis: ["😀", "🎉"],
      });

      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(ANIMATED_WEBP.length);

      // Verify RIFF/WEBP header is intact
      const header = new TextDecoder().decode(result.slice(0, 4));
      expect(header).toBe("RIFF");
    });

    it("adds metadata with all optional fields", () => {
      const metadata = {
        packId: "custom-pack-id-123",
        packName: "Full Pack",
        publisher: "Full Author",
        emojis: ["😀", "😎", "🔥"],
        androidAppStoreLink: "https://play.google.com/store/apps/details?id=test",
        iosAppStoreLink: "https://apps.apple.com/app/test/id123456789",
      };

      const result = addStickerMetadata(STATIC_WEBP, metadata);
      expect(result).toBeInstanceOf(Uint8Array);
    });

    it("generates a pack ID if not provided", () => {
      const result = addStickerMetadata(STATIC_WEBP, {
        packName: "Auto ID Pack",
        publisher: "Test",
      });

      // Read back the metadata to verify ID was generated
      const extracted = getStickerMetadata(result);
      expect(extracted).not.toBeNull();
      expect(extracted!.packId).toBeDefined();
      expect(extracted!.packId.length).toBeGreaterThan(0);
      // UUID format check
      expect(extracted!.packId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });

    it("throws on invalid WebP data", () => {
      const invalidData = new Uint8Array([0, 1, 2, 3, 4, 5]);
      expect(() =>
        addStickerMetadata(invalidData, {
          packName: "Test",
          publisher: "Test",
        })
      ).toThrow();
    });
  });

  describe("getStickerMetadata", () => {
    it("extracts metadata from a WebP with sticker metadata", () => {
      // First add metadata
      const withMetadata = addStickerMetadata(STATIC_WEBP, {
        packName: "Extract Test",
        publisher: "Extract Author",
        emojis: ["😀"],
      });

      // Then extract it
      const extracted = getStickerMetadata(withMetadata);

      expect(extracted).not.toBeNull();
      expect(extracted!.packName).toBe("Extract Test");
      expect(extracted!.publisher).toBe("Extract Author");
      expect(extracted!.emojis).toEqual(["😀"]);
    });

    it("returns undefined for WebP without sticker metadata", () => {
      const extracted = getStickerMetadata(STATIC_WEBP);
      expect(extracted).toBeUndefined();
    });

    it("extracts metadata with all fields", () => {
      const originalMetadata = {
        packId: "test-id-456",
        packName: "Complete Pack",
        publisher: "Complete Author",
        emojis: ["😀", "😎"],
        androidAppStoreLink: "https://play.google.com/test",
        iosAppStoreLink: "https://apps.apple.com/test",
      };

      const withMetadata = addStickerMetadata(STATIC_WEBP, originalMetadata);
      const extracted = getStickerMetadata(withMetadata);

      expect(extracted).not.toBeNull();
      expect(extracted!.packId).toBe("test-id-456");
      expect(extracted!.packName).toBe("Complete Pack");
      expect(extracted!.publisher).toBe("Complete Author");
      expect(extracted!.emojis).toEqual(["😀", "😎"]);
      expect(extracted!.androidAppStoreLink).toBe("https://play.google.com/test");
      expect(extracted!.iosAppStoreLink).toBe("https://apps.apple.com/test");
    });

    it("throws on invalid WebP data", () => {
      const invalidData = new Uint8Array([0, 1, 2, 3, 4, 5]);
      expect(() => getStickerMetadata(invalidData)).toThrow();
    });
  });

  describe("round-trip", () => {
    it("preserves metadata through multiple round-trips", () => {
      const metadata = {
        packName: "Round Trip",
        publisher: "RT Author",
        emojis: ["🔄"],
      };

      // Add metadata
      const first = addStickerMetadata(STATIC_WEBP, metadata);
      const extracted1 = getStickerMetadata(first);
      expect(extracted1!.packName).toBe("Round Trip");

      // Add different metadata to same image
      const second = addStickerMetadata(first, {
        packName: "Updated Pack",
        publisher: "New Author",
      });

      const extracted2 = getStickerMetadata(second);
      expect(extracted2!.packName).toBe("Updated Pack");
      expect(extracted2!.publisher).toBe("New Author");
    });

    it("works with animated WebP round-trip", () => {
      const metadata = {
        packName: "Animated Round Trip",
        publisher: "Anim Author",
        emojis: ["🎬", "✨"],
      };

      const withMetadata = addStickerMetadata(ANIMATED_WEBP, metadata);
      const extracted = getStickerMetadata(withMetadata);

      expect(extracted).not.toBeNull();
      expect(extracted!.packName).toBe("Animated Round Trip");
      expect(extracted!.publisher).toBe("Anim Author");
      expect(extracted!.emojis).toEqual(["🎬", "✨"]);
    });
  });

  describe("edge cases", () => {
    it("handles empty emojis array", () => {
      const result = addStickerMetadata(STATIC_WEBP, {
        packName: "No Emoji Pack",
        publisher: "Author",
        emojis: [],
      });

      const extracted = getStickerMetadata(result);
      // Empty arrays are skipped in serialization, so emojis is undefined
      expect(extracted!.emojis ?? []).toEqual([]);
    });

    it("handles unicode in pack name and publisher", () => {
      const metadata = {
        packName: "日本語パック 🇯🇵",
        publisher: "作者 émoji",
        emojis: ["🎌", "⛩️"],
      };

      const withMetadata = addStickerMetadata(STATIC_WEBP, metadata);
      const extracted = getStickerMetadata(withMetadata);

      expect(extracted!.packName).toBe("日本語パック 🇯🇵");
      expect(extracted!.publisher).toBe("作者 émoji");
    });

    it("handles very long pack name", () => {
      const longName = "A".repeat(128); // Max allowed by WhatsApp
      const metadata = {
        packName: longName,
        publisher: "Author",
      };

      const withMetadata = addStickerMetadata(STATIC_WEBP, metadata);
      const extracted = getStickerMetadata(withMetadata);
      expect(extracted!.packName).toBe(longName);
    });
  });
});
