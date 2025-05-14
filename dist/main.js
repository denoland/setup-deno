import process from "node:process";
import core from "@actions/core";
import * as path$1 from "node:path";
import path from "node:path";
import semver from "semver";
import { fetch } from "undici";
import * as fs$1 from "node:fs";
import * as console from "node:console";
import { setTimeout } from "node:timers";
import * as os from "node:os";
import * as fs from "node:fs/promises";
import tc from "@actions/tool-cache";

//#region src/version.ts
const GIT_HASH_RE = /^[0-9a-fA-F]{40}$/;
/** Parses the version from the user into a structure */
function parseVersionRange(version) {
	version = String(version) || "2.x";
	version = version.trim();
	if (version === "canary") return {
		range: "latest",
		kind: "canary"
	};
	if (version === "rc") return {
		range: "latest",
		kind: "rc"
	};
	if (version === "latest") return {
		range: "latest",
		kind: "stable"
	};
	if (version === "lts") return {
		range: "latest",
		kind: "lts"
	};
	if (GIT_HASH_RE.test(version)) return {
		range: version,
		kind: "canary"
	};
	const range = semver.validRange(version);
	if (range !== null) return {
		range,
		kind: "stable"
	};
	return null;
}
/** Parses the version from the version file */
function getDenoVersionFromFile(versionFilePath) {
	if (!fs$1.existsSync(versionFilePath)) throw new Error(`The specified node version file at: ${versionFilePath} does not exist`);
	const contents = fs$1.readFileSync(versionFilePath, "utf8");
	const denoVersionInToolVersions = contents.match(/^deno\s+v?(?<version>[^\s]+)$/m);
	return denoVersionInToolVersions?.groups?.version || contents.trim();
}
function resolveVersion({ range, kind }) {
	if (kind === "canary") return resolveCanary(range);
	else if (kind === "rc") return resolveReleaseCandidate();
	else if (kind === "lts") return resolveLTS();
	else return resolveRelease(range);
}
async function resolveCanary(range) {
	if (range === "latest") {
		const res = await fetchWithRetries("https://dl.deno.land/canary-latest.txt");
		if (res.status !== 200) throw new Error("Failed to fetch canary version info from dl.deno.land. Please try again later.");
		const version = (await res.text()).trim();
		return {
			version,
			kind: "canary"
		};
	} else return {
		version: range,
		kind: "canary"
	};
}
async function resolveReleaseCandidate() {
	const res = await fetchWithRetries("https://dl.deno.land/release-rc-latest.txt");
	if (res.status !== 200) throw new Error("Failed to fetch release candidate version info from dl.deno.land. Please try again later.");
	const version = semver.clean((await res.text()).trim());
	if (version === null) throw new Error("Failed to parse release candidate version.");
	return {
		version,
		kind: "rc"
	};
}
async function resolveLTS() {
	const res = await fetchWithRetries("https://dl.deno.land/release-lts-latest.txt");
	if (res.status !== 200) throw new Error("Failed to fetch LTS version info from dl.deno.land. Please try again later.");
	const version = semver.clean((await res.text()).trim());
	if (version === null) throw new Error("Failed to parse LTS version.");
	return {
		version,
		kind: "lts"
	};
}
async function resolveRelease(range) {
	if (range === "latest") {
		const res = await fetchWithRetries("https://dl.deno.land/release-latest.txt");
		if (res.status !== 200) throw new Error("Failed to fetch release version info from dl.deno.land. Please try again later.");
		let version = (await res.text()).trim();
		version = semver.clean(version);
		if (version === null) throw new Error("Failed to parse release version.");
		return {
			version,
			kind: "stable"
		};
	} else {
		const res = await fetchWithRetries("https://deno.com/versions.json");
		if (res.status !== 200) throw new Error("Failed to fetch stable version info from deno.com/versions.json. Please try again later.");
		const versionJson = await res.json();
		if (typeof versionJson !== "object" || versionJson === null) throw new Error("Fetched stable version info is invalid.");
		if (!("cli" in versionJson)) throw new Error("Fetched stable version info is invalid.");
		if (!Array.isArray(versionJson.cli)) throw new Error("Fetched stable version info is invalid.");
		const versions = versionJson.cli;
		let version = semver.maxSatisfying(versions, range);
		if (version === null) return null;
		version = semver.clean(version);
		if (version === null) throw new Error("UNREACHABLE");
		return {
			version,
			kind: version.includes("-rc.") ? "rc" : "stable"
		};
	}
}
async function fetchWithRetries(url, maxRetries = 5) {
	let sleepMs = 250;
	let iterationCount = 0;
	while (true) {
		iterationCount++;
		try {
			const res = await fetch(url);
			if (res.status === 200 || iterationCount > maxRetries) return res;
		} catch (err) {
			if (iterationCount > maxRetries) throw err;
		}
		console.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
		await new Promise((resolve) => setTimeout(resolve, sleepMs));
		sleepMs = Math.min(sleepMs * 2, 1e4);
	}
}

//#endregion
//#region src/install.ts
async function install(version) {
	const cachedPath = tc.find("deno", version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	if (cachedPath) {
		core.info(`Using cached Deno installation from ${cachedPath}.`);
		core.addPath(cachedPath);
		return;
	}
	const zip = zipName();
	let url;
	switch (version.kind) {
		case "canary":
			url = `https://dl.deno.land/canary/${version.version}/${zip}`;
			break;
		case "rc":
			url = `https://dl.deno.land/release/v${version.version}/${zip}`;
			break;
		case "stable":
		case "lts":
			url = `https://github.com/denoland/deno/releases/download/v${version.version}/${zip}`;
			break;
	}
	core.info(`Downloading Deno from ${url}.`);
	const zipPath = await tc.downloadTool(url);
	const extractedFolder = await tc.extractZip(zipPath);
	const binaryName = core.getInput("deno-binary-name");
	if (binaryName !== "deno") await fs.rename(path$1.join(extractedFolder, process.platform === "win32" ? "deno.exe" : "deno"), path$1.join(extractedFolder, process.platform === "win32" ? binaryName + ".exe" : binaryName));
	const newCachedPath = await tc.cacheDir(extractedFolder, binaryName, version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	core.info(`Cached Deno to ${newCachedPath}.`);
	core.addPath(newCachedPath);
	const denoInstallRoot = process.env.DENO_INSTALL_ROOT || path$1.join(os.homedir(), ".deno", "bin");
	core.addPath(denoInstallRoot);
}
function zipName() {
	let arch;
	switch (process.arch) {
		case "arm64":
			arch = "aarch64";
			break;
		case "x64":
			arch = "x86_64";
			break;
		default: throw new Error(`Unsupported architechture ${process.arch}.`);
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
		default: throw new Error(`Unsupported platform ${process.platform}.`);
	}
	return `deno-${arch}-${platform}.zip`;
}

//#endregion
//#region src/main.ts
function exit(message) {
	core.setFailed(message);
	process.exit();
}
function isCachingEnabled() {
	return core.getInput("cache") === "true" || core.getInput("cache-hash").length > 0;
}
async function main() {
	try {
		const denoVersionFile = core.getInput("deno-version-file");
		const range = parseVersionRange(denoVersionFile ? getDenoVersionFromFile(denoVersionFile) : core.getInput("deno-version"));
		if (range === null) exit("The passed version range is not valid.");
		const version = await resolveVersion(range);
		if (version === null) exit("Could not resolve a version for the given range.");
		core.info(`Going to install ${version.kind} version ${version.version}.`);
		await install(version);
		core.info(`::add-matcher::${path.join(import.meta.dirname ?? ".", "..", "deno-problem-matchers.json")}`);
		core.setOutput("deno-version", version.version);
		core.setOutput("release-channel", version.kind);
		core.info("Installation complete.");
		if (isCachingEnabled()) {
			const { restoreCache } = await import("./cache-DGvoSvnF.js");
			await restoreCache(core.getInput("cache-hash"));
		}
	} catch (err) {
		core.setFailed(err instanceof Error ? err : String(err));
		process.exit();
	}
}
main();

//#endregion