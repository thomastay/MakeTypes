const chalk = require("chalk");

const makeAllPackagesExternalPlugin = {
  name: "make-all-packages-external",
  setup(build) {
    const filter = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/; // Must not start with "/" or "./" or "../"
    build.onResolve({ filter }, args => ({ path: args.path, external: true }));
  },
};

const outfile = "dist/index.js";

function toKb(bytes) {
  if (typeof bytes !== "number" || Number.isNaN(bytes)) {
    throw new Error("bytes must be a number");
  }
  const kb = Math.ceil(bytes / 1000);
  return `${kb}kb`;
}

require("esbuild")
  .build({
    outfile,
    entryPoints: ["index.ts"],
    bundle: true,
    metafile: true,
    plugins: [makeAllPackagesExternalPlugin],
  })
  .then(result =>
    console.log(
      `${outfile}: ${chalk.blueBright(
        toKb(result.metafile.outputs[outfile].bytes),
      )}`,
    ),
  )
  .catch(() => process.exit(1));
