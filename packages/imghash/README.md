# imghash ![Version](https://img.shields.io/npm/v/imghash) ![License](https://img.shields.io/npm/l/imghash)

Perceptual image hashing for Node.js

## Installation

```sh
npm install imghash
```

## Basic usage

```js
import { hashFile } from "imghash";

const hash1 = await hashFile("./path/to/file");
console.log(hash1); // "f884c4d8d1193c07"

// Custom hex length and result in binary
const hash2 = await hashFile("./path/to/file", 4, "binary");
console.log(hash2); // "1000100010000010"
```

## Finding similar images

To measure similarity between images you can use [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) or [Levenshtein Distance](https://en.wikipedia.org/wiki/Levenshtein_distance).

The following example uses the latter one:

```js
import { hashFile } from "imghash";
import leven from "leven";

const hash1 = await hashFile("./img1");
const hash2 = await hashFile("./img2");

const distance = leven(hash1, hash2);
console.log(`Distance between images is: ${distance}`);
if (distance <= 12) {
  console.log("Images are similar");
} else {
  console.log("Images are NOT similar");
}
```

## API Reference

| Method                               | Description                                       |
| ------------------------------------ | ------------------------------------------------- |
| `hashFile(filepath, bits?, format?)` | Calculate an image perceptual hash.               |
| `hashRaw(data, bits)`                | Calculate a hash from already-decoded image data. |
| `hexToBinary(value)`                 | Convert a hexadecimal hash to binary.             |
| `binaryToHex(value)`                 | Convert a binary hash to hexadecimal.             |

#### `hashFile(filepath, bits?, format?)`

Calculates a perceptual hash for an image.

```js
import { hashFile } from "imghash";
const hash = await hashFile("./image.png", 8, "hex");
```

| Parameter  | Type                | Default | Description                               |
| ---------- | ------------------- | ------- | ----------------------------------------- |
| `filepath` | `string \| Buffer`  | —       | Image path or image data.                 |
| `bits`     | `number`            | `8`     | Hash grid size. Must be divisible by `4`. |
| `format`   | `"hex" \| "binary"` | `"hex"` | Returned hash encoding.                   |

Returns: `Promise<string>`.

---

#### `hashRaw(data, bits)`

Calculates a hexadecimal hash from decoded image data.

| Parameter | Type        | Description                                            |
| --------- | ----------- | ------------------------------------------------------ |
| `data`    | `ImageData` | Object containing `width`, `height`, and pixel `data`. |
| `bits`    | `number`    | Hash grid size.                                        |

Returns: `string`.

### Conversion helpers

```js
import { hexToBinary, binaryToHex } from "imghash";
hexToBinary("f8"); // "11111000"
binaryToHex("11111000"); // "f8"
```

## Further reading

`imghash` takes advantage of block mean value based hashing method:

- [http://stackoverflow.com/questions/14377854/block-mean-value-hashing-method](http://stackoverflow.com/questions/14377854/block-mean-value-hashing-method)
- [http://commonsmachinery.se/2014/09/digital-image-matching-part-1-hashing/](http://commonsmachinery.se/2014/09/digital-image-matching-part-1-hashing/)
