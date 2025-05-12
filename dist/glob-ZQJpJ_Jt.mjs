import { __commonJS, __require, require_core } from "./core-dugiPccr.mjs";
import { require_minimatch } from "./minimatch-DXwkXfwe.mjs";

//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-glob-options-helper.js
var require_internal_glob_options_helper = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-glob-options-helper.js"(exports) {
	var __createBinding$6 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$6 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$6 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$6(result, mod, k);
		}
		__setModuleDefault$6(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.getOptions = void 0;
	const core$2 = __importStar$6(require_core());
	/**
	* Returns a copy with defaults filled in.
	*/
	function getOptions(copy) {
		const result = {
			followSymbolicLinks: true,
			implicitDescendants: true,
			matchDirectories: true,
			omitBrokenSymbolicLinks: true,
			excludeHiddenFiles: false
		};
		if (copy) {
			if (typeof copy.followSymbolicLinks === "boolean") {
				result.followSymbolicLinks = copy.followSymbolicLinks;
				core$2.debug(`followSymbolicLinks '${result.followSymbolicLinks}'`);
			}
			if (typeof copy.implicitDescendants === "boolean") {
				result.implicitDescendants = copy.implicitDescendants;
				core$2.debug(`implicitDescendants '${result.implicitDescendants}'`);
			}
			if (typeof copy.matchDirectories === "boolean") {
				result.matchDirectories = copy.matchDirectories;
				core$2.debug(`matchDirectories '${result.matchDirectories}'`);
			}
			if (typeof copy.omitBrokenSymbolicLinks === "boolean") {
				result.omitBrokenSymbolicLinks = copy.omitBrokenSymbolicLinks;
				core$2.debug(`omitBrokenSymbolicLinks '${result.omitBrokenSymbolicLinks}'`);
			}
			if (typeof copy.excludeHiddenFiles === "boolean") {
				result.excludeHiddenFiles = copy.excludeHiddenFiles;
				core$2.debug(`excludeHiddenFiles '${result.excludeHiddenFiles}'`);
			}
		}
		return result;
	}
	exports.getOptions = getOptions;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-path-helper.js
var require_internal_path_helper = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-path-helper.js"(exports) {
	var __createBinding$5 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$5 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$5 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$5(result, mod, k);
		}
		__setModuleDefault$5(result, mod);
		return result;
	};
	var __importDefault$2 = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.safeTrimTrailingSeparator = exports.normalizeSeparators = exports.hasRoot = exports.hasAbsoluteRoot = exports.ensureAbsoluteRoot = exports.dirname = void 0;
	const path$4 = __importStar$5(__require("path"));
	const assert_1$2 = __importDefault$2(__require("assert"));
	const IS_WINDOWS$4 = process.platform === "win32";
	/**
	* Similar to path.dirname except normalizes the path separators and slightly better handling for Windows UNC paths.
	*
	* For example, on Linux/macOS:
	* - `/               => /`
	* - `/hello          => /`
	*
	* For example, on Windows:
	* - `C:\             => C:\`
	* - `C:\hello        => C:\`
	* - `C:              => C:`
	* - `C:hello         => C:`
	* - `\               => \`
	* - `\hello          => \`
	* - `\\hello         => \\hello`
	* - `\\hello\world   => \\hello\world`
	*/
	function dirname(p) {
		p = safeTrimTrailingSeparator(p);
		if (IS_WINDOWS$4 && /^\\\\[^\\]+(\\[^\\]+)?$/.test(p)) return p;
		let result = path$4.dirname(p);
		if (IS_WINDOWS$4 && /^\\\\[^\\]+\\[^\\]+\\$/.test(result)) result = safeTrimTrailingSeparator(result);
		return result;
	}
	exports.dirname = dirname;
	/**
	* Roots the path if not already rooted. On Windows, relative roots like `\`
	* or `C:` are expanded based on the current working directory.
	*/
	function ensureAbsoluteRoot(root, itemPath) {
		(0, assert_1$2.default)(root, `ensureAbsoluteRoot parameter 'root' must not be empty`);
		(0, assert_1$2.default)(itemPath, `ensureAbsoluteRoot parameter 'itemPath' must not be empty`);
		if (hasAbsoluteRoot(itemPath)) return itemPath;
		if (IS_WINDOWS$4) {
			if (itemPath.match(/^[A-Z]:[^\\/]|^[A-Z]:$/i)) {
				let cwd = process.cwd();
				(0, assert_1$2.default)(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
				if (itemPath[0].toUpperCase() === cwd[0].toUpperCase()) if (itemPath.length === 2) return `${itemPath[0]}:\\${cwd.substr(3)}`;
				else {
					if (!cwd.endsWith("\\")) cwd += "\\";
					return `${itemPath[0]}:\\${cwd.substr(3)}${itemPath.substr(2)}`;
				}
				else return `${itemPath[0]}:\\${itemPath.substr(2)}`;
			} else if (normalizeSeparators(itemPath).match(/^\\$|^\\[^\\]/)) {
				const cwd = process.cwd();
				(0, assert_1$2.default)(cwd.match(/^[A-Z]:\\/i), `Expected current directory to start with an absolute drive root. Actual '${cwd}'`);
				return `${cwd[0]}:\\${itemPath.substr(1)}`;
			}
		}
		(0, assert_1$2.default)(hasAbsoluteRoot(root), `ensureAbsoluteRoot parameter 'root' must have an absolute root`);
		if (root.endsWith("/") || IS_WINDOWS$4 && root.endsWith("\\")) {} else root += path$4.sep;
		return root + itemPath;
	}
	exports.ensureAbsoluteRoot = ensureAbsoluteRoot;
	/**
	* On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
	* `\\hello\share` and `C:\hello` (and using alternate separator).
	*/
	function hasAbsoluteRoot(itemPath) {
		(0, assert_1$2.default)(itemPath, `hasAbsoluteRoot parameter 'itemPath' must not be empty`);
		itemPath = normalizeSeparators(itemPath);
		if (IS_WINDOWS$4) return itemPath.startsWith("\\\\") || /^[A-Z]:\\/i.test(itemPath);
		return itemPath.startsWith("/");
	}
	exports.hasAbsoluteRoot = hasAbsoluteRoot;
	/**
	* On Linux/macOS, true if path starts with `/`. On Windows, true for paths like:
	* `\`, `\hello`, `\\hello\share`, `C:`, and `C:\hello` (and using alternate separator).
	*/
	function hasRoot(itemPath) {
		(0, assert_1$2.default)(itemPath, `isRooted parameter 'itemPath' must not be empty`);
		itemPath = normalizeSeparators(itemPath);
		if (IS_WINDOWS$4) return itemPath.startsWith("\\") || /^[A-Z]:/i.test(itemPath);
		return itemPath.startsWith("/");
	}
	exports.hasRoot = hasRoot;
	/**
	* Removes redundant slashes and converts `/` to `\` on Windows
	*/
	function normalizeSeparators(p) {
		p = p || "";
		if (IS_WINDOWS$4) {
			p = p.replace(/\//g, "\\");
			const isUnc = /^\\\\+[^\\]/.test(p);
			return (isUnc ? "\\" : "") + p.replace(/\\\\+/g, "\\");
		}
		return p.replace(/\/\/+/g, "/");
	}
	exports.normalizeSeparators = normalizeSeparators;
	/**
	* Normalizes the path separators and trims the trailing separator (when safe).
	* For example, `/foo/ => /foo` but `/ => /`
	*/
	function safeTrimTrailingSeparator(p) {
		if (!p) return "";
		p = normalizeSeparators(p);
		if (!p.endsWith(path$4.sep)) return p;
		if (p === path$4.sep) return p;
		if (IS_WINDOWS$4 && /^[A-Z]:\\$/i.test(p)) return p;
		return p.substr(0, p.length - 1);
	}
	exports.safeTrimTrailingSeparator = safeTrimTrailingSeparator;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-match-kind.js
var require_internal_match_kind = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-match-kind.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.MatchKind = void 0;
	/**
	* Indicates whether a pattern matches a path
	*/
	var MatchKind;
	(function(MatchKind$1) {
		/** Not matched */
		MatchKind$1[MatchKind$1["None"] = 0] = "None";
		/** Matched if the path is a directory */
		MatchKind$1[MatchKind$1["Directory"] = 1] = "Directory";
		/** Matched if the path is a regular file */
		MatchKind$1[MatchKind$1["File"] = 2] = "File";
		/** Matched */
		MatchKind$1[MatchKind$1["All"] = 3] = "All";
	})(MatchKind || (exports.MatchKind = MatchKind = {}));
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-pattern-helper.js
var require_internal_pattern_helper = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-pattern-helper.js"(exports) {
	var __createBinding$4 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$4 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$4 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$4(result, mod, k);
		}
		__setModuleDefault$4(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.partialMatch = exports.match = exports.getSearchPaths = void 0;
	const pathHelper$2 = __importStar$4(require_internal_path_helper());
	const internal_match_kind_1$2 = require_internal_match_kind();
	const IS_WINDOWS$3 = process.platform === "win32";
	/**
	* Given an array of patterns, returns an array of paths to search.
	* Duplicates and paths under other included paths are filtered out.
	*/
	function getSearchPaths(patterns) {
		patterns = patterns.filter((x) => !x.negate);
		const searchPathMap = {};
		for (const pattern of patterns) {
			const key = IS_WINDOWS$3 ? pattern.searchPath.toUpperCase() : pattern.searchPath;
			searchPathMap[key] = "candidate";
		}
		const result = [];
		for (const pattern of patterns) {
			const key = IS_WINDOWS$3 ? pattern.searchPath.toUpperCase() : pattern.searchPath;
			if (searchPathMap[key] === "included") continue;
			let foundAncestor = false;
			let tempKey = key;
			let parent = pathHelper$2.dirname(tempKey);
			while (parent !== tempKey) {
				if (searchPathMap[parent]) {
					foundAncestor = true;
					break;
				}
				tempKey = parent;
				parent = pathHelper$2.dirname(tempKey);
			}
			if (!foundAncestor) {
				result.push(pattern.searchPath);
				searchPathMap[key] = "included";
			}
		}
		return result;
	}
	exports.getSearchPaths = getSearchPaths;
	/**
	* Matches the patterns against the path
	*/
	function match(patterns, itemPath) {
		let result = internal_match_kind_1$2.MatchKind.None;
		for (const pattern of patterns) if (pattern.negate) result &= ~pattern.match(itemPath);
		else result |= pattern.match(itemPath);
		return result;
	}
	exports.match = match;
	/**
	* Checks whether to descend further into the directory
	*/
	function partialMatch(patterns, itemPath) {
		return patterns.some((x) => !x.negate && x.partialMatch(itemPath));
	}
	exports.partialMatch = partialMatch;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-path.js
var require_internal_path = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-path.js"(exports) {
	var __createBinding$3 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$3 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$3 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$3(result, mod, k);
		}
		__setModuleDefault$3(result, mod);
		return result;
	};
	var __importDefault$1 = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Path = void 0;
	const path$3 = __importStar$3(__require("path"));
	const pathHelper$1 = __importStar$3(require_internal_path_helper());
	const assert_1$1 = __importDefault$1(__require("assert"));
	const IS_WINDOWS$2 = process.platform === "win32";
	/**
	* Helper class for parsing paths into segments
	*/
	var Path = class {
		/**
		* Constructs a Path
		* @param itemPath Path or array of segments
		*/
		constructor(itemPath) {
			this.segments = [];
			if (typeof itemPath === "string") {
				(0, assert_1$1.default)(itemPath, `Parameter 'itemPath' must not be empty`);
				itemPath = pathHelper$1.safeTrimTrailingSeparator(itemPath);
				if (!pathHelper$1.hasRoot(itemPath)) this.segments = itemPath.split(path$3.sep);
				else {
					let remaining = itemPath;
					let dir = pathHelper$1.dirname(remaining);
					while (dir !== remaining) {
						const basename = path$3.basename(remaining);
						this.segments.unshift(basename);
						remaining = dir;
						dir = pathHelper$1.dirname(remaining);
					}
					this.segments.unshift(remaining);
				}
			} else {
				(0, assert_1$1.default)(itemPath.length > 0, `Parameter 'itemPath' must not be an empty array`);
				for (let i = 0; i < itemPath.length; i++) {
					let segment = itemPath[i];
					(0, assert_1$1.default)(segment, `Parameter 'itemPath' must not contain any empty segments`);
					segment = pathHelper$1.normalizeSeparators(itemPath[i]);
					if (i === 0 && pathHelper$1.hasRoot(segment)) {
						segment = pathHelper$1.safeTrimTrailingSeparator(segment);
						(0, assert_1$1.default)(segment === pathHelper$1.dirname(segment), `Parameter 'itemPath' root segment contains information for multiple segments`);
						this.segments.push(segment);
					} else {
						(0, assert_1$1.default)(!segment.includes(path$3.sep), `Parameter 'itemPath' contains unexpected path separators`);
						this.segments.push(segment);
					}
				}
			}
		}
		/**
		* Converts the path to it's string representation
		*/
		toString() {
			let result = this.segments[0];
			let skipSlash = result.endsWith(path$3.sep) || IS_WINDOWS$2 && /^[A-Z]:$/i.test(result);
			for (let i = 1; i < this.segments.length; i++) {
				if (skipSlash) skipSlash = false;
				else result += path$3.sep;
				result += this.segments[i];
			}
			return result;
		}
	};
	exports.Path = Path;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-pattern.js
var require_internal_pattern = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-pattern.js"(exports) {
	var __createBinding$2 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$2 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$2 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$2(result, mod, k);
		}
		__setModuleDefault$2(result, mod);
		return result;
	};
	var __importDefault = exports && exports.__importDefault || function(mod) {
		return mod && mod.__esModule ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Pattern = void 0;
	const os = __importStar$2(__require("os"));
	const path$2 = __importStar$2(__require("path"));
	const pathHelper = __importStar$2(require_internal_path_helper());
	const assert_1 = __importDefault(__require("assert"));
	const minimatch_1 = require_minimatch();
	const internal_match_kind_1$1 = require_internal_match_kind();
	const internal_path_1 = require_internal_path();
	const IS_WINDOWS$1 = process.platform === "win32";
	var Pattern = class Pattern {
		constructor(patternOrNegate, isImplicitPattern = false, segments, homedir) {
			/**
			* Indicates whether matches should be excluded from the result set
			*/
			this.negate = false;
			let pattern;
			if (typeof patternOrNegate === "string") pattern = patternOrNegate.trim();
			else {
				segments = segments || [];
				(0, assert_1.default)(segments.length, `Parameter 'segments' must not empty`);
				const root = Pattern.getLiteral(segments[0]);
				(0, assert_1.default)(root && pathHelper.hasAbsoluteRoot(root), `Parameter 'segments' first element must be a root path`);
				pattern = new internal_path_1.Path(segments).toString().trim();
				if (patternOrNegate) pattern = `!${pattern}`;
			}
			while (pattern.startsWith("!")) {
				this.negate = !this.negate;
				pattern = pattern.substr(1).trim();
			}
			pattern = Pattern.fixupPattern(pattern, homedir);
			this.segments = new internal_path_1.Path(pattern).segments;
			this.trailingSeparator = pathHelper.normalizeSeparators(pattern).endsWith(path$2.sep);
			pattern = pathHelper.safeTrimTrailingSeparator(pattern);
			let foundGlob = false;
			const searchSegments = this.segments.map((x) => Pattern.getLiteral(x)).filter((x) => !foundGlob && !(foundGlob = x === ""));
			this.searchPath = new internal_path_1.Path(searchSegments).toString();
			this.rootRegExp = new RegExp(Pattern.regExpEscape(searchSegments[0]), IS_WINDOWS$1 ? "i" : "");
			this.isImplicitPattern = isImplicitPattern;
			const minimatchOptions = {
				dot: true,
				nobrace: true,
				nocase: IS_WINDOWS$1,
				nocomment: true,
				noext: true,
				nonegate: true
			};
			pattern = IS_WINDOWS$1 ? pattern.replace(/\\/g, "/") : pattern;
			this.minimatch = new minimatch_1.Minimatch(pattern, minimatchOptions);
		}
		/**
		* Matches the pattern against the specified path
		*/
		match(itemPath) {
			if (this.segments[this.segments.length - 1] === "**") {
				itemPath = pathHelper.normalizeSeparators(itemPath);
				if (!itemPath.endsWith(path$2.sep) && this.isImplicitPattern === false) itemPath = `${itemPath}${path$2.sep}`;
			} else itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
			if (this.minimatch.match(itemPath)) return this.trailingSeparator ? internal_match_kind_1$1.MatchKind.Directory : internal_match_kind_1$1.MatchKind.All;
			return internal_match_kind_1$1.MatchKind.None;
		}
		/**
		* Indicates whether the pattern may match descendants of the specified path
		*/
		partialMatch(itemPath) {
			itemPath = pathHelper.safeTrimTrailingSeparator(itemPath);
			if (pathHelper.dirname(itemPath) === itemPath) return this.rootRegExp.test(itemPath);
			return this.minimatch.matchOne(itemPath.split(IS_WINDOWS$1 ? /\\+/ : /\/+/), this.minimatch.set[0], true);
		}
		/**
		* Escapes glob patterns within a path
		*/
		static globEscape(s) {
			return (IS_WINDOWS$1 ? s : s.replace(/\\/g, "\\\\")).replace(/(\[)(?=[^/]+\])/g, "[[]").replace(/\?/g, "[?]").replace(/\*/g, "[*]");
		}
		/**
		* Normalizes slashes and ensures absolute root
		*/
		static fixupPattern(pattern, homedir) {
			(0, assert_1.default)(pattern, "pattern cannot be empty");
			const literalSegments = new internal_path_1.Path(pattern).segments.map((x) => Pattern.getLiteral(x));
			(0, assert_1.default)(literalSegments.every((x, i) => (x !== "." || i === 0) && x !== ".."), `Invalid pattern '${pattern}'. Relative pathing '.' and '..' is not allowed.`);
			(0, assert_1.default)(!pathHelper.hasRoot(pattern) || literalSegments[0], `Invalid pattern '${pattern}'. Root segment must not contain globs.`);
			pattern = pathHelper.normalizeSeparators(pattern);
			if (pattern === "." || pattern.startsWith(`.${path$2.sep}`)) pattern = Pattern.globEscape(process.cwd()) + pattern.substr(1);
			else if (pattern === "~" || pattern.startsWith(`~${path$2.sep}`)) {
				homedir = homedir || os.homedir();
				(0, assert_1.default)(homedir, "Unable to determine HOME directory");
				(0, assert_1.default)(pathHelper.hasAbsoluteRoot(homedir), `Expected HOME directory to be a rooted path. Actual '${homedir}'`);
				pattern = Pattern.globEscape(homedir) + pattern.substr(1);
			} else if (IS_WINDOWS$1 && (pattern.match(/^[A-Z]:$/i) || pattern.match(/^[A-Z]:[^\\]/i))) {
				let root = pathHelper.ensureAbsoluteRoot("C:\\dummy-root", pattern.substr(0, 2));
				if (pattern.length > 2 && !root.endsWith("\\")) root += "\\";
				pattern = Pattern.globEscape(root) + pattern.substr(2);
			} else if (IS_WINDOWS$1 && (pattern === "\\" || pattern.match(/^\\[^\\]/))) {
				let root = pathHelper.ensureAbsoluteRoot("C:\\dummy-root", "\\");
				if (!root.endsWith("\\")) root += "\\";
				pattern = Pattern.globEscape(root) + pattern.substr(1);
			} else pattern = pathHelper.ensureAbsoluteRoot(Pattern.globEscape(process.cwd()), pattern);
			return pathHelper.normalizeSeparators(pattern);
		}
		/**
		* Attempts to unescape a pattern segment to create a literal path segment.
		* Otherwise returns empty string.
		*/
		static getLiteral(segment) {
			let literal = "";
			for (let i = 0; i < segment.length; i++) {
				const c = segment[i];
				if (c === "\\" && !IS_WINDOWS$1 && i + 1 < segment.length) {
					literal += segment[++i];
					continue;
				} else if (c === "*" || c === "?") return "";
				else if (c === "[" && i + 1 < segment.length) {
					let set = "";
					let closed = -1;
					for (let i2 = i + 1; i2 < segment.length; i2++) {
						const c2 = segment[i2];
						if (c2 === "\\" && !IS_WINDOWS$1 && i2 + 1 < segment.length) {
							set += segment[++i2];
							continue;
						} else if (c2 === "]") {
							closed = i2;
							break;
						} else set += c2;
					}
					if (closed >= 0) {
						if (set.length > 1) return "";
						if (set) {
							literal += set;
							i = closed;
							continue;
						}
					}
				}
				literal += c;
			}
			return literal;
		}
		/**
		* Escapes regexp special characters
		* https://javascript.info/regexp-escaping
		*/
		static regExpEscape(s) {
			return s.replace(/[[\\^$.|?*+()]/g, "\\$&");
		}
	};
	exports.Pattern = Pattern;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-search-state.js
var require_internal_search_state = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-search-state.js"(exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SearchState = void 0;
	var SearchState = class {
		constructor(path$5, level) {
			this.path = path$5;
			this.level = level;
		}
	};
	exports.SearchState = SearchState;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-globber.js
var require_internal_globber = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-globber.js"(exports) {
	var __createBinding$1 = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault$1 = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar$1 = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding$1(result, mod, k);
		}
		__setModuleDefault$1(result, mod);
		return result;
	};
	var __awaiter$2 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
	var __asyncValues$1 = exports && exports.__asyncValues || function(o) {
		if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
		var m = o[Symbol.asyncIterator], i;
		return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
			return this;
		}, i);
		function verb(n) {
			i[n] = o[n] && function(v) {
				return new Promise(function(resolve, reject) {
					v = o[n](v), settle(resolve, reject, v.done, v.value);
				});
			};
		}
		function settle(resolve, reject, d, v) {
			Promise.resolve(v).then(function(v$1) {
				resolve({
					value: v$1,
					done: d
				});
			}, reject);
		}
	};
	var __await = exports && exports.__await || function(v) {
		return this instanceof __await ? (this.v = v, this) : new __await(v);
	};
	var __asyncGenerator = exports && exports.__asyncGenerator || function(thisArg, _arguments, generator) {
		if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
		var g = generator.apply(thisArg, _arguments || []), i, q = [];
		return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
			return this;
		}, i;
		function verb(n) {
			if (g[n]) i[n] = function(v) {
				return new Promise(function(a, b) {
					q.push([
						n,
						v,
						a,
						b
					]) > 1 || resume(n, v);
				});
			};
		}
		function resume(n, v) {
			try {
				step(g[n](v));
			} catch (e) {
				settle(q[0][3], e);
			}
		}
		function step(r) {
			r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
		}
		function fulfill(value) {
			resume("next", value);
		}
		function reject(value) {
			resume("throw", value);
		}
		function settle(f, v) {
			if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
		}
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DefaultGlobber = void 0;
	const core$1 = __importStar$1(require_core());
	const fs$1 = __importStar$1(__require("fs"));
	const globOptionsHelper = __importStar$1(require_internal_glob_options_helper());
	const path$1 = __importStar$1(__require("path"));
	const patternHelper = __importStar$1(require_internal_pattern_helper());
	const internal_match_kind_1 = require_internal_match_kind();
	const internal_pattern_1 = require_internal_pattern();
	const internal_search_state_1 = require_internal_search_state();
	const IS_WINDOWS = process.platform === "win32";
	var DefaultGlobber = class DefaultGlobber {
		constructor(options) {
			this.patterns = [];
			this.searchPaths = [];
			this.options = globOptionsHelper.getOptions(options);
		}
		getSearchPaths() {
			return this.searchPaths.slice();
		}
		glob() {
			var _a, e_1, _b, _c;
			return __awaiter$2(this, void 0, void 0, function* () {
				const result = [];
				try {
					for (var _d = true, _e = __asyncValues$1(this.globGenerator()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
						_c = _f.value;
						_d = false;
						const itemPath = _c;
						result.push(itemPath);
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				return result;
			});
		}
		globGenerator() {
			return __asyncGenerator(this, arguments, function* globGenerator_1() {
				const options = globOptionsHelper.getOptions(this.options);
				const patterns = [];
				for (const pattern of this.patterns) {
					patterns.push(pattern);
					if (options.implicitDescendants && (pattern.trailingSeparator || pattern.segments[pattern.segments.length - 1] !== "**")) patterns.push(new internal_pattern_1.Pattern(pattern.negate, true, pattern.segments.concat("**")));
				}
				const stack = [];
				for (const searchPath of patternHelper.getSearchPaths(patterns)) {
					core$1.debug(`Search path '${searchPath}'`);
					try {
						yield __await(fs$1.promises.lstat(searchPath));
					} catch (err) {
						if (err.code === "ENOENT") continue;
						throw err;
					}
					stack.unshift(new internal_search_state_1.SearchState(searchPath, 1));
				}
				const traversalChain = [];
				while (stack.length) {
					const item = stack.pop();
					const match$1 = patternHelper.match(patterns, item.path);
					const partialMatch$1 = !!match$1 || patternHelper.partialMatch(patterns, item.path);
					if (!match$1 && !partialMatch$1) continue;
					const stats = yield __await(
						DefaultGlobber.stat(item, options, traversalChain)
						// Broken symlink, or symlink cycle detected, or no longer exists
);
					if (!stats) continue;
					if (options.excludeHiddenFiles && path$1.basename(item.path).match(/^\./)) continue;
					if (stats.isDirectory()) {
						if (match$1 & internal_match_kind_1.MatchKind.Directory && options.matchDirectories) yield yield __await(item.path);
						else if (!partialMatch$1) continue;
						const childLevel = item.level + 1;
						const childItems = (yield __await(fs$1.promises.readdir(item.path))).map((x) => new internal_search_state_1.SearchState(path$1.join(item.path, x), childLevel));
						stack.push(...childItems.reverse());
					} else if (match$1 & internal_match_kind_1.MatchKind.File) yield yield __await(item.path);
				}
			});
		}
		/**
		* Constructs a DefaultGlobber
		*/
		static create(patterns, options) {
			return __awaiter$2(this, void 0, void 0, function* () {
				const result = new DefaultGlobber(options);
				if (IS_WINDOWS) {
					patterns = patterns.replace(/\r\n/g, "\n");
					patterns = patterns.replace(/\r/g, "\n");
				}
				const lines = patterns.split("\n").map((x) => x.trim());
				for (const line of lines) if (!line || line.startsWith("#")) continue;
				else result.patterns.push(new internal_pattern_1.Pattern(line));
				result.searchPaths.push(...patternHelper.getSearchPaths(result.patterns));
				return result;
			});
		}
		static stat(item, options, traversalChain) {
			return __awaiter$2(this, void 0, void 0, function* () {
				let stats;
				if (options.followSymbolicLinks) try {
					stats = yield fs$1.promises.stat(item.path);
				} catch (err) {
					if (err.code === "ENOENT") {
						if (options.omitBrokenSymbolicLinks) {
							core$1.debug(`Broken symlink '${item.path}'`);
							return void 0;
						}
						throw new Error(`No information found for the path '${item.path}'. This may indicate a broken symbolic link.`);
					}
					throw err;
				}
				else stats = yield fs$1.promises.lstat(item.path);
				if (stats.isDirectory() && options.followSymbolicLinks) {
					const realPath = yield fs$1.promises.realpath(item.path);
					while (traversalChain.length >= item.level) traversalChain.pop();
					if (traversalChain.some((x) => x === realPath)) {
						core$1.debug(`Symlink cycle detected for path '${item.path}' and realpath '${realPath}'`);
						return void 0;
					}
					traversalChain.push(realPath);
				}
				return stats;
			});
		}
	};
	exports.DefaultGlobber = DefaultGlobber;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-hash-files.js
var require_internal_hash_files = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/internal-hash-files.js"(exports) {
	var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	} : function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	});
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	} : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	var __awaiter$1 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
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
	var __asyncValues = exports && exports.__asyncValues || function(o) {
		if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
		var m = o[Symbol.asyncIterator], i;
		return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
			return this;
		}, i);
		function verb(n) {
			i[n] = o[n] && function(v) {
				return new Promise(function(resolve, reject) {
					v = o[n](v), settle(resolve, reject, v.done, v.value);
				});
			};
		}
		function settle(resolve, reject, d, v) {
			Promise.resolve(v).then(function(v$1) {
				resolve({
					value: v$1,
					done: d
				});
			}, reject);
		}
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.hashFiles = void 0;
	const crypto = __importStar(__require("crypto"));
	const core = __importStar(require_core());
	const fs = __importStar(__require("fs"));
	const stream = __importStar(__require("stream"));
	const util = __importStar(__require("util"));
	const path = __importStar(__require("path"));
	function hashFiles$1(globber, currentWorkspace, verbose = false) {
		var _a, e_1, _b, _c;
		var _d;
		return __awaiter$1(this, void 0, void 0, function* () {
			const writeDelegate = verbose ? core.info : core.debug;
			let hasMatch = false;
			const githubWorkspace = currentWorkspace ? currentWorkspace : (_d = process.env["GITHUB_WORKSPACE"]) !== null && _d !== void 0 ? _d : process.cwd();
			const result = crypto.createHash("sha256");
			let count = 0;
			try {
				for (var _e = true, _f = __asyncValues(globber.globGenerator()), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
					_c = _g.value;
					_e = false;
					const file = _c;
					writeDelegate(file);
					if (!file.startsWith(`${githubWorkspace}${path.sep}`)) {
						writeDelegate(`Ignore '${file}' since it is not under GITHUB_WORKSPACE.`);
						continue;
					}
					if (fs.statSync(file).isDirectory()) {
						writeDelegate(`Skip directory '${file}'.`);
						continue;
					}
					const hash = crypto.createHash("sha256");
					const pipeline = util.promisify(stream.pipeline);
					yield pipeline(fs.createReadStream(file), hash);
					result.write(hash.digest());
					count++;
					if (!hasMatch) hasMatch = true;
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			result.end();
			if (hasMatch) {
				writeDelegate(`Found ${count} files to hash.`);
				return result.digest("hex");
			} else {
				writeDelegate(`No matches found for glob`);
				return "";
			}
		});
	}
	exports.hashFiles = hashFiles$1;
} });

//#endregion
//#region node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/glob.js
var require_glob = __commonJS({ "node_modules/.deno/@actions+glob@0.5.0/node_modules/@actions/glob/lib/glob.js"(exports) {
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
	exports.hashFiles = exports.create = void 0;
	const internal_globber_1 = require_internal_globber();
	const internal_hash_files_1 = require_internal_hash_files();
	/**
	* Constructs a globber
	*
	* @param patterns  Patterns separated by newlines
	* @param options   Glob options
	*/
	function create(patterns, options) {
		return __awaiter(this, void 0, void 0, function* () {
			return yield internal_globber_1.DefaultGlobber.create(patterns, options);
		});
	}
	exports.create = create;
	/**
	* Computes the sha256 hash of a glob
	*
	* @param patterns  Patterns separated by newlines
	* @param currentWorkspace  Workspace used when matching files
	* @param options   Glob options
	* @param verbose   Enables verbose logging
	*/
	function hashFiles(patterns, currentWorkspace = "", options, verbose = false) {
		return __awaiter(this, void 0, void 0, function* () {
			let followSymbolicLinks = true;
			if (options && typeof options.followSymbolicLinks === "boolean") followSymbolicLinks = options.followSymbolicLinks;
			const globber = yield create(patterns, { followSymbolicLinks });
			return (0, internal_hash_files_1.hashFiles)(globber, currentWorkspace, verbose);
		});
	}
	exports.hashFiles = hashFiles;
} });

//#endregion
export default require_glob();
