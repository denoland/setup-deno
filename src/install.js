const path = require("path");
const process = require("process");
const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const cache = require("@actions/cache");

/**
 * @param {import("./version").Version} version
 * @returns {Promise<string>} The path to the installation.
 */
async function install(version, useLocalCache = false) {
  const versionSpec = version.isCanary ? "canary" : version.version;

  const cachedPath = tc.find("deno", versionSpec);
  if (cachedPath) {
    core.info(`Using cached Deno installation in the runner: ${cachedPath}.`);
    core.addPath(cachedPath);
    return cachedPath;
  }

  if (!process.env.RUNNER_TOOL_CACHE) {
    throw new Error("RUNNER_TOOL_CACHE is not set");
  }
  const zip = zipName();
  const loaclCacheKey = zip.replace(/\.zip$/, "") + "-" + versionSpec;

  if (useLocalCache) {
    const restorePath = path.join(
      process.env.RUNNER_TOOL_CACHE,
      "deno",
      versionSpec,
      process.arch,
    );
    core.info(
      `attempting restore of Deno installation for ${loaclCacheKey} to ${restorePath}`,
    );
    const restoredKey = await cache.restoreCache([restorePath], loaclCacheKey);
    if (restoredKey) {
      core.info(
        `using cached Deno installation in the repository: ${restorePath}`,
      );
      return restorePath;
    }
  }

  const url = version.isCanary
    ? `https://dl.deno.land/canary/${version.version}/${zip}`
    : `https://github.com/denoland/deno/releases/download/v${version.version}/${zip}`;

  core.info(`No cached installation found. Downloading Deno from ${url}.`);

  const zipPath = await tc.downloadTool(url);
  const extractedFolder = await tc.extractZip(zipPath);

  const toolCachePath = await tc.cacheDir(
    extractedFolder,
    "deno",
    versionSpec,
    process.arch,
  );
  if (!toolCachePath.startsWith(process.env.RUNNER_TOOL_CACHE)) {
    core.warning(
      `Deno was cached to ${toolCachePath}, but the expected be cached under ${process.env.RUNNER_TOOL_CACHE}.`,
    );
  } else {
    core.info(`Cached Deno to ${toolCachePath}.`);
  }

  if (useLocalCache) {
    core.info(
      `Saving Deno installation to the repository cache for ${loaclCacheKey}.`,
    );
    await cache.saveCache([toolCachePath], loaclCacheKey);
  }

  return toolCachePath;
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
