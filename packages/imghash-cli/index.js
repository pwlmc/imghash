#!/usr/bin/env node

import { hashFile } from "imghash";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
const argv = yargs(process.argv)
  .scriptName("imghash")
  .usage(
    "$0 [-b BITS] [-f FORMAT] <file-path>",
    "generates image hash",
    (yargs) => {
      yargs.positional("file-path", {
        describe: "path to the image",
        type: "string",
        required: true,
      });
    },
  )
  .option("b", {
    alias: "bits",
    describe: "hash length",
    type: "number",
  })
  .option("f", {
    alias: "format",
    describe: "output format",
    type: "string",
    choices: ["hex", "binary"],
  })
  .parse(hideBin(process.argv));

hashFile(argv.filePath, argv.bits, argv.format).then(console.log);
