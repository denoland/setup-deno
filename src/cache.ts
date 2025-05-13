import process from "node:process";
import cache from "@actions/cache";
import core from "@actions/core";
import { hashFiles } from "@actions/glob";

const state = {
  DENO_DIR: "DENO_DIR",
  CACHE_HIT: "CACHE_HIT",
  CACHE_SAVE: "CACHE_SAVE",
} as const;

export async function saveCache() {
  if (!cache.isFeatureAvailable()) {
    core.warning("Caching is not available. Caching is skipped.");
    return;
  }

  const denoDir = core.getState(state.DENO_DIR);
  const saveKey = core.getState(state.CACHE_SAVE);
  if (!denoDir || !saveKey) {
    core.info("Caching is not enabled. Caching is skipped.");
    return;
  } else if (core.getState(state.CACHE_HIT) === "true") {
    core.info(
      `Cache hit occurred on the primary key "${saveKey}", not saving cache.`,
    );
    return;
  }

  await cache.saveCache([denoDir], saveKey);
  core.info(`Cache saved with key: "${saveKey}".`);
}

export async function restoreCache(cacheHash: string) {
  try {
    const denoDir = await resolveDenoDir();
    core.saveState(state.DENO_DIR, denoDir);

    if (cacheHash.length === 0) {
      cacheHash = await resolveDefaultCacheKey();
    }

    const { GITHUB_JOB, RUNNER_OS, RUNNER_ARCH } = process.env;
    const restoreKey = `deno-cache-${RUNNER_OS}-${RUNNER_ARCH}`;
    // CI jobs often download different dependencies, so include Job ID in the cache key.
    const primaryKey = `${restoreKey}-${GITHUB_JOB}-${cacheHash}`;
    core.saveState(state.CACHE_SAVE, primaryKey);

    const loadedCacheKey = await cache.restoreCache([denoDir], primaryKey, [
      restoreKey,
    ]);
    const cacheHit = primaryKey === loadedCacheKey;
    core.setOutput("cache-hit", cacheHit);
    core.saveState(state.CACHE_HIT, cacheHit);

    const message = loadedCacheKey
      ? `Cache key used: "${loadedCacheKey}".`
      : `No cache found for restore key: "${restoreKey}".`;
    core.info(message);
  } catch (err) {
    core.warning(
      new Error("Failed to restore cache. Continuing without cache."),
    );
    // core.warning doesn't log error causes, so explicititly log the error
    core.warning(err as Error);
  }
}

function resolveDefaultCacheKey(): Promise<string> {
  return hashFiles(
    "**/deno.lock",
    process.env.GITHUB_WORKSPACE,
  );
}

async function resolveDenoDir(): Promise<string> {
  const { DENO_DIR } = process.env;
  if (DENO_DIR) {
    return DENO_DIR;
  }

  // Retrieve the DENO_DIR from `deno info --json`
  const output = await exec("deno info --json");
  const info = JSON.parse(output);
  if (typeof info.denoDir !== "string") {
    throw new Error(
      "`deno info --json` output did not contain a denoDir property. " +
        "Maybe try updating this action or your Deno version if either are old.",
    );
  }
  return info.denoDir;
}

async function exec(command: string) {
  const { exec } = await import("node:child_process");
  return await new Promise<string>((res, rej) => {
    exec(command, (err, stdout) => err ? rej(err) : res(stdout));
  });
}
