function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 != (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createEffect } from 'solid-js';
import { testButterflyProps } from '../index.test.js';
import { reactive } from './reactive.js';
import { signal } from './signal.js';
describe('classy-solid', () => {
  describe('@reactive, @signal', () => {
    let _initProto, _initClass, _init_colors, _init_extra_colors, _init_colors2, _init_extra_colors2, _init_wingSize, _init_extra_wingSize, _init_finalize, _init_extra_finalize, _initProto2, _init_colors3, _init_extra_colors3, _init_finalize2, _init_extra_finalize2, _init_colors4, _init_extra_colors4, _init_wingSize2, _init_extra_wingSize2, _init_finalize3, _init_extra_finalize3, _initClass2, _init_colors5, _init_extra_colors5, _init_wingSize3, _init_extra_wingSize3, _init_colors6, _get_colors, _set_colors, _init_extra_colors6, _initProto3, _call_colors, _call_colors2, _initProto4, _initProto5;
    let _Butterfly;
    class Butterfly {
      static {
        ({
          e: [_init_colors, _init_extra_colors, _initProto],
          c: [_Butterfly, _initClass]
        } = _applyDecs(this, [reactive], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"]]));
      }
      colors = (_initProto(this), _init_colors(this, 3));
      #wingSize = (_init_extra_colors(this), 2);
      get wingSize() {
        return this.#wingSize;
      }
      set wingSize(s) {
        this.#wingSize = s;
      }
      static {
        _initClass();
      }
    }
    it('makes class fields reactive, using class and field/getter/setter decorators', () => {
      const b = new _Butterfly();
      testButterflyProps(b);
    });

    // @reactive
    class Butterfly2 {
      static {
        [_init_colors2, _init_extra_colors2, _init_wingSize, _init_extra_wingSize, _init_finalize, _init_extra_finalize] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 0, "wingSize"], [signal, 0, "finalize", o => o.#finalize, (o, v) => o.#finalize = v]], 0, _ => #finalize in _).e;
      }
      constructor() {
        _init_extra_finalize(this);
      }
      colors = _init_colors2(this, 3);
      wingSize = (_init_extra_colors2(this), _init_wingSize(this, 2));
      // @ts-ignore
      #finalize = (_init_extra_wingSize(this), _init_finalize(this));
    }
    it('makes class fields reactive, using field decorators without class decorator', () => {
      const b = new Butterfly2();
      testButterflyProps(b);
    });
    class Butterfly3 {
      static {
        [_init_colors3, _init_extra_colors3, _init_finalize2, _init_extra_finalize2, _initProto2] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"], [signal, 0, "finalize", o => o.#finalize, (o, v) => o.#finalize = v]], 0, _ => #finalize in _).e;
      }
      constructor() {
        _init_extra_finalize2(this);
      }
      colors = (_initProto2(this), _init_colors3(this, 3));
      #wingSize = (_init_extra_colors3(this), 2);
      get wingSize() {
        return this.#wingSize;
      }
      set wingSize(s) {
        this.#wingSize = s;
      }

      // @ts-ignore
      #finalize = _init_finalize2(this);
    }
    it('makes class fields reactive, using field/getter/setter decorators without class decorator', () => {
      const b = new Butterfly3();
      testButterflyProps(b);
    });
    class Butterfly4 {
      static {
        [_init_wingSize2, _init_extra_wingSize2, _init_colors4, _init_extra_colors4, _init_finalize3, _init_extra_finalize3] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 1, "wingSize"], [signal, 0, "finalize", o => o.#finalize, (o, v) => o.#finalize = v]], 0, _ => #finalize in _).e;
      }
      constructor() {
        _init_extra_finalize3(this);
      }
      colors = _init_colors4(this, 3);
      #A = (_init_extra_colors4(this), _init_wingSize2(this, 2)); // @ts-ignore
      get wingSize() {
        return this.#A;
      }
      set wingSize(v) {
        this.#A = v;
      }
      #finalize = (_init_extra_wingSize2(this), _init_finalize3(this));
    }
    it('makes class fields reactive, using field/accessor decorators without class decorator', () => {
      const b = new Butterfly4();
      testButterflyProps(b);
    });
    let _Butterfly2;
    class Butterfly5 {
      static {
        ({
          e: [_init_wingSize3, _init_extra_wingSize3, _init_colors5, _init_extra_colors5],
          c: [_Butterfly2, _initClass2]
        } = _applyDecs(this, [reactive], [[signal, 0, "colors"], [signal, 1, "wingSize"]]));
      }
      constructor() {
        _init_extra_wingSize3(this);
      }
      colors = _init_colors5(this, 3);
      #A = (_init_extra_colors5(this), _init_wingSize3(this, 2));
      get wingSize() {
        return this.#A;
      }
      set wingSize(v) {
        this.#A = v;
      }
      static {
        _initClass2();
      }
    }
    it('makes class fields reactive, using field/accessor decorators with class decorator', () => {
      const b = new _Butterfly2();
      testButterflyProps(b);
    });
    class Butterfly6 {
      static {
        [_init_colors6, _get_colors, _set_colors, _init_extra_colors6] = _applyDecs(this, [], [[signal, 1, "colors", o => o.#A, (o, v) => o.#A = v]], 0, _ => #colors in _).e;
      }
      constructor() {
        _init_extra_colors6(this);
      }
      #A = _init_colors6(this, 3);
      set #colors(v) {
        _set_colors(this, v);
      }
      get #colors() {
        return _get_colors(this);
      }
      getColors() {
        return this.#colors;
      }
      setColors(v) {
        return this.#colors = v;
      }
    }
    it('makes private class auto accessor reactive', () => {
      const b = new Butterfly6();
      testPrivate(b);
    });
    class Butterfly7 {
      static {
        [_call_colors, _call_colors2, _initProto3] = _applyDecs(this, [], [[signal, 3, "colors", function () {
          return this.#_colors;
        }], [signal, 4, "colors", function (v) {
          this.#_colors = v;
        }]], 0, _ => #_colors in _).e;
      }
      #_colors = (_initProto3(this), 3);
      get #colors() {
        return _call_colors(this);
      }
      set #colors(v) {
        _call_colors2(this, v);
      }
      getColors() {
        return this.#colors;
      }
      setColors(v) {
        return this.#colors = v;
      }
    }
    it('makes private class getter/setter accessors reactive', () => {
      const b = new Butterfly7();
      testPrivate(b);
    });
    class Base {
      static {
        [_initProto4] = _applyDecs(this, [], [[signal, 3, "colors"], [signal, 4, "colors"]]).e;
      }
      #_colors = (_initProto4(this), 3);
      get colors() {
        return this.#_colors;
      }
      set colors(v) {
        this.#_colors = v;
      }
    }
    class Butterfly8 extends Base {
      static {
        [_initProto5] = _applyDecs(this, [], [[signal, 3, "colors"], [signal, 4, "colors"]], 0, void 0, Base).e;
      }
      #_colors = (_initProto5(this), 3);
      get colors() {
        return this.#_colors;
      }
      set colors(v) {
        this.#_colors = v;
      }
      getColors() {
        return this.colors;
      }
      setColors(v) {
        return this.colors = v;
      }
    }
    it('makes overridden class getter/setter accessors reactive', () => {
      const b = new Butterfly8();
      testPrivate(b);
    });
    function testPrivate(b) {
      let count = 0;
      createEffect(() => {
        b.getColors();
        count++;
      });
      expect(b.getColors()).toBe(3);
      expect(count).toBe(1);
      b.setColors(5);
      expect(b.getColors()).toBe(5);
      expect(count).toBe(2);
    }
    const ensure = it;
    ensure('overridden fields work as expected', async () => {
      let _initClass3, _init_colors7, _init_extra_colors7;
      class Mid extends _Butterfly {
        colors = 0;
      }

      // ensure subclass did not interfere with functionality of base class
      const b0 = new _Butterfly();
      testProp(b0, 'colors', 3, 4, true);
      expect(Object.getOwnPropertyDescriptor(b0, 'colors')?.get?.call(b0) === 4).toBe(true); // accessor descriptor
      let _SubButterfly;
      class SubButterfly extends Mid {
        static {
          ({
            e: [_init_colors7, _init_extra_colors7],
            c: [_SubButterfly, _initClass3]
          } = _applyDecs(this, [reactive], [[signal, 0, "colors"]], 0, void 0, Mid));
        }
        constructor(...args) {
          super(...args);
          _init_extra_colors7(this);
        }
        colors = _init_colors7(this, 123);
        static {
          _initClass3();
        }
      }

      // ensure subclass did not interfere with functionality of base class
      const m = new Mid();
      testProp(m, 'colors', 0, 1, false);
      expect(Object.getOwnPropertyDescriptor(m, 'colors')?.value === 1).toBe(true); // value descriptor

      class SubSubButterfly extends _SubButterfly {
        colors = 456;
      }
      const b = new _SubButterfly();
      testButterflyProps(b, 123);
      const b2 = new SubSubButterfly();
      testProp(b2, 'colors', 456, 654, false);
    });
    function testProp(o, k, startVal, newVal, reactive = true) {
      let count = 0;
      createEffect(() => {
        o[k];
        count++;
      });
      expect(o[k]).toBe(startVal);
      expect(count).toBe(1);
      o[k] = newVal; // should not be a signal, should not trigger

      expect(o[k]).toBe(newVal);
      expect(count).toBe(reactive ? 2 : 1);
    }
    it('does not prevent superclass constructor from receiving subclass constructor args', () => {
      var _Insect2;
      let _initClass4, _initProto6, _initClass5, _init_colors8, _init_extra_colors8;
      let _Insect;
      class Insect {
        static {
          [_Insect, _initClass4] = _applyDecs(this, [reactive], []).c;
        }
        constructor(double) {
          this.double = double;
        }
        static {
          _initClass4();
        }
      }
      let _Butterfly3;
      class Butterfly extends (_Insect2 = _Insect) {
        static {
          ({
            e: [_init_colors8, _init_extra_colors8, _initProto6],
            c: [_Butterfly3, _initClass5]
          } = _applyDecs(this, [reactive], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"]], 0, void 0, _Insect2));
        }
        colors = (_initProto6(this), _init_colors8(this, 3));
        #wingSize = (_init_extra_colors8(this), 2);
        get wingSize() {
          return this.#wingSize;
        }
        set wingSize(s) {
          this.#wingSize = s;
        }
        constructor(arg) {
          super(arg * 2);
        }
        static {
          _initClass5();
        }
      }
      const b = new _Butterfly3(4);
      expect(b.double).toBe(8);
      testButterflyProps(b);
    });
    it('throws an error when @signal is used without @reactive', async () => {
      expect(() => {
        let _init_foo, _init_extra_foo, _initClass6, _init_bar, _init_extra_bar;
        // user forgot to use @reactive here
        class Foo {
          static {
            [_init_foo, _init_extra_foo] = _applyDecs(this, [], [[signal, 0, "foo"]]).e;
          }
          constructor() {
            _init_extra_foo(this);
          }
          foo = _init_foo(this, 'hoo');
        }
        Foo;
        let _Bar;
        class Bar {
          static {
            ({
              e: [_init_bar, _init_extra_bar],
              c: [_Bar, _initClass6]
            } = _applyDecs(this, [reactive], [[signal, 0, "bar"]]));
          }
          constructor() {
            _init_extra_bar(this);
          }
          bar = _init_bar(this, 123);
          static {
            _initClass6();
          }
        }
        new _Bar();
      }).toThrow('Did you forget');

      // TODO how to check for an error thrown from a microtask?
      // (window.addEventListener('error') seems not to work)
      //
      // It just won't work, the error seems to never fire here in the
      // tests, but it works fine when testing manually in Chrome.

      // const errPromise = new Promise<ErrorEvent>(r => window.addEventListener('error', e => r(e), {once: true}))

      // @reactive
      // class Foo {
      // 	@signal foo = 'hoo'
      // }

      // Foo

      // // user forgot to use @reactive here
      // class Bar {
      // 	@signal bar = 123
      // }

      // Bar

      // const err = await errPromise

      // expect(err.message).toContain('Did you forget')
    });
    it('works with function values', () => {
      let _initClass7, _init_do, _init_extra_do;
      let _Doer;
      // This test ensures that functions are handled propertly, because
      // if passed without being wrapped to a signal setter it will be
      // called immediately with the previous value and be expected to
      // return a new value, instead of being set as the actual new value.

      class Doer {
        static {
          ({
            e: [_init_do, _init_extra_do],
            c: [_Doer, _initClass7]
          } = _applyDecs(this, [reactive], [[signal, 0, "do"]]));
        }
        constructor() {
          _init_extra_do(this);
        }
        do = _init_do(this, null);
        static {
          _initClass7();
        }
      }
      const doer = new _Doer();
      expect(doer.do).toBe(null);
      const newFunc = () => 123;
      doer.do = newFunc;
      expect(doer.do).toBe(newFunc);
      expect(doer.do()).toBe(123);
    });
    it('automatically does not track reactivity in constructors when using decorators', () => {
      var _Foo2;
      let _initClass8, _init_amount, _init_extra_amount, _initClass9, _init_double, _init_extra_double;
      let _Foo;
      class Foo {
        static {
          ({
            e: [_init_amount, _init_extra_amount],
            c: [_Foo, _initClass8]
          } = _applyDecs(this, [reactive], [[signal, 0, "amount"]]));
        }
        constructor() {
          _init_extra_amount(this);
        }
        amount = _init_amount(this, 3);
        static {
          _initClass8();
        }
      }
      let _Bar2;
      class Bar extends (_Foo2 = _Foo) {
        static {
          ({
            e: [_init_double, _init_extra_double],
            c: [_Bar2, _initClass9]
          } = _applyDecs(this, [reactive], [[signal, 0, "double"]], 0, void 0, _Foo2));
        }
        double = _init_double(this, 0);
        constructor() {
          super(), _init_extra_double(this);
          this.double = this.amount * 2; // this read of .amount should not be tracked
        }
        static {
          _initClass9();
        }
      }
      let b;
      let count = 0;
      function noLoop() {
        createEffect(() => {
          b = new _Bar2(); // this should not track
          count++;
        });
      }
      expect(noLoop).not.toThrow();
      const b2 = b;
      b.amount = 4; // hence this should not trigger

      // If the effect ran only once initially, not when setting b.colors,
      // then both variables should reference the same instance
      expect(count).toBe(1);
      expect(b).toBe(b2);
    });
  });
});
//# sourceMappingURL=signal.test.js.map