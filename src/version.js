const semver = require("semver");
const { fetch } = require("undici");
const fs = require("fs");

const GIT_HASH_RE = /^[0-9a-fA-F]{40}$/;

/**
 * @typedef VersionRange
 * @property {string} range
 * @property {boolean} isCanary
 */

/**
 * @typedef Version
 * @property {string} version
 * @property {boolean} isCanary
 */

/**
 * Parses the version from the user into a structure.
 *
 * @param {string | undefined} version
 * @returns {VersionRange | null}
 */
function parseVersionRange(version) {
  version = String(version) || "1.x";
  version = version.trim();

  if (version == "canary") {
    return { range: "latest", isCanary: true };
  }

  if (GIT_HASH_RE.test(version)) {
    return { range: version, isCanary: true };
  }

  const range = semver.validRange(version);
  if (range !== null) {
    return { range, isCanary: false };
  }

  return null;
}

/**
 * Parses the version from the version file
 *
 * @param {string} versionFilePath
 * @returns {string | undefined}
 */
function getDenoVersionFromFile(versionFilePath) {
  if (!fs.existsSync(versionFilePath)) {
    throw new Error(
      `The specified node version file at: ${versionFilePath} does not exist`,
    );
  }

  const contents = fs.readFileSync(versionFilePath, "utf8");

  // .tool-versions typically looks like
  // ```
  // ruby 2.6.5
  // deno 1.43.1
  // node 20.0.0
  // ```
  // This parses the version of Deno from the file
  const denoVersionInToolVersions = contents.match(
    /^deno\s+v?(?<version>[^\s]+)$/m,
  );

  return denoVersionInToolVersions?.groups?.version || contents.trim();
}

/**
 * @param {VersionRange} range
 * @returns {Promise<Version | null>}
 */
async function resolveVersion({ range, isCanary }) {
  if (isCanary) {
    if (range === "latest") {
      const res = await fetchWithRetries(
        "https://dl.deno.land/canary-latest.txt",
      );
      if (res.status !== 200) {
        throw new Error(
          "Failed to fetch canary version info from dl.deno.land. Please try again later.",
        );
      }
      const version = (await res.text()).trim();
      return { version, isCanary: true };
    }
    return { version: range, isCanary: true };
  }

  const res = await fetchWithRetries("https://deno.com/versions.json");
  if (res.status !== 200) {
    throw new Error(
      "Failed to fetch stable version info from deno.com/versions.json. Please try again later.",
    );
  }
  const versionJson = await res.json();
  if (!("cli" in versionJson)) {
    throw new Error("Fetched stable version info is invalid.");
  }
  /** @type {string[]} */
  const versions = versionJson.cli;
  if (!Array.isArray(versions)) {
    throw new Error("Fetched stable version info is invalid.");
  }

  let version = semver.maxSatisfying(versions, range);
  if (version === null) {
    return null;
  }
  version = semver.clean(version);
  if (version === null) {
    return null;
  }

  return { version, isCanary: false };
}

/** @param {string} url */
async function fetchWithRetries(url, maxRetries = 5) {
  let sleepMs = 250;
  let iterationCount = 0;
  while (true) {
    iterationCount++;
    try {
      const res = await fetch(url);
      if (res.status === 200 || iterationCount > maxRetries) {
        return res;
      }
    } catch (err) {
      if (iterationCount > maxRetries) {
        throw err;
      }
    }
    console.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
    await new Promise((resolve) => setTimeout(resolve, sleepMs));
    sleepMs = Math.min(sleepMs * 2, 10_000);
  }
}

module.exports = {
  parseVersionRange,
  resolveVersion,
  getDenoVersionFromFile,
};
