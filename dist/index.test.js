function _applyDecs(e, t, r, n, o, a) { function i(e, t, r) { return function (n, o) { return r && r(n), e[t].call(n, o); }; } function c(e, t) { for (var r = 0; r < e.length; r++) e[r].call(t); return t; } function s(e, t, r, n) { if ("function" != typeof e && (n || void 0 !== e)) throw new TypeError(t + " must " + (r || "be") + " a function" + (n ? "" : " or undefined")); return e; } function applyDec(e, t, r, n, o, a, c, u, l, f, p, d, h) { function m(e) { if (!h(e)) throw new TypeError("Attempted to access private element on non-instance"); } var y, v = t[0], g = t[3], b = !u; if (!b) { r || Array.isArray(v) || (v = [v]); var w = {}, S = [], A = 3 === o ? "get" : 4 === o || d ? "set" : "value"; f ? (p || d ? w = { get: _setFunctionName(function () { return g(this); }, n, "get"), set: function (e) { t[4](this, e); } } : w[A] = g, p || _setFunctionName(w[A], n, 2 === o ? "" : A)) : p || (w = Object.getOwnPropertyDescriptor(e, n)); } for (var P = e, j = v.length - 1; j >= 0; j -= r ? 2 : 1) { var D = v[j], E = r ? v[j - 1] : void 0, I = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: n, metadata: a, addInitializer: function (e, t) { if (e.v) throw Error("attempted to call addInitializer after decoration was finished"); s(t, "An initializer", "be", !0), c.push(t); }.bind(null, I) }; try { if (b) (y = s(D.call(E, P, O), "class decorators", "return")) && (P = y);else { var k, F; O.static = l, O.private = f, f ? 2 === o ? k = function (e) { return m(e), w.value; } : (o < 4 && (k = i(w, "get", m)), 3 !== o && (F = i(w, "set", m))) : (k = function (e) { return e[n]; }, (o < 2 || 4 === o) && (F = function (e, t) { e[n] = t; })); var N = O.access = { has: f ? h.bind() : function (e) { return n in e; } }; if (k && (N.get = k), F && (N.set = F), P = D.call(E, d ? { get: w.get, set: w.set } : w[A], O), d) { if ("object" == typeof P && P) (y = s(P.get, "accessor.get")) && (w.get = y), (y = s(P.set, "accessor.set")) && (w.set = y), (y = s(P.init, "accessor.init")) && S.push(y);else if (void 0 !== P) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); } else s(P, (p ? "field" : "method") + " decorators", "return") && (p ? S.push(P) : w[A] = P); } } finally { I.v = !0; } } return (p || d) && u.push(function (e, t) { for (var r = S.length - 1; r >= 0; r--) t = S[r].call(e, t); return t; }), p || b || (f ? d ? u.push(i(w, "get"), i(w, "set")) : u.push(2 === o ? w[A] : i.call.bind(w[A])) : Object.defineProperty(e, n, w)), P; } function u(e, t) { return Object.defineProperty(e, Symbol.metadata || Symbol.for("Symbol.metadata"), { configurable: !0, enumerable: !0, value: t }); } if (arguments.length >= 6) var l = a[Symbol.metadata || Symbol.for("Symbol.metadata")]; var f = Object.create(null == l ? null : l), p = function (e, t, r, n) { var o, a, i = [], s = function (t) { return _checkInRHS(t) === e; }, u = new Map(); function l(e) { e && i.push(c.bind(null, e)); } for (var f = 0; f < t.length; f++) { var p = t[f]; if (Array.isArray(p)) { var d = p[1], h = p[2], m = p.length > 3, y = 16 & d, v = !!(8 & d), g = 0 == (d &= 7), b = h + "/" + v; if (!g && !m) { var w = u.get(b); if (!0 === w || 3 === w && 4 !== d || 4 === w && 3 !== d) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h); u.set(b, !(d > 2) || d); } applyDec(v ? e : e.prototype, p, y, m ? "#" + h : _toPropertyKey(h), d, n, v ? a = a || [] : o = o || [], i, v, m, g, 1 === d, v && m ? s : r); } } return l(o), l(a), i; }(e, t, o, f); return r.length || u(e, f), { e: p, get c() { var t = []; return r.length && [u(applyDec(e, [r], n, e.name, 5, f, t), f), c.bind(null, t, e)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import { createComputed, createEffect, createRoot, createSignal, untrack } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { render } from 'solid-js/web';
import html from 'solid-js/html';
import { createSignalObject, reactive, signalify, createSignalFunction, signal, createDeferredEffect, component } from './index.js';

// TODO move type def to @lume/cli, map @types/jest's `expect` type into the
// global env.

describe('classy-solid', () => {
  describe('createSignalObject()', () => {
    it('has gettable and settable values via .get and .set methods', async () => {
      const num = createSignalObject(0);

      // Set the variable's value by passing a value in.
      num.set(1);
      // Read the variable's value by calling it with no args.
      expect(num.get()).toBe(1);

      // increment example:
      const setResult = num.set(num.get() + 1);
      expect(num.get()).toBe(2);
      expect(setResult).toBe(2);

      // Set with a function that accepts the previous value and returns the next value.
      num.set(n => n + 1);
      expect(num.get()).toBe(3);
    });
  });
  describe('createSignalFunction()', () => {
    it('has gettable and settable values via a single overloaded function', async () => {
      const num = createSignalFunction(0);

      // Set the variable's value by passing a value in.
      num(1);
      // Read the variable's value by calling it with no args.
      expect(num()).toBe(1);

      // increment example:
      const setResult = num(num() + 1);
      expect(num()).toBe(2);
      expect(setResult).toBe(2);

      // Set with a function that accepts the previous value and returns the next value.
      num(n => n + 1);
      expect(num()).toBe(3);
    });
  });
  describe('createDeferredEffect()', () => {
    it('works', async () => {
      const count = createSignalFunction(0);
      const foo = createSignalFunction(0);
      let runCount = 0;
      const stop = (() => {
        let stop;
        createRoot(_stop => {
          stop = _stop;

          // Runs once initially after the current root context just
          // like createEffect, then any time it re-runs due to a
          // change in a dependency, the re-run will be deferred in
          // the next microtask and will run only once (not once per
          // signal that changed)
          createDeferredEffect(() => {
            count();
            foo();
            runCount++;
          });
        });
        return stop;
      })();

      // Queues the effect to run in the next microtask
      count(1);
      count(2);
      foo(3);

      // Still 1 because the deferred effect didn't run yet, it will in the next microtask.
      expect(runCount).toBe(1);
      await Promise.resolve();

      // It ran only once in the previous microtask (batched), not once per signal write.
      expect(runCount).toBe(2);
      count(3);
      count(4);
      foo(5);
      expect(runCount).toBe(2);
      await Promise.resolve();
      expect(runCount).toBe(3);

      // Stops the effect from re-running. It can now be garbage collected.
      stop();
      count(3);
      count(4);
      foo(5);
      expect(runCount).toBe(3);
      await Promise.resolve();

      // Still the same because it was stopped, so it didn't run in the
      // macrotask prior to the await.
      expect(runCount).toBe(3);

      // Double check just in case (the wrong implementation would make it
      // skip two microtasks before running).
      await Promise.resolve();
      expect(runCount).toBe(3);
    });
  });
  describe('@reactive, @signal', () => {
    var _initClass, _init_colors, _initProto;
    let _Butterfly;
    class Butterfly {
      static {
        ({
          e: [_init_colors, _initProto],
          c: [_Butterfly, _initClass]
        } = _applyDecs(this, [[signal, 3, "wingSize"], [signal, 0, "colors"]], [reactive]));
      }
      colors = (_initProto(this), _init_colors(this, 3));
      _wingSize = 2;
      get wingSize() {
        return this._wingSize;
      }
      set wingSize(s) {
        this._wingSize = s;
      }
      static {
        _initClass();
      }
    }
    it('makes class fields reactive, using class and field/accessor decorators', () => {
      const b = new _Butterfly();
      testButterflyProps(b);
    });
    const ensure = it;
    ensure('overridden fields work as expected', async () => {
      var _initClass2, _init_colors2;
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
            e: [_init_colors2],
            c: [_SubButterfly, _initClass2]
          } = _applyDecs(this, [[signal, 0, "colors"]], [reactive], 0, void 0, Mid));
        }
        colors = _init_colors2(this, 123);
        static {
          _initClass2();
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
      var _initClass3, _initClass4, _init_colors3, _initProto2, _Insect2;
      let _Insect;
      class Insect {
        static {
          [_Insect, _initClass3] = _applyDecs(this, [], [reactive]).c;
        }
        constructor(double) {
          this.double = double;
        }
        static {
          _initClass3();
        }
      }
      let _Butterfly2;
      class Butterfly extends (_Insect2 = _Insect) {
        static {
          ({
            e: [_init_colors3, _initProto2],
            c: [_Butterfly2, _initClass4]
          } = _applyDecs(this, [[signal, 3, "wingSize"], [signal, 0, "colors"]], [reactive], 0, void 0, _Insect2));
        }
        colors = (_initProto2(this), _init_colors3(this, 3));
        _wingSize = 2;
        get wingSize() {
          return this._wingSize;
        }
        set wingSize(s) {
          this._wingSize = s;
        }
        constructor(arg) {
          super(arg * 2);
        }
        static {
          _initClass4();
        }
      }
      const b = new _Butterfly2(4);
      expect(b.double).toBe(8);
      testButterflyProps(b);
    });
    it('throws an error when @signal is used without @reactive', async () => {
      expect(() => {
        var _init_foo, _initClass5, _init_bar;
        // user forgot to use @reactive here
        class Foo {
          static {
            [_init_foo] = _applyDecs(this, [[signal, 0, "foo"]], []).e;
          }
          foo = _init_foo(this, 'hoo');
        }
        Foo;
        let _Bar;
        class Bar {
          static {
            ({
              e: [_init_bar],
              c: [_Bar, _initClass5]
            } = _applyDecs(this, [[signal, 0, "bar"]], [reactive]));
          }
          bar = _init_bar(this, 123);
          static {
            _initClass5();
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
      var _initClass6, _init_do;
      let _Doer;
      // This test ensures that functions are handled propertly, because
      // if passed without being wrapped to a signal setter it will be
      // called immediately with the previous value and be expected to
      // return a new value, instead of being set as the actual new value.

      class Doer {
        static {
          ({
            e: [_init_do],
            c: [_Doer, _initClass6]
          } = _applyDecs(this, [[signal, 0, "do"]], [reactive]));
        }
        do = _init_do(this, null);
        static {
          _initClass6();
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
      var _initClass7, _init_amount, _initClass8, _init_double, _Foo2;
      let _Foo;
      class Foo {
        static {
          ({
            e: [_init_amount],
            c: [_Foo, _initClass7]
          } = _applyDecs(this, [[signal, 0, "amount"]], [reactive]));
        }
        amount = _init_amount(this, 3);
        static {
          _initClass7();
        }
      }
      let _Bar2;
      class Bar extends (_Foo2 = _Foo) {
        static {
          ({
            e: [_init_double],
            c: [_Bar2, _initClass8]
          } = _applyDecs(this, [[signal, 0, "double"]], [reactive], 0, void 0, _Foo2));
        }
        double = _init_double(this, 0);
        constructor() {
          super();
          this.double = this.amount * 2; // this read of .amount should not be tracked
        }
        static {
          _initClass8();
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
  describe('signalify()', () => {
    it('returns the same object that was passed in', () => {
      let obj = {
        n: 123
      };
      let obj2 = signalify(obj, 'n');
      expect(obj).toBe(obj2);
      obj = createMutable({
        n: 123
      });
      obj2 = signalify(obj, 'n');
      expect(obj).toBe(obj2);
    });
    describe('making objects reactive with signalify()', () => {
      it('', () => {
        const butterfly = {
          colors: 3,
          _wingSize: 2,
          get wingSize() {
            return this._wingSize;
          },
          set wingSize(s) {
            this._wingSize = s;
          }
        };
        const b = signalify(butterfly, 'colors', 'wingSize');
        testButterflyProps(b);

        // quick type check:
        // @ts-expect-error "foo" is not a property on butterfly
        signalify(butterfly, 'colors', 'wingSize', 'foo');
      });
      it('is not tracked inside of an effect to prevent loops', () => {
        test(true);
        test(false);
        function test(signalifyInitially) {
          // Library author provides obj
          const obj = {
            n: 123
          };
          if (signalifyInitially) signalify(obj, 'n'); // library author might signalify obj.n

          // User code:
          createEffect(() => {
            // o.n may or may not already be signalified, user does not know, but they want to be sure they can react to its changes.
            signalify(obj, 'n');
            obj.n = 123; // does not make an infinite loop

            // A deeper effect will be reading the property.
            createEffect(() => {
              console.log(obj.n);
            });
          });

          // No expectations in this test, the test passes if a maximum
          // callstack size error (infinite loop) does not happen.
        }
      });
    });
    describe('making reactive classes with signalify instead of with decorators', () => {
      it('makes class fields reactive, not using any decorators', () => {
        class Butterfly {
          colors = 3;
          _wingSize = 2;
          get wingSize() {
            return this._wingSize;
          }
          set wingSize(s) {
            this._wingSize = s;
          }
          constructor() {
            signalify(this, 'colors', 'wingSize');
          }
        }
        const b = new Butterfly();
        testButterflyProps(b);

        // quick type check:
        const b2 = new Butterfly();
        // @ts-expect-error "foo" is not a property on Butterfly
        signalify(b2, 'colors', 'wingSize', 'foo');
      });
      it('makes constructor properties reactive, not using any decorators', () => {
        class Butterfly {
          get wingSize() {
            return this._wingSize;
          }
          set wingSize(s) {
            this._wingSize = s;
          }
          constructor() {
            this.colors = 3;
            this._wingSize = 2;
            signalify(this, 'colors', 'wingSize');
          }
        }
        const b = new Butterfly();
        testButterflyProps(b);
      });
      it('works with a function-style class, with signalify in the constructor', () => {
        function Butterfly() {
          // @ts-ignore
          this.colors = 3;
          // @ts-ignore
          this._wingSize = 2;

          // @ts-ignore no type checking for ES5-style classes.
          signalify(this, 'colors', 'wingSize');
        }
        Butterfly.prototype = {
          get wingSize() {
            return this._wingSize;
          },
          set wingSize(s) {
            this._wingSize = s;
          }
        };

        // @ts-ignore
        const b = new Butterfly();
        testButterflyProps(b);
      });
      it('works with a function-style class, with properties on the prototype, and signalify in constructor', () => {
        function Butterfly() {
          // @ts-ignore no type checking for ES5-style classes.
          signalify(this, 'colors', 'wingSize');
        }
        Butterfly.prototype = {
          colors: 3,
          _wingSize: 2,
          get wingSize() {
            return this._wingSize;
          },
          set wingSize(s) {
            this._wingSize = s;
          }
        };

        // @ts-ignore no type checking for ES5-style classes.
        const b = new Butterfly();
        testButterflyProps(b);
      });
      it('can be used on a function-style class, with properties on the prototype, and signalify on the prototype', () => {
        function Butterfly() {}
        Butterfly.prototype = {
          colors: 3,
          _wingSize: 2,
          get wingSize() {
            return this._wingSize;
          },
          set wingSize(s) {
            this._wingSize = s;
          }
        };
        signalify(Butterfly.prototype, 'colors', 'wingSize');

        // @ts-ignore no type checking for ES5-style classes.
        const b = new Butterfly();
        testButterflyProps(b);
      });
      it('can be used on a function-style class, with properties in the constructor, and signalify on the prototype', () => {
        function Butterfly() {
          // @ts-ignore
          this.colors = 3;
          // @ts-ignore
          this._wingSize = 2;
        }
        Butterfly.prototype = {
          get wingSize() {
            return this._wingSize;
          },
          set wingSize(s) {
            this._wingSize = s;
          }
        };
        signalify(Butterfly.prototype, 'colors', 'wingSize');

        // @ts-ignore
        const b = new Butterfly();
        testButterflyProps(b);
      });
      it('show that signalify causes constructor to be reactive when used manually instead of decorators', () => {
        class Foo {
          amount = 3;
          constructor() {
            signalify(this, 'amount');
          }
        }
        class Bar extends Foo {
          double = 0;
          constructor() {
            super();
            signalify(this, 'double');
            this.double = this.amount * 2; // this tracks access of .amount
          }
        }
        let count = 0;
        let b;
        createEffect(() => {
          b = new Bar(); // tracks .amount
          count++;
        });
        expect(count).toBe(1);
        b.amount = 4; // triggers

        expect(count).toBe(2);
      });
      it('show how to manually untrack constructors when not using decorators', () => {
        class Foo {
          amount = 3;
          constructor() {
            signalify(this, 'amount');
          }
        }
        class Bar extends Foo {
          double = 0;
          constructor() {
            super();
            signalify(this, 'double');
            untrack(() => {
              this.double = this.amount * 2;
            });
          }
        }
        let count = 0;
        let b;
        createEffect(() => {
          b = new Bar(); // does not track .amount
          count++;
        });
        expect(count).toBe(1);
        b.amount = 4; // will not trigger

        expect(count).toBe(1);
      });
    });
    it('creates signal storage per descriptor+object pair, not per descriptor', () => {
      // This ensures we don't accidentally share a signal with multiple
      // objects. For example, we don't want a single signal per descriptor
      // because if the descriptor is on a prototype object, then that single
      // signal will erroneously be used by all objects extending from that
      // prototype.

      const a = signalify({
        foo: 0,
        name: 'a'
      }, 'foo');
      const b = Object.assign(Object.create(a), {
        name: 'b'
      });
      expect(a.foo).toBe(0);
      expect(b.foo).toBe(0);
      let countA = 0;
      createEffect(() => {
        a.foo;
        countA++;
      });
      let countB = 0;
      createEffect(() => {
        b.foo;
        countB++;
      });
      expect(countA).toBe(1);
      expect(countB).toBe(1);
      a.foo++;
      expect(a.foo).toBe(1);
      expect(countA).toBe(2);

      // ensure that updating a's foo property did not update b's foo
      // property or trigger b's effect, despite that the property is
      // defined in a single location on the prototype.
      // @ts-ignore
      expect(b.foo).toBe(0);
      expect(countB).toBe(1);
    });
  });
  describe('@component', () => {
    it('allows to define a class using class syntax', () => {
      var _initClass9;
      let onMountCalled = false;
      let onCleanupCalled = false;
      let _CoolComp;
      class CoolComp {
        static {
          [_CoolComp, _initClass9] = _applyDecs(this, [], [component]).c;
        }
        onMount() {
          onMountCalled = true;
        }
        onCleanup() {
          onCleanupCalled = true;
        }
        template(props) {
          expect(props.foo).toBe(123);
          return html`<div>hello classes!</div>`;
        }
        static {
          _initClass9();
        }
      }
      const root = document.createElement('div');
      document.body.append(root);
      const dispose = render(() => html`<${_CoolComp} foo=${123} />`, root);
      expect(root.textContent).toBe('hello classes!');
      expect(onMountCalled).toBe(true);
      expect(onCleanupCalled).toBe(false);
      dispose();
      root.remove();
      expect(onCleanupCalled).toBe(true);

      // throws on non-class use
      expect(() => {
        var _initProto3;
        class CoolComp {
          static {
            [_initProto3] = _applyDecs(this, [[component, 2, "onMount"]], []).e;
          }
          constructor(...args) {
            _initProto3(this);
          }
          // @ts-ignore
          onMount() {}
        }
        CoolComp;
      }).toThrow('component decorator should only be used on a class');
    });
    it('works in tandem with @reactive and @signal for reactivity', async () => {
      var _initClass10, _init_foo2, _init_bar2;
      let _CoolComp2;
      class CoolComp {
        static {
          ({
            e: [_init_foo2, _init_bar2],
            c: [_CoolComp2, _initClass10]
          } = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]));
        }
        foo = _init_foo2(this, 0);
        bar = _init_bar2(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass10();
        }
      }
      const root = document.createElement('div');
      document.body.append(root);
      const [a, setA] = createSignal(1);
      const b = createSignalFunction(2);

      // FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
      // check the `length` of the function and do something based on
      // that? Or does it get passed to a @signal property's setter and
      // receives the previous value?
      const dispose = render(() => html`<${_CoolComp2} foo=${a} bar=${() => b()} />`, root);
      expect(root.textContent).toBe('foo: 1, bar: 2');
      setA(3);
      b(4);
      expect(root.textContent).toBe('foo: 3, bar: 4');
      dispose();
      root.remove();
    });
    it('works without decorators', () => {
      const CoolComp = component(class CoolComp {
        foo = 0;
        bar = 0;
        constructor() {
          signalify(this);
        }
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
      });
      const root = document.createElement('div');
      document.body.append(root);
      const [a, setA] = createSignal(1);
      const b = createSignalFunction(2);

      // FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
      // check the `length` of the function and do something based on
      // that? Or does it get passed to a @signal property's setter and
      // receives the previous value?
      const dispose = render(() => html`<${CoolComp} foo=${a} bar=${() => b()} />`, root);
      expect(root.textContent).toBe('foo: 1, bar: 2');
      setA(3);
      b(4);
      expect(root.textContent).toBe('foo: 3, bar: 4');
      dispose();
      root.remove();
    });

    // FIXME not working, the spread doesn't seem to do anything.
    xit('works with reactive spreads', async () => {
      var _initClass11, _init_foo3, _init_bar3;
      let _CoolComp3;
      class CoolComp {
        static {
          ({
            e: [_init_foo3, _init_bar3],
            c: [_CoolComp3, _initClass11]
          } = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]));
        }
        foo = _init_foo3(this, 0);
        bar = _init_bar3(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass11();
        }
      }
      const root = document.createElement('div');
      document.body.append(root);
      let o = createMutable({
        o: {
          foo: 123
        }
      });

      // neither of these work
      // const dispose = render(() => html`<${CoolComp} ...${() => o.o} />`, root)
      const dispose = render(() => html`<${_CoolComp3} ...${o.o} />`, root);
      expect(root.textContent).toBe('foo: 123, bar: 0');
      o.o = {
        bar: 456
      };
      expect(root.textContent).toBe('foo: 123, bar: 456');
      dispose();
      root.remove();
    });
  });
});
function testButterflyProps(b, initialColors = 3) {
  let count = 0;
  createRoot(() => {
    createComputed(() => {
      b.colors;
      b.wingSize;
      count++;
    });
  });
  expect(b.colors).toBe(initialColors, 'initial colors value');
  expect(b.wingSize).toBe(2, 'initial wingSize value');
  expect(b._wingSize).toBe(2, 'ensure the original accessor works');
  expect(count).toBe(1, 'Should be reactive');
  b.colors++;
  expect(b.colors).toBe(initialColors + 1, 'incremented colors value');
  expect(count).toBe(2, 'Should be reactive');
  b.wingSize++;
  expect(b.wingSize).toBe(3, 'incremented wingSize value');
  expect(b._wingSize).toBe(3, 'ensure the original accessor works');
  expect(count).toBe(3, 'Should be reactive');
}

//////////////////////////////////////////////////////////////////////////
// createSignalObject type tests ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

{
  const num = createSignalObject(1);
  let n1 = num.get();
  n1;
  num.set(123);
  num.set(n => n1 = n + 1);
  // @ts-expect-error Expected 1 arguments, but got 0. ts(2554)
  num.set();
  const num3 = createSignalObject();
  // @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
  let n3 = num3.get();
  num3.set(123);
  num3.set(undefined); // ok, accepts undefined
  // @ts-expect-error Object is possibly 'undefined'. ts(2532) (the `n` value)
  num3.set(n => n3 = n + 1);
  // num3.set() // ok, accepts undefined // FIXME broke in Solid 1.7.9

  // @ts-expect-error Argument of type 'boolean' is not assignable to parameter of type 'number'. ts(2345)
  const num4 = createSignalObject(true);
  const bool = createSignalObject(true);
  let b1 = bool.get();
  b1;
  bool.set(false);
  bool.set(b => b1 = !b);
  // @ts-expect-error Expected 1 arguments, but got 0. ts(2554)
  bool.set();
  const bool2 = createSignalObject();
  // @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
  let n4 = bool2.get();
  bool2.set(false);
  bool2.set(undefined); // ok, accepts undefined
  bool2.set(n => n4 = !n); // ok because undefined is being converted to boolean
  // @ts-expect-error Type 'boolean | undefined' is not assignable to type 'boolean'. ts(2322)
  bool2.set(n => n4 = n);
  // bool2.set() // ok, accepts undefined // FIXME try Solid 1.7.9

  const func = createSignalObject(() => 1);
  // @ts-expect-error 1 is not assignable to function (no overload matches)
  func.set(() => 1);
  func.set(() => () => 1); // ok, set the value to a function
  const fn = func.get(); // ok, returns function value
  fn;
  const n5 = func.get()();
  n5;
  const func2 = createSignalObject(() => 1);
  // @FIXME-ts-expect-error number is not assignable to function (no overload matches)
  func2.set(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  func2.set(() => () => 1); // ok, set the value to a function
  const fn2 = func2.get(); // ok, returns function value
  fn2;
  const n6 = func2.get()();
  n6;
  const stringOrFunc1 = createSignalObject('');
  // @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc1.set(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf1 = stringOrFunc1.set(() => () => 1);
  sf1;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf2 = stringOrFunc1.set('oh yeah');
  sf2;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf3 = stringOrFunc1.set(() => 'oh yeah');
  sf3;
  // @ts-expect-error cannot set signal to undefined
  stringOrFunc1.set();
  // @ts-expect-error cannot set signal to undefined
  stringOrFunc1.set(undefined);
  // @ts-expect-error return value might be string
  const sf6 = stringOrFunc1.get();
  sf6;
  const sf7 = stringOrFunc1.get();
  sf7;
  const sf8 = stringOrFunc1.get();
  sf8;
  const stringOrFunc2 = createSignalObject();
  // @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc2.set(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf9 = stringOrFunc2.set(() => () => 1);
  sf9;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf10 = stringOrFunc2.set('oh yeah');
  sf10;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf11 = stringOrFunc2.set(() => 'oh yeah');
  sf11;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf12 = stringOrFunc2.set();
  sf12;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf13 = stringOrFunc2.set(undefined);
  sf13;
  const sf14 = stringOrFunc2.get();
  sf14;
  // @ts-expect-error return value might be undefined
  const sf15 = stringOrFunc2.get();
  sf15;
}

//////////////////////////////////////////////////////////////////////////
// createSignalFunction type tests ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

{
  const num = createSignalFunction(1);
  let n1 = num();
  n1;
  num(123);
  num(n => n1 = n + 1);
  num();
  const num3 = createSignalFunction();
  // @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
  let n3 = num3();
  num3(123);
  num3(undefined); // ok, accepts undefined
  // @ts-expect-error Object is possibly 'undefined'. ts(2532) (the `n` value)
  num3(n => n3 = n + 1);
  num3(); // ok, getter

  // @ts-expect-error Argument of type 'boolean' is not assignable to parameter of type 'number'. ts(2345)
  const num4 = createSignalFunction(true);
  const bool = createSignalFunction(true);
  let b1 = bool();
  b1;
  bool(false);
  bool(b => b1 = !b);
  bool();
  const bool2 = createSignalFunction();
  // @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
  let n4 = bool2();
  bool2(false);
  bool2(undefined); // ok, accepts undefined
  bool2(n => n4 = !n); // ok because undefined is being converted to boolean
  // @ts-expect-error Type 'boolean | undefined' is not assignable to type 'boolean'. ts(2322)
  bool2(n => n4 = n);
  bool2(); // ok, accepts undefined

  const func = createSignalFunction(() => 1);
  // @ts-expect-error 1 is not assignable to function (no overload matches)
  func(() => 1);
  func(() => () => 1); // ok, set the value to a function
  const fn = func(); // ok, returns function value
  fn;
  const n5 = func()();
  n5;
  const func2 = createSignalFunction(() => 1);
  // @ts-expect-error number is not assignable to function (no overload matches)
  func2(() => 1);
  func2(() => () => 1); // ok, set the value to a function
  const fn2 = func2(); // ok, returns function value
  fn2;
  const n6 = func2()();
  n6;
  const stringOrFunc1 = createSignalFunction('');
  // @ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc1(() => 1);
  const sf1 = stringOrFunc1(() => () => 1);
  sf1;
  const sf2 = stringOrFunc1('oh yeah');
  sf2;
  const sf3 = stringOrFunc1(() => 'oh yeah');
  sf3;
  stringOrFunc1(); // ok, getter
  // @ts-expect-error cannot set signal to undefined
  stringOrFunc1(undefined);
  // @ts-expect-error return value might be string
  const sf6 = stringOrFunc1();
  sf6;
  const sf7 = stringOrFunc1();
  sf7;
  const sf8 = stringOrFunc1();
  sf8;
  const stringOrFunc2 = createSignalFunction();
  // @ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc2(() => 1);
  const sf9 = stringOrFunc2(() => () => 1);
  sf9;
  const sf10 = stringOrFunc2('oh yeah');
  sf10;
  const sf11 = stringOrFunc2(() => 'oh yeah');
  sf11;
  // @ts-expect-error 'string | (() => number) | undefined' is not assignable to type 'undefined'.
  const sf12 = stringOrFunc2();
  sf12;
  const sf13 = stringOrFunc2(undefined);
  sf13;
  const sf14 = stringOrFunc2();
  sf14;
  // @ts-expect-error return value might be undefined
  const sf15 = stringOrFunc2();
  sf15;
}
//# sourceMappingURL=index.test.js.map