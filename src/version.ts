// @ts-types="@types/semver"
import semver from "semver";
import { fetch } from "undici";
import * as fs from "node:fs";
import * as console from "node:console";
import { setTimeout } from "node:timers";

const GIT_HASH_RE = /^[0-9a-fA-F]{40}$/;

export interface VersionRange {
  range: string;
  kind: "canary" | "rc" | "stable" | "lts";
}

export interface Version {
  version: string;
  kind: "canary" | "rc" | "stable" | "lts";
}

/** Parses the version from the user into a structure */
export function parseVersionRange(
  version: string | undefined,
): VersionRange | null {
  version = String(version) || "2.x";
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

  if (version === "lts") {
    return { range: "latest", kind: "lts" };
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

/** Parses the version from the version file */
export function getDenoVersionFromFile(
  versionFilePath: string,
): string | undefined {
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

export function resolveVersion(
  { range, kind }: VersionRange,
): Promise<Version | null> {
  if (kind === "canary") {
    return resolveCanary(range);
  } else if (kind === "rc") {
    // range is always "latest"
    return resolveReleaseCandidate();
  } else if (kind === "lts") {
    return resolveLTS();
  } else {
    return resolveRelease(range);
  }
}

async function resolveCanary(range: string): Promise<Version | null> {
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

async function resolveReleaseCandidate(): Promise<Version | null> {
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

async function resolveLTS() {
  const res = await fetchWithRetries(
    "https://dl.deno.land/release-lts-latest.txt",
  );
  if (res.status !== 200) {
    throw new Error(
      "Failed to fetch LTS version info from dl.deno.land. Please try again later.",
    );
  }
  const version = semver.clean((await res.text()).trim());
  if (version === null) {
    throw new Error("Failed to parse LTS version.");
  }
  return { version, kind: "lts" };
}

/**
 * @param {string} range
 * @returns {Promise<Version | null>}
 */
async function resolveRelease(range) {
async function resolveRelease(range: string): Promise<Version | null> {
  if (range === "latest") {
    const res = await fetchWithRetries(
      "https://dl.deno.land/release-latest.txt",
    );
    if (res.status !== 200) {
      throw new Error(
        "Failed to fetch release version info from dl.deno.land. Please try again later.",
      );
    }
    let version: string | null = (await res.text()).trim();
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
    const versions: string[] = versionJson.cli;

    let version = semver.maxSatisfying(versions, range);
    if (version === null) {
      return null;
    }
    version = semver.clean(version);
    if (version === null) throw new Error("UNREACHABLE");

    return { version, kind: version.includes("-rc.") ? "rc" : "stable" };
  }
}

async function fetchWithRetries(url: string, maxRetries = 5) {
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
