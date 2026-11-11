import fs from "node:fs";
import leven from "leven";
import { describe, expect, it } from "vitest";
import { binaryToHex, hashFile, hexToBinary } from "./index";

describe("imghash", () => {
  describe("hashFile", () => {
    it.each([
      ["jpeg", "../../../assets/absolut1"],
      ["png", "../../../assets/castle1.png"],
      ["bmp", "../../../assets/castle1.bmp"],
    ])("should create hash for %s", async (_fileType, filePath) => {
      const hash = await hashFile(`${__dirname}/${filePath}`);
      expect(hash).toBeDefined();
    });

    it("should create close hashes for the same image but in a different format", async () => {
      const h1 = await hashFile(`${__dirname}/../../../assets/castle1.png`);
      const h2 = await hashFile(`${__dirname}/../../../assets/castle1.bmp`);
      const dist = leven(h1, h2);
      expect(dist).toBeLessThan(12);
    });

    it("should create same hashes the same images", async () => {
      const h1 = await hashFile(`${__dirname}/../../../assets/castle1.png`);
      const h2 = await hashFile(`${__dirname}/../../../assets/castle2.png`);
      expect(h1).toBe(h2);
    });

    it("should create different hashes different images", async () => {
      const h1 = await hashFile(`${__dirname}/../../../assets/castle1.png`);
      const h2 = await hashFile(`${__dirname}/../../../assets/absolut1`);
      const dist = leven(h1, h2);
      expect(dist).toBeGreaterThan(12);
    });

    it("should create close hashes similar images", async () => {
      const h1 = await hashFile(`${__dirname}/../../../assets/absolut2`);
      const h2 = await hashFile(`${__dirname}/../../../assets/absolut1`);
      const dist = leven(h1, h2);
      expect(dist).not.toBe(0);
      expect(dist).toBeLessThan(14);
    });

    it("should support binary output", async () => {
      const h1 = hashFile(`${__dirname}/../../../assets/absolut1`, null, "hex");
      const h2 = hashFile(
        `${__dirname}/../../../assets/absolut1`,
        null,
        "binary",
      );
      expect(h1).not.toBe(h2);
    });

    /**
     * pngcheck shows this image to have 4-bit palette color type which png-js doesn't handle well:
     * pngcheck test/files/Arius.png
     * OK: test/files/Arius.png (150x200, 4-bit palette, non-interlaced, 14.7%).
     *
     * see: https://github.com/commonsmachinery/blockhash-js/issues/7
     */
    it("should hash palette based pngs correctly", async () => {
      const h1 = await hashFile(
        `${__dirname}/../../../assets/Arius.png`,
        16,
        "hex",
      );
      const h2 =
        "0ff91ff10ff1008300018fd986d79ddf9e058fc30fc30fc3dfc3c3c30b831783";
      expect(h1).toBe(h2);
    });

    /**
     * For some jpeg images, cwasm-jpeg-turbo throws longjmp error due to a bug in WebAssembly.
     * Added a workaround to use alternate libraries to read such images.
     *
     * see: https://github.com/LinusU/cwasm-jpeg-turbo/issues/2
     * see: https://github.com/pwlmaciejewski/imghash/issues/21
     */
    it("should not throw longjmp error", async () => {
      const h1 = await hashFile(
        `${__dirname}/../../../assets/longjmperror.jpg`,
        8,
      );
      const h2 = await hashFile(
        `${__dirname}/../../../assets/longjmperror.jpg`,
        16,
      );
      expect(h1).toHaveLength(16);
      expect(h2).toHaveLength(64);
    });

    it("should support validate output format", () => {
      return expect(
        hashFile(`${__dirname}/../../../assets/absolut1`, null, "foo"),
      ).rejects.toEqual(new Error("Unsupported format: foo"));
    });

    it("should support variable bits length", async () => {
      const h1 = await hashFile(`${__dirname}/../../../assets/absolut1`, 8);
      const h2 = await hashFile(`${__dirname}/../../../assets/absolut1`, 16);
      expect(h1.length * 4).toBe(h2.length);
    });

    it("should validate bit lengths", () =>
      expect(
        hashFile(`${__dirname}/../../../assets/absolut1`, 10),
      ).rejects.toEqual(new Error("Invalid bit-length: 10")));

    it("should accept Buffer input", async () => {
      const buffer = fs.readFileSync(`${__dirname}/../../../assets/absolut1`);
      const hash = await hashFile(buffer);
      expect(hash).not.toBeNull();
    });
  });

  describe("hexToBinary", () => {
    it("should convert hex to binary", () => {
      expect(hexToBinary("83C3D381C38985A5")).toBe(
        "1000001111000011110100111000000111000011100010011000010110100101",
      );
    });
  });

  describe("binaryToHex", () => {
    it("should convert number in binary to hex", () => {
      expect(
        binaryToHex(
          "1000001111000011110100111000000111000011100010011000010110100101",
        ),
      ).toBe("83c3d381c38985a5");
    });
  });
});
