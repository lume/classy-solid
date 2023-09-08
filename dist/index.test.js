function applyDecs2203Factory() { function createAddInitializerMethod(e, t) { return function (r) { !function (e, t) { if (e.v) throw new Error("attempted to call " + t + " after decoration was finished"); }(t, "addInitializer"), assertCallable(r, "An initializer"), e.push(r); }; } function memberDec(e, t, r, a, n, i, s, o) { var c; switch (n) { case 1: c = "accessor"; break; case 2: c = "method"; break; case 3: c = "getter"; break; case 4: c = "setter"; break; default: c = "field"; } var l, u, f = { kind: c, name: s ? "#" + t : t, static: i, private: s }, p = { v: !1 }; 0 !== n && (f.addInitializer = createAddInitializerMethod(a, p)), 0 === n ? s ? (l = r.get, u = r.set) : (l = function () { return this[t]; }, u = function (e) { this[t] = e; }) : 2 === n ? l = function () { return r.value; } : (1 !== n && 3 !== n || (l = function () { return r.get.call(this); }), 1 !== n && 4 !== n || (u = function (e) { r.set.call(this, e); })), f.access = l && u ? { get: l, set: u } : l ? { get: l } : { set: u }; try { return e(o, f); } finally { p.v = !0; } } function assertCallable(e, t) { if ("function" != typeof e) throw new TypeError(t + " must be a function"); } function assertValidReturnValue(e, t) { var r = typeof t; if (1 === e) { if ("object" !== r || null === t) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); void 0 !== t.get && assertCallable(t.get, "accessor.get"), void 0 !== t.set && assertCallable(t.set, "accessor.set"), void 0 !== t.init && assertCallable(t.init, "accessor.init"); } else if ("function" !== r) { var a; throw a = 0 === e ? "field" : 10 === e ? "class" : "method", new TypeError(a + " decorators must return a function or void 0"); } } function applyMemberDec(e, t, r, a, n, i, s, o) { var c, l, u, f, p, d, h = r[0]; if (s ? c = 0 === n || 1 === n ? { get: r[3], set: r[4] } : 3 === n ? { get: r[3] } : 4 === n ? { set: r[3] } : { value: r[3] } : 0 !== n && (c = Object.getOwnPropertyDescriptor(t, a)), 1 === n ? u = { get: c.get, set: c.set } : 2 === n ? u = c.value : 3 === n ? u = c.get : 4 === n && (u = c.set), "function" == typeof h) void 0 !== (f = memberDec(h, a, c, o, n, i, s, u)) && (assertValidReturnValue(n, f), 0 === n ? l = f : 1 === n ? (l = f.init, p = f.get || u.get, d = f.set || u.set, u = { get: p, set: d }) : u = f);else for (var v = h.length - 1; v >= 0; v--) { var g; if (void 0 !== (f = memberDec(h[v], a, c, o, n, i, s, u))) assertValidReturnValue(n, f), 0 === n ? g = f : 1 === n ? (g = f.init, p = f.get || u.get, d = f.set || u.set, u = { get: p, set: d }) : u = f, void 0 !== g && (void 0 === l ? l = g : "function" == typeof l ? l = [l, g] : l.push(g)); } if (0 === n || 1 === n) { if (void 0 === l) l = function (e, t) { return t; };else if ("function" != typeof l) { var y = l; l = function (e, t) { for (var r = t, a = 0; a < y.length; a++) r = y[a].call(e, r); return r; }; } else { var m = l; l = function (e, t) { return m.call(e, t); }; } e.push(l); } 0 !== n && (1 === n ? (c.get = u.get, c.set = u.set) : 2 === n ? c.value = u : 3 === n ? c.get = u : 4 === n && (c.set = u), s ? 1 === n ? (e.push(function (e, t) { return u.get.call(e, t); }), e.push(function (e, t) { return u.set.call(e, t); })) : 2 === n ? e.push(u) : e.push(function (e, t) { return u.call(e, t); }) : Object.defineProperty(t, a, c)); } function pushInitializers(e, t) { t && e.push(function (e) { for (var r = 0; r < t.length; r++) t[r].call(e); return e; }); } return function (e, t, r) { var a = []; return function (e, t, r) { for (var a, n, i = new Map(), s = new Map(), o = 0; o < r.length; o++) { var c = r[o]; if (Array.isArray(c)) { var l, u, f = c[1], p = c[2], d = c.length > 3, h = f >= 5; if (h ? (l = t, 0 != (f -= 5) && (u = n = n || [])) : (l = t.prototype, 0 !== f && (u = a = a || [])), 0 !== f && !d) { var v = h ? s : i, g = v.get(p) || 0; if (!0 === g || 3 === g && 4 !== f || 4 === g && 3 !== f) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + p); !g && f > 2 ? v.set(p, f) : v.set(p, !0); } applyMemberDec(e, l, c, p, f, h, d, u); } } pushInitializers(e, a), pushInitializers(e, n); }(a, e, t), function (e, t, r) { if (r.length > 0) { for (var a = [], n = t, i = t.name, s = r.length - 1; s >= 0; s--) { var o = { v: !1 }; try { var c = r[s](n, { kind: "class", name: i, addInitializer: createAddInitializerMethod(a, o) }); } finally { o.v = !0; } void 0 !== c && (assertValidReturnValue(10, c), n = c); } e.push(n, function () { for (var e = 0; e < a.length; e++) a[e].call(n); }); } }(a, e, r), a; }; }
var applyDecs2203Impl;
function _applyDecs(e, t, r) { return (applyDecs2203Impl = applyDecs2203Impl || applyDecs2203Factory())(e, t, r); }
import { createComputed, createRoot, createSignal } from 'solid-js';
import { createMutable } from 'solid-js/store';
import { render } from 'solid-js/web';
import html from 'solid-js/html';
import { createSignalObject, reactive, signalify, createSignalFunction, signal, createDeferredEffect, component } from './index.js';
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
      expect(runCount).withContext('a').toBe(1);
      await Promise.resolve();

      // It ran only once in the previous microtask (batched), not once per signal write.
      expect(runCount).withContext('b').toBe(2);
      count(3);
      count(4);
      foo(5);
      expect(runCount).withContext('c').toBe(2);
      await Promise.resolve();
      expect(runCount).withContext('d').toBe(3);

      // Stops the autorun from re-running. It can now be garbage collected.
      stop();
      count(3);
      count(4);
      foo(5);
      expect(runCount).withContext('c').toBe(3);
      await Promise.resolve();

      // Still the same because it was stopped, so it didn't run in the
      // macrotask prior to the await.
      expect(runCount).withContext('e').toBe(3);

      // Double check just in case (the wrong implementation would make it
      // skip two microtasks before running).
      await Promise.resolve();
      expect(runCount).withContext('f').toBe(3);
    });
  });
  describe('@reactive, @signal, and signalify', () => {
    it('makes class properties reactive, using class and property/accessor decorators', () => {
      var _initClass, _init_colors, _initProto;
      let _Butterfly;
      class Butterfly {
        static #_ = [_init_colors, _initProto, _Butterfly, _initClass] = _applyDecs(this, [[signal, 3, "wingSize"], [signal, 0, "colors"]], [reactive]);
        colors = (_initProto(this), _init_colors(this, 3));
        _wingSize = 2;
        get wingSize() {
          return this._wingSize;
        }
        set wingSize(s) {
          this._wingSize = s;
        }
        static #_2 = _initClass();
      }
      const b = new _Butterfly();
      testButterflyProps(b);
    });
    it('does not prevent superclass constructor from receiving subclass constructor args', () => {
      var _initClass2, _initClass3, _init_colors2, _initProto2;
      let _Insect;
      class Insect {
        static #_ = [_Insect, _initClass2] = _applyDecs(this, [], [reactive]);
        constructor(double) {
          this.double = double;
        }
        static #_2 = _initClass2();
      }
      let _Butterfly2;
      class Butterfly extends _Insect {
        static #_ = [_init_colors2, _initProto2, _Butterfly2, _initClass3] = _applyDecs(this, [[signal, 3, "wingSize"], [signal, 0, "colors"]], [reactive]);
        colors = (_initProto2(this), _init_colors2(this, 3));
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
        static #_2 = _initClass3();
      }
      const b = new _Butterfly2(4);
      expect(b.double).toBe(8);
      testButterflyProps(b);
    });
    it('makes class properties reactive, not using any decorators, specified in the constructor', () => {
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
      signalify(b2, 'colors', 'wingSize',
      // @ts-expect-error "foo" is not a property on Butterfly
      'foo');
    });
    it('makes class properties reactive, with signalify in the constructor', () => {
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
    it('throws an error when @signal is used without @reactive', async () => {
      expect(() => {
        var _init_foo, _initClass4, _init_bar;
        // user forgot to use @reactive here
        class Foo {
          static #_ = [_init_foo] = _applyDecs(this, [[signal, 0, "foo"]], []);
          foo = _init_foo(this, 'hoo');
        }
        Foo;
        let _Bar;
        class Bar {
          static #_ = [_init_bar, _Bar, _initClass4] = _applyDecs(this, [[signal, 0, "bar"]], [reactive]);
          bar = _init_bar(this, 123);
          static #_2 = _initClass4();
        }
        new _Bar();
      }).toThrowMatching(err => err.message.includes('Did you forget'));

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
      var _initClass5, _init_do;
      let _Doer;
      // This test ensures that functions are handled propertly, because
      // if passed without being wrapped to a signal setter it will be
      // called immediately with the previous value and be expected to
      // return a new value, instead of being set as the actual new value.

      class Doer {
        static #_ = [_init_do, _Doer, _initClass5] = _applyDecs(this, [[signal, 0, "do"]], [reactive]);
        do = _init_do(this, null);
        static #_2 = _initClass5();
      }
      const doer = new _Doer();
      expect(doer.do).toBe(null);
      const newFunc = () => 123;
      doer.do = newFunc;
      expect(doer.do).toBe(newFunc);
      expect(doer.do()).toBe(123);
    });
  });
  describe('@component', () => {
    it('allows to define a class using class syntax', () => {
      var _initClass6;
      let onMountCalled = false;
      let onCleanupCalled = false;
      let _CoolComp;
      class CoolComp {
        static #_ = [_CoolComp, _initClass6] = _applyDecs(this, [], [component]);
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
        static #_2 = _initClass6();
      }
      const root = document.createElement('div');
      document.body.append(root);
      const dispose = render(() => html`<${_CoolComp} foo=${123} />`, root);
      expect(root.textContent).toBe('hello classes!');
      expect(onMountCalled).toBeTrue();
      expect(onCleanupCalled).toBeFalse();
      dispose();
      root.remove();
      expect(onCleanupCalled).toBeTrue();

      // throws on non-class use
      expect(() => {
        var _initProto3;
        class CoolComp {
          static #_ = [_initProto3] = _applyDecs(this, [[component, 2, "onMount"]], []);
          constructor(...args) {
            _initProto3(this);
          }
          // @ts-ignore
          onMount() {}
        }
        CoolComp;
      }).toThrow();
    });
    it('works in tandem with @reactive and @signal for reactivity', async () => {
      var _initClass7, _init_foo2, _init_bar2;
      let _CoolComp2;
      class CoolComp {
        static #_ = [_init_foo2, _init_bar2, _CoolComp2, _initClass7] = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]);
        foo = _init_foo2(this, 0);
        bar = _init_bar2(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static #_2 = _initClass7();
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
      var _initClass8, _init_foo3, _init_bar3;
      let _CoolComp3;
      class CoolComp {
        static #_ = [_init_foo3, _init_bar3, _CoolComp3, _initClass8] = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]);
        foo = _init_foo3(this, 0);
        bar = _init_bar3(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static #_2 = _initClass8();
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
function testButterflyProps(b) {
  let count = 0;
  createRoot(() => {
    createComputed(() => {
      b.colors;
      b.wingSize;
      count++;
    });
  });
  expect(b.colors).toBe(3, 'initial colors value');
  expect(b.wingSize).toBe(2, 'initial wingSize value');
  expect(b._wingSize).toBe(2, 'ensure the original accessor works');
  expect(count).toBe(1, 'Should be reactive');
  b.colors++;
  expect(b.colors).toBe(4, 'incremented colors value');
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
  // @FIXME-ts-expect-error number is not assignable to function (no overload matches)
  func2(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  func2(() => () => 1); // ok, set the value to a function
  const fn2 = func2(); // ok, returns function value
  fn2;
  const n6 = func2()();
  n6;
  const stringOrFunc1 = createSignalFunction('');
  // @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc1(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf1 = stringOrFunc1(() => () => 1);
  sf1;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf2 = stringOrFunc1('oh yeah');
  sf2;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf3 = stringOrFunc1(() => 'oh yeah');
  sf3;
  stringOrFunc1(); // ok, getter
  // @FIXME-ts-expect-error cannot set signal to undefined
  stringOrFunc1(undefined); // FIXME should be a type error. Try Solid 1.7.9
  // @ts-expect-error return value might be string
  const sf6 = stringOrFunc1();
  sf6;
  const sf7 = stringOrFunc1();
  sf7;
  const sf8 = stringOrFunc1();
  sf8;
  const stringOrFunc2 = createSignalFunction();
  // @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
  stringOrFunc2(() => 1); // FIXME should be a type error. Try Solid 1.7.9
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf9 = stringOrFunc2(() => () => 1);
  sf9;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf10 = stringOrFunc2('oh yeah');
  sf10;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf11 = stringOrFunc2(() => 'oh yeah');
  sf11;
  // @ts-expect-error 'string | (() => number) | undefined' is not assignable to type 'undefined'.
  const sf12 = stringOrFunc2();
  sf12;
  // @ts-expect-error FIXME try Solid 1.7.9
  const sf13 = stringOrFunc2(undefined);
  sf13;
  const sf14 = stringOrFunc2();
  sf14;
  // @ts-expect-error return value might be undefined
  const sf15 = stringOrFunc2();
  sf15;
}
//# sourceMappingURL=index.test.js.map