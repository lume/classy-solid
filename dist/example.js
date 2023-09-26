var _initClass, _init_yoo, _initClass2, _init_foo, _initProto, _initClass3, _init_bar, _initProto2;
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
import { signal, reactive } from './index.js';
import { createEffect } from 'solid-js';
let _Other;
class Other {
  static {
    ({
      e: [_init_yoo],
      c: [_Other, _initClass]
    } = _applyDecs(this, [[signal, 0, "yoo"]], [reactive]));
  }
  yoo = _init_yoo(this, 'hoo');
  static {
    _initClass();
  }
}
new _Other();
let _Foo;
class Foo {
  static {
    ({
      e: [_init_foo, _initProto],
      c: [_Foo, _initClass2]
    } = _applyDecs(this, [[signal, 3, "lorem"], [signal, 0, "foo"]], [reactive]));
  }
  foo = (_initProto(this), _init_foo(this, 123));
  get lorem() {
    return 123;
  }
  set lorem(v) {
    v;
  }
  static {
    _initClass2();
  }
}
let _Bar;
class Bar extends _Foo {
  static {
    ({
      e: [_init_bar, _initProto2],
      c: [_Bar, _initClass3]
    } = _applyDecs(this, [[signal, 3, "baz"], [signal, 0, "bar"]], [reactive]));
  }
  bar = (_initProto2(this), _init_bar(this, 456));
  #baz = 789;
  get baz() {
    return this.#baz;
  }
  set baz(v) {
    this.#baz = v;
  }
  constructor() {
    super();
    console.log('Bar');
  }
  static {
    _initClass3();
  }
}
export { _Foo as Foo };
const b = new _Bar();
createEffect(() => {
  console.log('b.foo:', b.foo);
});
createEffect(() => {
  console.log('b.lorem:', b.lorem);
});
createEffect(() => {
  console.log('b.bar:', b.bar);
});
createEffect(() => {
  console.log('b.baz:', b.baz);
});
setInterval(() => {
  console.log('---');
  b.foo++;
  b.bar++;
  b.baz++;
  b.lorem++;
}, 1000);
//# sourceMappingURL=example.js.map