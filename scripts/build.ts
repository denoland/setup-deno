import { build } from "tsdown";
import { join } from "node:path";

// Ensure `deno install` has run before building
await new Deno.Command(Deno.execPath(), {
  args: ["install"],
  cwd: join(import.meta.dirname!, ".."),
  stdout: "inherit",
  stderr: "inherit",
}).output();

try {
  Deno.removeSync(join(import.meta.dirname!, "../dist"), { recursive: true });
} catch {
  // ignore
}

await build({
  entry: {
    main: "src/main.ts",
    post: "src/post.ts",
  },
  target: "node20.19",
  platform: "node",
  format: "esm",
});
