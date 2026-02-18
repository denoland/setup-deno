import { f as __toESM, n as require_core } from "./semver-O4tt7wRT.mjs";
import { n as saveCache } from "./cache-DpsdXZtI.mjs";
import process from "node:process";

//#region src/post.ts
var import_core = /* @__PURE__ */ __toESM(require_core(), 1);
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
export {  };