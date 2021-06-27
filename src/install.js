const os = require("os");
const path = require("path");
const process = require("process");
const core = require("@actions/core");
const tc = require("@actions/tool-cache");

/**
 * @param {import("./version").Version} version
 */
async function install(version) {
  const cachedPath = tc.find(
    "deno",
    version.isCanary ? `0.0.0-${version.version}` : version.version,
  );
  if (cachedPath) {
    core.info(`Using cached Deno installation from ${cachedPath}.`);
    core.addPath(cachedPath);
    return;
  }

  const zip = zipName();
  const url = version.isCanary
    ? `https://dl.deno.land/canary/${version.version}/${zip}`
    : `https://github.com/denoland/deno/releases/download/v${version.version}/${zip}`;

  core.info(`Downloading Deno from ${url}.`);

  const zipPath = await tc.downloadTool(url);
  const extractedFolder = await tc.extractZip(zipPath);

  const newCachedPath = await tc.cacheDir(
    extractedFolder,
    "deno",
    version.isCanary ? `0.0.0-${version.version}` : version.version,
  );
  core.info(`Cached Deno to ${newCachedPath}.`);
  core.addPath(newCachedPath);
  const denoInstallRoot = process.env.DENO_INSTALL_ROOT ||
    path.join(os.homedir(), ".deno", "bin");
  core.addPath(denoInstallRoot);
}

/** @returns {string} */
function zipName() {
  let arch;
  switch (process.arch) {
    case "arm64":
      arch = "aarch64";
      break;
    case "x64":
      arch = "x86_64";
      break;
    default:
      throw new Error(`Unsupported architechture ${process.arch}.`);
  }

  let platform;
  switch (process.platform) {
    case "linux":
      platform = "unknown-linux-gnu";
      break;
    case "darwin":
      platform = "apple-darwin";
      break;
    case "win32":
      platform = "pc-windows-msvc";
      break;
    default:
      throw new Error(`Unsupported platform ${process.platform}.`);
  }

  return `deno-${arch}-${platform}.zip`;
}

module.exports = {
  install,
};
