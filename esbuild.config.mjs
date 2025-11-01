import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";

const banner = `/*
 Bundled by esbuild. Source lives in TypeScript under src/.
*/`;

const isProd = process.argv[2] === "production";

const context = await esbuild.context({
  banner: { js: banner },
  entryPoints: ["main.ts"],
  bundle: true,
  format: "cjs",
  platform: "browser",
  target: "es2018",
  sourcemap: isProd ? false : "inline",
  treeShaking: true,
  external: [
    "obsidian",
    "electron",
    "@codemirror/autocomplete",
    "@codemirror/commands",
    "@codemirror/language",
    "@codemirror/state",
    "@codemirror/view",
    "@lezer/common",
    "@lezer/highlight",
    "@lezer/lr",
    ...builtins
  ],
  outfile: "main.js",
  minify: isProd
});

if (isProd) {
  await context.rebuild();
  process.exit(0);
} else {
  await context.watch();
}
