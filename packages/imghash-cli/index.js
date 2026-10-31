#!/usr/bin/env node

const imghash = require("imghash");
const argv = require("yargs")
  .usage(
    "$0 [-b BITS] [-f FORMAT] <file-path>",
    "generates image hash",
    (yargs) => {
      yargs.positional("file-path", {
        describe: "path to the image",
        type: "string",
        required: true,
      });
    }
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
  }).argv;

imghash.hash(argv.filePath, argv.bits, argv.format).then(console.log);
