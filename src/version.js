const semver = require("semver");
const fetch = require("node-fetch");

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
 * @param {VersionRange} range
 * @returns {Promise<Version | null>}
 */
async function resolveVersion({ range, isCanary }) {
  if (isCanary) {
    if (range === "latest") {
      const res = await fetch("https://dl.deno.land/canary-latest.txt");
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

  const res = await fetch(
    "https://raw.githubusercontent.com/denoland/deno_website2/main/versions.json",
  );
  if (res.status !== 200) {
    throw new Error(
      "Failed to fetch stable version info from raw.githubusercontent.com. Please try again later.",
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

module.exports = {
  parseVersionRange,
  resolveVersion,
};
