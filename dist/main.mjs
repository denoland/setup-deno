import { f as __toESM, i as require_io, n as require_core, o as require_lib, r as require_exec, s as __commonJSMin, t as require_semver$2, u as __require } from "./semver-O4tt7wRT.mjs";
import process$1 from "node:process";
import * as console$1 from "node:console";
import * as path$1 from "node:path";
import path from "node:path";
import * as fs$3 from "node:fs";
import { setTimeout as setTimeout$1 } from "node:timers";
import * as os from "node:os";
import * as fs from "node:fs/promises";

//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SEMVER_SPEC_VERSION = "2.0.0";
	const MAX_LENGTH = 256;
	const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
	const MAX_SAFE_COMPONENT_LENGTH = 16;
	const MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
	const RELEASE_TYPES = [
		"major",
		"premajor",
		"minor",
		"preminor",
		"patch",
		"prepatch",
		"prerelease"
	];
	module.exports = {
		MAX_LENGTH,
		MAX_SAFE_COMPONENT_LENGTH,
		MAX_SAFE_BUILD_LENGTH,
		MAX_SAFE_INTEGER,
		RELEASE_TYPES,
		SEMVER_SPEC_VERSION,
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/debug.js
var require_debug = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {};
	module.exports = debug;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/re.js
var require_re = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const { MAX_SAFE_COMPONENT_LENGTH, MAX_SAFE_BUILD_LENGTH, MAX_LENGTH } = require_constants();
	const debug = require_debug();
	exports = module.exports = {};
	const re = exports.re = [];
	const safeRe = exports.safeRe = [];
	const src = exports.src = [];
	const safeSrc = exports.safeSrc = [];
	const t = exports.t = {};
	let R = 0;
	const LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	const safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	const makeSafeRegex = (value) => {
		for (const [token, max] of safeRegexReplacements) value = value.split(`${token}*`).join(`${token}{0,${max}}`).split(`${token}+`).join(`${token}{1,${max}}`);
		return value;
	};
	const createToken = (name, value, isGlobal) => {
		const safe = makeSafeRegex(value);
		const index = R++;
		debug(name, index, value);
		t[name] = index;
		src[index] = value;
		safeSrc[index] = safe;
		re[index] = new RegExp(value, isGlobal ? "g" : void 0);
		safeRe[index] = new RegExp(safe, isGlobal ? "g" : void 0);
	};
	createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
	createToken("NUMERICIDENTIFIERLOOSE", "\\d+");
	createToken("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${LETTERDASHNUMBER}*`);
	createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
	createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIER]})`);
	createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NONNUMERICIDENTIFIER]}|${src[t.NUMERICIDENTIFIERLOOSE]})`);
	createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
	createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
	createToken("BUILDIDENTIFIER", `${LETTERDASHNUMBER}+`);
	createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
	createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
	createToken("FULL", `^${src[t.FULLPLAIN]}$`);
	createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
	createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
	createToken("GTLT", "((?:<|>)?=?)");
	createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
	createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
	createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COERCEPLAIN", `(^|[^\\d])(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?`);
	createToken("COERCE", `${src[t.COERCEPLAIN]}(?:$|[^\\d])`);
	createToken("COERCEFULL", src[t.COERCEPLAIN] + `(?:${src[t.PRERELEASE]})?(?:${src[t.BUILD]})?(?:$|[^\\d])`);
	createToken("COERCERTL", src[t.COERCE], true);
	createToken("COERCERTLFULL", src[t.COERCEFULL], true);
	createToken("LONETILDE", "(?:~>?)");
	createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = "$1~";
	createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("LONECARET", "(?:\\^)");
	createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = "$1^";
	createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
	createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
	createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = "$1$2$3";
	createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
	createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
	createToken("STAR", "(<|>)?=?\\s*\\*");
	createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
	createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/parse-options.js
var require_parse_options = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const looseOption = Object.freeze({ loose: true });
	const emptyOpts = Object.freeze({});
	const parseOptions = (options) => {
		if (!options) return emptyOpts;
		if (typeof options !== "object") return looseOption;
		return options;
	};
	module.exports = parseOptions;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/identifiers.js
var require_identifiers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const numeric = /^[0-9]+$/;
	const compareIdentifiers = (a, b) => {
		if (typeof a === "number" && typeof b === "number") return a === b ? 0 : a < b ? -1 : 1;
		const anum = numeric.test(a);
		const bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	};
	const rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
	module.exports = {
		compareIdentifiers,
		rcompareIdentifiers
	};
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/classes/semver.js
var require_semver$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const debug = require_debug();
	const { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
	const { safeRe: re, t } = require_re();
	const parseOptions = require_parse_options();
	const { compareIdentifiers } = require_identifiers();
	var SemVer = class SemVer {
		constructor(version, options) {
			options = parseOptions(options);
			if (version instanceof SemVer) if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
			else version = version.version;
			else if (typeof version !== "string") throw new TypeError(`Invalid version. Must be a string. Got type "${typeof version}".`);
			if (version.length > MAX_LENGTH) throw new TypeError(`version is longer than ${MAX_LENGTH} characters`);
			debug("SemVer", version, options);
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
			if (!m) throw new TypeError(`Invalid Version: ${version}`);
			this.raw = version;
			this.major = +m[1];
			this.minor = +m[2];
			this.patch = +m[3];
			if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
			if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
			if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
			if (!m[4]) this.prerelease = [];
			else this.prerelease = m[4].split(".").map((id) => {
				if (/^[0-9]+$/.test(id)) {
					const num = +id;
					if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
				}
				return id;
			});
			this.build = m[5] ? m[5].split(".") : [];
			this.format();
		}
		format() {
			this.version = `${this.major}.${this.minor}.${this.patch}`;
			if (this.prerelease.length) this.version += `-${this.prerelease.join(".")}`;
			return this.version;
		}
		toString() {
			return this.version;
		}
		compare(other) {
			debug("SemVer.compare", this.version, this.options, other);
			if (!(other instanceof SemVer)) {
				if (typeof other === "string" && other === this.version) return 0;
				other = new SemVer(other, this.options);
			}
			if (other.version === this.version) return 0;
			return this.compareMain(other) || this.comparePre(other);
		}
		compareMain(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.major < other.major) return -1;
			if (this.major > other.major) return 1;
			if (this.minor < other.minor) return -1;
			if (this.minor > other.minor) return 1;
			if (this.patch < other.patch) return -1;
			if (this.patch > other.patch) return 1;
			return 0;
		}
		comparePre(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			if (this.prerelease.length && !other.prerelease.length) return -1;
			else if (!this.prerelease.length && other.prerelease.length) return 1;
			else if (!this.prerelease.length && !other.prerelease.length) return 0;
			let i = 0;
			do {
				const a = this.prerelease[i];
				const b = other.prerelease[i];
				debug("prerelease compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		compareBuild(other) {
			if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
			let i = 0;
			do {
				const a = this.build[i];
				const b = other.build[i];
				debug("build compare", i, a, b);
				if (a === void 0 && b === void 0) return 0;
				else if (b === void 0) return 1;
				else if (a === void 0) return -1;
				else if (a === b) continue;
				else return compareIdentifiers(a, b);
			} while (++i);
		}
		inc(release, identifier, identifierBase) {
			if (release.startsWith("pre")) {
				if (!identifier && identifierBase === false) throw new Error("invalid increment argument: identifier is empty");
				if (identifier) {
					const match = `-${identifier}`.match(this.options.loose ? re[t.PRERELEASELOOSE] : re[t.PRERELEASE]);
					if (!match || match[1] !== identifier) throw new Error(`invalid identifier: ${identifier}`);
				}
			}
			switch (release) {
				case "premajor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor = 0;
					this.major++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "preminor":
					this.prerelease.length = 0;
					this.patch = 0;
					this.minor++;
					this.inc("pre", identifier, identifierBase);
					break;
				case "prepatch":
					this.prerelease.length = 0;
					this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "prerelease":
					if (this.prerelease.length === 0) this.inc("patch", identifier, identifierBase);
					this.inc("pre", identifier, identifierBase);
					break;
				case "release":
					if (this.prerelease.length === 0) throw new Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
					this.minor = 0;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "minor":
					if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
					this.patch = 0;
					this.prerelease = [];
					break;
				case "patch":
					if (this.prerelease.length === 0) this.patch++;
					this.prerelease = [];
					break;
				case "pre": {
					const base = Number(identifierBase) ? 1 : 0;
					if (this.prerelease.length === 0) this.prerelease = [base];
					else {
						let i = this.prerelease.length;
						while (--i >= 0) if (typeof this.prerelease[i] === "number") {
							this.prerelease[i]++;
							i = -2;
						}
						if (i === -1) {
							if (identifier === this.prerelease.join(".") && identifierBase === false) throw new Error("invalid increment argument: identifier already exists");
							this.prerelease.push(base);
						}
					}
					if (identifier) {
						let prerelease = [identifier, base];
						if (identifierBase === false) prerelease = [identifier];
						if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
							if (isNaN(this.prerelease[1])) this.prerelease = prerelease;
						} else this.prerelease = prerelease;
					}
					break;
				}
				default: throw new Error(`invalid increment argument: ${release}`);
			}
			this.raw = this.format();
			if (this.build.length) this.raw += `+${this.build.join(".")}`;
			return this;
		}
	};
	module.exports = SemVer;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/valid.js
var require_valid$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const valid = (version, options) => {
		const v = parse(version, options);
		return v ? v.version : null;
	};
	module.exports = valid;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/clean.js
var require_clean = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const clean = (version, options) => {
		const s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	};
	module.exports = clean;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/inc.js
var require_inc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const inc = (version, release, options, identifier, identifierBase) => {
		if (typeof options === "string") {
			identifierBase = identifier;
			identifier = options;
			options = void 0;
		}
		try {
			return new SemVer(version instanceof SemVer ? version.version : version, options).inc(release, identifier, identifierBase).version;
		} catch (er) {
			return null;
		}
	};
	module.exports = inc;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/diff.js
var require_diff = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const diff = (version1, version2) => {
		const v1 = parse(version1, null, true);
		const v2 = parse(version2, null, true);
		const comparison = v1.compare(v2);
		if (comparison === 0) return null;
		const v1Higher = comparison > 0;
		const highVersion = v1Higher ? v1 : v2;
		const lowVersion = v1Higher ? v2 : v1;
		const highHasPre = !!highVersion.prerelease.length;
		if (!!lowVersion.prerelease.length && !highHasPre) {
			if (!lowVersion.patch && !lowVersion.minor) return "major";
			if (lowVersion.compareMain(highVersion) === 0) {
				if (lowVersion.minor && !lowVersion.patch) return "minor";
				return "patch";
			}
		}
		const prefix = highHasPre ? "pre" : "";
		if (v1.major !== v2.major) return prefix + "major";
		if (v1.minor !== v2.minor) return prefix + "minor";
		if (v1.patch !== v2.patch) return prefix + "patch";
		return "prerelease";
	};
	module.exports = diff;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/major.js
var require_major = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const major = (a, loose) => new SemVer(a, loose).major;
	module.exports = major;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/minor.js
var require_minor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const minor = (a, loose) => new SemVer(a, loose).minor;
	module.exports = minor;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/patch.js
var require_patch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const patch = (a, loose) => new SemVer(a, loose).patch;
	module.exports = patch;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/prerelease.js
var require_prerelease = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const parse = require_parse();
	const prerelease = (version, options) => {
		const parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	};
	module.exports = prerelease;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/compare.js
var require_compare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
	module.exports = compare;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/rcompare.js
var require_rcompare = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const rcompare = (a, b, loose) => compare(b, a, loose);
	module.exports = rcompare;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/compare-loose.js
var require_compare_loose = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const compareLoose = (a, b) => compare(a, b, true);
	module.exports = compareLoose;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/compare-build.js
var require_compare_build = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const compareBuild = (a, b, loose) => {
		const versionA = new SemVer(a, loose);
		const versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	};
	module.exports = compareBuild;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/sort.js
var require_sort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
	module.exports = sort;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/rsort.js
var require_rsort = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compareBuild = require_compare_build();
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	module.exports = rsort;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/gt.js
var require_gt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gt = (a, b, loose) => compare(a, b, loose) > 0;
	module.exports = gt;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/lt.js
var require_lt = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lt = (a, b, loose) => compare(a, b, loose) < 0;
	module.exports = lt;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/eq.js
var require_eq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const eq = (a, b, loose) => compare(a, b, loose) === 0;
	module.exports = eq;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/neq.js
var require_neq = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const neq = (a, b, loose) => compare(a, b, loose) !== 0;
	module.exports = neq;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/gte.js
var require_gte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const gte = (a, b, loose) => compare(a, b, loose) >= 0;
	module.exports = gte;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/lte.js
var require_lte = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const compare = require_compare();
	const lte = (a, b, loose) => compare(a, b, loose) <= 0;
	module.exports = lte;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/cmp.js
var require_cmp = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const eq = require_eq();
	const neq = require_neq();
	const gt = require_gt();
	const gte = require_gte();
	const lt = require_lt();
	const lte = require_lte();
	const cmp = (a, op, b, loose) => {
		switch (op) {
			case "===":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a === b;
			case "!==":
				if (typeof a === "object") a = a.version;
				if (typeof b === "object") b = b.version;
				return a !== b;
			case "":
			case "=":
			case "==": return eq(a, b, loose);
			case "!=": return neq(a, b, loose);
			case ">": return gt(a, b, loose);
			case ">=": return gte(a, b, loose);
			case "<": return lt(a, b, loose);
			case "<=": return lte(a, b, loose);
			default: throw new TypeError(`Invalid operator: ${op}`);
		}
	};
	module.exports = cmp;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const parse = require_parse();
	const { safeRe: re, t } = require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		return parse(`${major}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/internal/lrucache.js
var require_lrucache = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var LRUCache = class {
		constructor() {
			this.max = 1e3;
			this.map = /* @__PURE__ */ new Map();
		}
		get(key) {
			const value = this.map.get(key);
			if (value === void 0) return;
			else {
				this.map.delete(key);
				this.map.set(key, value);
				return value;
			}
		}
		delete(key) {
			return this.map.delete(key);
		}
		set(key, value) {
			if (!this.delete(key) && value !== void 0) {
				if (this.map.size >= this.max) {
					const firstKey = this.map.keys().next().value;
					this.delete(firstKey);
				}
				this.map.set(key, value);
			}
			return this;
		}
	};
	module.exports = LRUCache;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/classes/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SPACE_CHARACTERS = /\s+/g;
	var Range = class Range {
		constructor(range, options) {
			options = parseOptions(options);
			if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
			else return new Range(range.raw, options);
			if (range instanceof Comparator) {
				this.raw = range.value;
				this.set = [[range]];
				this.formatted = void 0;
				return this;
			}
			this.options = options;
			this.loose = !!options.loose;
			this.includePrerelease = !!options.includePrerelease;
			this.raw = range.trim().replace(SPACE_CHARACTERS, " ");
			this.set = this.raw.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
			if (!this.set.length) throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				const first = this.set[0];
				this.set = this.set.filter((c) => !isNullSet(c[0]));
				if (this.set.length === 0) this.set = [first];
				else if (this.set.length > 1) {
					for (const c of this.set) if (c.length === 1 && isAny(c[0])) {
						this.set = [c];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let i = 0; i < this.set.length; i++) {
					if (i > 0) this.formatted += "||";
					const comps = this.set[i];
					for (let k = 0; k < comps.length; k++) {
						if (k > 0) this.formatted += " ";
						this.formatted += comps[k].toString().trim();
					}
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(range) {
			const memoKey = ((this.options.includePrerelease && FLAG_INCLUDE_PRERELEASE) | (this.options.loose && FLAG_LOOSE)) + ":" + range;
			const cached = cache.get(memoKey);
			if (cached) return cached;
			const loose = this.options.loose;
			const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
			range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
			debug("hyphen replace", range);
			range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
			debug("comparator trim", range);
			range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
			debug("tilde trim", range);
			range = range.replace(re[t.CARETTRIM], caretTrimReplace);
			debug("caret trim", range);
			let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
			if (loose) rangeList = rangeList.filter((comp) => {
				debug("loose invalid filter", comp, this.options);
				return !!comp.match(re[t.COMPARATORLOOSE]);
			});
			debug("range list", rangeList);
			const rangeMap = /* @__PURE__ */ new Map();
			const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
			for (const comp of comparators) {
				if (isNullSet(comp)) return [comp];
				rangeMap.set(comp.value, comp);
			}
			if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("");
			const result = [...rangeMap.values()];
			cache.set(memoKey, result);
			return result;
		}
		intersects(range, options) {
			if (!(range instanceof Range)) throw new TypeError("a Range is required");
			return this.set.some((thisComparators) => {
				return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
					return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
						return rangeComparators.every((rangeComparator) => {
							return thisComparator.intersects(rangeComparator, options);
						});
					});
				});
			});
		}
		test(version) {
			if (!version) return false;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			for (let i = 0; i < this.set.length; i++) if (testSet(this.set[i], version, this.options)) return true;
			return false;
		}
	};
	module.exports = Range;
	const cache = new (require_lrucache())();
	const parseOptions = require_parse_options();
	const Comparator = require_comparator();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const { safeRe: re, t, comparatorTrimReplace, tildeTrimReplace, caretTrimReplace } = require_re();
	const { FLAG_INCLUDE_PRERELEASE, FLAG_LOOSE } = require_constants();
	const isNullSet = (c) => c.value === "<0.0.0-0";
	const isAny = (c) => c.value === "";
	const isSatisfiable = (comparators, options) => {
		let result = true;
		const remainingComparators = comparators.slice();
		let testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every((otherComparator) => {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	};
	const parseComparator = (comp, options) => {
		comp = comp.replace(re[t.BUILD], "");
		debug("comp", comp, options);
		comp = replaceCarets(comp, options);
		debug("caret", comp);
		comp = replaceTildes(comp, options);
		debug("tildes", comp);
		comp = replaceXRanges(comp, options);
		debug("xrange", comp);
		comp = replaceStars(comp, options);
		debug("stars", comp);
		return comp;
	};
	const isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
	const replaceTildes = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceTilde(c, options)).join(" ");
	};
	const replaceTilde = (comp, options) => {
		const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("tilde", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
			else if (isX(p)) ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
			} else ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
			debug("tilde return", ret);
			return ret;
		});
	};
	const replaceCarets = (comp, options) => {
		return comp.trim().split(/\s+/).map((c) => replaceCaret(c, options)).join(" ");
	};
	const replaceCaret = (comp, options) => {
		debug("caret", comp, options);
		const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
		const z = options.includePrerelease ? "-0" : "";
		return comp.replace(r, (_, M, m, p, pr) => {
			debug("caret", comp, _, M, m, p, pr);
			let ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
			else if (isX(p)) if (M === "0") ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
			else ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
				else ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
				else ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
			}
			debug("caret return", ret);
			return ret;
		});
	};
	const replaceXRanges = (comp, options) => {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map((c) => replaceXRange(c, options)).join(" ");
	};
	const replaceXRange = (comp, options) => {
		comp = comp.trim();
		const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
		return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			const xM = isX(M);
			const xm = xM || isX(m);
			const xp = xm || isX(p);
			const anyX = xp;
			if (gtlt === "=" && anyX) gtlt = "";
			pr = options.includePrerelease ? "-0" : "";
			if (xM) if (gtlt === ">" || gtlt === "<") ret = "<0.0.0-0";
			else ret = "*";
			else if (gtlt && anyX) {
				if (xm) m = 0;
				p = 0;
				if (gtlt === ">") {
					gtlt = ">=";
					if (xm) {
						M = +M + 1;
						m = 0;
						p = 0;
					} else {
						m = +m + 1;
						p = 0;
					}
				} else if (gtlt === "<=") {
					gtlt = "<";
					if (xm) M = +M + 1;
					else m = +m + 1;
				}
				if (gtlt === "<") pr = "-0";
				ret = `${gtlt + M}.${m}.${p}${pr}`;
			} else if (xm) ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
			else if (xp) ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
			debug("xRange return", ret);
			return ret;
		});
	};
	const replaceStars = (comp, options) => {
		debug("replaceStars", comp, options);
		return comp.trim().replace(re[t.STAR], "");
	};
	const replaceGTE0 = (comp, options) => {
		debug("replaceGTE0", comp, options);
		return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
	};
	const hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr) => {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
		else if (isX(fp)) from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
		else if (fpr) from = `>=${from}`;
		else from = `>=${from}${incPr ? "-0" : ""}`;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = `<${+tM + 1}.0.0-0`;
		else if (isX(tp)) to = `<${tM}.${+tm + 1}.0-0`;
		else if (tpr) to = `<=${tM}.${tm}.${tp}-${tpr}`;
		else if (incPr) to = `<${tM}.${tm}.${+tp + 1}-0`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	};
	const testSet = (set, version, options) => {
		for (let i = 0; i < set.length; i++) if (!set[i].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (let i = 0; i < set.length; i++) {
				debug(set[i].semver);
				if (set[i].semver === Comparator.ANY) continue;
				if (set[i].semver.prerelease.length > 0) {
					const allowed = set[i].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	};
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/classes/comparator.js
var require_comparator = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const ANY = Symbol("SemVer ANY");
	var Comparator = class Comparator {
		static get ANY() {
			return ANY;
		}
		constructor(comp, options) {
			options = parseOptions(options);
			if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
			else comp = comp.value;
			comp = comp.trim().split(/\s+/).join(" ");
			debug("comparator", comp, options);
			this.options = options;
			this.loose = !!options.loose;
			this.parse(comp);
			if (this.semver === ANY) this.value = "";
			else this.value = this.operator + this.semver.version;
			debug("comp", this);
		}
		parse(comp) {
			const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
			const m = comp.match(r);
			if (!m) throw new TypeError(`Invalid comparator: ${comp}`);
			this.operator = m[1] !== void 0 ? m[1] : "";
			if (this.operator === "=") this.operator = "";
			if (!m[2]) this.semver = ANY;
			else this.semver = new SemVer(m[2], this.options.loose);
		}
		toString() {
			return this.value;
		}
		test(version) {
			debug("Comparator.test", version, this.options.loose);
			if (this.semver === ANY || version === ANY) return true;
			if (typeof version === "string") try {
				version = new SemVer(version, this.options);
			} catch (er) {
				return false;
			}
			return cmp(version, this.operator, this.semver, this.options);
		}
		intersects(comp, options) {
			if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
			if (this.operator === "") {
				if (this.value === "") return true;
				return new Range(comp.value, options).test(this.value);
			} else if (comp.operator === "") {
				if (comp.value === "") return true;
				return new Range(this.value, options).test(comp.semver);
			}
			options = parseOptions(options);
			if (options.includePrerelease && (this.value === "<0.0.0-0" || comp.value === "<0.0.0-0")) return false;
			if (!options.includePrerelease && (this.value.startsWith("<0.0.0") || comp.value.startsWith("<0.0.0"))) return false;
			if (this.operator.startsWith(">") && comp.operator.startsWith(">")) return true;
			if (this.operator.startsWith("<") && comp.operator.startsWith("<")) return true;
			if (this.semver.version === comp.semver.version && this.operator.includes("=") && comp.operator.includes("=")) return true;
			if (cmp(this.semver, "<", comp.semver, options) && this.operator.startsWith(">") && comp.operator.startsWith("<")) return true;
			if (cmp(this.semver, ">", comp.semver, options) && this.operator.startsWith("<") && comp.operator.startsWith(">")) return true;
			return false;
		}
	};
	module.exports = Comparator;
	const parseOptions = require_parse_options();
	const { safeRe: re, t } = require_re();
	const cmp = require_cmp();
	const debug = require_debug();
	const SemVer = require_semver$1();
	const Range = require_range();
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
	module.exports = toComparators;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const maxSatisfying = (versions, range, options) => {
		let max = null;
		let maxSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	};
	module.exports = maxSatisfying;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const minSatisfying = (versions, range, options) => {
		let min = null;
		let minSV = null;
		let rangeObj = null;
		try {
			rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach((v) => {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	};
	module.exports = minSatisfying;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/min-version.js
var require_min_version = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Range = require_range();
	const gt = require_gt();
	const minVersion = (range, loose) => {
		range = new Range(range, loose);
		let minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let setMin = null;
			comparators.forEach((comparator) => {
				const compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!setMin || gt(compver, setMin)) setMin = compver;
						break;
					case "<":
					case "<=": break;
					default: throw new Error(`Unexpected operation: ${comparator.operator}`);
				}
			});
			if (setMin && (!minver || gt(minver, setMin))) minver = setMin;
		}
		if (minver && range.test(minver)) return minver;
		return null;
	};
	module.exports = minVersion;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/valid.js
var require_valid = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const validRange = (range, options) => {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	};
	module.exports = validRange;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/outside.js
var require_outside = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const SemVer = require_semver$1();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const Range = require_range();
	const satisfies = require_satisfies();
	const gt = require_gt();
	const lt = require_lt();
	const lte = require_lte();
	const gte = require_gte();
	const outside = (version, range, hilo, options) => {
		version = new SemVer(version, options);
		range = new Range(range, options);
		let gtfn, ltefn, ltfn, comp, ecomp;
		switch (hilo) {
			case ">":
				gtfn = gt;
				ltefn = lte;
				ltfn = lt;
				comp = ">";
				ecomp = ">=";
				break;
			case "<":
				gtfn = lt;
				ltefn = gte;
				ltfn = gt;
				comp = "<";
				ecomp = "<=";
				break;
			default: throw new TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (satisfies(version, range, options)) return false;
		for (let i = 0; i < range.set.length; ++i) {
			const comparators = range.set[i];
			let high = null;
			let low = null;
			comparators.forEach((comparator) => {
				if (comparator.semver === ANY) comparator = new Comparator(">=0.0.0");
				high = high || comparator;
				low = low || comparator;
				if (gtfn(comparator.semver, high.semver, options)) high = comparator;
				else if (ltfn(comparator.semver, low.semver, options)) low = comparator;
			});
			if (high.operator === comp || high.operator === ecomp) return false;
			if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) return false;
			else if (low.operator === ecomp && ltfn(version, low.semver)) return false;
		}
		return true;
	};
	module.exports = outside;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/gtr.js
var require_gtr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const gtr = (version, range, options) => outside(version, range, ">", options);
	module.exports = gtr;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/ltr.js
var require_ltr = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const outside = require_outside();
	const ltr = (version, range, options) => outside(version, range, "<", options);
	module.exports = ltr;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/intersects.js
var require_intersects = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const intersects = (r1, r2, options) => {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2, options);
	};
	module.exports = intersects;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/simplify.js
var require_simplify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const satisfies = require_satisfies();
	const compare = require_compare();
	module.exports = (versions, range, options) => {
		const set = [];
		let first = null;
		let prev = null;
		const v = versions.sort((a, b) => compare(a, b, options));
		for (const version of v) if (satisfies(version, range, options)) {
			prev = version;
			if (!first) first = version;
		} else {
			if (prev) set.push([first, prev]);
			prev = null;
			first = null;
		}
		if (first) set.push([first, null]);
		const ranges = [];
		for (const [min, max] of set) if (min === max) ranges.push(min);
		else if (!max && min === v[0]) ranges.push("*");
		else if (!max) ranges.push(`>=${min}`);
		else if (min === v[0]) ranges.push(`<=${max}`);
		else ranges.push(`${min} - ${max}`);
		const simplified = ranges.join(" || ");
		const original = typeof range.raw === "string" ? range.raw : String(range);
		return simplified.length < original.length ? simplified : range;
	};
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/ranges/subset.js
var require_subset = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const Range = require_range();
	const Comparator = require_comparator();
	const { ANY } = Comparator;
	const satisfies = require_satisfies();
	const compare = require_compare();
	const subset = (sub, dom, options = {}) => {
		if (sub === dom) return true;
		sub = new Range(sub, options);
		dom = new Range(dom, options);
		let sawNonNull = false;
		OUTER: for (const simpleSub of sub.set) {
			for (const simpleDom of dom.set) {
				const isSub = simpleSubset(simpleSub, simpleDom, options);
				sawNonNull = sawNonNull || isSub !== null;
				if (isSub) continue OUTER;
			}
			if (sawNonNull) return false;
		}
		return true;
	};
	const minimumVersionWithPreRelease = [new Comparator(">=0.0.0-0")];
	const minimumVersion = [new Comparator(">=0.0.0")];
	const simpleSubset = (sub, dom, options) => {
		if (sub === dom) return true;
		if (sub.length === 1 && sub[0].semver === ANY) if (dom.length === 1 && dom[0].semver === ANY) return true;
		else if (options.includePrerelease) sub = minimumVersionWithPreRelease;
		else sub = minimumVersion;
		if (dom.length === 1 && dom[0].semver === ANY) if (options.includePrerelease) return true;
		else dom = minimumVersion;
		const eqSet = /* @__PURE__ */ new Set();
		let gt, lt;
		for (const c of sub) if (c.operator === ">" || c.operator === ">=") gt = higherGT(gt, c, options);
		else if (c.operator === "<" || c.operator === "<=") lt = lowerLT(lt, c, options);
		else eqSet.add(c.semver);
		if (eqSet.size > 1) return null;
		let gtltComp;
		if (gt && lt) {
			gtltComp = compare(gt.semver, lt.semver, options);
			if (gtltComp > 0) return null;
			else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) return null;
		}
		for (const eq of eqSet) {
			if (gt && !satisfies(eq, String(gt), options)) return null;
			if (lt && !satisfies(eq, String(lt), options)) return null;
			for (const c of dom) if (!satisfies(eq, String(c), options)) return false;
			return true;
		}
		let higher, lower;
		let hasDomLT, hasDomGT;
		let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
		let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
		if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) needDomLTPre = false;
		for (const c of dom) {
			hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
			hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
			if (gt) {
				if (needDomGTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) needDomGTPre = false;
				}
				if (c.operator === ">" || c.operator === ">=") {
					higher = higherGT(gt, c, options);
					if (higher === c && higher !== gt) return false;
				} else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) return false;
			}
			if (lt) {
				if (needDomLTPre) {
					if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) needDomLTPre = false;
				}
				if (c.operator === "<" || c.operator === "<=") {
					lower = lowerLT(lt, c, options);
					if (lower === c && lower !== lt) return false;
				} else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) return false;
			}
			if (!c.operator && (lt || gt) && gtltComp !== 0) return false;
		}
		if (gt && hasDomLT && !lt && gtltComp !== 0) return false;
		if (lt && hasDomGT && !gt && gtltComp !== 0) return false;
		if (needDomGTPre || needDomLTPre) return false;
		return true;
	};
	const higherGT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
	};
	const lowerLT = (a, b, options) => {
		if (!a) return b;
		const comp = compare(a.semver, b.semver, options);
		return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
	};
	module.exports = subset;
}));

//#endregion
//#region node_modules/.deno/semver@7.7.4/node_modules/semver/index.js
var require_semver = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const internalRe = require_re();
	const constants = require_constants();
	const SemVer = require_semver$1();
	const identifiers = require_identifiers();
	const parse = require_parse();
	const valid = require_valid$1();
	const clean = require_clean();
	const inc = require_inc();
	const diff = require_diff();
	const major = require_major();
	const minor = require_minor();
	const patch = require_patch();
	const prerelease = require_prerelease();
	const compare = require_compare();
	const rcompare = require_rcompare();
	const compareLoose = require_compare_loose();
	const compareBuild = require_compare_build();
	const sort = require_sort();
	const rsort = require_rsort();
	const gt = require_gt();
	const lt = require_lt();
	const eq = require_eq();
	const neq = require_neq();
	const gte = require_gte();
	const lte = require_lte();
	const cmp = require_cmp();
	const coerce = require_coerce();
	const Comparator = require_comparator();
	const Range = require_range();
	const satisfies = require_satisfies();
	const toComparators = require_to_comparators();
	const maxSatisfying = require_max_satisfying();
	const minSatisfying = require_min_satisfying();
	const minVersion = require_min_version();
	const validRange = require_valid();
	const outside = require_outside();
	const gtr = require_gtr();
	const ltr = require_ltr();
	const intersects = require_intersects();
	const simplifyRange = require_simplify();
	const subset = require_subset();
	module.exports = {
		parse,
		valid,
		clean,
		inc,
		diff,
		major,
		minor,
		patch,
		prerelease,
		compare,
		rcompare,
		compareLoose,
		compareBuild,
		sort,
		rsort,
		gt,
		lt,
		eq,
		neq,
		gte,
		lte,
		cmp,
		coerce,
		Comparator,
		Range,
		satisfies,
		toComparators,
		maxSatisfying,
		minSatisfying,
		minVersion,
		validRange,
		outside,
		gtr,
		ltr,
		intersects,
		simplifyRange,
		subset,
		SemVer,
		re: internalRe.re,
		src: internalRe.src,
		tokens: internalRe.t,
		SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: constants.RELEASE_TYPES,
		compareIdentifiers: identifiers.compareIdentifiers,
		rcompareIdentifiers: identifiers.rcompareIdentifiers
	};
}));

//#endregion
//#region src/fetch.ts
var import_semver = /* @__PURE__ */ __toESM(require_semver(), 1);
var import_core = /* @__PURE__ */ __toESM(require_core(), 1);
var import_lib = /* @__PURE__ */ __toESM(require_lib(), 1);
/**
* A fetch-compatible wrapper for @actions/http-client that maintains
* the exact signature and behavior of the original src/version.ts function.
*/
async function fetchWithRetries(url, maxRetries = 5) {
	const client = new import_lib.HttpClient();
	let sleepMs = 250;
	let iterationCount = 0;
	while (true) {
		iterationCount++;
		try {
			const res = await client.get(url);
			const fetchStyleResponse = {
				status: res.message.statusCode ?? 0,
				statusText: res.message.statusMessage ?? "",
				ok: (res.message.statusCode ?? 0) >= 200 && (res.message.statusCode ?? 0) < 300,
				url,
				_rawBody: await res.readBody(),
				_cachedJson: void 0,
				headers: {
					get: (name) => res.message.headers[name.toLowerCase()]?.toString() ?? null,
					has: (name) => name.toLowerCase() in res.message.headers,
					entries: () => Object.entries(res.message.headers).map(([k, v]) => [k, String(v)])
				},
				text() {
					return Promise.resolve(this._rawBody);
				},
				json() {
					if (this._cachedJson === void 0) this._cachedJson = JSON.parse(this._rawBody);
					return Promise.resolve(this._cachedJson);
				}
			};
			if (fetchStyleResponse.status === 200 || iterationCount > maxRetries) return fetchStyleResponse;
		} catch (err) {
			if (iterationCount > maxRetries) throw err;
		}
		console$1.warn(`Failed fetching. Retrying in ${sleepMs}ms...`);
		await new Promise((resolve) => setTimeout$1(resolve, sleepMs));
		sleepMs = Math.min(sleepMs * 2, 1e4);
	}
}

//#endregion
//#region src/version.ts
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
	if (version === "latest" || version === "stable") return {
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
	if (!fs$3.existsSync(versionFilePath)) throw new Error(`The specified node version file at: ${versionFilePath} does not exist`);
	const contents = fs$3.readFileSync(versionFilePath, "utf8");
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
		const res = await fetchWithRetries("https://github.com/denoland/docs/raw/refs/heads/main/replacements.json");
		if (res.status !== 200) throw new Error("Failed to fetch release version info from github.com. Please try again later.");
		let version = "";
		try {
			const replacementsJson = await res.json();
			if (typeof replacementsJson !== "object" || replacementsJson === null) throw new Error("Fetched CLI version info is invalid.");
			if (!("CLI_VERSION" in replacementsJson)) throw new Error("Fetched CLI version info is invalid.");
			version = replacementsJson.CLI_VERSION.trim();
		} catch {
			if ((await fetchWithRetries("https://github.com/denoland/deno/raw/refs/heads/main/cli/lib/version.txt")).status !== 200) throw new Error("Failed to fetch release version info from github.com. Please try again later.");
			version = (await res.text()).trim();
		}
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

//#endregion
//#region node_modules/.deno/@actions+tool-cache@3.0.1/node_modules/@actions/tool-cache/lib/manifest.js
var require_manifest = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports._findMatch = _findMatch;
	exports._getOsVersion = _getOsVersion;
	exports._readLinuxVersionFile = _readLinuxVersionFile;
	const semver = __importStar(require_semver$2());
	const core_1 = require_core();
	const os$2 = __require("os");
	const cp = __require("child_process");
	const fs$2 = __require("fs");
	function _findMatch(versionSpec, stable, candidates, archFilter) {
		return __awaiter(this, void 0, void 0, function* () {
			const platFilter = os$2.platform();
			let result;
			let match;
			let file;
			for (const candidate of candidates) {
				const version = candidate.version;
				(0, core_1.debug)(`check ${version} satisfies ${versionSpec}`);
				if (semver.satisfies(version, versionSpec) && (!stable || candidate.stable === stable)) {
					file = candidate.files.find((item) => {
						(0, core_1.debug)(`${item.arch}===${archFilter} && ${item.platform}===${platFilter}`);
						let chk = item.arch === archFilter && item.platform === platFilter;
						if (chk && item.platform_version) {
							const osVersion = module.exports._getOsVersion();
							if (osVersion === item.platform_version) chk = true;
							else chk = semver.satisfies(osVersion, item.platform_version);
						}
						return chk;
					});
					if (file) {
						(0, core_1.debug)(`matched ${candidate.version}`);
						match = candidate;
						break;
					}
				}
			}
			if (match && file) {
				result = Object.assign({}, match);
				result.files = [file];
			}
			return result;
		});
	}
	function _getOsVersion() {
		const plat = os$2.platform();
		let version = "";
		if (plat === "darwin") version = cp.execSync("sw_vers -productVersion").toString();
		else if (plat === "linux") {
			const lsbContents = module.exports._readLinuxVersionFile();
			if (lsbContents) {
				const lines = lsbContents.split("\n");
				for (const line of lines) {
					const parts = line.split("=");
					if (parts.length === 2 && (parts[0].trim() === "VERSION_ID" || parts[0].trim() === "DISTRIB_RELEASE")) {
						version = parts[1].trim().replace(/^"/, "").replace(/"$/, "");
						break;
					}
				}
			}
		}
		return version;
	}
	function _readLinuxVersionFile() {
		const lsbReleaseFile = "/etc/lsb-release";
		const osReleaseFile = "/etc/os-release";
		let contents = "";
		if (fs$2.existsSync(lsbReleaseFile)) contents = fs$2.readFileSync(lsbReleaseFile).toString();
		else if (fs$2.existsSync(osReleaseFile)) contents = fs$2.readFileSync(osReleaseFile).toString();
		return contents;
	}
}));

//#endregion
//#region node_modules/.deno/@actions+tool-cache@3.0.1/node_modules/@actions/tool-cache/lib/retry-helper.js
var require_retry_helper = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.RetryHelper = void 0;
	const core = __importStar(require_core());
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
			return __awaiter(this, void 0, void 0, function* () {
				let attempt = 1;
				while (attempt < this.maxAttempts) {
					try {
						return yield action();
					} catch (err) {
						if (isRetryable && !isRetryable(err)) throw err;
						core.info(err.message);
					}
					const seconds = this.getSleepAmount();
					core.info(`Waiting ${seconds} seconds before trying again`);
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
			return __awaiter(this, void 0, void 0, function* () {
				return new Promise((resolve) => setTimeout(resolve, seconds * 1e3));
			});
		}
	};
	exports.RetryHelper = RetryHelper;
}));

//#endregion
//#region node_modules/.deno/@actions+tool-cache@3.0.1/node_modules/@actions/tool-cache/lib/tool-cache.js
var require_tool_cache = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || (function() {
		var ownKeys = function(o) {
			ownKeys = Object.getOwnPropertyNames || function(o) {
				var ar = [];
				for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
				return ar;
			};
			return ownKeys(o);
		};
		return function(mod) {
			if (mod && mod.__esModule) return mod;
			var result = {};
			if (mod != null) {
				for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
			}
			__setModuleDefault(result, mod);
			return result;
		};
	})();
	var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.HTTPError = void 0;
	exports.downloadTool = downloadTool;
	exports.extractZip = extractZip;
	exports.cacheDir = cacheDir;
	exports.find = find;
	const core = __importStar(require_core());
	const io = __importStar(require_io());
	const crypto = __importStar(__require("crypto"));
	const fs$1 = __importStar(__require("fs"));
	const mm = __importStar(require_manifest());
	const os$1 = __importStar(__require("os"));
	const path$2 = __importStar(__require("path"));
	const httpm = __importStar(require_lib());
	const semver = __importStar(require_semver$2());
	const stream = __importStar(__require("stream"));
	const util = __importStar(__require("util"));
	const assert_1 = __require("assert");
	const exec_1 = require_exec();
	const retry_helper_1 = require_retry_helper();
	var HTTPError = class extends Error {
		constructor(httpStatusCode) {
			super(`Unexpected HTTP response: ${httpStatusCode}`);
			this.httpStatusCode = httpStatusCode;
			Object.setPrototypeOf(this, new.target.prototype);
		}
	};
	exports.HTTPError = HTTPError;
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
			dest = dest || path$2.join(_getTempDirectory(), crypto.randomUUID());
			yield io.mkdirP(path$2.dirname(dest));
			core.debug(`Downloading ${url}`);
			core.debug(`Destination ${dest}`);
			const maxAttempts = 3;
			const minSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS", 10);
			const maxSeconds = _getGlobal("TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS", 20);
			return yield new retry_helper_1.RetryHelper(maxAttempts, minSeconds, maxSeconds).execute(() => __awaiter(this, void 0, void 0, function* () {
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
			const http = new httpm.HttpClient(userAgent, [], { allowRetries: false });
			if (auth) {
				core.debug("set auth");
				if (headers === void 0) headers = {};
				headers.authorization = auth;
			}
			const response = yield http.get(url, headers);
			if (response.message.statusCode !== 200) {
				const err = new HTTPError(response.message.statusCode);
				core.debug(`Failed to download from "${url}". Code(${response.message.statusCode}) Message(${response.message.statusMessage})`);
				throw err;
			}
			const pipeline = util.promisify(stream.pipeline);
			const readStream = _getGlobal("TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY", () => response.message)();
			let succeeded = false;
			try {
				yield pipeline(readStream, fs$1.createWriteStream(dest));
				core.debug("download complete");
				succeeded = true;
				return dest;
			} finally {
				if (!succeeded) {
					core.debug("download failed");
					try {
						yield io.rmRF(dest);
					} catch (err) {
						core.debug(`Failed to delete '${dest}'. ${err.message}`);
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
			const pwshPath = yield io.which("pwsh", false);
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
				core.debug(`Using pwsh at path: ${pwshPath}`);
				yield (0, exec_1.exec)(`"${pwshPath}"`, args);
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
				const powershellPath = yield io.which("powershell", true);
				core.debug(`Using powershell at path: ${powershellPath}`);
				yield (0, exec_1.exec)(`"${powershellPath}"`, args);
			}
		});
	}
	function extractZipNix(file, dest) {
		return __awaiter(this, void 0, void 0, function* () {
			const unzipPath = yield io.which("unzip", true);
			const args = [file];
			if (!core.isDebug()) args.unshift("-q");
			args.unshift("-o");
			yield (0, exec_1.exec)(`"${unzipPath}"`, args, { cwd: dest });
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
			version = semver.clean(version) || version;
			arch = arch || os$1.arch();
			core.debug(`Caching tool ${tool} ${version} ${arch}`);
			core.debug(`source dir: ${sourceDir}`);
			if (!fs$1.statSync(sourceDir).isDirectory()) throw new Error("sourceDir is not a directory");
			const destPath = yield _createToolPath(tool, version, arch);
			for (const itemName of fs$1.readdirSync(sourceDir)) {
				const s = path$2.join(sourceDir, itemName);
				yield io.cp(s, destPath, { recursive: true });
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
		arch = arch || os$1.arch();
		if (!isExplicitVersion(versionSpec)) versionSpec = evaluateVersions(findAllVersions(toolName, arch), versionSpec);
		let toolPath = "";
		if (versionSpec) {
			versionSpec = semver.clean(versionSpec) || "";
			const cachePath = path$2.join(_getCacheDirectory(), toolName, versionSpec, arch);
			core.debug(`checking cache: ${cachePath}`);
			if (fs$1.existsSync(cachePath) && fs$1.existsSync(`${cachePath}.complete`)) {
				core.debug(`Found tool in cache ${toolName} ${versionSpec} ${arch}`);
				toolPath = cachePath;
			} else core.debug("not found");
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
		arch = arch || os$1.arch();
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
			if (!dest) dest = path$2.join(_getTempDirectory(), crypto.randomUUID());
			yield io.mkdirP(dest);
			return dest;
		});
	}
	function _createToolPath(tool, version, arch) {
		return __awaiter(this, void 0, void 0, function* () {
			const folderPath = path$2.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "");
			core.debug(`destination ${folderPath}`);
			const markerPath = `${folderPath}.complete`;
			yield io.rmRF(folderPath);
			yield io.rmRF(markerPath);
			yield io.mkdirP(folderPath);
			return folderPath;
		});
	}
	function _completeToolPath(tool, version, arch) {
		const markerPath = `${path$2.join(_getCacheDirectory(), tool, semver.clean(version) || version, arch || "")}.complete`;
		fs$1.writeFileSync(markerPath, "");
		core.debug("finished caching tool");
	}
	/**
	* Check if version string is explicit
	*
	* @param versionSpec      version string to check
	*/
	function isExplicitVersion(versionSpec) {
		const c = semver.clean(versionSpec) || "";
		core.debug(`isExplicit: ${c}`);
		const valid = semver.valid(c) != null;
		core.debug(`explicit? ${valid}`);
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
		core.debug(`evaluating ${versions.length} versions`);
		versions = versions.sort((a, b) => {
			if (semver.gt(a, b)) return 1;
			return -1;
		});
		for (let i = versions.length - 1; i >= 0; i--) {
			const potential = versions[i];
			if (semver.satisfies(potential, versionSpec)) {
				version = potential;
				break;
			}
		}
		if (version) core.debug(`matched: ${version}`);
		else core.debug("match not found");
		return version;
	}
	/**
	* Gets RUNNER_TOOL_CACHE
	*/
	function _getCacheDirectory() {
		const cacheDirectory = process.env["RUNNER_TOOL_CACHE"] || "";
		(0, assert_1.ok)(cacheDirectory, "Expected RUNNER_TOOL_CACHE to be defined");
		return cacheDirectory;
	}
	/**
	* Gets RUNNER_TEMP
	*/
	function _getTempDirectory() {
		const tempDirectory = process.env["RUNNER_TEMP"] || "";
		(0, assert_1.ok)(tempDirectory, "Expected RUNNER_TEMP to be defined");
		return tempDirectory;
	}
	/**
	* Gets a global variable
	*/
	function _getGlobal(key, defaultValue) {
		const value = global[key];
		return value !== void 0 ? value : defaultValue;
	}
}));

//#endregion
//#region src/install.ts
var import_tool_cache = /* @__PURE__ */ __toESM(require_tool_cache(), 1);
async function install(version) {
	const cachedPath = import_tool_cache.find("deno", version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	if (cachedPath) {
		import_core.info(`Using cached Deno installation from ${cachedPath}.`);
		import_core.addPath(cachedPath);
		return;
	}
	const zip = zipName();
	let url;
	switch (version.kind) {
		case "canary":
			url = `https://dl.deno.land/canary/${version.version}/${zip}`;
			break;
		case "rc":
			url = `https://dl.deno.land/release/v${version.version}/${zip}`;
			break;
		case "stable":
		case "lts":
			url = `https://github.com/denoland/deno/releases/download/v${version.version}/${zip}`;
			break;
	}
	import_core.info(`Downloading Deno from ${url}.`);
	const zipPath = await import_tool_cache.downloadTool(url);
	const extractedFolder = await import_tool_cache.extractZip(zipPath);
	const binaryName = import_core.getInput("deno-binary-name");
	if (binaryName !== "deno") await fs.rename(path$1.join(extractedFolder, process$1.platform === "win32" ? "deno.exe" : "deno"), path$1.join(extractedFolder, process$1.platform === "win32" ? binaryName + ".exe" : binaryName));
	const newCachedPath = await import_tool_cache.cacheDir(extractedFolder, binaryName, version.kind === "canary" ? `0.0.0-${version.version}` : version.version);
	import_core.info(`Cached Deno to ${newCachedPath}.`);
	import_core.addPath(newCachedPath);
	const denoInstallRoot = process$1.env.DENO_INSTALL_ROOT || path$1.join(os.homedir(), ".deno", "bin");
	import_core.addPath(denoInstallRoot);
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
	import_core.setFailed(message);
	process$1.exit();
}
function isCachingEnabled() {
	return import_core.getInput("cache") === "true" || import_core.getInput("cache-hash").length > 0;
}
async function main() {
	try {
		const denoVersionFile = import_core.getInput("deno-version-file");
		const range = parseVersionRange(denoVersionFile ? getDenoVersionFromFile(denoVersionFile) : import_core.getInput("deno-version"));
		if (range === null) exit("The passed version range is not valid.");
		const version = await resolveVersion(range);
		if (version === null) exit("Could not resolve a version for the given range.");
		import_core.info(`Going to install ${version.kind} version ${version.version}.`);
		await install(version);
		import_core.info(`::add-matcher::${path.join(import.meta.dirname ?? ".", "..", "deno-problem-matchers.json")}`);
		import_core.setOutput("deno-version", version.version);
		import_core.setOutput("release-channel", version.kind);
		import_core.info("Installation complete.");
		if (isCachingEnabled()) {
			const { restoreCache } = await import("./cache-DpsdXZtI.mjs").then((n) => n.t);
			await restoreCache(import_core.getInput("cache-hash"));
		}
	} catch (err) {
		import_core.setFailed(err instanceof Error ? err : String(err));
		process$1.exit();
	}
}
main();

//#endregion
export {  };