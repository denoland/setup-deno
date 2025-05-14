import { saveCache } from "./cache-TuPH0H7Y.js";
import process from "node:process";
import core from "@actions/core";

//#region src/post.ts
async function main() {
	try {
		await saveCache();
	} catch (err) {
		core.setFailed(err instanceof Error ? err : String(err));
		process.exit();
	}
}
main();

//#endregion