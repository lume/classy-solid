function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createEffect, batch, createSignal } from 'solid-js';
import { signal } from './signal.js';
import { memo } from './memo.js';
import { effect } from './effect.js';
describe('classy-solid', () => {
  describe('@memo decorator', () => {
    it('creates a readonly memo via getter', () => {
      let _initProto, _init_a, _init_extra_a, _init_b, _init_extra_b;
      class Example {
        static {
          [_init_a, _init_extra_a, _init_b, _init_extra_b, _initProto] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum2"]]).e;
        }
        constructor() {
          _init_extra_b(this);
        }
        a = (_initProto(this), _init_a(this, 1));
        b = (_init_extra_a(this), _init_b(this, 2));
        get sum2() {
          return this.a + this.b;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum2;
        count++;
      });
      expect(ex.sum2).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum2).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum2).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Readonly memo cannot be set - should throw in strict mode
      expect(() => {
        // @ts-expect-error - intentionally setting readonly property
        ex.sum2 = 20;
      }).toThrow();
    });
    it('creates a writable memo via getter+setter', () => {
      let _initProto2, _init_a2, _init_extra_a2, _init_b2, _init_extra_b2;
      class Example {
        static {
          [_init_a2, _init_extra_a2, _init_b2, _init_extra_b2, _initProto2] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum2"], [memo, 4, "sum2"]]).e;
        }
        constructor() {
          _init_extra_b2(this);
        }
        a = (_initProto2(this), _init_a2(this, 1));
        b = (_init_extra_a2(this), _init_b2(this, 2));
        get sum2() {
          return this.a + this.b;
        }
        set sum2(_val) {}
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum2;
        count++;
      });
      expect(ex.sum2).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum2).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum2).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Writable memo can be set directly
      ex.sum2 = 20;
      expect(ex.sum2).toBe(20);
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    it('creates a readonly memo via accessor function value', () => {
      let _init_a3, _init_extra_a3, _init_b3, _init_extra_b3, _init_sum, _init_extra_sum;
      class Example {
        static {
          [_init_sum, _init_extra_sum, _init_a3, _init_extra_a3, _init_b3, _init_extra_b3] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum3"]]).e;
        }
        constructor() {
          _init_extra_sum(this);
        }
        a = _init_a3(this, 1);
        b = (_init_extra_a3(this), _init_b3(this, 2));
        #A = (_init_extra_b3(this), _init_sum(this, () => this.a + this.b));
        get sum3() {
          return this.#A;
        }
        set sum3(v) {
          this.#A = v;
        }
      }
      const ex = new Example();
      let runs = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum3();
        runs++;
      });
      expect(ex.sum3()).toBe(3);
      expect(runs).toBe(1);
      ex.a = 5;
      expect(ex.sum3()).toBe(7);
      expect(lastSum).toBe(7);
      expect(runs).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum3()).toBe(7);
      expect(lastSum).toBe(7);
      expect(runs).toBe(2); // count should still be 2, not 3

      // @ts-expect-error Readonly memo cannot be set - should throw
      expect(() => ex.sum3(20)).toThrow();
    });
    it('creates a writable memo via accessor function value', () => {
      let _init_a4, _init_extra_a4, _init_b4, _init_extra_b4, _init_sum2, _init_extra_sum2;
      class Example {
        static {
          [_init_sum2, _init_extra_sum2, _init_a4, _init_extra_a4, _init_b4, _init_extra_b4] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum3"]]).e;
        }
        constructor() {
          _init_extra_sum2(this);
        }
        a = _init_a4(this, 1);
        b = (_init_extra_a4(this), _init_b4(this, 2));
        #A = (_init_extra_b4(this), _init_sum2(this, _val => this.a + this.b));
        get sum3() {
          return this.#A;
        }
        set sum3(v) {
          this.#A = v;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum3();
        count++;
      });
      expect(ex.sum3()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum3()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum3()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Writable memo can be set directly
      ex.sum3(20);
      expect(ex.sum3()).toBe(20);
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    it('creates a readonly memo via method', () => {
      let _initProto3, _init_a5, _init_extra_a5, _init_b5, _init_extra_b5;
      class Example {
        static {
          [_init_a5, _init_extra_a5, _init_b5, _init_extra_b5, _initProto3] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum4"]]).e;
        }
        constructor() {
          _init_extra_b5(this);
        }
        a = (_initProto3(this), _init_a5(this, 1));
        b = (_init_extra_a5(this), _init_b5(this, 2));
        sum4() {
          return this.a + this.b;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum4();
        count++;
      });
      expect(ex.sum4()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum4()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum4()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Readonly memo cannot be set - should throw
      expect(() => {
        // @ts-expect-error - intentionally setting readonly memo
        ex.sum4(20);
      }).toThrow();
    });
    it('creates a writable memo via method', () => {
      let _initProto4, _init_a6, _init_extra_a6, _init_b6, _init_extra_b6;
      class Example {
        static {
          [_init_a6, _init_extra_a6, _init_b6, _init_extra_b6, _initProto4] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum4"]]).e;
        }
        constructor() {
          _init_extra_b6(this);
        }
        a = (_initProto4(this), _init_a6(this, 1));
        b = (_init_extra_a6(this), _init_b6(this, 2));
        sum4(_val) {
          return this.a + this.b;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum4();
        count++;
      });
      expect(ex.sum4()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum4()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum4()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Writable memo can be set directly
      ex.sum4(20);
      expect(ex.sum4()).toBe(20);
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    it('memoizes complex computations and only re-runs when dependencies change', () => {
      let _initProto5, _init_x, _init_extra_x, _init_y, _init_extra_y;
      class Calculator {
        static {
          [_init_x, _init_extra_x, _init_y, _init_extra_y, _initProto5] = _applyDecs(this, [], [[signal, 0, "x"], [signal, 0, "y"], [memo, 3, "result"]]).e;
        }
        constructor() {
          _init_extra_y(this);
        }
        computeCount = (_initProto5(this), 0);
        x = _init_x(this, 10);
        y = (_init_extra_x(this), _init_y(this, 5));
        get result() {
          this.computeCount++;
          return this.x * 2 + this.y;
        }
      }
      const calc = new Calculator();
      expect(calc.result).toBe(25);
      expect(calc.computeCount).toBe(1);

      // Reading again should not re-compute
      expect(calc.result).toBe(25);
      expect(calc.computeCount).toBe(1);

      // Changing a dependency should trigger recomputation
      calc.x = 20;
      expect(calc.result).toBe(45);
      expect(calc.computeCount).toBe(2);

      // Reading again should not re-compute
      expect(calc.result).toBe(45);
      expect(calc.computeCount).toBe(2);
    });
    it('works with multiple memo properties', () => {
      let _initProto6, _init_value, _init_extra_value, _init_quadruple, _init_extra_quadruple;
      class MultiMemo {
        static {
          [_init_quadruple, _init_extra_quadruple, _init_value, _init_extra_value, _initProto6] = _applyDecs(this, [], [[signal, 0, "value"], [memo, 2, "double"], [memo, 3, "triple"], [memo, 1, "quadruple"]]).e;
        }
        constructor() {
          _init_extra_quadruple(this);
        }
        value = (_initProto6(this), _init_value(this, 10));
        double() {
          return this.value * 2;
        }
        get triple() {
          return this.value * 3;
        }
        #A = (_init_extra_value(this), _init_quadruple(this, () => this.value * 4));
        get quadruple() {
          return this.#A;
        }
        set quadruple(v) {
          this.#A = v;
        }
      }
      const mm = new MultiMemo();
      let doubleCount = 0;
      let tripleCount = 0;
      let quadCount = 0;
      createEffect(() => {
        mm.double();
        doubleCount++;
      });
      createEffect(() => {
        mm.triple;
        tripleCount++;
      });
      createEffect(() => {
        mm.quadruple();
        quadCount++;
      });
      expect(mm.double()).toBe(20);
      expect(mm.triple).toBe(30);
      expect(mm.quadruple()).toBe(40);
      expect(doubleCount).toBe(1);
      expect(tripleCount).toBe(1);
      expect(quadCount).toBe(1);
      mm.value = 5;
      expect(mm.double()).toBe(10);
      expect(mm.triple).toBe(15);
      expect(mm.quadruple()).toBe(20);
      expect(doubleCount).toBe(2);
      expect(tripleCount).toBe(2);
      expect(quadCount).toBe(2);
    });
    it('handles memo depending on other memos', () => {
      let _initProto7, _init_base, _init_extra_base;
      class ChainedMemo {
        static {
          [_init_base, _init_extra_base, _initProto7] = _applyDecs(this, [], [[signal, 0, "base"], [memo, 3, "squared"], [memo, 3, "cubed"]]).e;
        }
        constructor() {
          _init_extra_base(this);
        }
        base = (_initProto7(this), _init_base(this, 2));
        get squared() {
          return this.base * this.base;
        }
        get cubed() {
          return this.squared * this.base;
        }
      }
      const cm = new ChainedMemo();
      let count = 0;
      createEffect(() => {
        cm.cubed;
        count++;
      });
      expect(cm.squared).toBe(4);
      expect(cm.cubed).toBe(8);
      expect(count).toBe(1);
      cm.base = 3;
      expect(cm.squared).toBe(9);
      expect(cm.cubed).toBe(27);
      expect(count).toBe(2);
    });
    it('correctly handles writable getter+setter memo overriding explicit value', () => {
      let _initProto8, _init_a7, _init_extra_a7, _init_b7, _init_extra_b7;
      class WritableOverride {
        static {
          [_init_a7, _init_extra_a7, _init_b7, _init_extra_b7, _initProto8] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum"], [memo, 4, "sum"]]).e;
        }
        constructor() {
          _init_extra_b7(this);
        }
        a = (_initProto8(this), _init_a7(this, 5));
        b = (_init_extra_a7(this), _init_b7(this, 10));
        get sum() {
          return this.a + this.b;
        }
        set sum(_val) {}
      }
      const wo = new WritableOverride();
      let count = 0;
      let lastValue = 0;
      createEffect(() => {
        lastValue = wo.sum;
        count++;
      });
      expect(wo.sum).toBe(15);
      expect(count).toBe(1);
      expect(lastValue).toBe(15);

      // Override with direct value
      wo.sum = 100;
      expect(wo.sum).toBe(100);
      expect(count).toBe(2);
      expect(lastValue).toBe(100);

      // Changing dependencies should still work after override
      wo.a = 20;
      // The memo should now compute based on signals again
      expect(wo.sum).toBe(30); // 20 + 10
      expect(count).toBe(3);
      expect(lastValue).toBe(30);
    });
    it('correctly handles writable accessor memo overriding explicit value', () => {
      let _init_a8, _init_extra_a8, _init_b8, _init_extra_b8, _init_sum3, _init_extra_sum3;
      class WritableOverride {
        static {
          [_init_sum3, _init_extra_sum3, _init_a8, _init_extra_a8, _init_b8, _init_extra_b8] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum"]]).e;
        }
        constructor() {
          _init_extra_sum3(this);
        }
        a = _init_a8(this, 5);
        b = (_init_extra_a8(this), _init_b8(this, 10));
        #A = (_init_extra_b8(this), _init_sum3(this, _val => this.a + this.b));
        get sum() {
          return this.#A;
        }
        set sum(v) {
          this.#A = v;
        }
      }
      const wo = new WritableOverride();
      let count = 0;
      let lastValue = 0;
      createEffect(() => {
        lastValue = wo.sum();
        count++;
      });
      expect(wo.sum()).toBe(15);
      expect(count).toBe(1);
      expect(lastValue).toBe(15);

      // Override with direct value
      wo.sum(100);
      expect(wo.sum()).toBe(100);
      expect(count).toBe(2);
      expect(lastValue).toBe(100);

      // Changing dependencies should still work after override
      wo.a = 20;
      // The memo should now compute based on signals again
      expect(wo.sum()).toBe(30); // 20 + 10
      expect(count).toBe(3);
      expect(lastValue).toBe(30);
    });
    it('correctly handles writable method memo overriding explicit value', () => {
      let _initProto9, _init_a9, _init_extra_a9, _init_b9, _init_extra_b9;
      class WritableOverride {
        static {
          [_init_a9, _init_extra_a9, _init_b9, _init_extra_b9, _initProto9] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum"]]).e;
        }
        constructor() {
          _init_extra_b9(this);
        }
        a = (_initProto9(this), _init_a9(this, 5));
        b = (_init_extra_a9(this), _init_b9(this, 10));
        sum(_val) {
          return this.a + this.b;
        }
      }
      const wo = new WritableOverride();
      let count = 0;
      let lastValue = 0;
      createEffect(() => {
        lastValue = wo.sum();
        count++;
      });
      expect(wo.sum()).toBe(15);
      expect(count).toBe(1);
      expect(lastValue).toBe(15);

      // Override with direct value
      wo.sum(100);
      expect(wo.sum()).toBe(100);
      expect(count).toBe(2);
      expect(lastValue).toBe(100);

      // Changing dependencies should still work after override
      wo.a = 20;
      // The memo should now compute based on signals again
      expect(wo.sum()).toBe(30); // 20 + 10
      expect(count).toBe(3);
      expect(lastValue).toBe(30);
    });
    it('handles memo with no dependencies', () => {
      let _initProto0;
      class ConstantMemo {
        static {
          [_initProto0] = _applyDecs(this, [], [[memo, 3, "constant"]]).e;
        }
        constructor() {
          _initProto0(this);
        }
        get constant() {
          return 42;
        }
      }
      const cm = new ConstantMemo();
      let count = 0;
      createEffect(() => {
        cm.constant;
        count++;
      });
      expect(cm.constant).toBe(42);
      expect(count).toBe(1);

      // Reading again should not trigger effect
      const val = cm.constant;
      expect(val).toBe(42);
      expect(count).toBe(1);
    });
    it('supports private getter/setters', () => {
      let _initProto1, _init_a0, _init_extra_a0, _init_b0, _init_extra_b0, _call_sumPrivate, _call_sumPrivate2;
      class Example {
        static {
          [_call_sumPrivate, _call_sumPrivate2, _init_a0, _init_extra_a0, _init_b0, _init_extra_b0, _initProto1] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sumPrivate", function () {
            return this.a + this.b;
          }], [memo, 4, "sumPrivate", function (_val) {}]], 0, _ => #sumPrivate in _).e;
        }
        constructor() {
          _init_extra_b0(this);
        }
        a = (_initProto1(this), _init_a0(this, 1));
        b = (_init_extra_a0(this), _init_b0(this, 2));
        get #sumPrivate() {
          return _call_sumPrivate(this);
        }
        set #sumPrivate(v) {
          _call_sumPrivate2(this, v);
        }
        get sum() {
          return this.#sumPrivate;
        }
        set sum(val) {
          this.#sumPrivate = val;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum;
        count++;
      });
      expect(lastSum).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(lastSum).toBe(7);
      expect(count).toBe(2);
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // should not run because sum didn't change

      ex.sum = 20;
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    function accessorGetSet(value) {
      return function (_, __) {
        return value;
      };
    }

    // This is undocumented, but helps us get set up for concise accessors once that syntax lands.
    it('supports private auto accessors', () => {
      let _init_a1, _init_extra_a1, _init_b1, _init_extra_b1, _sumPrivateDecs, _init_sumPrivate, _get_sumPrivate, _set_sumPrivate, _init_extra_sumPrivate;
      class Example {
        static {
          [_init_sumPrivate, _get_sumPrivate, _set_sumPrivate, _init_extra_sumPrivate, _init_a1, _init_extra_a1, _init_b1, _init_extra_b1] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [_sumPrivateDecs, 1, "sumPrivate", o => o.#A, (o, v) => o.#A = v]], 0, _ => #sumPrivate in _).e;
        }
        constructor() {
          _init_extra_sumPrivate(this);
        }
        [(_sumPrivateDecs = [memo, accessorGetSet({
          get() {
            return this.a + this.b;
          },
          set() {}
        })], "a")] = _init_a1(this, 1);
        b = (_init_extra_a1(this), _init_b1(this, 2));

        // @ts-ignore
        #A = (_init_extra_b1(this), _init_sumPrivate(this, 0)); // initial value won't matter, memo will override initially
        set #sumPrivate(v) {
          _set_sumPrivate(this, v);
        }
        get #sumPrivate() {
          return _get_sumPrivate(this);
        }
        get sum() {
          return this.#sumPrivate;
        }
        set sum(val) {
          this.#sumPrivate = val;
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum;
        count++;
      });
      expect(lastSum).toBe(1 + 2);
      expect(count).toBe(1);
      ex.a = 5;
      expect(lastSum).toBe(5 + 2);
      expect(count).toBe(2);
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // should not run because sum didn't change

      ex.sum = 20;
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    it('supports private methods', () => {
      let _initProto10, _init_a10, _init_extra_a10, _init_b10, _init_extra_b10, _call_sumPrivate3;
      class Example {
        static {
          [_call_sumPrivate3, _init_a10, _init_extra_a10, _init_b10, _init_extra_b10, _initProto10] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sumPrivate", function (_val) {
            return this.a + this.b;
          }]], 0, _ => #sumPrivate in _).e;
        }
        constructor() {
          _init_extra_b10(this);
        }
        #sumPrivate = _call_sumPrivate3;
        a = (_initProto10(this), _init_a10(this, 1));
        b = (_init_extra_a10(this), _init_b10(this, 2));
        get sum() {
          return this.#sumPrivate();
        }
        set sum(val) {
          this.#sumPrivate(val);
        }
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum;
        count++;
      });
      expect(lastSum).toBe(1 + 2);
      expect(count).toBe(1);
      ex.a = 5;
      expect(lastSum).toBe(5 + 2);
      expect(count).toBe(2);
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // should not run because sum didn't change

      ex.sum = 20;
      console.log('sum?', ex.sum);
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    describe('subclass memo overriding/extending', () => {
      it('supports subclass memo extending base memo (getter)', () => {
        let _initProto11, _init_a11, _init_extra_a11, _initProto12;
        class Base {
          static {
            [_init_a11, _init_extra_a11, _initProto11] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 3, "baseVal"]]).e;
          }
          constructor() {
            _init_extra_a11(this);
          }
          a = (_initProto11(this), _init_a11(this, 1));
          get baseVal() {
            return this.a + 1;
          }
        }
        class Sub extends Base {
          static {
            [_initProto12] = _applyDecs(this, [], [[memo, 3, "baseVal"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto12(this);
          }
          get baseVal() {
            return super.baseVal + 1; // extend
          }
        }
        const s = new Sub();
        let runs = 0;
        let last = 0;
        createEffect(() => {
          runs++;
          last = s.baseVal;
        });
        expect(last).toBe(1 + 1 + 1);
        expect(runs).toBe(1);
        s.a = 5;
        expect(last).toBe(5 + 1 + 1);
        expect(runs).toBe(2);
      });
      it('supports subclass memo overriding base memo (getter no super)', () => {
        let _initProto13, _init_a12, _init_extra_a12, _initProto14;
        class Base {
          static {
            [_init_a12, _init_extra_a12, _initProto13] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 3, "val"]]).e;
          }
          constructor() {
            _init_extra_a12(this);
          }
          a = (_initProto13(this), _init_a12(this, 1));
          get val() {
            return this.a + 1;
          }
        }
        class Sub extends Base {
          static {
            [_initProto14] = _applyDecs(this, [], [[memo, 3, "val"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto14(this);
          }
          get val() {
            return this.a * 2; // override
          }
        }
        const s = new Sub();
        let runs = 0;
        let last = 0;
        createEffect(() => {
          runs++;
          last = s.val;
        });
        expect(last).toBe(1 * 2);
        expect(runs).toBe(1);
        s.a = 5;
        expect(last).toBe(5 * 2);
        expect(runs).toBe(2);
      });
      it('supports getter override with no super', () => {
        let _initProto15, _initProto16;
        const [a, setA] = createSignal(10);
        let baseRuns = 0;
        let subRuns = 0;
        class Base {
          static {
            [_initProto15] = _applyDecs(this, [], [[memo, 3, "val"]]).e;
          }
          constructor() {
            _initProto15(this);
          }
          get val() {
            baseRuns++;
            return a() + 1;
          }
        }
        class Sub extends Base {
          static {
            [_initProto16] = _applyDecs(this, [], [[memo, 3, "val"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto16(this);
          }
          get val() {
            subRuns++;
            return a() + 10;
          }
        }
        const o = new Sub();
        let effectRuns = 0;
        let effectVal = 0;
        createEffect(() => {
          effectRuns++;
          effectVal = o.val;
        });
        expect(effectVal).toBe(10 + 10);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        setA(20);
        expect(effectVal).toBe(20 + 10);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
      it('supports multi-level getter extension with super', () => {
        let _initProto17, _initProto18, _initProto19;
        const [a, setA] = createSignal(10);
        let baseRuns = 0;
        let midRuns = 0;
        let subRuns = 0;
        class Base {
          static {
            [_initProto17] = _applyDecs(this, [], [[memo, 3, "val"]]).e;
          }
          constructor() {
            _initProto17(this);
          }
          get val() {
            baseRuns++;
            return a() + 1;
          }
        }
        class Mid extends Base {
          static {
            [_initProto18] = _applyDecs(this, [], [[memo, 3, "val"]], 0, void 0, Base).e;
          }
          constructor(...args) {
            super(...args);
            _initProto18(this);
          }
          get val() {
            midRuns++;
            return super.val + 10;
          }
        }
        class Sub extends Mid {
          static {
            [_initProto19] = _applyDecs(this, [], [[memo, 3, "val"]], 0, void 0, Mid).e;
          }
          constructor(...args) {
            super(...args);
            _initProto19(this);
          }
          get val() {
            subRuns++;
            return super.val + 100;
          }
        }
        const o = new Sub();
        let effectRuns = 0;
        let effectVal = 0;
        createEffect(() => {
          effectRuns++;
          effectVal = o.val;
        });
        expect(effectVal).toBe(10 + 1 + 10 + 100);
        expect(baseRuns).toBe(1);
        expect(midRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        setA(20);
        expect(effectVal).toBe(20 + 1 + 10 + 100);
        expect(baseRuns).toBe(2);
        expect(midRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
      it('supports subclass memo method extension with super', () => {
        let _initProto20, _init_a13, _init_extra_a13, _initProto21;
        let baseRuns = 0;
        class BaseM {
          static {
            [_init_a13, _init_extra_a13, _initProto20] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 2, "val"]]).e;
          }
          constructor() {
            _init_extra_a13(this);
          }
          a = (_initProto20(this), _init_a13(this, 1));
          val() {
            baseRuns++;
            return this.a + 1;
          }
        }
        let subRuns = 0;
        class SubM extends BaseM {
          static {
            [_initProto21] = _applyDecs(this, [], [[memo, 2, "val"]], 0, void 0, BaseM).e;
          }
          constructor(...args) {
            super(...args);
            _initProto21(this);
          }
          val() {
            subRuns++;
            return super.val() + 2;
          }
        }
        const s = new SubM();
        let effectRuns = 0;
        let last = 0;
        createEffect(() => {
          effectRuns++;
          last = s.val();
        });
        expect(last).toBe(1 + 1 + 2);
        expect(baseRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        s.a = 5;
        expect(last).toBe(5 + 1 + 2);
        expect(baseRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
      it('supports subclass memo method override with no super', () => {
        let _initProto22, _init_a14, _init_extra_a14, _initProto23;
        let baseRuns = 0;
        let subRuns = 0;
        class BaseM {
          static {
            [_init_a14, _init_extra_a14, _initProto22] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 2, "val"]]).e;
          }
          constructor() {
            _init_extra_a14(this);
          }
          a = (_initProto22(this), _init_a14(this, 1));
          val() {
            baseRuns++;
            return this.a + 1;
          }
        }
        class SubM extends BaseM {
          static {
            [_initProto23] = _applyDecs(this, [], [[memo, 2, "val"]], 0, void 0, BaseM).e;
          }
          constructor(...args) {
            super(...args);
            _initProto23(this);
          }
          val() {
            subRuns++;
            return this.a + 2;
          }
        }
        const s = new SubM();
        let effectRuns = 0;
        let last = 0;
        createEffect(() => {
          effectRuns++;
          last = s.val();
        });
        expect(last).toBe(1 + 2);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        s.a = 5;
        expect(last).toBe(5 + 2);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
      it('supports subclass memo auto accessor extension with super', () => {
        let _init_a15, _init_extra_a15, _init_val, _init_extra_val, _init_val2, _init_extra_val2;
        let baseRuns = 0;
        let subRuns = 0;
        class BaseFO {
          static {
            [_init_val, _init_extra_val, _init_a15, _init_extra_a15] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 1, "val"]]).e;
          }
          constructor() {
            _init_extra_val(this);
          }
          a = _init_a15(this, 1);
          #A = (_init_extra_a15(this), _init_val(this, () => {
            baseRuns++;
            return this.a + 1;
          }));
          get val() {
            return this.#A;
          }
          set val(v) {
            this.#A = v;
          }
        }
        class SubFO extends BaseFO {
          static {
            [_init_val2, _init_extra_val2] = _applyDecs(this, [], [[memo, 1, "val"]], 0, void 0, BaseFO).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_val2(this);
          }
          #A = _init_val2(this, () => {
            subRuns++;
            return super.val() * 3;
          });
          get val() {
            return this.#A;
          }
          set val(v) {
            this.#A = v;
          }
        }
        const s = new SubFO();
        let effectRuns = 0;
        let last = 0;
        createEffect(() => {
          effectRuns++;
          last = s.val();
        });
        expect(last).toBe((1 + 1) * 3);
        expect(baseRuns).toBe(1);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        s.a = 4;
        expect(last).toBe((4 + 1) * 3);
        expect(baseRuns).toBe(2);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
      it('supports subclass memo auto accessor override with no super', () => {
        let _init_a16, _init_extra_a16, _init_val3, _init_extra_val3, _init_val4, _init_extra_val4;
        let baseRuns = 0;
        let subRuns = 0;
        class BaseFO {
          static {
            [_init_val3, _init_extra_val3, _init_a16, _init_extra_a16] = _applyDecs(this, [], [[signal, 0, "a"], [memo, 1, "val"]]).e;
          }
          constructor() {
            _init_extra_val3(this);
          }
          a = _init_a16(this, 1);
          #A = (_init_extra_a16(this), _init_val3(this, () => {
            baseRuns++;
            return this.a + 1;
          }));
          get val() {
            return this.#A;
          }
          set val(v) {
            this.#A = v;
          }
        }
        class SubFO extends BaseFO {
          static {
            [_init_val4, _init_extra_val4] = _applyDecs(this, [], [[memo, 1, "val"]], 0, void 0, BaseFO).e;
          }
          constructor(...args) {
            super(...args);
            _init_extra_val4(this);
          }
          #A = _init_val4(this, () => {
            subRuns++;
            return this.a * 3;
          });
          get val() {
            return this.#A;
          }
          set val(v) {
            this.#A = v;
          }
        }
        const s = new SubFO();
        let effectRuns = 0;
        let last = 0;
        createEffect(() => {
          effectRuns++;
          last = s.val();
        });
        expect(last).toBe(1 * 3);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(1);
        expect(effectRuns).toBe(1);
        s.a = 4;
        expect(last).toBe(4 * 3);
        expect(baseRuns).toBe(0);
        expect(subRuns).toBe(2);
        expect(effectRuns).toBe(2);
      });
    });
    describe('invalid usage', () => {
      it('throws on non-function value', () => {
        let _init_foo, _init_extra_foo;
        class Base {
          static {
            [_init_foo, _init_extra_foo] = _applyDecs(this, [], [[memo, 1, "foo"]]).e;
          }
          constructor() {
            _init_extra_foo(this);
          }
          // @ts-expect-error non-function value
          #A = _init_foo(this, 1);
          get foo() {
            return this.#A;
          }
          set foo(v) {
            this.#A = v;
          }
        }
        expect(() => new Base()).toThrow('memo value for "foo" is not a function: 1');
      });
      it('throws on @memo used on class field', () => {
        const [a] = createSignal(10);
        expect(() => {
          let _init_a17, _init_extra_a17;
          class InvalidMemo {
            static {
              [_init_a17, _init_extra_a17] = _applyDecs(this, [], [[memo, 0, "a"]]).e;
            }
            constructor() {
              _init_extra_a17(this);
            }
            // @ts-expect-error @memo not usable on fields
            a = _init_a17(this, () => a());
          }
          new InvalidMemo();
        }).toThrow('@memo is not supported on class fields.');
      });
      it('throws on duplicate members', () => {
        const run = () => {
          let _initProto24;
          class SuperDuper {
            static {
              [_initProto24] = _applyDecs(this, [], [[memo, 3, "dupe"], [memo, 3, "dupe"]]).e;
            }
            constructor() {
              _initProto24(this);
            }
            // @ts-expect-error duplicate member
            get dupe() {
              return 2;
            }
            // @ts-expect-error duplicate member
            get dupe() {
              return 3;
            }
          }
          new SuperDuper();
        };

        // When compiling with Babel, decorators currently throw an error when applied onto multiple members of the same name.
        expect(run).toThrow('Decorating two elements with the same name (get dupe) is not supported yet');

        // When compiling with TypeScript, decorating duplicate members is allowed, and the last one wins.
        // expect(run).toThrow(
        // 	'@memo decorated member "dupe" has already been memoified. This can happen if there are duplicated class members.',
        // )

        // TODO ^ update Babel to latest in @lume/cli, see if decorators on duplicate members work in classy-solid
      });
      it('throws due to TDZ when accessing private fields defined after regular fields', () => {
        let _initProto25, _init_bar, _init_extra_bar, _initProto26, _init_bar2, _init_extra_bar2;
        class Bar {
          static {
            [_init_bar, _init_extra_bar, _initProto25] = _applyDecs(this, [], [[signal, 0, "bar"], [signal, 3, "baz"], [signal, 4, "baz"], [effect, 2, "logBar"]]).e;
          }
          bar = (_initProto25(this), _init_bar(this, 456));
          #baz = (_init_extra_bar(this), 789);
          get baz() {
            return this.#baz;
          }
          set baz(v) {
            this.#baz = v;
          }

          // This throws because #baz is used before its initialization
          // The ordering is:
          // 1. bar field initialized
          // 2. bar field runs finalizers because it is last in the ordering of extra initializers (so #baz is not initialized yet)
          // 3. During the logBar finalizer (executed in the bar extra initializer), the baz getter is accessed, which accesses #baz before it is initialized
          logBar() {
            this.baz;
          }
        }
        expect(() => new Bar()).toThrow('Cannot read private member #baz from an object whose class did not declare it');

        // To work around the problem, place private fields before regular fields:
        class Bar2 {
          static {
            [_init_bar2, _init_extra_bar2, _initProto26] = _applyDecs(this, [], [[signal, 0, "bar"], [signal, 3, "baz"], [signal, 4, "baz"], [effect, 2, "logBar"]]).e;
          }
          constructor() {
            _init_extra_bar2(this);
          }
          #baz = (_initProto26(this), 789);
          bar = _init_bar2(this, 456);
          get baz() {
            return this.#baz;
          }
          set baz(v) {
            this.#baz = v;
          }
          logBar() {
            this.baz;
          }
        }
        expect(() => new Bar2()).not.toThrow();
      });
    });
  });
});
//# sourceMappingURL=memo.test.js.map