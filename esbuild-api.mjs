import { build } from "esbuild";

// Bundle the main API handler
await build({
  entryPoints: ["server/api-handler.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "api/index.js",
  external: ["@vercel/node"],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

// Bundle the Jobber callback handler
await build({
  entryPoints: ["server/jobber-callback.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: "api/jobber/callback.js",
  external: ["@vercel/node"],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

console.log("API functions bundled successfully");
