function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { $PROXY, createEffect } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { testButterflyProps } from '../index.test.js';
import { signal } from './signal.js';
import { signalify } from '../signals/signalify.js';
import { isSignalGetter } from '../_state.js';
import { memo } from './memo.js';
describe('classy-solid', () => {
  describe('@signal decorator', () => {
    let _initProto, _init_colors, _init_extra_colors, _init_colors2, _init_extra_colors2, _init_wingSize, _init_extra_wingSize, _initProto2, _init_colors3, _init_extra_colors3, _init_colors4, _init_extra_colors4, _init_wingSize2, _init_extra_wingSize2, _init_colors5, _init_extra_colors5, _init_wingSize3, _init_extra_wingSize3, _init_colors6, _get_colors, _set_colors, _init_extra_colors6, _initProto3, _call_colors, _call_colors2, _initProto4, _initProto5;
    class Butterfly {
      static {
        [_init_colors, _init_extra_colors, _initProto] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"]]).e;
      }
      colors = (_initProto(this), _init_colors(this, 3));
      #wingSize = (_init_extra_colors(this), 2);

      // Stick this here to ensure that nested constructor doesn't
      // interfere with decorator behavior mid-way through initialization
      // of the wrapper parent class (tested with a subclass)
      child = this.constructor !== Butterfly ? new Butterfly() : null;
      get wingSize() {
        return this.#wingSize;
      }
      set wingSize(s) {
        this.#wingSize = s;
      }
    }
    it('makes class fields reactive, using class and field/getter/setter decorators', () => {
      const b = new Butterfly();
      testButterflyProps(b);
    });
    class Butterfly2 {
      static {
        [_init_colors2, _init_extra_colors2, _init_wingSize, _init_extra_wingSize] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 0, "wingSize"]]).e;
      }
      constructor() {
        _init_extra_wingSize(this);
      }
      colors = _init_colors2(this, 3);
      wingSize = (_init_extra_colors2(this), _init_wingSize(this, 2));
    }
    it('makes class fields reactive, using field decorators without class decorator', () => {
      const b = new Butterfly2();
      testButterflyProps(b);
    });
    class Butterfly3 {
      static {
        [_init_colors3, _init_extra_colors3, _initProto2] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"]]).e;
      }
      colors = (_initProto2(this), _init_colors3(this, 3));
      #wingSize = (_init_extra_colors3(this), 2);
      get wingSize() {
        return this.#wingSize;
      }
      set wingSize(s) {
        this.#wingSize = s;
      }
    }
    it('makes class fields reactive, using field/getter/setter decorators without class decorator', () => {
      const b = new Butterfly3();
      testButterflyProps(b);
    });
    class Butterfly4 {
      static {
        [_init_wingSize2, _init_extra_wingSize2, _init_colors4, _init_extra_colors4] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 1, "wingSize"]]).e;
      }
      constructor() {
        _init_extra_wingSize2(this);
      }
      colors = _init_colors4(this, 3);
      #A = (_init_extra_colors4(this), _init_wingSize2(this, 2));
      get wingSize() {
        return this.#A;
      }
      set wingSize(v) {
        this.#A = v;
      }
    }
    it('makes class fields reactive, using field/accessor decorators without class decorator', () => {
      const b = new Butterfly4();
      testButterflyProps(b);
    });
    class Butterfly5 {
      static {
        [_init_wingSize3, _init_extra_wingSize3, _init_colors5, _init_extra_colors5] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 1, "wingSize"]]).e;
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
    }
    it('makes class fields reactive, using field/accessor decorators with class decorator', () => {
      const b = new Butterfly5();
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
      #colors = (_initProto4(this), 3);
      get colors() {
        return this.#colors;
      }
      set colors(v) {
        this.#colors = v;
      }
    }
    class Butterfly8 extends Base {
      static {
        [_initProto5] = _applyDecs(this, [], [[signal, 3, "colors"], [signal, 4, "colors"]], 0, void 0, Base).e;
      }
      #colors = (_initProto5(this), 3);
      get colors() {
        return this.#colors;
      }
      set colors(v) {
        this.#colors = v;
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
    it('allows overridden fields to work as expected', async () => {
      let _init_colors7, _init_extra_colors7;
      class Mid extends Butterfly {
        colors = 0;
      }

      // ensure subclass did not interfere with functionality of base class
      new Butterfly(); // ensure first instantiation doesn't affect later ones
      const b0 = new Butterfly();
      testProp(b0, 'colors', 3, 4, true);
      expect(Object.getOwnPropertyDescriptor(b0, 'colors')?.get?.call(b0) === 4).toBe(true); // accessor descriptor

      class SubButterfly extends Mid {
        static {
          [_init_colors7, _init_extra_colors7] = _applyDecs(this, [], [[signal, 0, "colors"]], 0, void 0, Mid).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_colors7(this);
        }
        colors = _init_colors7(this, 123);
      }

      // ensure subclass did not interfere with functionality of base class
      const m = new Mid();
      testProp(m, 'colors', 0, 1, false);
      expect(Object.getOwnPropertyDescriptor(m, 'colors')?.value === 1).toBe(true); // value descriptor

      class SubSubButterfly extends SubButterfly {
        colors = 456;
      }
      const b = new SubButterfly();
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
      let _initProto6, _init_colors8, _init_extra_colors8;
      class Insect {
        constructor(double) {
          this.double = double;
        }
      }
      class Butterfly extends Insect {
        static {
          [_init_colors8, _init_extra_colors8, _initProto6] = _applyDecs(this, [], [[signal, 0, "colors"], [signal, 3, "wingSize"], [signal, 4, "wingSize"]], 0, void 0, Insect).e;
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
      }
      const b = new Butterfly(4);
      expect(b.double).toBe(8);
      testButterflyProps(b);
    });
    it('works with function values', () => {
      let _init_do, _init_extra_do;
      // This test ensures that functions are handled propertly, because
      // if passed without being wrapped to a signal setter it will be
      // called immediately with the previous value and be expected to
      // return a new value, instead of being set as the actual new value.

      class Doer {
        static {
          [_init_do, _init_extra_do] = _applyDecs(this, [], [[signal, 0, "do"]]).e;
        }
        constructor() {
          _init_extra_do(this);
        }
        do = _init_do(this, null);
      }
      const doer = new Doer();
      expect(doer.do).toBe(null);
      const newFunc = () => 123;
      doer.do = newFunc;
      expect(doer.do).toBe(newFunc);
      expect(doer.do()).toBe(123);
    });
    it('prevents duplicate signals for any property', () => {
      let _initProto7, _init_venomous, _init_extra_venomous, _init_legs, _init_extra_legs;
      class Insect {
        static {
          [_init_legs, _init_extra_legs, _init_venomous, _init_extra_venomous, _initProto7] = _applyDecs(this, [], [[signal, 0, "venomous"], [signal, 1, "legs"], [signal, 3, "eyes"], [signal, 4, "eyes"]]).e;
        }
        venomous = (_initProto7(this), _init_venomous(this, 0));
        #A = (_init_extra_venomous(this), _init_legs(this, 6));
        get legs() {
          return this.#A;
        }
        set legs(v) {
          this.#A = v;
        }
        #eyes = (_init_extra_legs(this), 10);
        get eyes() {
          return this.#eyes;
        }
        set eyes(n) {
          this.#eyes = n;
        }
        antennas = 0;
        constructor() {
          // This should not add any extra signals for properties that
          // are already signalified by the @signal decorator
          signalify(this, 'venomous', 'legs', 'eyes', 'antennas');
        }
      }
      const i = new Insect();
      testNoDuplicateSignal(i, 'venomous');
      testNoDuplicateSignal(i, 'legs');
      testNoDuplicateSignal(i, 'eyes');
      testNoDuplicateSignal(i, 'antennas');
      function testNoDuplicateSignal(o, prop) {
        let count = 0;
        createEffect(() => {
          count++;
          o[prop];
        });
        expect(count).toBe(1);
        o[prop]++;
        expect(count).toBe(2); // it would be 3 if there were an extra signal
      }
    });
    it('throws on invalid usage', () => {
      expect(() => {
        let _init_val, _init_extra_val;
        class InvalidStatic {
          static {
            [_init_val, _init_extra_val] = _applyDecs(this, [], [[signal, 8, "val"]]).e;
          }
          static val = _init_val(1);
          static {
            _init_extra_val();
          }
        }
        new InvalidStatic();
      }).toThrowError('@signal is not supported on static fields yet.');
      expect(() => {
        let _initProto8;
        class InvalidMethod {
          static {
            [_initProto8] = _applyDecs(this, [], [[signal, 2, "method"]]).e;
          }
          constructor() {
            _initProto8(this);
          }
          // @ts-expect-error type error because method is invalid
          method() {
            return 1;
          }
        }
        new InvalidMethod();
      }).toThrowError('The @signal decorator is only for use on fields, getters, setters, and auto accessors.');
    });
    it('no-ops with Solid proxies to avoid an unnecessary extra signal', () => {
      let _initProto9, _init_age, _init_extra_age;
      let plain;
      let proxy;
      class Human {
        constructor() {
          plain = this;
          return proxy = createMutable(this);
        }
      }
      let metadata;
      const _signal = (_, context) => {
        metadata = context.metadata;
        return signal(_, context);
      };
      let memoRuns = 0;
      class CoolKid extends Human {
        static {
          [_init_age, _init_extra_age, _initProto9] = _applyDecs(this, [], [[_signal, 0, "age"], [memo, 3, "ageInDogYears"]], 0, void 0, Human).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_age(this);
        }
        age = (_initProto9(this), _init_age(this, 3));
        get ageInDogYears() {
          memoRuns++;
          return this.age * 7;
        }
      }
      const kid = new CoolKid();

      // Verify we got a Solid Proxy.
      expect(plain === proxy).toBe(false);
      expect(plain[$PROXY] === proxy).toBe(true);
      expect(metadata.classySolid_members.find(m => m.name === 'age').applied.get(kid)).toBe(true);

      // Verify it there is not our own signal getter applied (it may be
      // the Solid Proxy's, or none, depending on how the Solid Proxy
      // implementation goes).
      const descriptor = Object.getOwnPropertyDescriptor(kid, 'age');
      const getter = descriptor.get;
      expect(isSignalGetter.has(getter)).toBe(false);
      let count = 0;
      createEffect(() => {
        count++;
        kid.age;
      });
      expect(count).toBe(1);
      expect(kid.age).toBe(3);
      // check that @memo still works with the Proxy
      expect(memoRuns).toBe(1);
      expect(kid.ageInDogYears).toBe(21);
      kid.age = 4;
      expect(count).toBe(2);
      expect(kid.age).toBe(4);
      // check that @memo still works with the Proxy
      expect(memoRuns).toBe(2);
      expect(kid.ageInDogYears).toBe(28);
    });
    describe('subclass signal overriding/extending', () => {
      it('supports subclass signal field extending base signal field', () => {
        let _init_val2, _init_extra_val2, _init_val3, _init_extra_val3;
        class Base {
          static {
            [_init_val2, _init_extra_val2] = _applyDecs(this, [], [[signal, 0, "val"]]).e;
          }
          constructor() {
            _init_extra_val2(this);
          }
          val = _init_val2(this, 1);
        }
        class Sub extends Base {
          static {
            [_init_val3, _init_extra_val3] = _applyDecs(this, [], [[signal, 0, "val"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_val3(this);
          }
          // @ts-ignore this is valid in plain JS, TS complains about using field before initialization
          val = _init_val3(this, this.val + 1); // override field with initial value from base class
        }
        const s = new Sub();
        let count = 0;
        createEffect(() => {
          count++;
          s.val;
        });
        expect(s.val).toBe(2);
        expect(count).toBe(1);
        s.val = 5;
        expect(s.val).toBe(5);
        expect(count).toBe(2);
      });
      it('supports subclass signal auto accessor extending base signal auto accessor with super', () => {
        let _init_n, _init_extra_n, _init_n2, _init_extra_n2;
        class Base {
          static {
            [_init_n, _init_extra_n] = _applyDecs(this, [], [[signal, 1, "n"]]).e;
          }
          constructor() {
            _init_extra_n(this);
          }
          #A = _init_n(this, 1);
          get n() {
            return this.#A;
          }
          set n(v) {
            this.#A = v;
          }
        }
        class Sub extends Base {
          static {
            [_init_n2, _init_extra_n2] = _applyDecs(this, [], [[signal, 1, "n"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_n2(this);
          }
          #A = _init_n2(this, super.n + 1); // initialize with initial super value
          get n() {
            return this.#A;
          }
          set n(v) {
            this.#A = v;
          }
        }
        const s = new Sub();
        let count = 0;
        createEffect(() => {
          count++;
          s.n;
        });
        expect(s.n).toBe(2);
        expect(count).toBe(1);
        s.n = 7;
        expect(s.n).toBe(7);
        expect(count).toBe(2);
      });
      it('supports subclass signal getter/setter extending base signal getter/setter with super', () => {
        let _initProto0, _initProto1;
        class Base {
          static {
            [_initProto0] = _applyDecs(this, [], [[signal, 3, "n"], [signal, 4, "n"]]).e;
          }
          #n = (_initProto0(this), 1);
          get n() {
            return this.#n;
          }
          set n(v) {
            this.#n = v;
          }
        }
        class Sub extends Base {
          static {
            [_initProto1] = _applyDecs(this, [], [[signal, 3, "n"], [signal, 4, "n"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto1(this);
          }
          get n() {
            return super.n + 1; // extend read
          }
          set n(v) {
            super.n = v + 1; // extend write
          }
        }
        const s = new Sub();
        let count = 0;
        let last = 0;
        createEffect(() => {
          count++;
          last = s.n;
        });
        expect(last).toBe(1 + 1);
        expect(count).toBe(1);
        s.n = 10;
        expect(last).toBe(10 + 1 + 1);
        expect(count).toBe(2);
      });
      it('supports multi-level signal getter/setter extension with super', () => {
        let _initProto10, _initProto11, _initProto12;
        let runs = 0;
        class Base {
          static {
            [_initProto10] = _applyDecs(this, [], [[signal, 3, "val"], [signal, 4, "val"]]).e;
          }
          _val = (_initProto10(this), 1);
          get val() {
            return this._val;
          }
          set val(v) {
            this._val = v;
          }
        }
        class Mid extends Base {
          static {
            [_initProto11] = _applyDecs(this, [], [[signal, 3, "val"], [signal, 4, "val"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto11(this);
          }
          get val() {
            return super.val + 10;
          }
          set val(v) {
            super.val = v - 10;
          }
        }
        class Sub extends Mid {
          static {
            [_initProto12] = _applyDecs(this, [], [[signal, 3, "val"], [signal, 4, "val"]], 0, void 0, Mid).e;
          }
          constructor(...args) {
            super(...args);
            _initProto12(this);
          }
          get val() {
            return super.val + 100;
          }
          set val(v) {
            super.val = v - 100;
          }
        }
        const o = new Sub();
        createEffect(() => {
          runs++;
          o.val;
        });
        expect(o._val).toBe(1);
        expect(o.val).toBe(1 + 10 + 100);
        expect(runs).toBe(1);
        o.val = 200;
        expect(runs).toBe(2);
        expect(o._val).toBe(200 - 100 - 10);
        expect(o.val).toBe(90 + 10 + 100);
      });
      it('supports subclass signal getter/setter overriding base signal getter/setter without super', () => {
        let _initProto13, _initProto14;
        class Base {
          static {
            [_initProto13] = _applyDecs(this, [], [[signal, 3, "v"], [signal, 4, "v"]]).e;
          }
          #v = (_initProto13(this), 1);
          get v() {
            return this.#v;
          }
          set v(x) {
            this.#v = x;
          }
        }
        class Sub extends Base {
          static {
            [_initProto14] = _applyDecs(this, [], [[signal, 3, "v"], [signal, 4, "v"]], 0, void 0, Base).e;
          }
          #y = (_initProto14(this), 100);
          get v() {
            return this.#y;
          }
          set v(x) {
            this.#y = x;
          }
        }
        const s = new Sub();
        let count = 0;
        createEffect(() => {
          s.v;
          count++;
        });
        expect(s.v).toBe(100);
        expect(count).toBe(1);
        s.v = 50;
        expect(s.v).toBe(50);
        expect(count).toBe(2);
      });
    });
    describe('invalid usage', () => {
      it('throws on duplicate members', () => {
        const run = () => {
          let _init_dupe, _init_extra_dupe, _init_dupe2, _init_extra_dupe2;
          class SuperDuper {
            static {
              [_init_dupe, _init_extra_dupe, _init_dupe2, _init_extra_dupe2] = _applyDecs(this, [], [[signal, 0, "dupe"], [signal, 0, "dupe"]]).e;
            }
            constructor() {
              _init_extra_dupe2(this);
            }
            dupe = _init_dupe(this, 0);
            // @ts-expect-error duplicate member
            dupe = (_init_extra_dupe(this), _init_dupe2(this, 0));
          }
          new SuperDuper();
        };

        // This one works the same way whether compiling with Babel or
        // TypeScript. See the same tests for @memo and @effect.
        expect(run).toThrow('@signal decorated member "dupe" has already been signalified. This can happen if there are duplicated class members.');
      });
    });
  });
});
//# sourceMappingURL=signal.test.js.map