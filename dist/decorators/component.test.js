function _applyDecs(e, t, n, r, o, i) { var a, c, u, s, f, l, p, d = Symbol.metadata || Symbol.for("Symbol.metadata"), m = Object.defineProperty, h = Object.create, y = [h(null), h(null)], v = t.length; function g(t, n, r) { return function (o, i) { n && (i = o, o = e); for (var a = 0; a < t.length; a++) i = t[a].apply(o, r ? [i] : []); return r ? i : o; }; } function b(e, t, n, r) { if ("function" != typeof e && (r || void 0 !== e)) throw new TypeError(t + " must " + (n || "be") + " a function" + (r ? "" : " or undefined")); return e; } function applyDec(e, t, n, r, o, i, u, s, f, l, p) { function d(e) { if (!p(e)) throw new TypeError("Attempted to access private element on non-instance"); } var h = [].concat(t[0]), v = t[3], w = !u, D = 1 === o, S = 3 === o, j = 4 === o, E = 2 === o; function I(t, n, r) { return function (o, i) { return n && (i = o, o = e), r && r(o), P[t].call(o, i); }; } if (!w) { var P = {}, k = [], F = S ? "get" : j || D ? "set" : "value"; if (f ? (l || D ? P = { get: _setFunctionName(function () { return v(this); }, r, "get"), set: function (e) { t[4](this, e); } } : P[F] = v, l || _setFunctionName(P[F], r, E ? "" : F)) : l || (P = Object.getOwnPropertyDescriptor(e, r)), !l && !f) { if ((c = y[+s][r]) && 7 !== (c ^ o)) throw Error("Decorating two elements with the same name (" + P[F].name + ") is not supported yet"); y[+s][r] = o < 3 ? 1 : o; } } for (var N = e, O = h.length - 1; O >= 0; O -= n ? 2 : 1) { var T = b(h[O], "A decorator", "be", !0), z = n ? h[O - 1] : void 0, A = {}, H = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o], name: r, metadata: a, addInitializer: function (e, t) { if (e.v) throw new TypeError("attempted to call addInitializer after decoration was finished"); b(t, "An initializer", "be", !0), i.push(t); }.bind(null, A) }; if (w) c = T.call(z, N, H), A.v = 1, b(c, "class decorators", "return") && (N = c);else if (H.static = s, H.private = f, c = H.access = { has: f ? p.bind() : function (e) { return r in e; } }, j || (c.get = f ? E ? function (e) { return d(e), P.value; } : I("get", 0, d) : function (e) { return e[r]; }), E || S || (c.set = f ? I("set", 0, d) : function (e, t) { e[r] = t; }), N = T.call(z, D ? { get: P.get, set: P.set } : P[F], H), A.v = 1, D) { if ("object" == typeof N && N) (c = b(N.get, "accessor.get")) && (P.get = c), (c = b(N.set, "accessor.set")) && (P.set = c), (c = b(N.init, "accessor.init")) && k.unshift(c);else if (void 0 !== N) throw new TypeError("accessor decorators must return an object with get, set, or init properties or undefined"); } else b(N, (l ? "field" : "method") + " decorators", "return") && (l ? k.unshift(N) : P[F] = N); } return o < 2 && u.push(g(k, s, 1), g(i, s, 0)), l || w || (f ? D ? u.splice(-1, 0, I("get", s), I("set", s)) : u.push(E ? P[F] : b.call.bind(P[F])) : m(e, r, P)), N; } function w(e) { return m(e, d, { configurable: !0, enumerable: !0, value: a }); } return void 0 !== i && (a = i[d]), a = h(null == a ? null : a), f = [], l = function (e) { e && f.push(g(e)); }, p = function (t, r) { for (var i = 0; i < n.length; i++) { var a = n[i], c = a[1], l = 7 & c; if ((8 & c) == t && !l == r) { var p = a[2], d = !!a[3], m = 16 & c; applyDec(t ? e : e.prototype, a, m, d ? "#" + p : _toPropertyKey(p), l, l < 2 ? [] : t ? s = s || [] : u = u || [], f, !!t, d, r, t && d ? function (t) { return _checkInRHS(t) === e; } : o); } } }, p(8, 0), p(0, 0), p(8, 1), p(0, 1), l(u), l(s), c = f, v || w(e), { e: c, get c() { var n = []; return v && [w(e = applyDec(e, [t], r, e.name, 5, n)), g(n, 1)]; } }; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _setFunctionName(e, t, n) { "symbol" == typeof t && (t = (t = t.description) ? "[" + t + "]" : ""); try { Object.defineProperty(e, "name", { configurable: !0, value: n ? n + " " + t : t }); } catch (e) {} return e; }
function _checkInRHS(e) { if (Object(e) !== e) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e ? typeof e : "null")); return e; }
import html from 'solid-js/html';
import { component } from './component.js';
import { render } from 'solid-js/web';
import { signal } from './signal.js';
import { createSignal } from 'solid-js';
import { createSignalFunction } from '../signals/createSignalFunction.js';
import { signalify } from '../signals/signalify.js';
import { createMutable } from 'solid-js/store';
import { memo } from './memo.js';
import { effect } from './effect.js';
describe('classy-solid', () => {
  describe('@component', () => {
    it('allows to define a class using class syntax', () => {
      let _initClass, _init_foo, _init_extra_foo;
      let onMountCalled = false;
      let onCleanupCalled = false;
      let _CoolComp;
      class CoolComp {
        static {
          ({
            e: [_init_foo, _init_extra_foo],
            c: [_CoolComp, _initClass]
          } = _applyDecs(this, [component], [[signal, 0, "foo"]]));
        }
        constructor() {
          _init_extra_foo(this);
        }
        foo = _init_foo(this, 0);
        onMount() {
          onMountCalled = true;
        }
        onCleanup() {
          onCleanupCalled = true;
        }
        template(props) {
          expect(props.foo).toBe(123); // not recommended to access props this way

          expect(this.foo).toBe(0); // initial value only

          return html`<div>hello classes! ${() => this.foo}</div>`;
        }
        static {
          _initClass();
        }
      }

      // Component classes cannot be instantiated directly, they can only
      // be used as Solid components in JSX or html templates.
      expect(() => new _CoolComp()).toThrow();
      const root = document.createElement('div');
      document.body.append(root);
      const dispose = render(() => html`<${_CoolComp} foo=${123} />`, root);
      expect(root.textContent).toBe('hello classes! 123');
      expect(onMountCalled).toBe(true);
      expect(onCleanupCalled).toBe(false);
      dispose();
      root.remove();
      expect(onCleanupCalled).toBe(true);
    });
    it('throws on invalid use', () => {
      // throws on non-class use
      expect(() => {
        let _initProto;
        class CoolComp {
          static {
            [_initProto] = _applyDecs(this, [], [[component, 2, "onMount"]]).e;
          }
          constructor() {
            _initProto(this);
          }
          // @ts-ignore
          onMount() {}
        }
        CoolComp;
      }).toThrow('component decorator should only be used on a class');
    });
    it('allows getting a ref to the class instance', () => {
      let _initClass2;
      let _CoolComp2;
      class CoolComp {
        static {
          [_CoolComp2, _initClass2] = _applyDecs(this, [component], []).c;
        }
        coolness = Infinity;
        template = () => html`<div>hello refs!</div>`;
        static {
          _initClass2();
        }
      }
      const root = document.createElement('div');
      document.body.append(root);
      let compRef;
      const dispose = render(() => html`<${_CoolComp2} ref=${comp => compRef = comp} />`, root);
      expect(root.textContent).toBe('hello refs!');
      expect(compRef instanceof _CoolComp2).toBe(true);
      expect(compRef.coolness).toBe(Infinity);
      dispose();
      root.remove();
    });
    it('works in tandem with @signal, @memo, and @effect for reactivity', async () => {
      let _initProto2, _initClass3, _init_foo2, _init_extra_foo2, _init_bar, _init_extra_bar;
      let _CoolComp3;
      class CoolComp {
        static {
          ({
            e: [_init_foo2, _init_extra_foo2, _init_bar, _init_extra_bar, _initProto2],
            c: [_CoolComp3, _initClass3]
          } = _applyDecs(this, [component], [[signal, 0, "foo"], [signal, 0, "bar"], [memo, 3, "sum"], [effect, 2, "logSum"]]));
        }
        foo = (_initProto2(this), _init_foo2(this, 0));
        bar = (_init_extra_foo2(this), _init_bar(this, 0));
        get sum() {
          return this.foo + this.bar;
        }
        runs = (_init_extra_bar(this), 0);
        result = 0;
        logSum() {
          this.runs++;
          this.result = this.sum;
        }
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass3();
        }
      }
      const root = document.createElement('div');
      document.body.append(root);
      const [a, setA] = createSignal(1);
      const b = createSignalFunction(2);
      let compRef;

      // FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
      // check the `length` of the function and do something based on
      // that? Or does it get passed to a @signal property's setter and
      // receives the previous value?
      const dispose = render(() => html` <${_CoolComp3} ref=${comp => compRef = comp} foo=${a} bar=${() => b()} /> `, root);
      expect(root.textContent).toBe('foo: 1, bar: 2');
      expect(compRef.result).toBe(3);
      expect(compRef.runs).toBe(2); // 1 initial run with 0 and 0, 1 run from setting foo and bar props

      setA(3);
      expect(root.textContent).toBe('foo: 3, bar: 2');
      expect(compRef.result).toBe(5);
      expect(compRef.runs).toBe(3);
      b(4);
      expect(root.textContent).toBe('foo: 3, bar: 4');
      expect(compRef.result).toBe(7);
      expect(compRef.runs).toBe(4);
      dispose();
      root.remove();
      setA(5);
      b(6);
      expect(compRef.result).toBe(7); // no change after dispose
      expect(compRef.runs).toBe(4); // no change after dispose
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

    // FIXME not working, spread syntax not supported yet in solid-js/html
    // TODO unit test using JSX
    it.skip('works with reactive spreads', async () => {
      let _initClass4, _init_foo3, _init_extra_foo3, _init_bar2, _init_extra_bar2;
      let _CoolComp4;
      class CoolComp {
        static {
          ({
            e: [_init_foo3, _init_extra_foo3, _init_bar2, _init_extra_bar2],
            c: [_CoolComp4, _initClass4]
          } = _applyDecs(this, [component], [[signal, 0, "foo"], [signal, 0, "bar"]]));
        }
        constructor() {
          _init_extra_bar2(this);
        }
        foo = _init_foo3(this, 0);
        bar = (_init_extra_foo3(this), _init_bar2(this, 0));
        template() {
          return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`;
        }
        static {
          _initClass4();
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
      const dispose = render(() => html`<${_CoolComp4} ...${o.o} />`, root);
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
//# sourceMappingURL=component.test.js.map