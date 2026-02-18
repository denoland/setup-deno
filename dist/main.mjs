import { C as require_undici, D as __toESM, _ as rmRF, a as getInput, b as HttpClient, c as isDebug, d as setOutput, g as mkdirP, h as cp, m as exec, n as addPath, p as warning, r as debug, s as info, t as require_semver, u as setFailed, v as which } from "./semver-DXB6lDr5.mjs";
import process$1 from "node:process";
import * as os$3 from "os";
import * as crypto$1 from "crypto";
import * as fs$1 from "fs";
import * as path$2 from "path";
import { ok } from "assert";
import * as util from "util";
import * as crypto from "node:crypto";
import * as console from "node:console";
import * as path$1 from "node:path";
import path from "node:path";
import * as fs$2 from "node:fs";
import { setTimeout as setTimeout$1 } from "node:timers";
import * as fsPromises from "node:fs/promises";
import * as os$2 from "node:os";
import { pipeline } from "node:stream/promises";
import * as stream from "stream";

//#region src/version.ts
var import_semver = /* @__PURE__ */ __toESM(require_semver(), 1);
var import_undici = require_undici();
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
	const range = import_semver.default.validRange(version);
	if (range !== null) return {
		range,
		kind: "stable"
	};
	return null;
}
/** Parses the version from the version file */
function getDenoVersionFromFile(versionFilePath) {
	if (!fs$2.existsSync(versionFilePath)) throw new Error(`The specified node version file at: ${versionFilePath} does not exist`);
	const contents = fs$2.readFileSync(versionFilePath, "utf8");
	return contents.match(/^deno\s+v?(?<version>[^\s]+)$/m)?.groups?.version || contents.trim();
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
		return {
			version: (await res.text()).trim(),
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
	const version = import_semver.default.clean((await res.text()).trim());
	if (version === null) throw new Error("Failed to parse release candidate version.");
	return {
		version,
		kind: "rc"
	};
}
async function resolveLTS() {
	const res = await fetchWithRetries("https://dl.deno.land/release-lts-latest.txt");
	if (res.status !== 200) throw new Error("Failed to fetch LTS version info from dl.deno.land. Please try again later.");
	const version = import_semver.default.clean((await res.text()).trim());
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
		version = import_semver.default.clean(version);
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
		let version = import_semver.default.maxSatisfying(versions, range);
		if (version === null) return null;
		version = import_semver.default.clean(version);
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
			const res = await (0, import_undici.fetch)(url);
			if (res.status === 200 || iterationCount > maxRetries) return res;
		} catch (err) {
			if (iterationCount > maxRetries) throw err;
		}
		console.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
		await new Promise((resolve) => setTimeout$1(resolve, sleepMs));
		sleepMs = Math.min(sleepMs * 2, 1e4);
	}
}

//#endregion
//#region node_modules/.deno/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/manifest.js
var __awaiter$2 = void 0 && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};

//#endregion
//#region node_modules/.deno/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/retry-helper.js
var __awaiter$1 = void 0 && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
/**
* Internal class for retries
*/
var RetryHelper = class {
	constructor(maxAttempts, minSeconds, maxSeconds) {
		if (maxAttempts < 1) throw new Error("max attempts should be greater than or equal to 1");
		this.maxAttempts = maxAttempts;
		this.minSeconds = Math.floor(minSeconds);
		this.maxSeconds = Math.floor(maxSeconds);
		if (this.minSeconds > this.maxSeconds) throw new Error("min seconds should be less than or equal to max seconds");
	}
	execute(action, isRetryable) {
		return __awaiter$1(this, void 0, void 0, function* () {
			let attempt = 1;
			while (attempt < this.maxAttempts) {
				try {
					return yield action();
				} catch (err) {
					if (isRetryable && !isRetryable(err)) throw err;
					info(err.message);
				}
				const seconds = this.getSleepAmount();
				info(`Waiting ${seconds} seconds before trying again`);
				yield this.sleep(seconds);
				attempt++;
			}
			return yield action();
		});
	}
	getSleepAmount() {
		return Math.floor(Math.random() * (this.maxSeconds - this.minSeconds + 1)) + this.minSeconds;
	}
	sleep(seconds) {
		return __awaiter$1(this, void 0, void 0, function* () {
			return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
		});
	}
};

//#endregion
//#region node_modules/.deno/@actions+tool-cache@4.0.0/node_modules/@actions/tool-cache/lib/tool-cache.js
var __awaiter = void 0 && (void 0).__awaiter || function(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
var HTTPError = class extends Error {
	constructor(httpStatusCode) {
		super(`Unexpected HTTP response: ${httpStatusCode}`);
		this.httpStatusCode = httpStatusCode;
		Object.setPrototypeOf(this, new.target.prototype);
	}
};
const IS_WINDOWS = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
const userAgent = "actions/tool-cache";
/**
* Download a tool from an url and stream it into a file
*
* @param url       url of tool to download
* @param dest      path to download tool
* @param auth      authorization header
* @param headers   other headers
* @returns         path to downloaded tool
*/
function downloadTool(url, dest, auth, headers) {
	return __awaiter(this, void 0, void 0, function* () {
		dest = dest || path$2.join(_getTempDirectory(), crypto$1.randomUUID());
		yield mkdirP(path$2.dirname(dest));
		debug(`Downloading ${url}`);
		debug(`Destination ${dest}`);
		return yield new RetryHelper(3, _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10), _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20)).execute(() => __awaiter(this, void 0, void 0, function* () {
			return yield downloadToolAttempt(url, dest || "", auth, headers);
		}), (err) => {
			if (err instanceof HTTPError && err.httpStatusCode) {
				if (err.httpStatusCode < 500 && err.httpStatusCode !== 408 && err.httpStatusCode !== 429) return false;
			}
			return true;
		});
	});
}
function downloadToolAttempt(url, dest, auth, headers) {
	return __awaiter(this, void 0, void 0, function* () {
		if (fs$1.existsSync(dest)) throw new Error(`Destination file path ${dest} already exists`);
		const http = new HttpClient(userAgent, [], { allowRetries: false });
		if (auth) {
			debug("set auth");
			if (headers === void 0) headers = {};
			headers.authorization = auth;
		}
		const response = yield http.get(url, headers);
		if (response.message.statusCode !== 200) {
			const err = new HTTPError(response.message.statusCode);
			debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
			throw err;
		}
		const pipeline = util.promisify(stream.pipeline);
		const readStream = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message)();
		let succeeded = false;
		try {
			yield pipeline(readStream, fs$1.createWriteStream(dest));
			debug("download complete");
			succeeded = true;
			return dest;
		} finally {
			if (!succeeded) {
				debug("download failed");
				try {
					yield rmRF(dest);
				} catch (err) {
					debug(`Failed to delete '${dest}'. ${err.message}`);
				}
			}
		}
	});
}
/**
* Extract a zip
*
* @param file     path to the zip
* @param dest     destination directory. Optional.
* @returns        path to the destination directory
*/
function extractZip(file, dest) {
	return __awaiter(this, void 0, void 0, function* () {
		if (!file) throw new Error("parameter 'file' is required");
		dest = yield _createExtractFolder(dest);
		if (IS_WINDOWS) yield extractZipWin(file, dest);
		else yield extractZipNix(file, dest);
		return dest;
	});
}
function extractZipWin(file, dest) {
	return __awaiter(this, void 0, void 0, function* () {
		const escapedFile = file.replace(/'/g, "''").replace(/"|\n|\r/g, "");
		const escapedDest = dest.replace(/'/g, "''").replace(/"|\n|\r/g, "");
		const pwshPath = yield which("pwsh", false);
		if (pwshPath) {
			const args = [
				"-NoLogo",
				"-NoProfile",
				"-NonInteractive",
				"-ExecutionPolicy",
				"Unrestricted",
				"-Command",
				[
					`$ErrorActionPreference = 'Stop' ;`,
					`try { Add-Type -AssemblyName System.IO.Compression.ZipFile } catch { } ;`,
					`try { [System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`,
					`catch { if (($_.Exception.GetType().FullName -eq 'System.Management.Automation.MethodException') -or ($_.Exception.GetType().FullName -eq 'System.Management.Automation.RuntimeException') ){ Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force } else { throw $_ } } ;`
				].join(" ")
			];
			debug(`Using pwsh at path: ${pwshPath}`);
			yield exec(`"${pwshPath}"`, args);
		} else {
			const args = [
				"-NoLogo",
				"-Sta",
				"-NoProfile",
				"-NonInteractive",
				"-ExecutionPolicy",
				"Unrestricted",
				"-Command",
				[
					`$ErrorActionPreference = 'Stop' ;`,
					`try { Add-Type -AssemblyName System.IO.Compression.FileSystem } catch { } ;`,
					`if ((Get-Command -Name Expand-Archive -Module Microsoft.PowerShell.Archive -ErrorAction Ignore)) { Expand-Archive -LiteralPath '${escapedFile}' -DestinationPath '${escapedDest}' -Force }`,
					`else {[System.IO.Compression.ZipFile]::ExtractToDirectory('${escapedFile}', '${escapedDest}', $true) }`
				].join(" ")
			];
			const powershellPath = yield which("powershell", true);
			debug(`Using powershell at path: ${powershellPath}`);
			yield exec(`"${powershellPath}"`, args);
		}
	});
}
function extractZipNix(file, dest) {
	return __awaiter(this, void 0, void 0, function* () {
		const unzipPath = yield which("unzip", true);
		const args = [file];
		if (!isDebug()) args.unshift("-q");
		args.unshift("-o");
		yield exec(`"${unzipPath}"`, args, { cwd: dest });
	});
}
/**
* Caches a directory and installs it into the tool cacheDir
*
* @param sourceDir    the directory to cache into tools
* @param tool          tool name
* @param version       version of the tool.  semver format
* @param arch          architecture of the tool.  Optional.  Defaults to machine architecture
*/
function cacheDir(sourceDir, tool, version, arch) {
	return __awaiter(this, void 0, void 0, function* () {
		version = import_semver.clean(version) || version;
		arch = arch || os$3.arch();
		debug(`Caching tool ${tool} ${version} ${arch}`);
		debug(`source dir: ${sourceDir}`);
		if (!fs$1.statSync(sourceDir).isDirectory()) throw new Error("sourceDir is not a directory");
		const destPath = yield _createToolPath(tool, version, arch);
		for (const itemName of fs$1.readdirSync(sourceDir)) {
			const s = path$2.join(sourceDir, itemName);
			yield cp(s, destPath, { recursive: true });
		}
		_completeToolPath(tool, version, arch);
		return destPath;
	});
}
/**
* Finds the path to a tool version in the local installed tool cache
*
* @param toolName      name of the tool
* @param versionSpec   version of the tool
* @param arch          optional arch.  defaults to arch of computer
*/
function find(toolName, versionSpec, arch) {
	if (!toolName) throw new Error("toolName parameter is required");
	if (!versionSpec) throw new Error("versionSpec parameter is required");
	arch = arch || os$3.arch();
	if (!isExplicitVersion(versionSpec)) versionSpec = evaluateVersions(findAllVersions(toolName, arch), versionSpec);
	let toolPath = "";
	if (versionSpec) {
		versionSpec = import_semver.clean(versionSpec) || "";
		const cachePath = path$2.join(_getCacheDirectory(), toolName, versionSpec, arch);
		debug(`checking cache: ${cachePath}`);
		if (fs$1.existsSync(cachePath) && fs$1.existsSync(`${cachePath}.complete`)) {
			debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
			toolPath = cachePath;
		} else debug("not found");
	}
	return toolPath;
}
/**
* Finds the paths to all versions of a tool that are installed in the local tool cache
*
* @param toolName  name of the tool
* @param arch      optional arch.  defaults to arch of computer
*/
function findAllVersions(toolName, arch) {
	const versions = [];
	arch = arch || os$3.arch();
	const toolPath = path$2.join(_getCacheDirectory(), toolName);
	if (fs$1.existsSync(toolPath)) {
		const children = fs$1.readdirSync(toolPath);
		for (const child of children) if (isExplicitVersion(child)) {
			const fullPath = path$2.join(toolPath, child, arch || "");
			if (fs$1.existsSync(fullPath) && fs$1.existsSync(`${fullPath}.complete`)) versions.push(child);
		}
	}
	return versions;
}
function _createExtractFolder(dest) {
	return __awaiter(this, void 0, void 0, function* () {
		if (!dest) dest = path$2.join(_getTempDirectory(), crypto$1.randomUUID());
		yield mkdirP(dest);
		return dest;
	});
}
function _createToolPath(tool, version, arch) {
	return __awaiter(this, void 0, void 0, function* () {
		const folderPath = path$2.join(_getCacheDirectory(), tool, import_semver.clean(version) || version, arch || "");
		debug(`destination ${folderPath}`);
		const markerPath = `${folderPath}.complete`;
		yield rmRF(folderPath);
		yield rmRF(markerPath);
		yield mkdirP(folderPath);
		return folderPath;
	});
}
function _completeToolPath(tool, version, arch) {
	const markerPath = `${path$2.join(_getCacheDirectory(), tool, import_semver.clean(version) || version, arch || "")}.complete`;
	fs$1.writeFileSync(markerPath, "");
	debug("finished caching tool");
}
/**
* Check if version string is explicit
*
* @param versionSpec      version string to check
*/
function isExplicitVersion(versionSpec) {
	const c = import_semver.clean(versionSpec) || "";
	debug(`isExplicit: ${c}`);
	const valid = import_semver.valid(c) != null;
	debug(`explicit? ${valid}`);
	return valid;
}
/**
* Get the highest satisfiying semantic version in `versions` which satisfies `versionSpec`
*
* @param versions        array of versions to evaluate
* @param versionSpec     semantic version spec to satisfy
*/
function evaluateVersions(versions, versionSpec) {
	let version = "";
	debug(`evaluating ${versions.length} versions`);
	versions = versions.sort((a, b) => {
		if (import_semver.gt(a, b)) return 1;
		return -1;
	});
	for (let i = versions.length - 1; i >= 0; i--) {
		const potential = versions[i];
		if (import_semver.satisfies(potential, versionSpec)) {
			version = potential;
			break;
		}
	}
	if (version) debug(`matched: ${version}`);
	else debug("match not found");
	return version;
}
/**
* Gets RUNNER_TOOL_CACHE
*/
function _getCacheDirectory() {
	const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
	ok(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
	return cacheDirectory;
}
/**
* Gets RUNNER_TEMP
*/
function _getTempDirectory() {
	const tempDirectory = process.env["RUNNER_TEMP"] || "";
	ok(tempDirectory, "Expected RUNNER_TEMP to be defined");
	return tempDirectory;
}
/**
* Gets a global variable
*/
function _getGlobal(key, defaultValue) {
	const value = global[key];
	return value !== void 0 ? value : defaultValue;
}

//#endregion
//#region src/install.ts
async function install(version) {
	const HOSTS = {
		docs: "docs.deno.com",
		dl: "dl.deno.land",
		github: "github.com"
	};
	const docLink = `https://${HOSTS.docs}/runtime/manual/getting_started/installation`;
	const cachedPath = find("deno", version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	if (cachedPath) {
		info(`Using cached Deno installation from ${cachedPath}.`);
		addPath(cachedPath);
		return;
	}
	const getUrl = (file, ext = "") => {
		const filename = file + ext;
		const suffix = `${version.version}/${filename}`;
		switch (version.kind) {
			case "canary": return `https://${HOSTS.dl}/canary/${suffix}`;
			case "rc": return `https://${HOSTS.dl}/release/v${suffix}`;
			default: return `https://${HOSTS.github}/denoland/deno/releases/download/v${suffix}`;
		}
	};
	const zip = zipName();
	info(`Downloading Deno from ${getUrl(zip)}.`);
	const zipPath = await downloadTool(getUrl(zip));
	try {
		const shaPath = await downloadTool(getUrl(zip, ".sha256sum"));
		const shaContent = await fsPromises.readFile(shaPath, "utf8");
		if (!shaContent.includes(zip)) warning(`The .sha256sum file does not explicitly mention the remote filename: '${zip}'.`);
		const match = shaContent.match(/[A-Fa-f0-9]{64}/);
		if (!match) throw new Error("FORMAT_ERROR");
		const expectedHash = match[0].toLowerCase();
		const hash = crypto.createHash("sha256");
		await pipeline(fs$2.createReadStream(zipPath), hash);
		const actualHash = hash.digest("hex");
		if (actualHash !== expectedHash) {
			await fsPromises.unlink(zipPath);
			setFailed(`Integrity mismatch! Expected ${expectedHash}, got ${actualHash}.`);
			return;
		}
		info("Checksum verified successfully.");
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		if (message.includes("404")) warning("No .sha256sum found. Continuing without integrity verification.");
		else if (message === "FORMAT_ERROR") warning(".sha256sum found but no valid hash detected. Continuing.");
		else warning(`Verification skipped: ${message}`);
	}
	const extractedFolder = await extractZip(zipPath);
	const binaryName = getInput("deno-binary-name") || "deno";
	const exeSuffix = process$1.platform === "win32" ? ".exe" : "";
	let binaryPath = path$1.join(extractedFolder, `deno${exeSuffix}`);
	if (binaryName !== "deno") {
		const newPath = path$1.join(extractedFolder, `${binaryName}${exeSuffix}`);
		await fsPromises.rename(binaryPath, newPath);
		binaryPath = newPath;
	}
	let stderr = "";
	try {
		info("Verifying Deno binary functional integrity...");
		let stdout = "";
		await exec(binaryPath, ["--version"], {
			silent: true,
			delay: 1e3 * 10,
			listeners: {
				stdout: (data) => {
					stdout += data.toString();
				},
				stderr: (data) => {
					stderr += data.toString();
				}
			}
		});
		const expectedArch = process$1.arch === "x64" ? "x86_64" : "aarch64";
		if (!stdout.includes(expectedArch)) throw new Error(`Arch mismatch! Runner is ${process$1.arch}, Deno reported: ${stdout.trim()}`);
	} catch (err) {
		const errorMsg = stderr.trim() || (err instanceof Error ? err.message : String(err));
		const missingLibs = [...errorMsg.matchAll(/lib[\w\d\.]+\.so\.\d+/g)].map((m) => m[0]);
		if (errorMsg.includes("GLIBC_") || errorMsg.includes("GLIBCXX_")) setFailed(`Deno requires a newer version of glibc/libstdc++ than this runner provides. See: ${docLink}`);
		else if (missingLibs.length > 0) {
			const libs = [...new Set(missingLibs)].join(", ");
			setFailed(`Deno failed to start due to missing shared libraries: ${libs}. See: ${docLink}`);
		} else if (errorMsg.includes("Permission denied")) setFailed(`Execute permission denied. The distribution archive may be missing the executable bit.`);
		else setFailed(`Binary verification failed: ${errorMsg}`);
		return;
	}
	const newCachedPath = await cacheDir(extractedFolder, binaryName, version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	info(`Cached Deno to ${newCachedPath}.`);
	addPath(newCachedPath);
	const denoInstallRoot = process$1.env.DENO_INSTALL_ROOT || path$1.join(os$2.homedir(), ".deno", "bin");
	addPath(denoInstallRoot);
}
function zipName() {
	let arch;
	switch (process$1.arch) {
		case "arm64":
			arch = "aarch64";
			break;
		case "x64":
			arch = "x86_64";
			break;
		default: throw new Error(`Unsupported architechture ${process$1.arch}.`);
	}
	let platform;
	switch (process$1.platform) {
		case "linux":
			platform = "unknown-linux-gnu";
			break;
		case "darwin":
			platform = "apple-darwin";
			break;
		case "win32":
			platform = "pc-windows-msvc";
			break;
		default: throw new Error(`Unsupported platform ${process$1.platform}.`);
	}
	return `deno-${arch}-${platform}.zip`;
}

//#endregion
//#region src/main.ts
function exit(message) {
	setFailed(message);
	process$1.exit();
}
function isCachingEnabled() {
	return getInput("cache") === "true" || getInput("cache-hash").length > 0;
}
async function main() {
	try {
		const denoVersionFile = getInput("deno-version-file");
		const range = parseVersionRange(denoVersionFile ? getDenoVersionFromFile(denoVersionFile) : getInput("deno-version"));
		if (range === null) exit("The passed version range is not valid.");
		const version = await resolveVersion(range);
		if (version === null) exit("Could not resolve a version for the given range.");
		info(`Going to install ${version.kind} version ${version.version}.`);
		await install(version);
		info(`::add-matcher::${path.join(import.meta.dirname ?? ".", "..", "deno-problem-matchers.json")}`);
		setOutput("deno-version", version.version);
		setOutput("release-channel", version.kind);
		info("Installation complete.");
		if (isCachingEnabled()) {
			const { restoreCache } = await import("./cache-BKNjz_DU.mjs").then((n) => n.t);
			await restoreCache(getInput("cache-hash"));
		}
	} catch (err) {
		setFailed(err instanceof Error ? err : String(err));
		process$1.exit();
	}
}
main();

//#endregion
export {  };