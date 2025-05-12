import { __commonJS } from "./core-dugiPccr.mjs";

//#region node_modules/.deno/semver@6.3.1/node_modules/semver/semver.js
var require_semver = __commonJS({ "node_modules/.deno/semver@6.3.1/node_modules/semver/semver.js"(exports, module) {
	exports = module.exports = SemVer;
	var debug;
	/* istanbul ignore next */
	if (typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG)) debug = function() {
		var args = Array.prototype.slice.call(arguments, 0);
		args.unshift("SEMVER");
		console.log.apply(console, args);
	};
	else debug = function() {};
	exports.SEMVER_SPEC_VERSION = "2.0.0";
	var MAX_LENGTH = 256;
	var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
	var MAX_SAFE_COMPONENT_LENGTH = 16;
	var MAX_SAFE_BUILD_LENGTH = MAX_LENGTH - 6;
	var re = exports.re = [];
	var safeRe = exports.safeRe = [];
	var src = exports.src = [];
	var t = exports.tokens = {};
	var R = 0;
	function tok(n) {
		t[n] = R++;
	}
	var LETTERDASHNUMBER = "[a-zA-Z0-9-]";
	var safeRegexReplacements = [
		["\\s", 1],
		["\\d", MAX_LENGTH],
		[LETTERDASHNUMBER, MAX_SAFE_BUILD_LENGTH]
	];
	function makeSafeRe(value) {
		for (var i$1 = 0; i$1 < safeRegexReplacements.length; i$1++) {
			var token = safeRegexReplacements[i$1][0];
			var max = safeRegexReplacements[i$1][1];
			value = value.split(token + "*").join(token + "{0," + max + "}").split(token + "+").join(token + "{1," + max + "}");
		}
		return value;
	}
	tok("NUMERICIDENTIFIER");
	src[t.NUMERICIDENTIFIER] = "0|[1-9]\\d*";
	tok("NUMERICIDENTIFIERLOOSE");
	src[t.NUMERICIDENTIFIERLOOSE] = "\\d+";
	tok("NONNUMERICIDENTIFIER");
	src[t.NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-]" + LETTERDASHNUMBER + "*";
	tok("MAINVERSION");
	src[t.MAINVERSION] = "(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")\\.(" + src[t.NUMERICIDENTIFIER] + ")";
	tok("MAINVERSIONLOOSE");
	src[t.MAINVERSIONLOOSE] = "(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")\\.(" + src[t.NUMERICIDENTIFIERLOOSE] + ")";
	tok("PRERELEASEIDENTIFIER");
	src[t.PRERELEASEIDENTIFIER] = "(?:" + src[t.NUMERICIDENTIFIER] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
	tok("PRERELEASEIDENTIFIERLOOSE");
	src[t.PRERELEASEIDENTIFIERLOOSE] = "(?:" + src[t.NUMERICIDENTIFIERLOOSE] + "|" + src[t.NONNUMERICIDENTIFIER] + ")";
	tok("PRERELEASE");
	src[t.PRERELEASE] = "(?:-(" + src[t.PRERELEASEIDENTIFIER] + "(?:\\." + src[t.PRERELEASEIDENTIFIER] + ")*))";
	tok("PRERELEASELOOSE");
	src[t.PRERELEASELOOSE] = "(?:-?(" + src[t.PRERELEASEIDENTIFIERLOOSE] + "(?:\\." + src[t.PRERELEASEIDENTIFIERLOOSE] + ")*))";
	tok("BUILDIDENTIFIER");
	src[t.BUILDIDENTIFIER] = LETTERDASHNUMBER + "+";
	tok("BUILD");
	src[t.BUILD] = "(?:\\+(" + src[t.BUILDIDENTIFIER] + "(?:\\." + src[t.BUILDIDENTIFIER] + ")*))";
	tok("FULL");
	tok("FULLPLAIN");
	src[t.FULLPLAIN] = "v?" + src[t.MAINVERSION] + src[t.PRERELEASE] + "?" + src[t.BUILD] + "?";
	src[t.FULL] = "^" + src[t.FULLPLAIN] + "$";
	tok("LOOSEPLAIN");
	src[t.LOOSEPLAIN] = "[v=\\s]*" + src[t.MAINVERSIONLOOSE] + src[t.PRERELEASELOOSE] + "?" + src[t.BUILD] + "?";
	tok("LOOSE");
	src[t.LOOSE] = "^" + src[t.LOOSEPLAIN] + "$";
	tok("GTLT");
	src[t.GTLT] = "((?:<|>)?=?)";
	tok("XRANGEIDENTIFIERLOOSE");
	src[t.XRANGEIDENTIFIERLOOSE] = src[t.NUMERICIDENTIFIERLOOSE] + "|x|X|\\*";
	tok("XRANGEIDENTIFIER");
	src[t.XRANGEIDENTIFIER] = src[t.NUMERICIDENTIFIER] + "|x|X|\\*";
	tok("XRANGEPLAIN");
	src[t.XRANGEPLAIN] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:\\.(" + src[t.XRANGEIDENTIFIER] + ")(?:" + src[t.PRERELEASE] + ")?" + src[t.BUILD] + "?)?)?";
	tok("XRANGEPLAINLOOSE");
	src[t.XRANGEPLAINLOOSE] = "[v=\\s]*(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:\\.(" + src[t.XRANGEIDENTIFIERLOOSE] + ")(?:" + src[t.PRERELEASELOOSE] + ")?" + src[t.BUILD] + "?)?)?";
	tok("XRANGE");
	src[t.XRANGE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAIN] + "$";
	tok("XRANGELOOSE");
	src[t.XRANGELOOSE] = "^" + src[t.GTLT] + "\\s*" + src[t.XRANGEPLAINLOOSE] + "$";
	tok("COERCE");
	src[t.COERCE] = "(^|[^\\d])(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "})(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:\\.(\\d{1," + MAX_SAFE_COMPONENT_LENGTH + "}))?(?:$|[^\\d])";
	tok("COERCERTL");
	re[t.COERCERTL] = new RegExp(src[t.COERCE], "g");
	safeRe[t.COERCERTL] = new RegExp(makeSafeRe(src[t.COERCE]), "g");
	tok("LONETILDE");
	src[t.LONETILDE] = "(?:~>?)";
	tok("TILDETRIM");
	src[t.TILDETRIM] = "(\\s*)" + src[t.LONETILDE] + "\\s+";
	re[t.TILDETRIM] = new RegExp(src[t.TILDETRIM], "g");
	safeRe[t.TILDETRIM] = new RegExp(makeSafeRe(src[t.TILDETRIM]), "g");
	var tildeTrimReplace = "$1~";
	tok("TILDE");
	src[t.TILDE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAIN] + "$";
	tok("TILDELOOSE");
	src[t.TILDELOOSE] = "^" + src[t.LONETILDE] + src[t.XRANGEPLAINLOOSE] + "$";
	tok("LONECARET");
	src[t.LONECARET] = "(?:\\^)";
	tok("CARETTRIM");
	src[t.CARETTRIM] = "(\\s*)" + src[t.LONECARET] + "\\s+";
	re[t.CARETTRIM] = new RegExp(src[t.CARETTRIM], "g");
	safeRe[t.CARETTRIM] = new RegExp(makeSafeRe(src[t.CARETTRIM]), "g");
	var caretTrimReplace = "$1^";
	tok("CARET");
	src[t.CARET] = "^" + src[t.LONECARET] + src[t.XRANGEPLAIN] + "$";
	tok("CARETLOOSE");
	src[t.CARETLOOSE] = "^" + src[t.LONECARET] + src[t.XRANGEPLAINLOOSE] + "$";
	tok("COMPARATORLOOSE");
	src[t.COMPARATORLOOSE] = "^" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + ")$|^$";
	tok("COMPARATOR");
	src[t.COMPARATOR] = "^" + src[t.GTLT] + "\\s*(" + src[t.FULLPLAIN] + ")$|^$";
	tok("COMPARATORTRIM");
	src[t.COMPARATORTRIM] = "(\\s*)" + src[t.GTLT] + "\\s*(" + src[t.LOOSEPLAIN] + "|" + src[t.XRANGEPLAIN] + ")";
	re[t.COMPARATORTRIM] = new RegExp(src[t.COMPARATORTRIM], "g");
	safeRe[t.COMPARATORTRIM] = new RegExp(makeSafeRe(src[t.COMPARATORTRIM]), "g");
	var comparatorTrimReplace = "$1$2$3";
	tok("HYPHENRANGE");
	src[t.HYPHENRANGE] = "^\\s*(" + src[t.XRANGEPLAIN] + ")\\s+-\\s+(" + src[t.XRANGEPLAIN] + ")\\s*$";
	tok("HYPHENRANGELOOSE");
	src[t.HYPHENRANGELOOSE] = "^\\s*(" + src[t.XRANGEPLAINLOOSE] + ")\\s+-\\s+(" + src[t.XRANGEPLAINLOOSE] + ")\\s*$";
	tok("STAR");
	src[t.STAR] = "(<|>)?=?\\s*\\*";
	for (var i = 0; i < R; i++) {
		debug(i, src[i]);
		if (!re[i]) {
			re[i] = new RegExp(src[i]);
			safeRe[i] = new RegExp(makeSafeRe(src[i]));
		}
	}
	exports.parse = parse;
	function parse(version, options) {
		if (!options || typeof options !== "object") options = {
			loose: !!options,
			includePrerelease: false
		};
		if (version instanceof SemVer) return version;
		if (typeof version !== "string") return null;
		if (version.length > MAX_LENGTH) return null;
		var r = options.loose ? safeRe[t.LOOSE] : safeRe[t.FULL];
		if (!r.test(version)) return null;
		try {
			return new SemVer(version, options);
		} catch (er) {
			return null;
		}
	}
	exports.valid = valid;
	function valid(version, options) {
		var v = parse(version, options);
		return v ? v.version : null;
	}
	exports.clean = clean;
	function clean(version, options) {
		var s = parse(version.trim().replace(/^[=v]+/, ""), options);
		return s ? s.version : null;
	}
	exports.SemVer = SemVer;
	function SemVer(version, options) {
		if (!options || typeof options !== "object") options = {
			loose: !!options,
			includePrerelease: false
		};
		if (version instanceof SemVer) if (version.loose === options.loose) return version;
		else version = version.version;
		else if (typeof version !== "string") throw new TypeError("Invalid Version: " + version);
		if (version.length > MAX_LENGTH) throw new TypeError("version is longer than " + MAX_LENGTH + " characters");
		if (!(this instanceof SemVer)) return new SemVer(version, options);
		debug("SemVer", version, options);
		this.options = options;
		this.loose = !!options.loose;
		var m = version.trim().match(options.loose ? safeRe[t.LOOSE] : safeRe[t.FULL]);
		if (!m) throw new TypeError("Invalid Version: " + version);
		this.raw = version;
		this.major = +m[1];
		this.minor = +m[2];
		this.patch = +m[3];
		if (this.major > MAX_SAFE_INTEGER || this.major < 0) throw new TypeError("Invalid major version");
		if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError("Invalid minor version");
		if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError("Invalid patch version");
		if (!m[4]) this.prerelease = [];
		else this.prerelease = m[4].split(".").map(function(id) {
			if (/^[0-9]+$/.test(id)) {
				var num = +id;
				if (num >= 0 && num < MAX_SAFE_INTEGER) return num;
			}
			return id;
		});
		this.build = m[5] ? m[5].split(".") : [];
		this.format();
	}
	SemVer.prototype.format = function() {
		this.version = this.major + "." + this.minor + "." + this.patch;
		if (this.prerelease.length) this.version += "-" + this.prerelease.join(".");
		return this.version;
	};
	SemVer.prototype.toString = function() {
		return this.version;
	};
	SemVer.prototype.compare = function(other) {
		debug("SemVer.compare", this.version, this.options, other);
		if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
		return this.compareMain(other) || this.comparePre(other);
	};
	SemVer.prototype.compareMain = function(other) {
		if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
		return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
	};
	SemVer.prototype.comparePre = function(other) {
		if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
		if (this.prerelease.length && !other.prerelease.length) return -1;
		else if (!this.prerelease.length && other.prerelease.length) return 1;
		else if (!this.prerelease.length && !other.prerelease.length) return 0;
		var i$1 = 0;
		do {
			var a = this.prerelease[i$1];
			var b = other.prerelease[i$1];
			debug("prerelease compare", i$1, a, b);
			if (a === void 0 && b === void 0) return 0;
			else if (b === void 0) return 1;
			else if (a === void 0) return -1;
			else if (a === b) continue;
			else return compareIdentifiers(a, b);
		} while (++i$1);
	};
	SemVer.prototype.compareBuild = function(other) {
		if (!(other instanceof SemVer)) other = new SemVer(other, this.options);
		var i$1 = 0;
		do {
			var a = this.build[i$1];
			var b = other.build[i$1];
			debug("prerelease compare", i$1, a, b);
			if (a === void 0 && b === void 0) return 0;
			else if (b === void 0) return 1;
			else if (a === void 0) return -1;
			else if (a === b) continue;
			else return compareIdentifiers(a, b);
		} while (++i$1);
	};
	SemVer.prototype.inc = function(release, identifier) {
		switch (release) {
			case "premajor":
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor = 0;
				this.major++;
				this.inc("pre", identifier);
				break;
			case "preminor":
				this.prerelease.length = 0;
				this.patch = 0;
				this.minor++;
				this.inc("pre", identifier);
				break;
			case "prepatch":
				this.prerelease.length = 0;
				this.inc("patch", identifier);
				this.inc("pre", identifier);
				break;
			case "prerelease":
				if (this.prerelease.length === 0) this.inc("patch", identifier);
				this.inc("pre", identifier);
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
			case "pre":
				if (this.prerelease.length === 0) this.prerelease = [0];
				else {
					var i$1 = this.prerelease.length;
					while (--i$1 >= 0) if (typeof this.prerelease[i$1] === "number") {
						this.prerelease[i$1]++;
						i$1 = -2;
					}
					if (i$1 === -1) this.prerelease.push(0);
				}
				if (identifier) if (this.prerelease[0] === identifier) {
					if (isNaN(this.prerelease[1])) this.prerelease = [identifier, 0];
				} else this.prerelease = [identifier, 0];
				break;
			default: throw new Error("invalid increment argument: " + release);
		}
		this.format();
		this.raw = this.version;
		return this;
	};
	exports.inc = inc;
	function inc(version, release, loose, identifier) {
		if (typeof loose === "string") {
			identifier = loose;
			loose = void 0;
		}
		try {
			return new SemVer(version, loose).inc(release, identifier).version;
		} catch (er) {
			return null;
		}
	}
	exports.diff = diff;
	function diff(version1, version2) {
		if (eq(version1, version2)) return null;
		else {
			var v1 = parse(version1);
			var v2 = parse(version2);
			var prefix = "";
			if (v1.prerelease.length || v2.prerelease.length) {
				prefix = "pre";
				var defaultResult = "prerelease";
			}
			for (var key in v1) if (key === "major" || key === "minor" || key === "patch") {
				if (v1[key] !== v2[key]) return prefix + key;
			}
			return defaultResult;
		}
	}
	exports.compareIdentifiers = compareIdentifiers;
	var numeric = /^[0-9]+$/;
	function compareIdentifiers(a, b) {
		var anum = numeric.test(a);
		var bnum = numeric.test(b);
		if (anum && bnum) {
			a = +a;
			b = +b;
		}
		return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
	}
	exports.rcompareIdentifiers = rcompareIdentifiers;
	function rcompareIdentifiers(a, b) {
		return compareIdentifiers(b, a);
	}
	exports.major = major;
	function major(a, loose) {
		return new SemVer(a, loose).major;
	}
	exports.minor = minor;
	function minor(a, loose) {
		return new SemVer(a, loose).minor;
	}
	exports.patch = patch;
	function patch(a, loose) {
		return new SemVer(a, loose).patch;
	}
	exports.compare = compare;
	function compare(a, b, loose) {
		return new SemVer(a, loose).compare(new SemVer(b, loose));
	}
	exports.compareLoose = compareLoose;
	function compareLoose(a, b) {
		return compare(a, b, true);
	}
	exports.compareBuild = compareBuild;
	function compareBuild(a, b, loose) {
		var versionA = new SemVer(a, loose);
		var versionB = new SemVer(b, loose);
		return versionA.compare(versionB) || versionA.compareBuild(versionB);
	}
	exports.rcompare = rcompare;
	function rcompare(a, b, loose) {
		return compare(b, a, loose);
	}
	exports.sort = sort;
	function sort(list, loose) {
		return list.sort(function(a, b) {
			return exports.compareBuild(a, b, loose);
		});
	}
	exports.rsort = rsort;
	function rsort(list, loose) {
		return list.sort(function(a, b) {
			return exports.compareBuild(b, a, loose);
		});
	}
	exports.gt = gt;
	function gt(a, b, loose) {
		return compare(a, b, loose) > 0;
	}
	exports.lt = lt;
	function lt(a, b, loose) {
		return compare(a, b, loose) < 0;
	}
	exports.eq = eq;
	function eq(a, b, loose) {
		return compare(a, b, loose) === 0;
	}
	exports.neq = neq;
	function neq(a, b, loose) {
		return compare(a, b, loose) !== 0;
	}
	exports.gte = gte;
	function gte(a, b, loose) {
		return compare(a, b, loose) >= 0;
	}
	exports.lte = lte;
	function lte(a, b, loose) {
		return compare(a, b, loose) <= 0;
	}
	exports.cmp = cmp;
	function cmp(a, op, b, loose) {
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
			default: throw new TypeError("Invalid operator: " + op);
		}
	}
	exports.Comparator = Comparator;
	function Comparator(comp, options) {
		if (!options || typeof options !== "object") options = {
			loose: !!options,
			includePrerelease: false
		};
		if (comp instanceof Comparator) if (comp.loose === !!options.loose) return comp;
		else comp = comp.value;
		if (!(this instanceof Comparator)) return new Comparator(comp, options);
		comp = comp.trim().split(/\s+/).join(" ");
		debug("comparator", comp, options);
		this.options = options;
		this.loose = !!options.loose;
		this.parse(comp);
		if (this.semver === ANY) this.value = "";
		else this.value = this.operator + this.semver.version;
		debug("comp", this);
	}
	var ANY = {};
	Comparator.prototype.parse = function(comp) {
		var r = this.options.loose ? safeRe[t.COMPARATORLOOSE] : safeRe[t.COMPARATOR];
		var m = comp.match(r);
		if (!m) throw new TypeError("Invalid comparator: " + comp);
		this.operator = m[1] !== void 0 ? m[1] : "";
		if (this.operator === "=") this.operator = "";
		if (!m[2]) this.semver = ANY;
		else this.semver = new SemVer(m[2], this.options.loose);
	};
	Comparator.prototype.toString = function() {
		return this.value;
	};
	Comparator.prototype.test = function(version) {
		debug("Comparator.test", version, this.options.loose);
		if (this.semver === ANY || version === ANY) return true;
		if (typeof version === "string") try {
			version = new SemVer(version, this.options);
		} catch (er) {
			return false;
		}
		return cmp(version, this.operator, this.semver, this.options);
	};
	Comparator.prototype.intersects = function(comp, options) {
		if (!(comp instanceof Comparator)) throw new TypeError("a Comparator is required");
		if (!options || typeof options !== "object") options = {
			loose: !!options,
			includePrerelease: false
		};
		var rangeTmp;
		if (this.operator === "") {
			if (this.value === "") return true;
			rangeTmp = new Range(comp.value, options);
			return satisfies(this.value, rangeTmp, options);
		} else if (comp.operator === "") {
			if (comp.value === "") return true;
			rangeTmp = new Range(this.value, options);
			return satisfies(comp.semver, rangeTmp, options);
		}
		var sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
		var sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
		var sameSemVer = this.semver.version === comp.semver.version;
		var differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
		var oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && (this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<");
		var oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && (this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">");
		return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
	};
	exports.Range = Range;
	function Range(range, options) {
		if (!options || typeof options !== "object") options = {
			loose: !!options,
			includePrerelease: false
		};
		if (range instanceof Range) if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) return range;
		else return new Range(range.raw, options);
		if (range instanceof Comparator) return new Range(range.value, options);
		if (!(this instanceof Range)) return new Range(range, options);
		this.options = options;
		this.loose = !!options.loose;
		this.includePrerelease = !!options.includePrerelease;
		this.raw = range.trim().split(/\s+/).join(" ");
		this.set = this.raw.split("||").map(function(range$1) {
			return this.parseRange(range$1.trim());
		}, this).filter(function(c) {
			return c.length;
		});
		if (!this.set.length) throw new TypeError("Invalid SemVer Range: " + this.raw);
		this.format();
	}
	Range.prototype.format = function() {
		this.range = this.set.map(function(comps) {
			return comps.join(" ").trim();
		}).join("||").trim();
		return this.range;
	};
	Range.prototype.toString = function() {
		return this.range;
	};
	Range.prototype.parseRange = function(range) {
		var loose = this.options.loose;
		var hr = loose ? safeRe[t.HYPHENRANGELOOSE] : safeRe[t.HYPHENRANGE];
		range = range.replace(hr, hyphenReplace);
		debug("hyphen replace", range);
		range = range.replace(safeRe[t.COMPARATORTRIM], comparatorTrimReplace);
		debug("comparator trim", range, safeRe[t.COMPARATORTRIM]);
		range = range.replace(safeRe[t.TILDETRIM], tildeTrimReplace);
		range = range.replace(safeRe[t.CARETTRIM], caretTrimReplace);
		range = range.split(/\s+/).join(" ");
		var compRe = loose ? safeRe[t.COMPARATORLOOSE] : safeRe[t.COMPARATOR];
		var set = range.split(" ").map(function(comp) {
			return parseComparator(comp, this.options);
		}, this).join(" ").split(/\s+/);
		if (this.options.loose) set = set.filter(function(comp) {
			return !!comp.match(compRe);
		});
		set = set.map(function(comp) {
			return new Comparator(comp, this.options);
		}, this);
		return set;
	};
	Range.prototype.intersects = function(range, options) {
		if (!(range instanceof Range)) throw new TypeError("a Range is required");
		return this.set.some(function(thisComparators) {
			return isSatisfiable(thisComparators, options) && range.set.some(function(rangeComparators) {
				return isSatisfiable(rangeComparators, options) && thisComparators.every(function(thisComparator) {
					return rangeComparators.every(function(rangeComparator) {
						return thisComparator.intersects(rangeComparator, options);
					});
				});
			});
		});
	};
	function isSatisfiable(comparators, options) {
		var result = true;
		var remainingComparators = comparators.slice();
		var testComparator = remainingComparators.pop();
		while (result && remainingComparators.length) {
			result = remainingComparators.every(function(otherComparator) {
				return testComparator.intersects(otherComparator, options);
			});
			testComparator = remainingComparators.pop();
		}
		return result;
	}
	exports.toComparators = toComparators;
	function toComparators(range, options) {
		return new Range(range, options).set.map(function(comp) {
			return comp.map(function(c) {
				return c.value;
			}).join(" ").trim().split(" ");
		});
	}
	function parseComparator(comp, options) {
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
	}
	function isX(id) {
		return !id || id.toLowerCase() === "x" || id === "*";
	}
	function replaceTildes(comp, options) {
		return comp.trim().split(/\s+/).map(function(comp$1) {
			return replaceTilde(comp$1, options);
		}).join(" ");
	}
	function replaceTilde(comp, options) {
		var r = options.loose ? safeRe[t.TILDELOOSE] : safeRe[t.TILDE];
		return comp.replace(r, function(_, M, m, p, pr) {
			debug("tilde", comp, _, M, m, p, pr);
			var ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
			else if (isX(p)) ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
			else if (pr) {
				debug("replaceTilde pr", pr);
				ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
			} else ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
			debug("tilde return", ret);
			return ret;
		});
	}
	function replaceCarets(comp, options) {
		return comp.trim().split(/\s+/).map(function(comp$1) {
			return replaceCaret(comp$1, options);
		}).join(" ");
	}
	function replaceCaret(comp, options) {
		debug("caret", comp, options);
		var r = options.loose ? safeRe[t.CARETLOOSE] : safeRe[t.CARET];
		return comp.replace(r, function(_, M, m, p, pr) {
			debug("caret", comp, _, M, m, p, pr);
			var ret;
			if (isX(M)) ret = "";
			else if (isX(m)) ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0";
			else if (isX(p)) if (M === "0") ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0";
			else ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0";
			else if (pr) {
				debug("replaceCaret pr", pr);
				if (M === "0") if (m === "0") ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + m + "." + (+p + 1);
				else ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + M + "." + (+m + 1) + ".0";
				else ret = ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0";
			} else {
				debug("no pr");
				if (M === "0") if (m === "0") ret = ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1);
				else ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0";
				else ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0";
			}
			debug("caret return", ret);
			return ret;
		});
	}
	function replaceXRanges(comp, options) {
		debug("replaceXRanges", comp, options);
		return comp.split(/\s+/).map(function(comp$1) {
			return replaceXRange(comp$1, options);
		}).join(" ");
	}
	function replaceXRange(comp, options) {
		comp = comp.trim();
		var r = options.loose ? safeRe[t.XRANGELOOSE] : safeRe[t.XRANGE];
		return comp.replace(r, function(ret, gtlt, M, m, p, pr) {
			debug("xRange", comp, ret, gtlt, M, m, p, pr);
			var xM = isX(M);
			var xm = xM || isX(m);
			var xp = xm || isX(p);
			var anyX = xp;
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
				ret = gtlt + M + "." + m + "." + p + pr;
			} else if (xm) ret = ">=" + M + ".0.0" + pr + " <" + (+M + 1) + ".0.0" + pr;
			else if (xp) ret = ">=" + M + "." + m + ".0" + pr + " <" + M + "." + (+m + 1) + ".0" + pr;
			debug("xRange return", ret);
			return ret;
		});
	}
	function replaceStars(comp, options) {
		debug("replaceStars", comp, options);
		return comp.trim().replace(safeRe[t.STAR], "");
	}
	function hyphenReplace($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) {
		if (isX(fM)) from = "";
		else if (isX(fm)) from = ">=" + fM + ".0.0";
		else if (isX(fp)) from = ">=" + fM + "." + fm + ".0";
		else from = ">=" + from;
		if (isX(tM)) to = "";
		else if (isX(tm)) to = "<" + (+tM + 1) + ".0.0";
		else if (isX(tp)) to = "<" + tM + "." + (+tm + 1) + ".0";
		else if (tpr) to = "<=" + tM + "." + tm + "." + tp + "-" + tpr;
		else to = "<=" + to;
		return (from + " " + to).trim();
	}
	Range.prototype.test = function(version) {
		if (!version) return false;
		if (typeof version === "string") try {
			version = new SemVer(version, this.options);
		} catch (er) {
			return false;
		}
		for (var i$1 = 0; i$1 < this.set.length; i$1++) if (testSet(this.set[i$1], version, this.options)) return true;
		return false;
	};
	function testSet(set, version, options) {
		for (var i$1 = 0; i$1 < set.length; i$1++) if (!set[i$1].test(version)) return false;
		if (version.prerelease.length && !options.includePrerelease) {
			for (i$1 = 0; i$1 < set.length; i$1++) {
				debug(set[i$1].semver);
				if (set[i$1].semver === ANY) continue;
				if (set[i$1].semver.prerelease.length > 0) {
					var allowed = set[i$1].semver;
					if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) return true;
				}
			}
			return false;
		}
		return true;
	}
	exports.satisfies = satisfies;
	function satisfies(version, range, options) {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	}
	exports.maxSatisfying = maxSatisfying;
	function maxSatisfying(versions, range, options) {
		var max = null;
		var maxSV = null;
		try {
			var rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach(function(v) {
			if (rangeObj.test(v)) {
				if (!max || maxSV.compare(v) === -1) {
					max = v;
					maxSV = new SemVer(max, options);
				}
			}
		});
		return max;
	}
	exports.minSatisfying = minSatisfying;
	function minSatisfying(versions, range, options) {
		var min = null;
		var minSV = null;
		try {
			var rangeObj = new Range(range, options);
		} catch (er) {
			return null;
		}
		versions.forEach(function(v) {
			if (rangeObj.test(v)) {
				if (!min || minSV.compare(v) === 1) {
					min = v;
					minSV = new SemVer(min, options);
				}
			}
		});
		return min;
	}
	exports.minVersion = minVersion;
	function minVersion(range, loose) {
		range = new Range(range, loose);
		var minver = new SemVer("0.0.0");
		if (range.test(minver)) return minver;
		minver = new SemVer("0.0.0-0");
		if (range.test(minver)) return minver;
		minver = null;
		for (var i$1 = 0; i$1 < range.set.length; ++i$1) {
			var comparators = range.set[i$1];
			comparators.forEach(function(comparator) {
				var compver = new SemVer(comparator.semver.version);
				switch (comparator.operator) {
					case ">":
						if (compver.prerelease.length === 0) compver.patch++;
						else compver.prerelease.push(0);
						compver.raw = compver.format();
					case "":
					case ">=":
						if (!minver || gt(minver, compver)) minver = compver;
						break;
					case "<":
					case "<=": break;
					default: throw new Error("Unexpected operation: " + comparator.operator);
				}
			});
		}
		if (minver && range.test(minver)) return minver;
		return null;
	}
	exports.validRange = validRange;
	function validRange(range, options) {
		try {
			return new Range(range, options).range || "*";
		} catch (er) {
			return null;
		}
	}
	exports.ltr = ltr;
	function ltr(version, range, options) {
		return outside(version, range, "<", options);
	}
	exports.gtr = gtr;
	function gtr(version, range, options) {
		return outside(version, range, ">", options);
	}
	exports.outside = outside;
	function outside(version, range, hilo, options) {
		version = new SemVer(version, options);
		range = new Range(range, options);
		var gtfn, ltefn, ltfn, comp, ecomp;
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
		for (var i$1 = 0; i$1 < range.set.length; ++i$1) {
			var comparators = range.set[i$1];
			var high = null;
			var low = null;
			comparators.forEach(function(comparator) {
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
	}
	exports.prerelease = prerelease;
	function prerelease(version, options) {
		var parsed = parse(version, options);
		return parsed && parsed.prerelease.length ? parsed.prerelease : null;
	}
	exports.intersects = intersects;
	function intersects(r1, r2, options) {
		r1 = new Range(r1, options);
		r2 = new Range(r2, options);
		return r1.intersects(r2);
	}
	exports.coerce = coerce;
	function coerce(version, options) {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		var match = null;
		if (!options.rtl) match = version.match(safeRe[t.COERCE]);
		else {
			var next;
			while ((next = safeRe[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				safeRe[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
			}
			safeRe[t.COERCERTL].lastIndex = -1;
		}
		if (match === null) return null;
		return parse(match[2] + "." + (match[3] || "0") + "." + (match[4] || "0"), options);
	}
} });

//#endregion
export { require_semver };