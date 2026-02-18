import { u as setFailed } from "./semver-DXB6lDr5.mjs";
import { n as saveCache } from "./cache-BKNjz_DU.mjs";
import process from "node:process";

//#region src/post.ts
async function main() {
	try {
		await saveCache();
	} catch (err) {
		setFailed(err instanceof Error ? err : String(err));
		process.exit();
	}
}
main();

//#endregion
export {  };