import process from "node:process";
import core from "@actions/core";
import { saveCache } from "./src/cache.mjs";

async function main() {
  try {
    await saveCache();
  } catch (err) {
    core.setFailed((err instanceof Error) ? err : String(err));
    process.exit();
  }
}

main();
