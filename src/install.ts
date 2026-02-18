// Node.js Built-in Modules
import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { pipeline } from "node:stream/promises";

// External Packages
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";

// Project-Specific Types
import type { Version } from "./version.ts";

export async function install(version: Version) {
  const HOSTS = {
    docs: "docs.deno.com",
    dl: "dl.deno.land",
    github: "github.com",
  } as const;

  const docLink =
    `https://${HOSTS.docs}/runtime/manual/getting_started/installation`;

  const cachedPath = tc.find(
    "deno",
    version.kind === "canary" ? `0.0.0-${version.version}` : version.version,
  );
  if (cachedPath) {
    core.info(`Using cached Deno installation from ${cachedPath}.`);
    core.addPath(cachedPath);
    return;
  }

  const getUrl = (file: string, ext = "") => {
    const filename = file + ext;
    const suffix = `${version.version}/${filename}`;

    switch (version.kind) {
      case "canary":
        return `https://${HOSTS.dl}/canary/${suffix}`;
      case "rc":
        return `https://${HOSTS.dl}/release/v${suffix}`;
      default:
        return `https://${HOSTS.github}/denoland/deno/releases/download/v${suffix}`;
    }
  };

  const zip = zipName();
  core.info(`Downloading Deno from ${getUrl(zip)}.`);
  const zipPath = await tc.downloadTool(getUrl(zip));

  try {
    const shaPath = await tc.downloadTool(getUrl(zip, ".sha256sum"));
    const shaContent = await fsPromises.readFile(shaPath, "utf8");

    if (!shaContent.includes(zip)) {
      core.warning(
        `The .sha256sum file does not explicitly mention the remote filename: '${zip}'.`,
      );
    }

    const match = shaContent.match(/[A-Fa-f0-9]{64}/);
    if (!match) throw new Error("FORMAT_ERROR");
    const expectedHash = match[0].toLowerCase();

    const hash = crypto.createHash("sha256");
    await pipeline(fs.createReadStream(zipPath), hash);
    const actualHash = hash.digest("hex");

    if (actualHash !== expectedHash) {
      await fsPromises.unlink(zipPath);
      core.setFailed(
        `Integrity mismatch! Expected ${expectedHash}, got ${actualHash}.`,
      );
      return;
    }
    core.info("Checksum verified successfully.");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("404")) {
      core.warning(
        "No .sha256sum found. Continuing without integrity verification.",
      );
    } else if (message === "FORMAT_ERROR") {
      core.warning(".sha256sum found but no valid hash detected. Continuing.");
    } else {
      core.warning(`Verification skipped: ${message}`);
    }
  }

  const extractedFolder = await tc.extractZip(zipPath);
  const binaryName = core.getInput("deno-binary-name") || "deno";
  const exeSuffix = process.platform === "win32" ? ".exe" : "";
  let binaryPath = path.join(extractedFolder, `deno${exeSuffix}`);

  if (binaryName !== "deno") {
    const newPath = path.join(extractedFolder, `${binaryName}${exeSuffix}`);
    await fsPromises.rename(binaryPath, newPath);
    binaryPath = newPath;
  }

  let stderr = "";
  try {
    core.info("Verifying Deno binary functional integrity...");
    let stdout = "";

    await exec.exec(binaryPath, ["--version"], {
      silent: true,
      delay: (1000) * 10, // seconds
      listeners: {
        stdout: (data) => {
          stdout += data.toString();
        },
        stderr: (data) => {
          stderr += data.toString();
        },
      },
    });

    const expectedArch = process.arch === "x64" ? "x86_64" : "aarch64";
    if (!stdout.includes(expectedArch)) {
      throw new Error(
        `Arch mismatch! Runner is ${process.arch}, Deno reported: ${stdout.trim()}`,
      );
    }
  } catch (err) {
    const errorMsg = stderr.trim() ||
      (err instanceof Error ? err.message : String(err));
    const missingLibs = [...errorMsg.matchAll(/lib[\w\d\.]+\.so\.\d+/g)].map(
      (m) => m[0],
    );

    if (errorMsg.includes("GLIBC_") || errorMsg.includes("GLIBCXX_")) {
      core.setFailed(
        `Deno requires a newer version of glibc/libstdc++ than this runner provides. See: ${docLink}`,
      );
    } else if (missingLibs.length > 0) {
      const libs = [...new Set(missingLibs)].join(", ");
      core.setFailed(
        `Deno failed to start due to missing shared libraries: ${libs}. See: ${docLink}`,
      );
    } else if (errorMsg.includes("Permission denied")) {
      core.setFailed(
        `Execute permission denied. The distribution archive may be missing the executable bit.`,
      );
    } else {
      core.setFailed(`Binary verification failed: ${errorMsg}`);
    }
    return;
  }

  const newCachedPath = await tc.cacheDir(
    extractedFolder,
    binaryName,
    version.kind === "canary" ? `0.0.0-${version.version}` : version.version,
  );

  core.info(`Cached Deno to ${newCachedPath}.`);
  core.addPath(newCachedPath);
  const denoInstallRoot = process.env.DENO_INSTALL_ROOT ||
    path.join(os.homedir(), ".deno", "bin");
  core.addPath(denoInstallRoot);
}

function zipName(): string {
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
