const process = require("process");
const core = require("@actions/core");

const {
  parseVersionRange,
  getDenoVersionFromFile,
  resolveVersion,
} = require("./src/version.js");
const { install } = require("./src/install.js");

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

    core.info(
      `Going to install ${
        version.isCanary ? "canary" : "stable"
      } version ${version.version}.`,
    );

    await install(version);

    core.setOutput("deno-version", version.version);
    core.setOutput("is-canary", version.isCanary);

    core.info("Installation complete.");
  } catch (err) {
    core.setFailed(err);
    process.exit();
  }
}

main();
