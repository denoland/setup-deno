import semver from "semver";
import { fetch } from "undici";
import * as fs from "node:fs";
import { HttpClient } from "@actions/http-client";

const GIT_HASH_RE = /^[0-9a-fA-F]{40}$/;

/**
 * @typedef VersionRange
 * @property {string} range
 * @property {"canary" | "rc" | "stable"} kind
 */

/**
 * @typedef Version
 * @property {string} version
 * @property {"canary" | "rc" | "stable"} kind
 */

/**
 * Parses the version from the user into a structure.
 *
 * @param {string | undefined} version
 * @returns {VersionRange | null}
 */
export function parseVersionRange(version) {
  version = String(version) || "1.x";
  version = version.trim();

  if (version === "canary") {
    return { range: "latest", kind: "canary" };
  }

  if (version === "rc") {
    return { range: "latest", kind: "rc" };
  }

  if (version === "latest") {
    return { range: "latest", kind: "stable" };
  }

  if (GIT_HASH_RE.test(version)) {
    return { range: version, kind: "canary" };
  }

  const range = semver.validRange(version);
  if (range !== null) {
    return { range, kind: "stable" };
  }

  return null;
}

/**
 * Parses the version from the version file
 *
 * @param {string} versionFilePath
 * @returns {string | undefined}
 */
export function getDenoVersionFromFile(versionFilePath) {
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
export function resolveVersion({ range, kind }) {
  if (kind === "canary") {
    return resolveCanary(range);
  } else if (kind === "rc") {
    // range is always "latest"
    return resolveReleaseCandidate();
  } else {
    return resolveRelease(range);
  }
}

/**
 * @param {string} range
 * @returns {Promise<Version | null>}
 */
async function resolveCanary(range) {
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
    return { version, kind: "canary" };
  } else {
    return { version: range, kind: "canary" };
  }
}

/**
 * @returns {Promise<Version | null>}
 */
async function resolveReleaseCandidate() {
  const res = await fetchWithRetries(
    "https://dl.deno.land/release-rc-latest.txt",
  );
  if (res.status !== 200) {
    throw new Error(
      "Failed to fetch release candidate version info from dl.deno.land. Please try again later.",
    );
  }
  const version = semver.clean((await res.text()).trim());
  if (version === null) {
    throw new Error("Failed to parse release candidate version.");
  }
  return { version, kind: "rc" };
}

/**
 * @param {string} range
 * @returns {Promise<Version | null>}
 */
async function resolveRelease(range) {
  if (range === "latest") {
    const res = await fetchWithRetries(
      "https://dl.deno.land/release-latest.txt",
    );
    if (res.status !== 200) {
      throw new Error(
        "Failed to fetch release version info from dl.deno.land. Please try again later.",
      );
    }
    /** @type {string | null} */
    let version = (await res.text()).trim();
    version = semver.clean(version);
    if (version === null) {
      throw new Error("Failed to parse release version.");
    }
    return { version, kind: "stable" };
  } else {
    const res = await fetchWithRetries("https://deno.com/versions.json");
    if (res.status !== 200) {
      throw new Error(
        "Failed to fetch stable version info from deno.com/versions.json. Please try again later.",
      );
    }
    const versionJson = await res.json();
    if (typeof versionJson !== "object" || versionJson === null) {
      throw new Error("Fetched stable version info is invalid.");
    }
    if (!("cli" in versionJson)) {
      throw new Error("Fetched stable version info is invalid.");
    }
    if (!Array.isArray(versionJson.cli)) {
      throw new Error("Fetched stable version info is invalid.");
    }
    /** @type {string[]} */
    const versions = versionJson.cli;

    let version = semver.maxSatisfying(versions, range);
    if (version === null) {
      return null;
    }
    version = semver.clean(version);
    if (version === null) throw new Error("UNREACHABLE");

    return { version, kind: version.includes("-rc.") ? "rc" : "stable" };
  }
}

/** @param {string} url */
async function fetchWithRetries(url, maxRetries = 5) {
  const dispatcher = new HttpClient().getAgentDispatcher(url);

  let sleepMs = 250;
  let iterationCount = 0;
  while (true) {
    iterationCount++;
    try {
      const res = await fetch(
        url,
        // dispatcher is `ProxyAgent | undefined`, which is assignable to `Dispatcher | undefined` because
        // ProxyAgent extends Dispatcher, but TS2322 is reported.
        // @ts-ignore:
        { dispatcher },
      );
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
