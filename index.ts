#!/usr/bin/env node
const yargs = require("yargs");
import * as fs from "fs";
import * as path from "path";

import { StreamWriter, NopWriter, Emitter } from "./lib/index";

const argv = yargs
  .usage("Usage: $0 [options] inputFile rootName")
  .option("interface-file", {
    alias: "i",
    string: true,
    description: "Specify output file for interfaces",
  })
  .option("proxy-file", {
    alias: "p",
    string: true,
    description: "Specify output file for Typescript proxy classes",
  })
  .help("h")
  .alias("h", "help").argv;

let interfaceWriter = new NopWriter();
let proxyWriter = interfaceWriter;
if (argv.i && argv.p && path.resolve(argv.i) === path.resolve(argv.p)) {
  console.error(`Interfaces and proxies cannot be written to same file.`);
  yargs.showHelp();
  process.exit(1);
}
if (argv.i) {
  interfaceWriter = new StreamWriter(fs.createWriteStream(argv.i));
}
if (argv.p) {
  proxyWriter = new StreamWriter(fs.createWriteStream(argv.p));
}
if (argv._.length !== 2) {
  console.error(
    `Please supply an input file with samples in a JSON array, and a symbol to use for the root interface / proxy.`,
  );
  yargs.showHelp();
  process.exit(1);
}

const samples = JSON.parse(fs.readFileSync(argv._[0]).toString());
const e = new Emitter(interfaceWriter, proxyWriter);
e.emit(samples, argv._[1]);
