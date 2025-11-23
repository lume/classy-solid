function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createEffect, batch } from 'solid-js';
import { reactive } from './reactive.js';
import { signal } from './signal.js';
import { memo } from './memo.js';
describe('classy-solid', () => {
  describe('@reactive, @signal, @memo', () => {
    it('creates a readonly memo via field', () => {
      let _init_a, _init_extra_a, _init_b, _init_extra_b, _init_sum, _init_extra_sum;
      // @reactive
      class Example {
        static {
          [_init_a, _init_extra_a, _init_b, _init_extra_b, _init_sum, _init_extra_sum] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 0, "sum"]]).e;
        }
        constructor() {
          _init_extra_sum(this);
        }
        a = _init_a(this, 1);
        b = (_init_extra_a(this), _init_b(this, 2));
        sum = (_init_extra_b(this), _init_sum(this, () => this.a + this.b));
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum();
        count++;
      });
      expect(ex.sum()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // @ts-expect-error Readonly memo cannot be set - should throw
      expect(() => ex.sum(20)).toThrow();
    });
    it('creates a writable memo via field', () => {
      let _init_a2, _init_extra_a2, _init_b2, _init_extra_b2, _init_sum2, _init_extra_sum2;
      class Example {
        static {
          [_init_a2, _init_extra_a2, _init_b2, _init_extra_b2, _init_sum2, _init_extra_sum2] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 0, "sum"]]).e;
        }
        constructor() {
          _init_extra_sum2(this);
        }
        a = _init_a2(this, 1);
        b = (_init_extra_a2(this), _init_b2(this, 2));
        sum = (_init_extra_b2(this), _init_sum2(this, _val => this.a + this.b));
      }
      const ex = new Example();
      let count = 0;
      let lastSum = 0;
      createEffect(() => {
        lastSum = ex.sum();
        count++;
      });
      expect(ex.sum()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2);

      // This should not trigger the effect since the computed value doesn't change (still 7)
      batch(() => {
        ex.a = 3;
        ex.b = 4;
      });
      expect(ex.sum()).toBe(7);
      expect(lastSum).toBe(7);
      expect(count).toBe(2); // count should still be 2, not 3

      // Writable memo can be set directly
      ex.sum(20);
      expect(ex.sum()).toBe(20);
      expect(lastSum).toBe(20);
      expect(count).toBe(3);
    });
    it('creates a readonly memo via getter', () => {
      let _initProto, _init_a3, _init_extra_a3, _init_b3, _init_extra_b3;
      class Example {
        static {
          [_init_a3, _init_extra_a3, _init_b3, _init_extra_b3, _initProto] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum2"]]).e;
        }
        constructor() {
          _init_extra_b3(this);
        }
        a = (_initProto(this), _init_a3(this, 1));
        b = (_init_extra_a3(this), _init_b3(this, 2));
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
      let _initProto2, _initClass, _init_a4, _init_extra_a4, _init_b4, _init_extra_b4;
      let _Example;
      class Example {
        static {
          ({
            e: [_init_a4, _init_extra_a4, _init_b4, _init_extra_b4, _initProto2],
            c: [_Example, _initClass]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum2"], [memo, 4, "sum2"]]));
        }
        constructor() {
          _init_extra_b4(this);
        }
        a = (_initProto2(this), _init_a4(this, 1));
        b = (_init_extra_a4(this), _init_b4(this, 2));
        get sum2() {
          return this.a + this.b;
        }
        set sum2(_val) {}
        static {
          _initClass();
        }
      }
      const ex = new _Example();
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
      let _initClass2, _init_a5, _init_extra_a5, _init_b5, _init_extra_b5, _init_sum3, _init_extra_sum3;
      let _Example2;
      class Example {
        static {
          ({
            e: [_init_sum3, _init_extra_sum3, _init_a5, _init_extra_a5, _init_b5, _init_extra_b5],
            c: [_Example2, _initClass2]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum3"]]));
        }
        constructor() {
          _init_extra_sum3(this);
        }
        a = _init_a5(this, 1);
        b = (_init_extra_a5(this), _init_b5(this, 2));
        #A = (_init_extra_b5(this), _init_sum3(this, () => this.a + this.b));
        get sum3() {
          return this.#A;
        }
        set sum3(v) {
          this.#A = v;
        }
        static {
          _initClass2();
        }
      }
      const ex = new _Example2();
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

      // @ts-expect-error Readonly memo cannot be set - should throw
      expect(() => ex.sum3(20)).toThrow();
    });
    it('creates a writable memo via accessor function value', () => {
      let _initClass3, _init_a6, _init_extra_a6, _init_b6, _init_extra_b6, _init_sum4, _init_extra_sum4;
      let _Example3;
      class Example {
        static {
          ({
            e: [_init_sum4, _init_extra_sum4, _init_a6, _init_extra_a6, _init_b6, _init_extra_b6],
            c: [_Example3, _initClass3]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum3"]]));
        }
        constructor() {
          _init_extra_sum4(this);
        }
        a = _init_a6(this, 1);
        b = (_init_extra_a6(this), _init_b6(this, 2));
        #A = (_init_extra_b6(this), _init_sum4(this, _val => this.a + this.b));
        get sum3() {
          return this.#A;
        }
        set sum3(v) {
          this.#A = v;
        }
        static {
          _initClass3();
        }
      }
      const ex = new _Example3();
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
      let _initProto3, _initClass4, _init_a7, _init_extra_a7, _init_b7, _init_extra_b7;
      let _Example4;
      class Example {
        static {
          ({
            e: [_init_a7, _init_extra_a7, _init_b7, _init_extra_b7, _initProto3],
            c: [_Example4, _initClass4]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum4"]]));
        }
        constructor() {
          _init_extra_b7(this);
        }
        a = (_initProto3(this), _init_a7(this, 1));
        b = (_init_extra_a7(this), _init_b7(this, 2));
        sum4() {
          return this.a + this.b;
        }
        static {
          _initClass4();
        }
      }
      const ex = new _Example4();
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
      let _initProto4, _initClass5, _init_a8, _init_extra_a8, _init_b8, _init_extra_b8;
      let _Example5;
      class Example {
        static {
          ({
            e: [_init_a8, _init_extra_a8, _init_b8, _init_extra_b8, _initProto4],
            c: [_Example5, _initClass5]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum4"]]));
        }
        constructor() {
          _init_extra_b8(this);
        }
        a = (_initProto4(this), _init_a8(this, 1));
        b = (_init_extra_a8(this), _init_b8(this, 2));
        sum4(_val) {
          return this.a + this.b;
        }
        static {
          _initClass5();
        }
      }
      const ex = new _Example5();
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
      let _initProto5, _initClass6, _init_x, _init_extra_x, _init_y, _init_extra_y;
      let _Calculator;
      class Calculator {
        static {
          ({
            e: [_init_x, _init_extra_x, _init_y, _init_extra_y, _initProto5],
            c: [_Calculator, _initClass6]
          } = _applyDecs(this, [reactive], [[signal, 0, "x"], [signal, 0, "y"], [memo, 3, "result"]]));
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
        static {
          _initClass6();
        }
      }
      const calc = new _Calculator();
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
      let _initProto6, _initClass7, _init_value, _init_extra_value, _init_double, _init_extra_double, _init_quadruple, _init_extra_quadruple;
      let _MultiMemo;
      class MultiMemo {
        static {
          ({
            e: [_init_quadruple, _init_extra_quadruple, _init_value, _init_extra_value, _init_double, _init_extra_double, _initProto6],
            c: [_MultiMemo, _initClass7]
          } = _applyDecs(this, [reactive], [[signal, 0, "value"], [memo, 0, "double"], [memo, 3, "triple"], [memo, 1, "quadruple"]]));
        }
        constructor() {
          _init_extra_quadruple(this);
        }
        value = (_initProto6(this), _init_value(this, 10));
        double = (_init_extra_value(this), _init_double(this, () => this.value * 2));
        get triple() {
          return this.value * 3;
        }
        #A = (_init_extra_double(this), _init_quadruple(this, () => this.value * 4));
        get quadruple() {
          return this.#A;
        }
        set quadruple(v) {
          this.#A = v;
        }
        static {
          _initClass7();
        }
      }
      const mm = new _MultiMemo();
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
      let _initProto7, _initClass8, _init_base, _init_extra_base;
      let _ChainedMemo;
      class ChainedMemo {
        static {
          ({
            e: [_init_base, _init_extra_base, _initProto7],
            c: [_ChainedMemo, _initClass8]
          } = _applyDecs(this, [reactive], [[signal, 0, "base"], [memo, 3, "squared"], [memo, 3, "cubed"]]));
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
        static {
          _initClass8();
        }
      }
      const cm = new _ChainedMemo();
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
    it('correctly handles writable field memo overriding explicit value', () => {
      let _initClass9, _init_a9, _init_extra_a9, _init_b9, _init_extra_b9, _init_sum5, _init_extra_sum5;
      let _WritableOverride;
      class WritableOverride {
        static {
          ({
            e: [_init_a9, _init_extra_a9, _init_b9, _init_extra_b9, _init_sum5, _init_extra_sum5],
            c: [_WritableOverride, _initClass9]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 0, "sum"]]));
        }
        constructor() {
          _init_extra_sum5(this);
        }
        a = _init_a9(this, 5);
        b = (_init_extra_a9(this), _init_b9(this, 10));
        sum = (_init_extra_b9(this), _init_sum5(this, _val => this.a + this.b));
        static {
          _initClass9();
        }
      }
      const wo = new _WritableOverride();
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
    it('correctly handles writable getter+setter memo overriding explicit value', () => {
      let _initProto8, _initClass0, _init_a0, _init_extra_a0, _init_b0, _init_extra_b0;
      let _WritableOverride2;
      class WritableOverride {
        static {
          ({
            e: [_init_a0, _init_extra_a0, _init_b0, _init_extra_b0, _initProto8],
            c: [_WritableOverride2, _initClass0]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 3, "sum"], [memo, 4, "sum"]]));
        }
        constructor() {
          _init_extra_b0(this);
        }
        a = (_initProto8(this), _init_a0(this, 5));
        b = (_init_extra_a0(this), _init_b0(this, 10));
        get sum() {
          return this.a + this.b;
        }
        set sum(_val) {}
        static {
          _initClass0();
        }
      }
      const wo = new _WritableOverride2();
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
      let _initClass1, _init_a1, _init_extra_a1, _init_b1, _init_extra_b1, _init_sum6, _init_extra_sum6;
      let _WritableOverride3;
      class WritableOverride {
        static {
          ({
            e: [_init_sum6, _init_extra_sum6, _init_a1, _init_extra_a1, _init_b1, _init_extra_b1],
            c: [_WritableOverride3, _initClass1]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 1, "sum"]]));
        }
        constructor() {
          _init_extra_sum6(this);
        }
        a = _init_a1(this, 5);
        b = (_init_extra_a1(this), _init_b1(this, 10));
        #A = (_init_extra_b1(this), _init_sum6(this, _val => this.a + this.b));
        get sum() {
          return this.#A;
        }
        set sum(v) {
          this.#A = v;
        }
        static {
          _initClass1();
        }
      }
      const wo = new _WritableOverride3();
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
      let _initProto9, _initClass10, _init_a10, _init_extra_a10, _init_b10, _init_extra_b10;
      let _WritableOverride4;
      class WritableOverride {
        static {
          ({
            e: [_init_a10, _init_extra_a10, _init_b10, _init_extra_b10, _initProto9],
            c: [_WritableOverride4, _initClass10]
          } = _applyDecs(this, [reactive], [[signal, 0, "a"], [signal, 0, "b"], [memo, 2, "sum"]]));
        }
        constructor() {
          _init_extra_b10(this);
        }
        a = (_initProto9(this), _init_a10(this, 5));
        b = (_init_extra_a10(this), _init_b10(this, 10));
        sum(_val) {
          return this.a + this.b;
        }
        static {
          _initClass10();
        }
      }
      const wo = new _WritableOverride4();
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
    it('works correctly without @reactive decorator when using field-based approach', () => {
      let _init_a11, _init_extra_a11, _init_b11, _init_extra_b11, _init_sum7, _init_extra_sum7, _init_finalize, _init_extra_finalize;
      class Example {
        static {
          [_init_a11, _init_extra_a11, _init_b11, _init_extra_b11, _init_sum7, _init_extra_sum7, _init_finalize, _init_extra_finalize] = _applyDecs(this, [], [[signal, 0, "a"], [signal, 0, "b"], [memo, 0, "sum"], [signal, 0, "finalize", o => o.#finalize, (o, v) => o.#finalize = v]], 0, _ => #finalize in _).e;
        }
        constructor() {
          _init_extra_finalize(this);
        }
        a = _init_a11(this, 1);
        b = (_init_extra_a11(this), _init_b11(this, 2));
        sum = (_init_extra_b11(this), _init_sum7(this, () => this.a + this.b));
        // @ts-ignore
        #finalize = (_init_extra_sum7(this), _init_finalize(this));
      }
      const ex = new Example();
      let count = 0;
      createEffect(() => {
        ex.sum();
        count++;
      });
      expect(ex.sum()).toBe(3);
      expect(count).toBe(1);
      ex.a = 5;
      expect(ex.sum()).toBe(7);
      expect(count).toBe(2);
    });
    it('handles memo with no dependencies', () => {
      let _initProto0, _initClass11;
      let _ConstantMemo;
      class ConstantMemo {
        static {
          ({
            e: [_initProto0],
            c: [_ConstantMemo, _initClass11]
          } = _applyDecs(this, [reactive], [[memo, 3, "constant"]]));
        }
        constructor() {
          _initProto0(this);
        }
        get constant() {
          return 42;
        }
        static {
          _initClass11();
        }
      }
      const cm = new _ConstantMemo();
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
  });
});
//# sourceMappingURL=memo.test.js.map