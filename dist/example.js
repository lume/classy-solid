var _initClass, _init_yoo, _initClass2, _init_foo, _initProto, _initClass3, _init_bar, _initProto2, _Foo2;
function createAddInitializerMethod(e, t) { return function (r) { assertNotFinished(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r); }; }
function assertInstanceIfPrivate(e, t) { if (!e(t)) throw new TypeError("Attempted to access private element on non-instance"); }
function memberDec(e, t, r, a, n, i, s, o, c, l, u) { var f; switch (i) { case 1: f = "accessor"; break; case 2: f = "method"; break; case 3: f = "getter"; break; case 4: f = "setter"; break; default: f = "field"; } var d, p, h = { kind: f, name: o ? "#" + r : r, static: s, private: o, metadata: u }, v = { v: !1 }; if (0 !== i && (h.addInitializer = createAddInitializerMethod(n, v)), o || 0 !== i && 2 !== i) { if (2 === i) d = function (e) { return assertInstanceIfPrivate(l, e), a.value; };else { var y = 0 === i || 1 === i; (y || 3 === i) && (d = o ? function (e) { return assertInstanceIfPrivate(l, e), a.get.call(e); } : function (e) { return a.get.call(e); }), (y || 4 === i) && (p = o ? function (e, t) { assertInstanceIfPrivate(l, e), a.set.call(e, t); } : function (e, t) { a.set.call(e, t); }); } } else d = function (e) { return e[r]; }, 0 === i && (p = function (e, t) { e[r] = t; }); var m = o ? l.bind() : function (e) { return r in e; }; h.access = d && p ? { get: d, set: p, has: m } : d ? { get: d, has: m } : { set: p, has: m }; try { return e.call(t, c, h); } finally { v.v = !0; } }
function assertNotFinished(e, t) { if (e.v) throw new Error("attempted to call " + t + " after decoration was finished"); }
function assertCallable(e, t) { if ("function" != typeof e) throw new TypeError(t + " must be a function"); }
function assertValidReturnValue(e, t) { var r = typeof t; if (1 === e) { if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init"); } else if ("function" !== r) { var a; throw a = 0 === e ? "field" : 5 === e ? "class" : "method", new TypeError(a + " decorators must return a function or void 0"); } }
function curryThis1(e) { return function () { return e(this); }; }
function curryThis2(e) { return function (t) { e(this, t); }; }
function applyMemberDec(e, t, r, a, n, i, s, o, c, l, u) { var f, d, p, h, v, y, m = r[0]; a || Array.isArray(m) || (m = [m]), o ? f = 0 === i || 1 === i ? { get: curryThis1(r[3]), set: curryThis2(r[4]) } : 3 === i ? { get: r[3] } : 4 === i ? { set: r[3] } : { value: r[3] } : 0 !== i && (f = Object.getOwnPropertyDescriptor(t, n)), 1 === i ? p = { get: f.get, set: f.set } : 2 === i ? p = f.value : 3 === i ? p = f.get : 4 === i && (p = f.set); for (var g = a ? 2 : 1, b = m.length - 1; b >= 0; b -= g) { var I; if (void 0 !== (h = memberDec(m[b], a ? m[b - 1] : void 0, n, f, c, i, s, o, p, l, u))) assertValidReturnValue(i, h), 0 === i ? I = h : 1 === i ? (I = h.init, v = h.get || p.get, y = h.set || p.set, p = { get: v, set: y }) : p = h, void 0 !== I && (void 0 === d ? d = I : "function" == typeof d ? d = [d, I] : d.push(I)); } if (0 === i || 1 === i) { if (void 0 === d) d = function (e, t) { return t; };else if ("function" != typeof d) { var w = d; d = function (e, t) { for (var r = t, a = w.length - 1; a >= 0; a--) r = w[a].call(e, r); return r; }; } else { var M = d; d = function (e, t) { return M.call(e, t); }; } e.push(d); } 0 !== i && (1 === i ? (f.get = p.get, f.set = p.set) : 2 === i ? f.value = p : 3 === i ? f.get = p : 4 === i && (f.set = p), o ? 1 === i ? (e.push(function (e, t) { return p.get.call(e, t); }), e.push(function (e, t) { return p.set.call(e, t); })) : 2 === i ? e.push(p) : e.push(function (e, t) { return p.call(e, t); }) : Object.defineProperty(t, n, f)); }
function applyMemberDecs(e, t, r, a) { for (var n, i, s, o = [], c = new Map(), l = new Map(), u = 0; u < t.length; u++) { var f = t[u]; if (Array.isArray(f)) { var d, p, h = f[1], v = f[2], y = f.length > 3, m = 16 & h, g = !!(8 & h), b = r; if (h &= 7, g ? (d = e, 0 !== h && (p = i = i || []), y && !s && (s = function (t) { return _checkInRHS(t) === e; }), b = s) : (d = e.prototype, 0 !== h && (p = n = n || [])), 0 !== h && !y) { var I = g ? l : c, w = I.get(v) || 0; if (!0 === w || 3 === w && 4 !== h || 4 === w && 3 !== h) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + v); I.set(v, !(!w && h > 2) || h); } applyMemberDec(o, d, f, m, v, h, g, y, p, b, a); } } return pushInitializers(o, n), pushInitializers(o, i), o; }
function pushInitializers(e, t) { t && e.push(function (e) { for (var r = 0; r < t.length; r++) t[r].call(e); return e; }); }
function applyClassDecs(e, t, r, a) { if (t.length) { for (var n = [], i = e, s = e.name, o = r ? 2 : 1, c = t.length - 1; c >= 0; c -= o) { var l = { v: !1 }; try { var u = t[c].call(r ? t[c - 1] : void 0, i, { kind: "class", name: s, addInitializer: createAddInitializerMethod(n, l), metadata: a }); } finally { l.v = !0; } void 0 !== u && (assertValidReturnValue(5, u), i = u); } return [defineMetadata(i, a), function () { for (var e = 0; e < n.length; e++) n[e].call(i); }]; } }
function defineMetadata(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); }
function _applyDecs(e, t, r, a, n, i) { if (arguments.length >= 6) var s = i[Symbol.metadata || Symbol.for("Symbol.metadata")]; var o = Object.create(void 0 === s ? null : s), c = applyMemberDecs(e, t, n, o); return r.length || defineMetadata(e, o), { e: c, get c() { return applyClassDecs(e, r, a, o); } }; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { signal, reactive } from './index.js';
import { createEffect } from 'solid-js';
let _Other;
class Other {
  static {
    ({
      e: [_init_yoo],
      c: [_Other, _initClass]
    } = _applyDecs(this, [[signal, 0, "yoo"]], [reactive]));
  }
  yoo = _init_yoo(this, 'hoo');
  static {
    _initClass();
  }
}
new _Other();
let _Foo;
class Foo {
  static {
    ({
      e: [_init_foo, _initProto],
      c: [_Foo, _initClass2]
    } = _applyDecs(this, [[signal, 3, "lorem"], [signal, 0, "foo"]], [reactive]));
  }
  foo = (_initProto(this), _init_foo(this, 123));
  get lorem() {
    return 123;
  }
  set lorem(v) {
    v;
  }
  static {
    _initClass2();
  }
}
let _Bar;
class Bar extends (_Foo2 = _Foo) {
  static {
    ({
      e: [_init_bar, _initProto2],
      c: [_Bar, _initClass3]
    } = _applyDecs(this, [[signal, 3, "baz"], [signal, 0, "bar"]], [reactive], 0, void 0, _Foo2));
  }
  bar = (_initProto2(this), _init_bar(this, 456));
  #baz = 789;
  get baz() {
    return this.#baz;
  }
  set baz(v) {
    this.#baz = v;
  }
  constructor() {
    super();
    console.log('Bar');
  }
  static {
    _initClass3();
  }
}
export { _Foo as Foo };
const b = new _Bar();
createEffect(() => {
  console.log('b.foo:', b.foo);
});
createEffect(() => {
  console.log('b.lorem:', b.lorem);
});
createEffect(() => {
  console.log('b.bar:', b.bar);
});
createEffect(() => {
  console.log('b.baz:', b.baz);
});
setInterval(() => {
  console.log('---');
  b.foo++;
  b.bar++;
  b.baz++;
  b.lorem++;
}, 1000);
//# sourceMappingURL=example.js.map