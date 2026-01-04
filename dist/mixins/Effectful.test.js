function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createSignal } from 'solid-js';
import { Effectful, Effects } from './Effectful.js';
import { signal } from '../decorators/signal.js';
import { testElementEffects } from '../index.test.js';
import { effect } from '../decorators/effect.js';
describe('classy-solid', () => {
  describe('Effectful mixin / Effects', () => {
    let last = null;
    let runs = 0;
    it('createEffect runs immediately, stopEffects stops further runs, startEffects runs effects again', () => {
      last = null;
      runs = 0;
      const [s, setS] = createSignal(1);
      const e = new Effects();
      e.createEffect(() => {
        runs++;
        last = s();
      });
      testEffects(e, s, setS);
    });
    it('effects stopped initially with .stopEffects()', () => {
      last = null;
      runs = 0;
      const [s, setS] = createSignal(1);
      const e = new Effects();
      e.stopEffects(); // stop immediately after creation

      // does not auto start
      e.addEffectFn(() => {
        runs++;
        last = s();
      });
      expect(last).toBe(null);
      expect(runs).toBe(0);
      e.startEffects(); // now start effects

      testEffects(e, s, setS);
    });
    it('effects stopped initially with static autoStartEffects = false', () => {
      let _initProto;
      last = null;
      runs = 0;
      class TestEffects extends Effects {
        static {
          [_initProto] = _applyDecs(this, [], [[effect, 2, "testEffect"]], 0, void 0, Effects).e;
        }
        constructor(...args) {
          super(...args);
          _initProto(this);
        }
        static autoStartEffects = false;
        testEffect() {
          runs++;
          last = s();
        }
      }
      const [s, setS] = createSignal(1);
      const e = new TestEffects(); // effects stopped initially

      expect(last).toBe(null);
      expect(runs).toBe(0);
      e.startEffects(); // now start effects

      testEffects(e, s, setS);
    });
    function testEffects(e, s, setS) {
      expect(last).toBe(1);
      expect(runs).toBe(1);
      setS(2);
      expect(last).toBe(2);
      expect(runs).toBe(2);

      // later, stop effects when done (f.e. when custom element disconnected from DOM)...

      e.stopEffects();
      setS(3);
      expect(last).toBe(2);
      expect(runs).toBe(2);

      // later, start effects again (f.e. when custom element reconnected to DOM)...

      e.startEffects();
      expect(last).toBe(3);
      expect(runs).toBe(3);
      setS(4);
      expect(last).toBe(4);
      expect(runs).toBe(4);

      // Clear all effects.
      e.clearEffects();
      setS(5);
      expect(last).toBe(4);
      expect(runs).toBe(4);
      e.startEffects(); // no effects to start
      expect(last).toBe(4);
      expect(runs).toBe(4);
      setS(6);
      expect(last).toBe(4);
      expect(runs).toBe(4);

      // Add a new effect after clearing previous ones

      // auto starts
      e.createEffect(() => {
        runs++;
        last = s();
      });
      expect(last).toBe(6);
      expect(runs).toBe(5);
      setS(7);
      expect(last).toBe(7);
      expect(runs).toBe(6);
    }
    it('startEffects does not duplicate effects', () => {
      const [s, setS] = createSignal(1);
      const e = new Effects();
      let runs = 0;
      e.createEffect(() => {
        runs++;
        s();
      });
      expect(runs).toBe(1);
      e.startEffects(); // should not duplicate effects

      setS(2);
      expect(runs).toBe(2);
    });
    it('clearEffects prevents effects from restarting', () => {
      const [s, setS] = createSignal(1);
      const e = new Effects();
      let runs = 0;
      e.createEffect(() => {
        runs++;
        s();
      });
      expect(runs).toBe(1);
      e.clearEffects();
      setS(2);
      expect(runs).toBe(1);
      e.startEffects(); // should not restart any effects

      setS(3);
      expect(runs).toBe(1);
    });
    it('can be extended from', () => {
      let _init_a, _init_extra_a;
      class MyEffects extends Effects {
        static {
          [_init_a, _init_extra_a] = _applyDecs(this, [], [[signal, 0, "a"]], 0, void 0, Effects).e;
        }
        double = 0;
        constructor() {
          super(), _init_extra_a(this);
          this.createEffect(() => {
            this.double = this.a * 2;
          });
        }
        a = _init_a(this, 1);
      }
      const me = new MyEffects();
      expect(me.double).toBe(2);
      me.a = 5;
      expect(me.double).toBe(10);
      me.stopEffects();
      me.a = 10;
      expect(me.double).toBe(10);
      me.startEffects();
      expect(me.double).toBe(20);
    });
    it('works with multiple Effectful-derived classes', () => {
      var _Effectful;
      let _init_baseSignal, _init_extra_baseSignal, _init_derivedSignal, _init_extra_derivedSignal;
      class Base extends (_Effectful = Effectful(Object)) {
        static {
          [_init_baseSignal, _init_extra_baseSignal] = _applyDecs(this, [], [[signal, 0, "baseSignal"]], 0, void 0, _Effectful).e;
        }
        baseSignal = _init_baseSignal(this, 1);
        baseValue = (_init_extra_baseSignal(this), 0);
        constructor() {
          super();
          this.createEffect(() => {
            this.baseValue = this.baseSignal * 10;
          });
        }
      }
      class Derived extends Base {
        static {
          [_init_derivedSignal, _init_extra_derivedSignal] = _applyDecs(this, [], [[signal, 0, "derivedSignal"]], 0, void 0, Base).e;
        }
        derivedSignal = _init_derivedSignal(this, 2);
        derivedValue = (_init_extra_derivedSignal(this), 0);
        constructor() {
          super();
          this.createEffect(() => {
            this.derivedValue = this.derivedSignal * 100;
          });
        }
      }
      const d = new Derived();
      expect(d.baseValue).toBe(10);
      expect(d.derivedValue).toBe(200);
      d.baseSignal = 3;
      expect(d.baseValue).toBe(30);
      d.derivedSignal = 4;
      expect(d.derivedValue).toBe(400);
      d.stopEffects();
      d.baseSignal = 5;
      d.derivedSignal = 6;
      expect(d.baseValue).toBe(30);
      expect(d.derivedValue).toBe(400);
      d.startEffects();
      expect(d.baseValue).toBe(50);
      expect(d.derivedValue).toBe(600);
    });
    it('supports instanceof checks', () => {
      class MyEffectful extends Effectful(Object) {}
      const me = new MyEffectful();
      expect(me instanceof Effectful).toBe(true);
      expect(me instanceof MyEffectful).toBe(true);
      const e = new Effects();
      expect(e instanceof Effects).toBe(true);
      expect(e instanceof Effectful).toBe(true);
    });
    it('allows nested createEffect calls', () => {
      const [a, setA] = createSignal(0);
      const [b, setB] = createSignal(0);
      const e = new Effects();
      let outerRuns = 0;
      let innerRuns = 0;
      e.createEffect(function outer() {
        outerRuns++;
        a();
        e.createEffect(function inner() {
          innerRuns++;
          b();
        });
      });
      expect(outerRuns).toBe(1);
      expect(innerRuns).toBe(1);
      e.startEffects(); // should not duplicate effects (already started)

      expect(outerRuns).toBe(1);
      expect(innerRuns).toBe(1);
      setA(1);
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(2); // inner effect runs because outer effect re-ran

      setB(1);
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(3); // inner effect runs independently

      e.stopEffects();
      expect(outerRuns).toBe(2);
      expect(innerRuns).toBe(3);
      e.startEffects();
      expect(outerRuns).toBe(3);
      expect(innerRuns).toBe(4); // inner effect runs because outer effect re-ran

      setB(2);
      expect(outerRuns).toBe(3);
      expect(innerRuns).toBe(5); // inner effect runs independently
    });
    describe('invalid usages', () => {
      it('prevents multiple Effectful mixin applications', () => {
        expect(() => {
          class Base extends Effectful(Object) {}
          class Derived extends Effectful(Base) {}
          Derived;
        }).toThrow('Class already extends Effectful, no need to apply the mixin again.');
      });
    });
    describe('usage with custom elements', () => {
      it('createEffect in connectedCallback, clearEffects in disconnectedCallback', () => {
        const el = document.createElement('my-element');
        expect(el.result).toBe(0);
        expect(el.runs).toBe(0);
        testElementEffects(el);
      });
      it('createEffect in constructor, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
        const el = document.createElement('my-element2');
        expect(el.result).toBe(1 + 2);
        expect(el.runs).toBe(1); // already ran in constructor

        testElementEffects(el);
      });
      it('@effect methods, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
        const el = document.createElement('my-element3');
        expect(el.result).toBe(1 + 2);
        expect(el.runs).toBe(1); // already ran in constructor

        testElementEffects(el);
      });
    });
  });
});
//# sourceMappingURL=Effectful.test.js.map