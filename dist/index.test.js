function createAddInitializerMethod(initializers, decoratorFinishedRef) { return function (initializer) { assertNotFinished(decoratorFinishedRef, "addInitializer"), assertCallable(initializer, "An initializer"), initializers.push(initializer); }; }
function assertInstanceIfPrivate(has, target) { if (!has(target)) throw new TypeError("Attempted to access private element on non-instance"); }
function memberDec(dec, thisArg, name, desc, initializers, kind, isStatic, isPrivate, value, hasPrivateBrand) { var kindStr; switch (kind) { case 1: kindStr = "accessor"; break; case 2: kindStr = "method"; break; case 3: kindStr = "getter"; break; case 4: kindStr = "setter"; break; default: kindStr = "field"; } var get, set, ctx = { kind: kindStr, name: isPrivate ? "#" + name : name, static: isStatic, private: isPrivate }, decoratorFinishedRef = { v: !1 }; if (0 !== kind && (ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef)), isPrivate || 0 !== kind && 2 !== kind) { if (2 === kind) get = function (target) { return assertInstanceIfPrivate(hasPrivateBrand, target), desc.value; };else { var t = 0 === kind || 1 === kind; (t || 3 === kind) && (get = isPrivate ? function (target) { return assertInstanceIfPrivate(hasPrivateBrand, target), desc.get.call(target); } : function (target) { return desc.get.call(target); }), (t || 4 === kind) && (set = isPrivate ? function (target, value) { assertInstanceIfPrivate(hasPrivateBrand, target), desc.set.call(target, value); } : function (target, value) { desc.set.call(target, value); }); } } else get = function (target) { return target[name]; }, 0 === kind && (set = function (target, v) { target[name] = v; }); var has = isPrivate ? hasPrivateBrand.bind() : function (target) { return name in target; }; ctx.access = get && set ? { get: get, set: set, has: has } : get ? { get: get, has: has } : { set: set, has: has }; try { return dec.call(thisArg, value, ctx); } finally { decoratorFinishedRef.v = !0; } }
function assertNotFinished(decoratorFinishedRef, fnName) { if (decoratorFinishedRef.v) throw new Error("attempted to call " + fnName + " after decoration was finished"); }
function assertCallable(fn, hint) { if ("function" != typeof fn) throw new TypeError(hint + " must be a function"); }
function assertValidReturnValue(kind, value) { var type = typeof value; if (1 === kind) { if ("object" !== type || null === value) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0"); void 0 !== value.get && assertCallable(value.get, "accessor.get"), void 0 !== value.set && assertCallable(value.set, "accessor.set"), void 0 !== value.init && assertCallable(value.init, "accessor.init"); } else if ("function" !== type) { var hint; throw hint = 0 === kind ? "field" : 5 === kind ? "class" : "method", new TypeError(hint + " decorators must return a function or void 0"); } }
function curryThis1(fn) { return function () { return fn(this); }; }
function curryThis2(fn) { return function (value) { fn(this, value); }; }
function applyMemberDec(ret, base, decInfo, decoratorsHaveThis, name, kind, isStatic, isPrivate, initializers, hasPrivateBrand) { var desc, init, value, newValue, get, set, decs = decInfo[0]; decoratorsHaveThis || Array.isArray(decs) || (decs = [decs]), isPrivate ? desc = 0 === kind || 1 === kind ? { get: curryThis1(decInfo[3]), set: curryThis2(decInfo[4]) } : 3 === kind ? { get: decInfo[3] } : 4 === kind ? { set: decInfo[3] } : { value: decInfo[3] } : 0 !== kind && (desc = Object.getOwnPropertyDescriptor(base, name)), 1 === kind ? value = { get: desc.get, set: desc.set } : 2 === kind ? value = desc.value : 3 === kind ? value = desc.get : 4 === kind && (value = desc.set); for (var inc = decoratorsHaveThis ? 2 : 1, i = decs.length - 1; i >= 0; i -= inc) { var newInit; if (void 0 !== (newValue = memberDec(decs[i], decoratorsHaveThis ? decs[i - 1] : void 0, name, desc, initializers, kind, isStatic, isPrivate, value, hasPrivateBrand))) assertValidReturnValue(kind, newValue), 0 === kind ? newInit = newValue : 1 === kind ? (newInit = newValue.init, get = newValue.get || value.get, set = newValue.set || value.set, value = { get: get, set: set }) : value = newValue, void 0 !== newInit && (void 0 === init ? init = newInit : "function" == typeof init ? init = [init, newInit] : init.push(newInit)); } if (0 === kind || 1 === kind) { if (void 0 === init) init = function (instance, init) { return init; };else if ("function" != typeof init) { var ownInitializers = init; init = function (instance, init) { for (var value = init, i = ownInitializers.length - 1; i >= 0; i--) value = ownInitializers[i].call(instance, value); return value; }; } else { var originalInitializer = init; init = function (instance, init) { return originalInitializer.call(instance, init); }; } ret.push(init); } 0 !== kind && (1 === kind ? (desc.get = value.get, desc.set = value.set) : 2 === kind ? desc.value = value : 3 === kind ? desc.get = value : 4 === kind && (desc.set = value), isPrivate ? 1 === kind ? (ret.push(function (instance, args) { return value.get.call(instance, args); }), ret.push(function (instance, args) { return value.set.call(instance, args); })) : 2 === kind ? ret.push(value) : ret.push(function (instance, args) { return value.call(instance, args); }) : Object.defineProperty(base, name, desc)); }
function applyMemberDecs(Class, decInfos, instanceBrand) { for (var protoInitializers, staticInitializers, staticBrand, ret = [], existingProtoNonFields = new Map(), existingStaticNonFields = new Map(), i = 0; i < decInfos.length; i++) { var decInfo = decInfos[i]; if (Array.isArray(decInfo)) { var base, initializers, kind = decInfo[1], name = decInfo[2], isPrivate = decInfo.length > 3, decoratorsHaveThis = 16 & kind, isStatic = !!(8 & kind), hasPrivateBrand = instanceBrand; if (kind &= 7, isStatic ? (base = Class, 0 !== kind && (initializers = staticInitializers = staticInitializers || []), isPrivate && !staticBrand && (staticBrand = function (_) { return _checkInRHS(_) === Class; }), hasPrivateBrand = staticBrand) : (base = Class.prototype, 0 !== kind && (initializers = protoInitializers = protoInitializers || [])), 0 !== kind && !isPrivate) { var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields, existingKind = existingNonFields.get(name) || 0; if (!0 === existingKind || 3 === existingKind && 4 !== kind || 4 === existingKind && 3 !== kind) throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name); existingNonFields.set(name, !(!existingKind && kind > 2) || kind); } applyMemberDec(ret, base, decInfo, decoratorsHaveThis, name, kind, isStatic, isPrivate, initializers, hasPrivateBrand); } } return pushInitializers(ret, protoInitializers), pushInitializers(ret, staticInitializers), ret; }
function pushInitializers(ret, initializers) { initializers && ret.push(function (instance) { for (var i = 0; i < initializers.length; i++) initializers[i].call(instance); return instance; }); }
function applyClassDecs(targetClass, classDecs, decoratorsHaveThis) { if (classDecs.length) { for (var initializers = [], newClass = targetClass, name = targetClass.name, inc = decoratorsHaveThis ? 2 : 1, i = classDecs.length - 1; i >= 0; i -= inc) { var decoratorFinishedRef = { v: !1 }; try { var nextNewClass = classDecs[i].call(decoratorsHaveThis ? classDecs[i - 1] : void 0, newClass, { kind: "class", name: name, addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef) }); } finally { decoratorFinishedRef.v = !0; } void 0 !== nextNewClass && (assertValidReturnValue(5, nextNewClass), newClass = nextNewClass); } return [newClass, function () { for (var i = 0; i < initializers.length; i++) initializers[i].call(newClass); }]; } }
function _applyDecs(targetClass, memberDecs, classDecs, classDecsHaveThis, instanceBrand) { return { e: applyMemberDecs(targetClass, memberDecs, instanceBrand), get c() { return applyClassDecs(targetClass, classDecs, classDecsHaveThis); } }; }
function _checkInRHS(value) { if (Object(value) !== value) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== value ? typeof value : "null")); return value; }
import { createComputed, createEffect, createRoot, createSignal, untrack } from 'solid-js';
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

      // Stops the effect from re-running. It can now be garbage collected.
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
      const b = new _Butterfly();
      testButterflyProps(b);
    });
    it('does not prevent superclass constructor from receiving subclass constructor args', () => {
      var _initClass2, _initClass3, _init_colors2, _initProto2;
      let _Insect;
      class Insect {
        static {
          [_Insect, _initClass2] = _applyDecs(this, [], [reactive]).c;
        }
        constructor(double) {
          this.double = double;
        }
        static {
          _initClass2();
        }
      }
      let _Butterfly2;
      class Butterfly extends _Insect {
        static {
          ({
            e: [_init_colors2, _initProto2],
            c: [_Butterfly2, _initClass3]
          } = _applyDecs(this, [[signal, 3, "wingSize"], [signal, 0, "colors"]], [reactive]));
        }
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
        static {
          _initClass3();
        }
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
              c: [_Bar, _initClass4]
            } = _applyDecs(this, [[signal, 0, "bar"]], [reactive]));
          }
          bar = _init_bar(this, 123);
          static {
            _initClass4();
          }
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
        static {
          ({
            e: [_init_do],
            c: [_Doer, _initClass5]
          } = _applyDecs(this, [[signal, 0, "do"]], [reactive]));
        }
        do = _init_do(this, null);
        static {
          _initClass5();
        }
      }
      const doer = new _Doer();
      expect(doer.do).toBe(null);
      const newFunc = () => 123;
      doer.do = newFunc;
      expect(doer.do).toBe(newFunc);
      expect(doer.do()).toBe(123);
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
    it('automatically does not track reactivity in constructors when using decorators', () => {
      var _initClass6, _init_amount, _initClass7, _init_double;
      let _Foo;
      class Foo {
        static {
          ({
            e: [_init_amount],
            c: [_Foo, _initClass6]
          } = _applyDecs(this, [[signal, 0, "amount"]], [reactive]));
        }
        amount = _init_amount(this, 3);
        static {
          _initClass6();
        }
      }
      let _Bar2;
      class Bar extends _Foo {
        static {
          ({
            e: [_init_double],
            c: [_Bar2, _initClass7]
          } = _applyDecs(this, [[signal, 0, "double"]], [reactive]));
        }
        double = _init_double(this, 0);
        constructor() {
          super();
          this.double = this.amount * 2; // this read of .amount should not be tracked
        }
        static {
          _initClass7();
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
      expect(b).toBe(b2);
      expect(count).toBe(1);
    });
  });
  describe('@component', () => {
    it('allows to define a class using class syntax', () => {
      var _initClass8;
      let onMountCalled = false;
      let onCleanupCalled = false;
      let _CoolComp;
      class CoolComp {
        static {
          [_CoolComp, _initClass8] = _applyDecs(this, [], [component]).c;
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
          _initClass8();
        }
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
      }).toThrow();
    });
    it('works in tandem with @reactive and @signal for reactivity', async () => {
      var _initClass9, _init_foo2, _init_bar2;
      let _CoolComp2;
      class CoolComp {
        static {
          ({
            e: [_init_foo2, _init_bar2],
            c: [_CoolComp2, _initClass9]
          } = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]));
        }
        foo = _init_foo2(this, 0);
        bar = _init_bar2(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass9();
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
      var _initClass10, _init_foo3, _init_bar3;
      let _CoolComp3;
      class CoolComp {
        static {
          ({
            e: [_init_foo3, _init_bar3],
            c: [_CoolComp3, _initClass10]
          } = _applyDecs(this, [[signal, 0, "foo"], [signal, 0, "bar"]], [component, reactive]));
        }
        foo = _init_foo3(this, 0);
        bar = _init_bar3(this, 0);
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass10();
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