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

// Use a 4-bit hash grid and return the result as binary
const hash2 = await hashFile("./path/to/file", 4, "binary");
console.log(hash2); // "1000100010000010"
```

### Finding similar images

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

The threshold of `12` is a starting point, not a universal rule. Tune it for
your image set and the hash size you use.

## API

See the full [API Reference](./packages/imghash/README.md#api-reference).

## Read more

- [Command-Line Interface](./packages/imghash-cli)
- [Block mean value hashing method](https://stackoverflow.com/questions/14377854/block-mean-value-hashing-method)
