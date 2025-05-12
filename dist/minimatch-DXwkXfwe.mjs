import { __commonJS, __require } from "./core-dugiPccr.mjs";

//#region node_modules/.deno/concat-map@0.0.1/node_modules/concat-map/index.js
var require_concat_map = __commonJS({ "node_modules/.deno/concat-map@0.0.1/node_modules/concat-map/index.js"(exports, module) {
	module.exports = function(xs, fn) {
		var res = [];
		for (var i = 0; i < xs.length; i++) {
			var x = fn(xs[i], i);
			if (isArray(x)) res.push.apply(res, x);
			else res.push(x);
		}
		return res;
	};
	var isArray = Array.isArray || function(xs) {
		return Object.prototype.toString.call(xs) === "[object Array]";
	};
} });

//#endregion
//#region node_modules/.deno/balanced-match@1.0.2/node_modules/balanced-match/index.js
var require_balanced_match = __commonJS({ "node_modules/.deno/balanced-match@1.0.2/node_modules/balanced-match/index.js"(exports, module) {
	module.exports = balanced$1;
	function balanced$1(a, b, str) {
		if (a instanceof RegExp) a = maybeMatch(a, str);
		if (b instanceof RegExp) b = maybeMatch(b, str);
		var r = range(a, b, str);
		return r && {
			start: r[0],
			end: r[1],
			pre: str.slice(0, r[0]),
			body: str.slice(r[0] + a.length, r[1]),
			post: str.slice(r[1] + b.length)
		};
	}
	function maybeMatch(reg, str) {
		var m = str.match(reg);
		return m ? m[0] : null;
	}
	balanced$1.range = range;
	function range(a, b, str) {
		var begs, beg, left, right, result;
		var ai = str.indexOf(a);
		var bi = str.indexOf(b, ai + 1);
		var i = ai;
		if (ai >= 0 && bi > 0) {
			if (a === b) return [ai, bi];
			begs = [];
			left = str.length;
			while (i >= 0 && !result) {
				if (i == ai) {
					begs.push(i);
					ai = str.indexOf(a, i + 1);
				} else if (begs.length == 1) result = [begs.pop(), bi];
				else {
					beg = begs.pop();
					if (beg < left) {
						left = beg;
						right = bi;
					}
					bi = str.indexOf(b, i + 1);
				}
				i = ai < bi && ai >= 0 ? ai : bi;
			}
			if (begs.length) result = [left, right];
		}
		return result;
	}
} });

//#endregion
//#region node_modules/.deno/brace-expansion@1.1.11/node_modules/brace-expansion/index.js
var require_brace_expansion = __commonJS({ "node_modules/.deno/brace-expansion@1.1.11/node_modules/brace-expansion/index.js"(exports, module) {
	var concatMap = require_concat_map();
	var balanced = require_balanced_match();
	module.exports = expandTop;
	var escSlash = "\0SLASH" + Math.random() + "\0";
	var escOpen = "\0OPEN" + Math.random() + "\0";
	var escClose = "\0CLOSE" + Math.random() + "\0";
	var escComma = "\0COMMA" + Math.random() + "\0";
	var escPeriod = "\0PERIOD" + Math.random() + "\0";
	function numeric(str) {
		return parseInt(str, 10) == str ? parseInt(str, 10) : str.charCodeAt(0);
	}
	function escapeBraces(str) {
		return str.split("\\\\").join(escSlash).split("\\{").join(escOpen).split("\\}").join(escClose).split("\\,").join(escComma).split("\\.").join(escPeriod);
	}
	function unescapeBraces(str) {
		return str.split(escSlash).join("\\").split(escOpen).join("{").split(escClose).join("}").split(escComma).join(",").split(escPeriod).join(".");
	}
	function parseCommaParts(str) {
		if (!str) return [""];
		var parts = [];
		var m = balanced("{", "}", str);
		if (!m) return str.split(",");
		var pre = m.pre;
		var body = m.body;
		var post = m.post;
		var p = pre.split(",");
		p[p.length - 1] += "{" + body + "}";
		var postParts = parseCommaParts(post);
		if (post.length) {
			p[p.length - 1] += postParts.shift();
			p.push.apply(p, postParts);
		}
		parts.push.apply(parts, p);
		return parts;
	}
	function expandTop(str) {
		if (!str) return [];
		if (str.substr(0, 2) === "{}") str = "\\{\\}" + str.substr(2);
		return expand$1(escapeBraces(str), true).map(unescapeBraces);
	}
	function embrace(str) {
		return "{" + str + "}";
	}
	function isPadded(el) {
		return /^-?0\d/.test(el);
	}
	function lte(i, y) {
		return i <= y;
	}
	function gte(i, y) {
		return i >= y;
	}
	function expand$1(str, isTop) {
		var expansions = [];
		var m = balanced("{", "}", str);
		if (!m || /\$$/.test(m.pre)) return [str];
		var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
		var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
		var isSequence = isNumericSequence || isAlphaSequence;
		var isOptions = m.body.indexOf(",") >= 0;
		if (!isSequence && !isOptions) {
			if (m.post.match(/,.*\}/)) {
				str = m.pre + "{" + m.body + escClose + m.post;
				return expand$1(str);
			}
			return [str];
		}
		var n;
		if (isSequence) n = m.body.split(/\.\./);
		else {
			n = parseCommaParts(m.body);
			if (n.length === 1) {
				n = expand$1(n[0], false).map(embrace);
				if (n.length === 1) {
					var post = m.post.length ? expand$1(m.post, false) : [""];
					return post.map(function(p) {
						return m.pre + n[0] + p;
					});
				}
			}
		}
		var pre = m.pre;
		var post = m.post.length ? expand$1(m.post, false) : [""];
		var N;
		if (isSequence) {
			var x = numeric(n[0]);
			var y = numeric(n[1]);
			var width = Math.max(n[0].length, n[1].length);
			var incr = n.length == 3 ? Math.abs(numeric(n[2])) : 1;
			var test = lte;
			var reverse = y < x;
			if (reverse) {
				incr *= -1;
				test = gte;
			}
			var pad = n.some(isPadded);
			N = [];
			for (var i = x; test(i, y); i += incr) {
				var c;
				if (isAlphaSequence) {
					c = String.fromCharCode(i);
					if (c === "\\") c = "";
				} else {
					c = String(i);
					if (pad) {
						var need = width - c.length;
						if (need > 0) {
							var z = new Array(need + 1).join("0");
							if (i < 0) c = "-" + z + c.slice(1);
							else c = z + c;
						}
					}
				}
				N.push(c);
			}
		} else N = concatMap(n, function(el) {
			return expand$1(el, false);
		});
		for (var j = 0; j < N.length; j++) for (var k = 0; k < post.length; k++) {
			var expansion = pre + N[j] + post[k];
			if (!isTop || isSequence || expansion) expansions.push(expansion);
		}
		return expansions;
	}
} });

//#endregion
//#region node_modules/.deno/minimatch@3.1.2/node_modules/minimatch/minimatch.js
var require_minimatch = __commonJS({ "node_modules/.deno/minimatch@3.1.2/node_modules/minimatch/minimatch.js"(exports, module) {
	module.exports = minimatch;
	minimatch.Minimatch = Minimatch;
	var path = function() {
		try {
			return __require("path");
		} catch (e) {}
	}() || { sep: "/" };
	minimatch.sep = path.sep;
	var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {};
	var expand = require_brace_expansion();
	var plTypes = {
		"!": {
			open: "(?:(?!(?:",
			close: "))[^/]*?)"
		},
		"?": {
			open: "(?:",
			close: ")?"
		},
		"+": {
			open: "(?:",
			close: ")+"
		},
		"*": {
			open: "(?:",
			close: ")*"
		},
		"@": {
			open: "(?:",
			close: ")"
		}
	};
	var qmark = "[^/]";
	var star = qmark + "*?";
	var twoStarDot = "(?:(?!(?:\\/|^)(?:\\.{1,2})($|\\/)).)*?";
	var twoStarNoDot = "(?:(?!(?:\\/|^)\\.).)*?";
	var reSpecials = charSet("().*{}+?[]^$\\!");
	function charSet(s) {
		return s.split("").reduce(function(set, c) {
			set[c] = true;
			return set;
		}, {});
	}
	var slashSplit = /\/+/;
	minimatch.filter = filter;
	function filter(pattern, options) {
		options = options || {};
		return function(p, i, list) {
			return minimatch(p, pattern, options);
		};
	}
	function ext(a, b) {
		b = b || {};
		var t = {};
		Object.keys(a).forEach(function(k) {
			t[k] = a[k];
		});
		Object.keys(b).forEach(function(k) {
			t[k] = b[k];
		});
		return t;
	}
	minimatch.defaults = function(def) {
		if (!def || typeof def !== "object" || !Object.keys(def).length) return minimatch;
		var orig = minimatch;
		var m = function minimatch$1(p, pattern, options) {
			return orig(p, pattern, ext(def, options));
		};
		m.Minimatch = function Minimatch$1(pattern, options) {
			return new orig.Minimatch(pattern, ext(def, options));
		};
		m.Minimatch.defaults = function defaults(options) {
			return orig.defaults(ext(def, options)).Minimatch;
		};
		m.filter = function filter$1(pattern, options) {
			return orig.filter(pattern, ext(def, options));
		};
		m.defaults = function defaults(options) {
			return orig.defaults(ext(def, options));
		};
		m.makeRe = function makeRe$1(pattern, options) {
			return orig.makeRe(pattern, ext(def, options));
		};
		m.braceExpand = function braceExpand$1(pattern, options) {
			return orig.braceExpand(pattern, ext(def, options));
		};
		m.match = function(list, pattern, options) {
			return orig.match(list, pattern, ext(def, options));
		};
		return m;
	};
	Minimatch.defaults = function(def) {
		return minimatch.defaults(def).Minimatch;
	};
	function minimatch(p, pattern, options) {
		assertValidPattern(pattern);
		if (!options) options = {};
		if (!options.nocomment && pattern.charAt(0) === "#") return false;
		return new Minimatch(pattern, options).match(p);
	}
	function Minimatch(pattern, options) {
		if (!(this instanceof Minimatch)) return new Minimatch(pattern, options);
		assertValidPattern(pattern);
		if (!options) options = {};
		pattern = pattern.trim();
		if (!options.allowWindowsEscape && path.sep !== "/") pattern = pattern.split(path.sep).join("/");
		this.options = options;
		this.set = [];
		this.pattern = pattern;
		this.regexp = null;
		this.negate = false;
		this.comment = false;
		this.empty = false;
		this.partial = !!options.partial;
		this.make();
	}
	Minimatch.prototype.debug = function() {};
	Minimatch.prototype.make = make;
	function make() {
		var pattern = this.pattern;
		var options = this.options;
		if (!options.nocomment && pattern.charAt(0) === "#") {
			this.comment = true;
			return;
		}
		if (!pattern) {
			this.empty = true;
			return;
		}
		this.parseNegate();
		var set = this.globSet = this.braceExpand();
		if (options.debug) this.debug = function debug() {
			console.error.apply(console, arguments);
		};
		this.debug(this.pattern, set);
		set = this.globParts = set.map(function(s) {
			return s.split(slashSplit);
		});
		this.debug(this.pattern, set);
		set = set.map(function(s, si, set$1) {
			return s.map(this.parse, this);
		}, this);
		this.debug(this.pattern, set);
		set = set.filter(function(s) {
			return s.indexOf(false) === -1;
		});
		this.debug(this.pattern, set);
		this.set = set;
	}
	Minimatch.prototype.parseNegate = parseNegate;
	function parseNegate() {
		var pattern = this.pattern;
		var negate = false;
		var options = this.options;
		var negateOffset = 0;
		if (options.nonegate) return;
		for (var i = 0, l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
			negate = !negate;
			negateOffset++;
		}
		if (negateOffset) this.pattern = pattern.substr(negateOffset);
		this.negate = negate;
	}
	minimatch.braceExpand = function(pattern, options) {
		return braceExpand(pattern, options);
	};
	Minimatch.prototype.braceExpand = braceExpand;
	function braceExpand(pattern, options) {
		if (!options) if (this instanceof Minimatch) options = this.options;
		else options = {};
		pattern = typeof pattern === "undefined" ? this.pattern : pattern;
		assertValidPattern(pattern);
		if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) return [pattern];
		return expand(pattern);
	}
	var MAX_PATTERN_LENGTH = 1024 * 64;
	var assertValidPattern = function(pattern) {
		if (typeof pattern !== "string") throw new TypeError("invalid pattern");
		if (pattern.length > MAX_PATTERN_LENGTH) throw new TypeError("pattern is too long");
	};
	Minimatch.prototype.parse = parse;
	var SUBPARSE = {};
	function parse(pattern, isSub) {
		assertValidPattern(pattern);
		var options = this.options;
		if (pattern === "**") if (!options.noglobstar) return GLOBSTAR;
		else pattern = "*";
		if (pattern === "") return "";
		var re = "";
		var hasMagic = !!options.nocase;
		var escaping = false;
		var patternListStack = [];
		var negativeLists = [];
		var stateChar;
		var inClass = false;
		var reClassStart = -1;
		var classStart = -1;
		var patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\/)\\.{1,2}(?:$|\\/))" : "(?!\\.)";
		var self = this;
		function clearStateChar() {
			if (stateChar) {
				switch (stateChar) {
					case "*":
						re += star;
						hasMagic = true;
						break;
					case "?":
						re += qmark;
						hasMagic = true;
						break;
					default:
						re += "\\" + stateChar;
						break;
				}
				self.debug("clearStateChar %j %j", stateChar, re);
				stateChar = false;
			}
		}
		for (var i = 0, len = pattern.length, c; i < len && (c = pattern.charAt(i)); i++) {
			this.debug("%s	%s %s %j", pattern, i, re, c);
			if (escaping && reSpecials[c]) {
				re += "\\" + c;
				escaping = false;
				continue;
			}
			switch (c) {
				case "/": return false;
				case "\\":
					clearStateChar();
					escaping = true;
					continue;
				case "?":
				case "*":
				case "+":
				case "@":
				case "!":
					this.debug("%s	%s %s %j <-- stateChar", pattern, i, re, c);
					if (inClass) {
						this.debug("  in class");
						if (c === "!" && i === classStart + 1) c = "^";
						re += c;
						continue;
					}
					self.debug("call clearStateChar %j", stateChar);
					clearStateChar();
					stateChar = c;
					if (options.noext) clearStateChar();
					continue;
				case "(":
					if (inClass) {
						re += "(";
						continue;
					}
					if (!stateChar) {
						re += "\\(";
						continue;
					}
					patternListStack.push({
						type: stateChar,
						start: i - 1,
						reStart: re.length,
						open: plTypes[stateChar].open,
						close: plTypes[stateChar].close
					});
					re += stateChar === "!" ? "(?:(?!(?:" : "(?:";
					this.debug("plType %j %j", stateChar, re);
					stateChar = false;
					continue;
				case ")":
					if (inClass || !patternListStack.length) {
						re += "\\)";
						continue;
					}
					clearStateChar();
					hasMagic = true;
					var pl = patternListStack.pop();
					re += pl.close;
					if (pl.type === "!") negativeLists.push(pl);
					pl.reEnd = re.length;
					continue;
				case "|":
					if (inClass || !patternListStack.length || escaping) {
						re += "\\|";
						escaping = false;
						continue;
					}
					clearStateChar();
					re += "|";
					continue;
				case "[":
					clearStateChar();
					if (inClass) {
						re += "\\" + c;
						continue;
					}
					inClass = true;
					classStart = i;
					reClassStart = re.length;
					re += c;
					continue;
				case "]":
					if (i === classStart + 1 || !inClass) {
						re += "\\" + c;
						escaping = false;
						continue;
					}
					var cs = pattern.substring(classStart + 1, i);
					try {
						RegExp("[" + cs + "]");
					} catch (er) {
						var sp = this.parse(cs, SUBPARSE);
						re = re.substr(0, reClassStart) + "\\[" + sp[0] + "\\]";
						hasMagic = hasMagic || sp[1];
						inClass = false;
						continue;
					}
					hasMagic = true;
					inClass = false;
					re += c;
					continue;
				default:
					clearStateChar();
					if (escaping) escaping = false;
					else if (reSpecials[c] && !(c === "^" && inClass)) re += "\\";
					re += c;
			}
		}
		if (inClass) {
			cs = pattern.substr(classStart + 1);
			sp = this.parse(cs, SUBPARSE);
			re = re.substr(0, reClassStart) + "\\[" + sp[0];
			hasMagic = hasMagic || sp[1];
		}
		for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
			var tail = re.slice(pl.reStart + pl.open.length);
			this.debug("setting tail", re, pl);
			tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function(_, $1, $2) {
				if (!$2) $2 = "\\";
				return $1 + $1 + $2 + "|";
			});
			this.debug("tail=%j\n   %s", tail, tail, pl, re);
			var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
			hasMagic = true;
			re = re.slice(0, pl.reStart) + t + "\\(" + tail;
		}
		clearStateChar();
		if (escaping) re += "\\\\";
		var addPatternStart = false;
		switch (re.charAt(0)) {
			case "[":
			case ".":
			case "(": addPatternStart = true;
		}
		for (var n = negativeLists.length - 1; n > -1; n--) {
			var nl = negativeLists[n];
			var nlBefore = re.slice(0, nl.reStart);
			var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
			var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
			var nlAfter = re.slice(nl.reEnd);
			nlLast += nlAfter;
			var openParensBefore = nlBefore.split("(").length - 1;
			var cleanAfter = nlAfter;
			for (i = 0; i < openParensBefore; i++) cleanAfter = cleanAfter.replace(/\)[+*?]?/, "");
			nlAfter = cleanAfter;
			var dollar = "";
			if (nlAfter === "" && isSub !== SUBPARSE) dollar = "$";
			var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
			re = newRe;
		}
		if (re !== "" && hasMagic) re = "(?=.)" + re;
		if (addPatternStart) re = patternStart + re;
		if (isSub === SUBPARSE) return [re, hasMagic];
		if (!hasMagic) return globUnescape(pattern);
		var flags = options.nocase ? "i" : "";
		try {
			var regExp = new RegExp("^" + re + "$", flags);
		} catch (er) {
			return new RegExp("$.");
		}
		regExp._glob = pattern;
		regExp._src = re;
		return regExp;
	}
	minimatch.makeRe = function(pattern, options) {
		return new Minimatch(pattern, options || {}).makeRe();
	};
	Minimatch.prototype.makeRe = makeRe;
	function makeRe() {
		if (this.regexp || this.regexp === false) return this.regexp;
		var set = this.set;
		if (!set.length) {
			this.regexp = false;
			return this.regexp;
		}
		var options = this.options;
		var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot;
		var flags = options.nocase ? "i" : "";
		var re = set.map(function(pattern) {
			return pattern.map(function(p) {
				return p === GLOBSTAR ? twoStar : typeof p === "string" ? regExpEscape(p) : p._src;
			}).join("\\/");
		}).join("|");
		re = "^(?:" + re + ")$";
		if (this.negate) re = "^(?!" + re + ").*$";
		try {
			this.regexp = new RegExp(re, flags);
		} catch (ex) {
			this.regexp = false;
		}
		return this.regexp;
	}
	minimatch.match = function(list, pattern, options) {
		options = options || {};
		var mm = new Minimatch(pattern, options);
		list = list.filter(function(f) {
			return mm.match(f);
		});
		if (mm.options.nonull && !list.length) list.push(pattern);
		return list;
	};
	Minimatch.prototype.match = function match(f, partial) {
		if (typeof partial === "undefined") partial = this.partial;
		this.debug("match", f, this.pattern);
		if (this.comment) return false;
		if (this.empty) return f === "";
		if (f === "/" && partial) return true;
		var options = this.options;
		if (path.sep !== "/") f = f.split(path.sep).join("/");
		f = f.split(slashSplit);
		this.debug(this.pattern, "split", f);
		var set = this.set;
		this.debug(this.pattern, "set", set);
		var filename;
		var i;
		for (i = f.length - 1; i >= 0; i--) {
			filename = f[i];
			if (filename) break;
		}
		for (i = 0; i < set.length; i++) {
			var pattern = set[i];
			var file = f;
			if (options.matchBase && pattern.length === 1) file = [filename];
			var hit = this.matchOne(file, pattern, partial);
			if (hit) {
				if (options.flipNegate) return true;
				return !this.negate;
			}
		}
		if (options.flipNegate) return false;
		return this.negate;
	};
	Minimatch.prototype.matchOne = function(file, pattern, partial) {
		var options = this.options;
		this.debug("matchOne", {
			"this": this,
			file,
			pattern
		});
		this.debug("matchOne", file.length, pattern.length);
		for (var fi = 0, pi = 0, fl = file.length, pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
			this.debug("matchOne loop");
			var p = pattern[pi];
			var f = file[fi];
			this.debug(pattern, p, f);
			/* istanbul ignore if */
			if (p === false) return false;
			if (p === GLOBSTAR) {
				this.debug("GLOBSTAR", [
					pattern,
					p,
					f
				]);
				var fr = fi;
				var pr = pi + 1;
				if (pr === pl) {
					this.debug("** at the end");
					for (; fi < fl; fi++) if (file[fi] === "." || file[fi] === ".." || !options.dot && file[fi].charAt(0) === ".") return false;
					return true;
				}
				while (fr < fl) {
					var swallowee = file[fr];
					this.debug("\nglobstar while", file, fr, pattern, pr, swallowee);
					if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
						this.debug("globstar found match!", fr, fl, swallowee);
						return true;
					} else {
						if (swallowee === "." || swallowee === ".." || !options.dot && swallowee.charAt(0) === ".") {
							this.debug("dot detected!", file, fr, pattern, pr);
							break;
						}
						this.debug("globstar swallow a segment, and continue");
						fr++;
					}
				}
				/* istanbul ignore if */
				if (partial) {
					this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
					if (fr === fl) return true;
				}
				return false;
			}
			var hit;
			if (typeof p === "string") {
				hit = f === p;
				this.debug("string match", p, f, hit);
			} else {
				hit = f.match(p);
				this.debug("pattern match", p, f, hit);
			}
			if (!hit) return false;
		}
		if (fi === fl && pi === pl) return true;
		else if (fi === fl) return partial;
		else if (pi === pl) return fi === fl - 1 && file[fi] === "";
		/* istanbul ignore next */
		throw new Error("wtf?");
	};
	function globUnescape(s) {
		return s.replace(/\\(.)/g, "$1");
	}
	function regExpEscape(s) {
		return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	}
} });

//#endregion
export { require_minimatch };