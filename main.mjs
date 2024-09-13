import process from "node:process";
import core from "@actions/core";
import {
  getDenoVersionFromFile,
  parseVersionRange,
  resolveVersion,
} from "./src/version.mjs";
import { install } from "./src/install.mjs";

/**
 * @param {string} message
 * @returns {never}
 */
function exit(message) {
  core.setFailed(message);
  process.exit();
}

async function main() {
  try {
    const denoVersionFile = core.getInput("deno-version-file");
    const range = parseVersionRange(
      denoVersionFile
        ? getDenoVersionFromFile(denoVersionFile)
        : core.getInput("deno-version"),
    );

    if (range === null) {
      exit("The passed version range is not valid.");
    }

    const version = await resolveVersion(range);
    if (version === null) {
      exit("Could not resolve a version for the given range.");
    }

    core.info(`Going to install ${version.kind} version ${version.version}.`);

    await install(version);

    core.setOutput("deno-version", version.version);
    // TODO(@crowlKats): remove in 2.0
    core.setOutput("is-canary", version.kind === "canary");
    core.setOutput("release-channel", version.kind);

    core.info("Installation complete.");
  } catch (err) {
    core.setFailed((err instanceof Error) ? err : String(err));
    process.exit();
  }
}

main();
