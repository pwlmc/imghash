import fs from "fs";
import blockhash from "blockhash-core";
import { imageFromBuffer, getImageData } from "@canvas/image";
import imageType from "image-type";
import jpeg from "jpeg-js";
import { ImageData } from "blockhash-core";

const JPEG_MAX_MEMORY_USAGE_MB = 1024;

const HEX_BINARY_LOOKUP = {
  0: "0000",
  1: "0001",
  2: "0010",
  3: "0011",
  4: "0100",
  5: "0101",
  6: "0110",
  7: "0111",
  8: "1000",
  9: "1001",
  a: "1010",
  b: "1011",
  c: "1100",
  d: "1101",
  e: "1110",
  f: "1111",
  A: "1010",
  B: "1011",
  C: "1100",
  D: "1101",
  E: "1110",
  F: "1111",
} as const;

const BINARY_TO_HEX_LOOKUP = {
  "0000": "0",
  "0001": "1",
  "0010": "2",
  "0011": "3",
  "0100": "4",
  "0101": "5",
  "0110": "6",
  "0111": "7",
  1000: "8",
  1001: "9",
  1010: "a",
  1011: "b",
  1100: "c",
  1101: "d",
  1110: "e",
  1111: "f",
} as const;

async function hash(filepath: string, bits?: number | null, format?: string) {
  format = format || "hex";
  if (format !== "hex" && format !== "binary") {
    throw new Error(`Unsupported format: ${format}`);
  }

  bits = bits || 8;
  if (bits % 4 !== 0) {
    throw new Error(`Invalid bit-length: ${bits}`);
  }

  const fileData: Buffer = await new Promise((resolve, reject) => {
    if (Buffer.isBuffer(filepath)) {
      return resolve(filepath);
    }

    fs.readFile(filepath, (err, content) => {
      if (err) return reject(err);
      resolve(content);
    });
  });

  let imageData;
  try {
    const image = await imageFromBuffer(fileData);
    imageData = getImageData(image);
  } catch (error) {
    if (imageType(fileData)!.mime === "image/jpeg") {
      imageData = jpeg.decode(fileData, {
        maxMemoryUsageInMB: JPEG_MAX_MEMORY_USAGE_MB,
      });
    } else {
      throw error;
    }
  }

  const hexHash = hashRaw(imageData!, bits);
  if (format === "binary") {
    return hexToBinary(hexHash);
  }
  return hexHash;
}

function hashRaw(data: ImageData, bits: number) {
  return blockhash.bmvbhash(data, bits);
}

function hexToBinary(s: string): string {
  let ret = "";
  for (let i = 0; i < s.length; i++) {
    if (Object.prototype.hasOwnProperty.call(HEX_BINARY_LOOKUP, s[i]!)) {
      ret += HEX_BINARY_LOOKUP[s[i]! as keyof typeof HEX_BINARY_LOOKUP];
    }
  }
  return ret;
}

function binaryToHex(s: string): string {
  let ret = "";
  for (let i = 0; i < s.length; i += 4) {
    const chunk = s.slice(i, i + 4);
    if (Object.prototype.hasOwnProperty.call(BINARY_TO_HEX_LOOKUP, chunk)) {
      ret += BINARY_TO_HEX_LOOKUP[chunk as keyof typeof BINARY_TO_HEX_LOOKUP];
    }
  }
  return ret;
}

const api = {
  hash,
  hashRaw,
  hexToBinary,
  binaryToHex,
};

// @ts-expect-error: we don't want to introduce backward incompatible changes yet
export = api;
