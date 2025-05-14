import process from "node:process";
import core from "@actions/core";
import cache from "@actions/cache";
import { hashFiles } from "@actions/glob";

//#region src/cache.ts
const state = {
	DENO_DIR: "DENO_DIR",
	CACHE_HIT: "CACHE_HIT",
	CACHE_SAVE: "CACHE_SAVE"
};
async function saveCache() {
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
		core.info(`Cache hit occurred on the primary key "${saveKey}", not saving cache.`);
		return;
	}
	await cache.saveCache([denoDir], saveKey);
	core.info(`Cache saved with key: "${saveKey}".`);
}
async function restoreCache(cacheHash) {
	try {
		const denoDir = await resolveDenoDir();
		core.saveState(state.DENO_DIR, denoDir);
		if (cacheHash.length === 0) cacheHash = await resolveDefaultCacheKey();
		const { GITHUB_JOB, RUNNER_OS, RUNNER_ARCH } = process.env;
		const restoreKey = `deno-cache-${RUNNER_OS}-${RUNNER_ARCH}`;
		const primaryKey = `${restoreKey}-${GITHUB_JOB}-${cacheHash}`;
		core.saveState(state.CACHE_SAVE, primaryKey);
		const loadedCacheKey = await cache.restoreCache([denoDir], primaryKey, [restoreKey]);
		const cacheHit = primaryKey === loadedCacheKey;
		core.setOutput("cache-hit", cacheHit);
		core.saveState(state.CACHE_HIT, cacheHit);
		const message = loadedCacheKey ? `Cache key used: "${loadedCacheKey}".` : `No cache found for restore key: "${restoreKey}".`;
		core.info(message);
	} catch (err) {
		core.warning(new Error("Failed to restore cache. Continuing without cache."));
		core.warning(err);
	}
}
function resolveDefaultCacheKey() {
	return hashFiles("**/deno.lock", process.env.GITHUB_WORKSPACE);
}
async function resolveDenoDir() {
	const { DENO_DIR } = process.env;
	if (DENO_DIR) return DENO_DIR;
	const output = await exec("deno info --json");
	const info = JSON.parse(output);
	if (typeof info.denoDir !== "string") throw new Error("`deno info --json` output did not contain a denoDir property. Maybe try updating this action or your Deno version if either are old.");
	return info.denoDir;
}
async function exec(command) {
	const { exec: exec$1 } = await import("node:child_process");
	return await new Promise((res, rej) => {
		exec$1(command, (err, stdout) => err ? rej(err) : res(stdout));
	});
}

//#endregion
export { restoreCache, saveCache };