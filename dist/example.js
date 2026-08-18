let _initProto, _init_count, _init_extra_count, _call_logCount, _initProto2, _init_num, _init_extra_num, _call_sum, _call_logSum, _initClass, _init_message, _init_extra_message, _init_name, _init_extra_name, _initProto3, _init_count2, _init_extra_count2, _call_logCount2, _call_interval;
function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { signal, effect, memo, stopEffects, component, startEffects } from './index.js';
import { render } from 'solid-js/web';
import html from 'solid-js/html';
import { onCleanup } from 'solid-js';

//////////////////////////////////////////////////
// Make plain classes reactive with Solid signals.

class Counter {
  static {
    [_call_logCount, _init_count, _init_extra_count, _initProto] = _applyDecs(this, [], [[signal, 0, "count"], [effect, 2, "logCount", function () {
      // Log the count whenever it changes.
      console.log(`Count is: ${this.count}`);
    }]], 0, _ => #logCount in _).e;
  }
  constructor() {
    _init_extra_count(this);
  }
  #logCount = _call_logCount;
  count = (_initProto(this), _init_count(this, 0));

  // @ts-expect-error not unused

  increment() {
    this.count++;
  }
}
class Example extends Counter {
  static {
    [_call_sum, _call_logSum, _init_num, _init_extra_num, _initProto2] = _applyDecs(this, [], [[signal, 0, "num"], [memo, 3, "sum", function () {
      return this.count + this.num;
    }], [effect, 2, "logSum", function () {
      // Log the sum whenever it changes.
      console.log(`Sum is: ${this.#sum}`);
    }]], 0, _ => #sum in _, Counter).e;
  }
  constructor(...args) {
    super(...args);
    _init_extra_num(this);
  }
  #logSum = _call_logSum;
  num = (_initProto2(this), _init_num(this, 10));
  get #sum() {
    return _call_sum(this);
  } // @ts-expect-error not unused
}
const ex = new Example(); // starts effects, logs "Count is: 0", "Sum is: 10"

ex.count = 5; // Logs "Count is: 5", "Sum is: 15"
ex.num = 20; // Logs "Sum is: 25"

setInterval(() => ex.increment(), 1000);

// ...later, clean up when done...
setTimeout(() => stopEffects(ex), 3000);

//////////////////////////////////////////////////
// Optionally use classes as Solid components.
let _MyComp;
class MyComp {
  static {
    ({
      e: [_init_message, _init_extra_message, _init_name, _init_extra_name],
      c: [_MyComp, _initClass]
    } = _applyDecs(this, [component], [[signal, 0, "message"], [signal, 0, "name"]]));
  }
  constructor() {
    _init_extra_name(this);
  }
  message = _init_message(this, 'Hello, World!');
  name = (_init_extra_message(this), _init_name(this, 'Tom'));
  template() {
    setTimeout(() => this.message = 'Hello after 3 seconds!', 3000);
    return html`
			<div>
				<h1>${() => this.message}</h1>

				<p>My name is ${() => this.name}.</p>

				<p>The count is: ${() => ex.count}</p>
			</div>
		`;
  }
  static {
    _initClass();
  }
}
render(
// prettier-ignore
() => html`
		<${_MyComp} name="Joe"></>

		<p>(Also see console output.)</p><br />
	`, document.body);

//////////////////////////////////////////////////
// Use reactivity with Custom Elements.
// For an additional set of utilities for concisely defining Custom Elements,
// see the @lume/element package built on top of classy-solid.

class ElementWithEffects extends HTMLElement {
  connectedCallback() {
    startEffects(this);
  }
  disconnectedCallback() {
    stopEffects(this);
  }
}
class MyElement extends ElementWithEffects {
  static {
    [_call_logCount2, _call_interval, _init_count2, _init_extra_count2, _initProto3] = _applyDecs(this, [], [[signal, 0, "count"], [effect, 2, "logCount", function () {
      // Show the count whenever it changes.
      this.#root.textContent = `<${this.tagName.toLowerCase()}> Count is: ${this.count}`;
    }], [effect, 2, "interval", function () {
      const int = setInterval(() => this.count++, 1000);
      onCleanup(() => clearInterval(int));
    }]], 0, _ => #root in _, ElementWithEffects).e;
  }
  constructor(...args) {
    super(...args);
    _init_extra_count2(this);
  }
  #interval = _call_interval;
  #logCount = _call_logCount2;
  #root = (_initProto3(this), this.attachShadow({
    mode: 'open'
  }));
  count = _init_count2(this, 0);

  // @ts-expect-error not unused

  // @ts-expect-error not unused
}
customElements.define('my-element', MyElement);
const el = document.createElement('my-element');
document.body.append(el);

// ...Later, remove the element to stop its effects...
setTimeout(() => el.remove(), 3000);

// ...Later, add the element back to see effects restart...
setTimeout(() => document.body.append(el), 6000);
//# sourceMappingURL=example.js.map