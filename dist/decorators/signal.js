let propsToSignalify = new Map();
let accessKey = null;

/**
 * Provides a key for accessing internal APIs. If any other module tries to get
 * this, an error will be thrown, and signal and reactive decorators will not
 * work.
 */
export function getKey() {
  if (accessKey) throw new Error('Attempted use of classy-solid internals.');
  accessKey = Symbol();
  return accessKey;
}

/**
 * This function provides propsToSignalify to only one external module
 * (reactive.ts). The purpose of this is to keep the API private for reactive.ts
 * only, otherwise an error will be thrown that breaks signal/reactive
 * functionality.
 */
export function getPropsToSignalify(key) {
  if (key !== accessKey) throw new Error('Attempted use of classy-solid internals.');
  return propsToSignalify;
}

/**
 * Only the module that first gets the key can call this function (it should be
 * reactive.ts)
 */
export function resetPropsToSignalify(key) {
  if (key !== accessKey) throw new Error('Attempted use of classy-solid internals.');
  propsToSignalify = new Map();
}
function isMemberDecorator(context) {
  return !!('private' in context);
}

/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive. Don't forget that the class in which `@signal`
 * is used must be decorated with `@reactive`.
 *
 * Example:
 *
 * > Note in the following example that `\@` should be written as `@` without
 * the back slash. The back slash prevents JSDoc parsing errors in this comment
 * in TypeScript.  https://github.com/microsoft/TypeScript/issues/47679
 *
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * \@reactive
 * class Counter {
 *   \@signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export function signal(_, context) {
  const {
    kind,
    name
  } = context;
  const props = propsToSignalify;
  if (isMemberDecorator(context)) {
    if (context.private) throw new Error('@signal is not supported on private fields yet.');
    if (context.static) throw new Error('@signal is not supported on static fields yet.');
  }
  if (kind === 'field') {
    props.set(name, {
      initialValue: undefined
    });
    return function (initialValue) {
      props.get(name).initialValue = initialValue;
      return initialValue;
    };
  } else if (kind === 'getter' || kind === 'setter') {
    props.set(name, {
      initialValue: undefined
    });
  } else {
    throw new Error('The @signal decorator is only for use on fields, getters, and setters. Auto accessor support is coming next if there is demand for it.');
  }

  // @prod-prune
  queueReactiveDecoratorChecker(props);
}
let checkerQueued = false;

/**
 * This throws an error in some cases of an end dev forgetting to decorate a
 * class with @reactive if they used @signal on that class's fields.
 *
 * This doesn't work all the time, only when the very last class decorated is
 * missing @reactive, but something is better than nothing. There's another
 * similar check performed in the @reactive decorator.
 */
function queueReactiveDecoratorChecker(props) {
  if (checkerQueued) return;
  checkerQueued = true;
  queueMicrotask(() => {
    checkerQueued = false;

    // If the refs are still equal, it means @reactive did not run (forgot
    // to decorate a class that uses @signal with @reactive).
    if (props === propsToSignalify) {
      throw new Error(
      // Array.from(map.keys()) instead of [...map.keys()] because it breaks in Oculus browser.
      `Stray @signal-decorated properties detected: ${Array.from(props.keys()).join(', ')}. Did you forget to use the \`@reactive\` decorator on a class that has properties decorated with \`@signal\`?`);
    }
  });
}
//# sourceMappingURL=signal.js.map