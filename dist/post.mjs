import { import_core } from "./semver-C43QPvfi.mjs";
import { saveCache } from "./cache-BG71A93Z.mjs";
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