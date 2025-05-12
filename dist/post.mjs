import { import_core } from "./semver-DmxAwBYV.mjs";
import { saveCache } from "./cache-CxD0nROf.mjs";
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