import process from "node:process";
import * as core from "@actions/core";
import { saveCache } from "./cache.ts";

async function main() {
  try {
    await saveCache();
  } catch (err) {
    core.setFailed((err instanceof Error) ? err : String(err));
    process.exit();
  }
}

main();
