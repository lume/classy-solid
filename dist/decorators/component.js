import { Constructor } from 'lowclass/dist/Constructor.js';
import { onMount, createEffect, onCleanup, $TRACK, createMemo } from 'solid-js';
import './metadata-shim.js';

// https://github.com/ryansolid/dom-expressions/pull/122

/**
 * A decorator for using classes as Solid components.
 *
 * Example:
 *
 * ```js
 * ⁣@component
 * class MyComp {
 *   ⁣@signal last = 'none'
 *
 *   onMount() {
 *     console.log('mounted')
 *   }
 *
 *   template(props) {
 *     // here we use `props` passed in, or the signal on `this` which is also
 *     // treated as a prop
 *     return <h1>Hello, my name is {props.first} {this.last}</h1>
 *   }
 * }
 *
 * render(() => <MyComp first="Joe" last="Pea" />)
 * ```
 */
export function component(Base, context) {
  if (typeof Base !== 'function' || context && context.kind !== 'class') throw new Error('The @component decorator should only be used on a class.');
  const Class = Constructor(Base);

  // Solid only undetstands function components, so we create a wrapper
  // function that instantiates the class and hooks up lifecycle methods and
  // props.
  function classComponentWrapper(props) {
    const instance = new Class();
    const keys = createMemo(() => {
      props[$TRACK];
      return Object.keys(props);
    }, [], {
      equals(prev, next) {
        if (prev.length !== next.length) return false;
        for (let i = 0, l = prev.length; i < l; i += 1) if (prev[i] !== next[i]) return false;
        return true;
      }
    });
    createEffect(() => {
      // @ts-expect-error index signature
      for (const prop of keys()) createEffect(() => instance[prop] = props[prop]);
    });
    onMount(() => {
      instance.onMount?.();
      createEffect(() => {
        const ref = props.ref;
        ref?.(instance);
      });
      onCleanup(() => instance.onCleanup?.());
    });
    return instance.template?.(props) ?? null;
  }
  Object.defineProperties(classComponentWrapper, {
    name: {
      value: Class.name,
      configurable: true
    },
    [Symbol.hasInstance]: {
      value(obj) {
        return obj instanceof Class;
      },
      configurable: true
    }
  });
  return classComponentWrapper;
}
//# sourceMappingURL=component.js.map