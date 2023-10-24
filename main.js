const process = require("process");
const core = require("@actions/core");
const os = require("os");
const path = require("path");

const { parseVersionRange, resolveVersion } = require("./src/version.js");
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
    const range = parseVersionRange(core.getInput("deno-version"));
    if (range === null) {
      exit("The passed version range is not valid.");
    }

    const version = await resolveVersion(range);
    if (version === null) {
      exit("Could not resolve a version for the given range.");
    }

    const useLocalCache = core.getInput("cache") === "true";

    core.info(
      `Going to install ${
        version.isCanary ? "canary" : "stable"
      } version ${version.version}.`,
    );

    const installationPath = await install(version, useLocalCache);

    const denoInstallRoot = process.env.DENO_INSTALL_ROOT ||
      path.join(os.homedir(), ".deno", "bin");

    core.addPath(installationPath);
    core.addPath(denoInstallRoot);

    core.setOutput("deno-version", version.version);
    core.setOutput("is-canary", version.isCanary);

    core.info("Installation complete.");
  } catch (err) {
    core.setFailed(err);
    process.exit();
  }
}

main();
