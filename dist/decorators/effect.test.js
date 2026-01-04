function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createSignal, batch, createRoot, createEffect } from 'solid-js';
import { signal } from './signal.js';
import { memo } from './memo.js';
import { effect, startEffects, stopEffects } from './effect.js';
import { Effects } from '../mixins/Effectful.js';
import { testElementEffects } from '../index.test.js';
describe('classy-solid', () => {
  describe('@effect decorator', () => {
    it('runs a basic public method effect, using stopEffects', () => {
      let _initProto, _init_b, _init_extra_b;
      const [a, setA] = createSignal(1);
      class Funkalicious {
        static {
          [_init_b, _init_extra_b, _initProto] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum"]]).e;
        }
        constructor() {
          _init_extra_b(this);
        }
        last = (_initProto(this), null);
        runs = 0;
        b = _init_b(this, 2);
        logSum() {
          this.runs++;
          this.last = a() + this.b;
        }
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    it('runs a basic public method effect, using stopEffects, with autoStart false', () => {
      let _initProto2, _init_b2, _init_extra_b2;
      const [a, setA] = createSignal(1);
      class Funkalicious {
        static {
          [_init_b2, _init_extra_b2, _initProto2] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum"]]).e;
        }
        constructor() {
          _init_extra_b2(this);
        }
        last = (_initProto2(this), null);
        runs = 0;
        b = _init_b2(this, 2);
        static autoStartEffects = false;
        logSum() {
          this.runs++;
          this.last = a() + this.b;
        }
      }
      const fun = new Funkalicious();

      // Ensure effects didn't start yet.
      expect(fun.last === null).toBe(true);
      expect(fun.runs).toBe(0);
      startEffects(fun); // manually start first

      basicTest(fun, setA);
    });
    it('works with both static autoStartEffects = false and Effects class without calling start/stopEffects methods', () => {
      let _initProto3, _init_b3, _init_extra_b3;
      const [a, setA] = createSignal(1);
      class Funkalicious extends Effects {
        static {
          [_init_b3, _init_extra_b3, _initProto3] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_b3(this);
        }
        last = (_initProto3(this), null);
        runs = 0;
        b = _init_b3(this, 2);
        static autoStartEffects = false;
        logSum() {
          this.runs++;
          this.last = a() + this.b;
        }
      }
      const fun = new Funkalicious();

      // Ensure effects didn't start yet.
      expect(fun.last === null).toBe(true);
      expect(fun.runs).toBe(0);
      startEffects(fun); // manually start first

      basicTest(fun, setA, true);
    });
    it('runs a basic private method effect, using stopEffects', () => {
      let _initProto4, _init_b4, _init_extra_b4, _call_logSum;
      const [a, setA] = createSignal(1);
      class Funkalicious {
        static {
          [_call_logSum, _init_b4, _init_extra_b4, _initProto4] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum", function () {
            this.runs++;
            this.last = a() + this.b;
          }]], 0, _ => #logSum in _).e;
        }
        constructor() {
          _init_extra_b4(this);
        }
        #logSum = _call_logSum;
        last = (_initProto4(this), null);
        runs = 0;
        b = _init_b4(this, 2);

        // @ts-expect-error unused private method
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    it('runs a basic private auto accessor effect, using stopEffects', () => {
      let _init_b5, _init_extra_b5, _init_logSum, _get_logSum, _set_logSum, _init_extra_logSum;
      const [a, setA] = createSignal(1);
      class Funkalicious {
        static {
          [_init_logSum, _get_logSum, _set_logSum, _init_extra_logSum, _init_b5, _init_extra_b5] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "logSum", o => o.#A, (o, v) => o.#A = v]], 0, _ => #logSum in _).e;
        }
        constructor() {
          _init_extra_logSum(this);
        }
        last = null;
        runs = 0;
        b = _init_b5(this, 2);

        // @ts-expect-error unused private member
        #A = (_init_extra_b5(this), _init_logSum(this, () => {
          this.runs++;
          this.last = a() + this.b;
        }));
        set #logSum(v) {
          _set_logSum(this, v);
        }
        get #logSum() {
          return _get_logSum(this);
        }
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    it('runs a basic public method effect, using Effects', () => {
      let _initProto5, _init_b6, _init_extra_b6;
      const [a, setA] = createSignal(1);
      class Funkalicious extends Effects {
        static {
          [_init_b6, _init_extra_b6, _initProto5] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_b6(this);
        }
        last = (_initProto5(this), null);
        runs = 0;
        b = _init_b6(this, 2);
        logSum() {
          this.runs++;
          this.last = a() + this.b;
        }
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    it('runs a basic private method effect, using Effects', () => {
      let _initProto6, _init_b7, _init_extra_b7, _call_logSum2;
      const [a, setA] = createSignal(1);
      class Funkalicious extends Effects {
        static {
          [_call_logSum2, _init_b7, _init_extra_b7, _initProto6] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "logSum", function () {
            this.runs++;
            this.last = a() + this.b;
          }]], 0, _ => #logSum in _, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_b7(this);
        }
        #logSum = _call_logSum2;
        last = (_initProto6(this), null);
        runs = 0;
        b = _init_b7(this, 2);

        // @ts-expect-error unused private method
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    it('runs a basic private auto accessor effect, using Effects', () => {
      let _init_b8, _init_extra_b8, _init_logSum2, _get_logSum2, _set_logSum2, _init_extra_logSum2;
      const [a, setA] = createSignal(1);
      class Funkalicious extends Effects {
        static {
          [_init_logSum2, _get_logSum2, _set_logSum2, _init_extra_logSum2, _init_b8, _init_extra_b8] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "logSum", o => o.#A, (o, v) => o.#A = v]], 0, _ => #logSum in _, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_logSum2(this);
        }
        last = null;
        runs = 0;
        b = _init_b8(this, 2);

        // @ts-expect-error unused private member
        #A = (_init_extra_b8(this), _init_logSum2(this, () => {
          this.runs++;
          this.last = a() + this.b;
        }));
        set #logSum(v) {
          _set_logSum2(this, v);
        }
        get #logSum() {
          return _get_logSum2(this);
        }
      }
      const fun = new Funkalicious();
      basicTest(fun, setA);
    });
    function basicTest(fun, setA, useFunctions = false) {
      expect(fun.last).toBe(1 + 2);
      expect(fun.runs).toBe(1);
      setA(5);
      expect(fun.last).toBe(5 + 2);
      expect(fun.runs).toBe(2);
      fun.b = 10;
      expect(fun.last).toBe(5 + 10);
      expect(fun.runs).toBe(3);
      fun instanceof Effects && !useFunctions ? fun.stopEffects() : stopEffects(fun);
      setA(1);
      fun.b = 1;
      expect(fun.last).toBe(5 + 10);
      expect(fun.runs).toBe(3);
      fun instanceof Effects && !useFunctions ? fun.startEffects() : startEffects(fun);
      expect(fun.last).toBe(1 + 1);
      expect(fun.runs).toBe(4);

      // Ensure no duplicate effects
      fun instanceof Effects && !useFunctions ? fun.startEffects() : startEffects(fun);
      expect(fun.last).toBe(1 + 1);
      expect(fun.runs).toBe(4);
      setA(3);
      expect(fun.last).toBe(3 + 1);
      expect(fun.runs).toBe(5);
      fun instanceof Effects && !useFunctions ? fun.stopEffects() : stopEffects(fun);
      setA(10);
      fun.b = 20;
      expect(fun.last).toBe(3 + 1);
      expect(fun.runs).toBe(5);
    }
    it('runs multiple effects independently, using Effects', () => {
      let _initProto7, _init_b9, _init_extra_b9, _init_eff, _init_extra_eff;
      const [a, setA] = createSignal(1);
      let sum1 = 0;
      let sum2 = 0;
      let runs = 0;
      class Doubler extends Effects {
        static {
          [_init_eff, _init_extra_eff, _init_b9, _init_extra_b9, _initProto7] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "eff1"], [effect, 1, "eff2"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_eff(this);
        }
        b = (_initProto7(this), _init_b9(this, 3));
        eff1() {
          runs++;
          sum1 = a() + this.b;
        }
        #A = (_init_extra_b9(this), _init_eff(this, () => {
          runs++;
          sum2 = (a() + this.b) * 2;
        }));
        get eff2() {
          return this.#A;
        }
        set eff2(v) {
          this.#A = v;
        }
      }
      const o = new Doubler();
      expect(sum1).toBe(4);
      expect(sum2).toBe(8);
      expect(runs).toBe(2);
      setA(2);
      expect(sum1).toBe(5);
      expect(sum2).toBe(10);
      expect(runs).toBe(4);
      o.b = 4;
      expect(sum1).toBe(6);
      expect(sum2).toBe(12);
      expect(runs).toBe(6);
      o.stopEffects();
      setA(10);
      o.b = 20;
      expect(sum1).toBe(6);
      expect(sum2).toBe(12);
      expect(runs).toBe(6);
    });
    it('runs multiple effects independently, using stopEffects', () => {
      let _initProto8, _init_b0, _init_extra_b0, _init_eff2, _init_extra_eff2;
      const [a, setA] = createSignal(1);
      let sum1 = 0;
      let sum2 = 0;
      let runs = 0;
      class Doubler {
        static {
          [_init_eff2, _init_extra_eff2, _init_b0, _init_extra_b0, _initProto8] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "eff1"], [effect, 1, "eff2"]]).e;
        }
        constructor() {
          _init_extra_eff2(this);
        }
        b = (_initProto8(this), _init_b0(this, 3));
        eff1() {
          runs++;
          sum1 = a() + this.b;
        }
        #A = (_init_extra_b0(this), _init_eff2(this, () => {
          runs++;
          sum2 = (a() + this.b) * 2;
        }));
        get eff2() {
          return this.#A;
        }
        set eff2(v) {
          this.#A = v;
        }
      }
      const o = new Doubler();
      expect(sum1).toBe(4);
      expect(sum2).toBe(8);
      expect(runs).toBe(2);
      setA(2);
      expect(sum1).toBe(5);
      expect(sum2).toBe(10);
      expect(runs).toBe(4);
      o.b = 4;
      expect(sum1).toBe(6);
      expect(sum2).toBe(12);
      expect(runs).toBe(6);
      stopEffects(o);
      setA(10);
      o.b = 20;
      expect(sum1).toBe(6);
      expect(sum2).toBe(12);
      expect(runs).toBe(6);
    });
    it('reruns effect when memos change inside effect, using Effects', () => {
      let _initProto9;
      const [a, setA] = createSignal(1);
      const [b, setB] = createSignal(2);
      let memoVal = 0;
      let effectRuns = 0;
      class MemoUser extends Effects {
        static {
          [_initProto9] = _applyDecs(this, [], [[memo, 3, "sum"], [effect, 2, "report"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _initProto9(this);
        }
        get sum() {
          return a() + b();
        }
        report() {
          effectRuns++;
          memoVal = this.sum;
        }
      }
      const m = new MemoUser();
      expect(memoVal).toBe(3);
      expect(effectRuns).toBe(1);
      setA(5);
      expect(memoVal).toBe(7);
      expect(effectRuns).toBe(2);
      batch(() => {
        setA(6);
        setB(1);
      }); // sum stays 7
      expect(effectRuns).toBe(2);
      setB(5);
      expect(memoVal).toBe(11);
      expect(effectRuns).toBe(3);
      m.stopEffects();
      setA(0);
      setB(0);
      expect(memoVal).toBe(11);
      expect(effectRuns).toBe(3);
    });
    it('reruns effect when memos change inside effect, using stopEffects', () => {
      let _initProto0;
      const [a, setA] = createSignal(1);
      const [b, setB] = createSignal(2);
      let memoVal = 0;
      let effectRuns = 0;
      class MemoUser {
        static {
          [_initProto0] = _applyDecs(this, [], [[memo, 3, "sum"], [effect, 2, "report"]]).e;
        }
        constructor() {
          _initProto0(this);
        }
        get sum() {
          return a() + b();
        }
        report() {
          effectRuns++;
          memoVal = this.sum;
        }
      }
      const m = new MemoUser();
      expect(memoVal).toBe(3);
      expect(effectRuns).toBe(1);
      setA(5);
      expect(memoVal).toBe(7);
      expect(effectRuns).toBe(2);
      batch(() => {
        setA(6);
        setB(1);
      }); // sum stays 7
      expect(effectRuns).toBe(2);
      setB(5);
      expect(memoVal).toBe(11);
      expect(effectRuns).toBe(3);
      stopEffects(m);
      setA(0);
      setB(0);
      expect(memoVal).toBe(11);
    });
    it('runs an effect on auto accessor, using Effects', () => {
      let _init_b1, _init_extra_b1, _init_compute, _init_extra_compute;
      const [a, setA] = createSignal(1);
      class AccessorClass extends Effects {
        static {
          [_init_compute, _init_extra_compute, _init_b1, _init_extra_b1] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "compute"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _init_extra_compute(this);
        }
        b = _init_b1(this, 2);

        // Stick this here to ensure that nested constructor doesn't
        // interfere with decorator behavior mid-way through initialization
        // of the wrapper parent class (tested with a subclass)
        child = (_init_extra_b1(this), this.constructor !== AccessorClass ? new AccessorClass() : null);
        result = 0;
        runs = 0;
        #A = _init_compute(this, () => {
          this.runs++;
          this.result = a() + this.b;
        });
        get compute() {
          return this.#A;
        }
        set compute(v) {
          this.#A = v;
        }
      }
      class Sub extends AccessorClass {}
      const o = new Sub();
      expect(o.result).toBe(3);
      expect(o.runs).toBe(1);
      setA(5);
      expect(o.result).toBe(7);
      expect(o.runs).toBe(2);
      o.b = 10;
      expect(o.result).toBe(15);
      expect(o.runs).toBe(3);
      o.stopEffects();
      setA(1);
      o.b = 1;
      expect(o.result).toBe(15);
      expect(o.runs).toBe(3);
    });
    it('runs an effect on auto accessor, using stopEffects', () => {
      let _init_b10, _init_extra_b10, _init_compute2, _init_extra_compute2;
      const [a, setA] = createSignal(1);
      class AccessorClass {
        static {
          [_init_compute2, _init_extra_compute2, _init_b10, _init_extra_b10] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "compute"]]).e;
        }
        constructor() {
          _init_extra_compute2(this);
        }
        b = _init_b10(this, 2);

        // Stick this here to ensure that nested constructor doesn't
        // interfere with decorator behavior mid-way through initialization
        // of the wrapper parent class (tested with a subclass)
        child = (_init_extra_b10(this), this.constructor !== AccessorClass ? new AccessorClass() : null);
        result = 0;
        runs = 0;
        #A = _init_compute2(this, () => {
          this.runs++;
          this.result = a() + this.b;
        });
        get compute() {
          return this.#A;
        }
        set compute(v) {
          this.#A = v;
        }
      }
      class Sub extends AccessorClass {}
      const o = new Sub();
      expect(o.result).toBe(3);
      expect(o.runs).toBe(1);
      setA(5);
      expect(o.result).toBe(7);
      expect(o.runs).toBe(2);
      o.b = 10;
      expect(o.result).toBe(15);
      expect(o.runs).toBe(3);
      stopEffects(o);
      setA(1);
      o.b = 1;
      expect(o.result).toBe(15);
      expect(o.runs).toBe(3);
    });
    it('managed within an existing root, without Effects, without stopEffects', () => {
      let _initProto1, _init_b11, _init_extra_b11;
      const [a, setA] = createSignal(1);
      let observed = 0;
      let runs = 0;
      class PlainYogurt {
        static {
          [_init_b11, _init_extra_b11, _initProto1] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "sum"]]).e;
        }
        constructor() {
          _init_extra_b11(this);
        }
        b = (_initProto1(this), _init_b11(this, 2));
        sum() {
          runs++;
          observed = a() + this.b;
        }
      }
      let p;
      let dispose;
      createRoot(d => {
        p = new PlainYogurt();
        dispose = d;
      });

      // As p is created inside a root, it will be tied to that root's owner,
      // so this stopEffects(p) will not dispose the effects.
      stopEffects(p);
      expect(observed).toBe(3);
      expect(runs).toBe(1);
      setA(4);
      p.b = 5;
      expect(observed).toBe(9);
      expect(runs).toBe(3);

      // Now dispose the root to clean up effects
      dispose();
      setA(10);
      p.b = 20;
      expect(observed).toBe(9); // disposed root, no further updates
      expect(runs).toBe(3);
    });
    describe('subclass effect overriding/extending', () => {
      it('runs subclass effect auto accessor extending base effect auto accessor with super', () => {
        let _init_b12, _init_extra_b12, _init_eff3, _init_extra_eff3, _init_eff4, _init_extra_eff4;
        const [a, setA] = createSignal(1);
        let baseRuns = 0;
        let subRuns = 0;
        let observed = 0;
        class Base extends Effects {
          static {
            [_init_eff3, _init_extra_eff3, _init_b12, _init_extra_b12] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "eff"]], 0, void 0, Effects).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_eff3(this);
          }
          b = _init_b12(this, 2);
          #A = (_init_extra_b12(this), _init_eff3(this, () => {
            baseRuns++;
            observed = a() + this.b;
          }));
          get eff() {
            return this.#A;
          }
          set eff(v) {
            this.#A = v;
          }
        }
        class Sub extends Base {
          static {
            [_init_eff4, _init_extra_eff4] = _applyDecs(this, [], [[effect, 1, "eff"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_eff4(this);
          }
          #A = _init_eff4(this, () => {
            subRuns++;
            super.eff();
            observed = observed + 10;
          });
          get eff() {
            return this.#A;
          }
          set eff(v) {
            this.#A = v;
          }
        }
        const o = new Sub();
        expect(baseRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(observed).toBe(1 + 2 + 10);
        o.b = 5;
        expect(baseRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(observed).toBe(1 + 5 + 10);
        setA(10);
        expect(baseRuns).toBe(3);
        expect(subRuns).toBe(3);
        expect(observed).toBe(10 + 5 + 10);
        o.stopEffects();
        o.b = 100;
        expect(baseRuns).toBe(3);
        expect(subRuns).toBe(3);
        expect(observed).toBe(10 + 5 + 10);
      });
      it('runs subclass effect auto accessor overriding base effect auto accessor without super', () => {
        let _init_b13, _init_extra_b13, _init_eff5, _init_extra_eff5, _init_eff6, _init_extra_eff6;
        const [a, setA] = createSignal(1);
        let baseRuns = 0;
        let subRuns = 0;
        let observed = 0;
        class Base extends Effects {
          static {
            [_init_eff5, _init_extra_eff5, _init_b13, _init_extra_b13] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 1, "eff"]], 0, void 0, Effects).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_eff5(this);
          }
          b = _init_b13(this, 2);
          #A = (_init_extra_b13(this), _init_eff5(this, () => {
            baseRuns++;
            observed = a() + this.b;
          }));
          get eff() {
            return this.#A;
          }
          set eff(v) {
            this.#A = v;
          }
        }
        class Sub extends Base {
          static {
            [_init_eff6, _init_extra_eff6] = _applyDecs(this, [], [[effect, 1, "eff"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_eff6(this);
          }
          #A = _init_eff6(this, () => {
            subRuns++;
            observed = (a() + this.b) * 2; // override without super
          });
          get eff() {
            return this.#A;
          }
          set eff(v) {
            this.#A = v;
          }
        }
        const o = new Sub();
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(1);
        expect(observed).toBe((1 + 2) * 2);
        o.b = 5;
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(2);
        expect(observed).toBe((1 + 5) * 2);
        setA(10);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(3);
        expect(observed).toBe((10 + 5) * 2);
        o.stopEffects();
        o.b = 100;
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(3);
        expect(observed).toBe((10 + 5) * 2);
      });
      it('runs subclass effect method extending base effect method with super', () => {
        let _initProto10, _init_b14, _init_extra_b14, _initProto11, _init_c, _init_extra_c;
        const [a, setA] = createSignal(1);
        let superRuns = 0;
        let subRuns = 0;
        let observed = 0;
        class Base extends Effects {
          static {
            [_init_b14, _init_extra_b14, _initProto10] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "compute"]], 0, void 0, Effects).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_b14(this);
          }
          b = (_initProto10(this), _init_b14(this, 2));
          compute() {
            superRuns++;
            observed = a() + this.b;
          }
        }
        class Sub extends Base {
          static {
            [_init_c, _init_extra_c, _initProto11] = _applyDecs(this, [], [[signal, 0, "c"], [effect, 2, "compute"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_c(this);
          }
          c = (_initProto11(this), _init_c(this, 3));
          compute() {
            subRuns++;
            super.compute();
            observed += this.c; // extend behavior
          }
        }
        const o = new Sub();
        expect(superRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(observed).toBe(1 + 2 + 3); // a + b + extension

        setA(5);
        expect(superRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(observed).toBe(5 + 2 + 3);
        o.b = 10;
        expect(superRuns).toBe(3);
        expect(subRuns).toBe(3);
        expect(observed).toBe(5 + 10 + 3);
        o.c = 5;
        expect(superRuns).toBe(4);
        expect(subRuns).toBe(4);
        expect(observed).toBe(5 + 10 + 5);
        o.stopEffects();
        setA(0);
        o.b = 0;
        o.c = 0;
        expect(superRuns).toBe(4);
        expect(subRuns).toBe(4);
        expect(observed).toBe(5 + 10 + 5);
      });
      it('supports multi-level effect method extending base effect method with super', () => {
        let _initProto12, _init_b15, _init_extra_b15, _initProto13, _init_c2, _init_extra_c2, _initProto14, _init_d, _init_extra_d;
        const [a, setA] = createSignal(1);
        let baseRuns = 0;
        let midRuns = 0;
        let subRuns = 0;
        let observed = 0;
        class Base extends Effects {
          static {
            [_init_b15, _init_extra_b15, _initProto12] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "compute"]], 0, void 0, Effects).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_b15(this);
          }
          b = (_initProto12(this), _init_b15(this, 2));
          compute() {
            baseRuns++;
            observed = a() + this.b;
          }
        }
        class Mid extends Base {
          static {
            [_init_c2, _init_extra_c2, _initProto13] = _applyDecs(this, [], [[signal, 0, "c"], [effect, 2, "compute"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_c2(this);
          }
          c = (_initProto13(this), _init_c2(this, 3));
          compute() {
            midRuns++;
            super.compute();
            observed += this.c;
          }
        }
        class Sub extends Mid {
          static {
            [_init_d, _init_extra_d, _initProto14] = _applyDecs(this, [], [[signal, 0, "d"], [effect, 2, "compute"]], 0, void 0, Mid).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_d(this);
          }
          d = (_initProto14(this), _init_d(this, 4));
          compute() {
            subRuns++;
            super.compute();
            observed += this.d;
          }
        }
        const o = new Sub();
        expect(baseRuns).toBe(1);
        expect(midRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(observed).toBe(1 + 2 + 3 + 4);
        setA(5);
        expect(baseRuns).toBe(2);
        expect(midRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(observed).toBe(5 + 2 + 3 + 4);
        o.b = 10;
        expect(baseRuns).toBe(3);
        expect(midRuns).toBe(3);
        expect(subRuns).toBe(3);
        expect(observed).toBe(5 + 10 + 3 + 4);
        o.c = 6;
        expect(baseRuns).toBe(4);
        expect(midRuns).toBe(4);
        expect(subRuns).toBe(4);
        expect(observed).toBe(5 + 10 + 6 + 4);
        o.d = 7;
        expect(baseRuns).toBe(5);
        expect(midRuns).toBe(5);
        expect(subRuns).toBe(5);
        expect(observed).toBe(5 + 10 + 6 + 7);
        o.stopEffects();
        setA(0);
        o.b = 0;
        o.c = 0;
        o.d = 0;
        expect(baseRuns).toBe(5);
        expect(midRuns).toBe(5);
        expect(subRuns).toBe(5);
        expect(observed).toBe(5 + 10 + 6 + 7);
      });
      it('runs subclass effect method overriding base effect method without super', () => {
        let _initProto15, _init_b16, _init_extra_b16, _initProto16;
        const [a, setA] = createSignal(1);
        let superRuns = 0;
        let subRuns = 0;
        let observed = 0;
        class Base extends Effects {
          static {
            [_init_b16, _init_extra_b16, _initProto15] = _applyDecs(this, [], [[signal, 0, "b"], [effect, 2, "compute"]], 0, void 0, Effects).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_b16(this);
          }
          b = (_initProto15(this), _init_b16(this, 2));
          compute() {
            superRuns++;
            observed = a() + this.b;
          }
        }
        class Sub extends Base {
          static {
            [_initProto16] = _applyDecs(this, [], [[effect, 2, "compute"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto16(this);
          }
          compute() {
            subRuns++;
            observed = (a() + this.b) * 2; // override without super
          }
        }
        const o = new Sub();
        expect(superRuns).toBe(0);
        expect(subRuns).toBe(1);
        expect(observed).toBe((1 + 2) * 2);
        setA(3);
        expect(superRuns).toBe(0);
        expect(subRuns).toBe(2);
        expect(observed).toBe((3 + 2) * 2);
        o.b = 5;
        expect(superRuns).toBe(0);
        expect(subRuns).toBe(3);
        expect(observed).toBe((3 + 5) * 2);
        o.stopEffects();
        setA(10);
        o.b = 1;
        expect(subRuns).toBe(3);
      });
    });
    it('works with nested effects', () => {
      let _initProto17, _init_a, _init_extra_a, _init_b17, _init_extra_b17;
      let outerRuns = 0;
      let innerRuns = 0;
      class MyEffects {
        static {
          [_init_a, _init_extra_a, _init_b17, _init_extra_b17, _initProto17] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [effect, 2, "outer"]]).e;
        }
        constructor() {
          _init_extra_b17(this);
        }
        a = (_initProto17(this), _init_a(this, 0));
        b = (_init_extra_a(this), _init_b17(this, 0));
        outer() {
          outerRuns++;
          this.a;
          createEffect(() => {
            innerRuns++;
            this.b;
          });
        }
      }
      const e = new MyEffects();
      expect(outerRuns).toBe(1);
      expect(innerRuns).toBe(1);
      startEffects(e); // should not duplicate effects (already started)

      expect(outerRuns).toBe(1);
      expect(innerRuns).toBe(1);
      e.a = 1;
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(2); // inner effect runs because outer effect re-ran

      e.b = 1;
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(3); // inner effect runs independently

      stopEffects(e);
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(3);
      startEffects(e);
      expect(outerRuns).toBe(3);
      expect(innerRuns).toBe(4); // inner effect runs because outer effect re-ran

      e.b = 2;
      expect(outerRuns).toBe(3);
      expect(innerRuns).toBe(5); // inner effect runs independently
    });
    describe('invalid usage', () => {
      it('throws on invalid field usage', () => {
        expect(() => {
          let _init_nope, _init_extra_nope;
          class BadField {
            static {
              [_init_nope, _init_extra_nope] = _applyDecs(this, [], [[effect, 0, "nope"]]).e;
            }
            constructor() {
              _init_extra_nope(this);
            }
            // @ts-expect-error invalid decorator usage on field
            nope = _init_nope(this, () => 123);
          }
          new BadField();
        }).toThrow('@effect can only be used on methods or function-valued auto accessors');
      });
      it('throws on invalid getter usage', () => {
        expect(() => {
          let _initProto18, _init_a2, _init_extra_a2;
          class BadGetter {
            static {
              [_init_a2, _init_extra_a2, _initProto18] = _applyDecs(this, [], [[signal, 0, "a"], [effect, 3, "nope"]]).e;
            }
            constructor() {
              _init_extra_a2(this);
            }
            a = (_initProto18(this), _init_a2(this, 1));
            // @ts-expect-error invalid decorator usage on getter
            get nope() {
              return this.a;
            }
          }
          new BadGetter();
        }).toThrow('@effect can only be used on methods or function-valued auto accessors');
      });
      it('throws on invalid static usage', () => {
        expect(() => {
          let _initStatic;
          class BadStatic {
            static {
              [_initStatic] = _applyDecs(this, [], [[effect, 10, "nope"]]).e;
              _initStatic(this);
            }
            static nope() {}
          }
          BadStatic;
        }).toThrow('@effect is not supported on static members.');
      });
      it('throws on invalid non-function value', () => {
        expect(() => {
          let _init_a3, _init_extra_a3, _init_nope2, _init_extra_nope2;
          class NonFunction {
            static {
              [_init_nope2, _init_extra_nope2, _init_a3, _init_extra_a3] = _applyDecs(this, [], [[signal, 0, "a"], [effect, 1, "nope"]]).e;
            }
            constructor() {
              _init_extra_nope2(this);
            }
            a = _init_a3(this, 1);
            // @ts-expect-error invalid decorator usage on non-function
            #A = (_init_extra_a3(this), _init_nope2(this, 123));
            get nope() {
              return this.#A;
            }
            set nope(v) {
              this.#A = v;
            }
          }
          new NonFunction();
        }).toThrow('@effect decorated member "nope" is not a function');
      });
      it('throws on duplicate members', () => {
        const run = () => {
          let _initProto19;
          class SuperDuper {
            static {
              [_initProto19] = _applyDecs(this, [], [[effect, 2, "dupe"], [effect, 2, "dupe"]]).e;
            }
            constructor() {
              _initProto19(this);
            }
            // @ts-expect-error duplicate member
            dupe() {
              this;
            }

            // @ts-expect-error duplicate member
            dupe() {
              this;
            }
          }
          new SuperDuper();
        };

        // When compiling with Babel, decorators currently throw an error when applied onto multiple members of the same name.
        expect(run).toThrow('Decorating two elements with the same name (dupe) is not supported yet');

        // When compiling with TypeScript, decorating duplicate members is allowed, and the last one wins.
        // expect(run).toThrow(
        // 	'@effect decorated member "dupe" has already been effectified. This can happen if there are duplicated class members.',
        // )
      });
    });
    describe('usage with custom elements', () => {
      it('@effect methods, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
        const el = document.createElement('my-element4');
        expect(el.result).toBe(1 + 2);
        expect(el.runs).toBe(1); // already ran in constructor

        testElementEffects(el);
      });
    });
  });
});
//# sourceMappingURL=effect.test.js.map