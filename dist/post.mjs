import { import_core } from "./core-dugiPccr.mjs";
import "./semver-DsNchBJJ.mjs";
import { saveCache } from "./cache-_-oG870o.mjs";
import "./minimatch-DXwkXfwe.mjs";
import process from "node:process";

//#region src/post.ts
async function main() {
	try {
		await saveCache();
	} catch (err) {
		import_core.setFailed(err instanceof Error ? err : String(err));
		process.exit();
	}
}
main();

//#endregion