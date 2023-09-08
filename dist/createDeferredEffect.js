// TODO switch to non-dep-tracking non-queue-modifying deferred signals, because those do not break with regular effects.

import { createSignal as _createSignal, createEffect, onCleanup, getOwner, runWithOwner } from 'solid-js';
const effectQueue = new Set();
let runningEffects = false;

// map of effects to dependencies
const effectDeps = new Map();
let currentEffect = () => {};

// Override createSignal in order to implement custom tracking of effect
// dependencies, so that when signals change, we are aware which dependenct
// effects need to be moved to the end of the effect queue while running
// deferred effects in a microtask.
export let createSignal = (value, options) => {
  let [_get, _set] = _createSignal(value, options);
  const get = () => {
    if (!runningEffects) return _get();
    let deps = effectDeps.get(currentEffect);
    if (!deps) effectDeps.set(currentEffect, deps = new Set());
    deps.add(_set);
    return _get();
  };
  const set = v => {
    if (!runningEffects) return _set(v);

    // This is inefficient, for proof of concept, unable to use Solid
    // internals on the outside.
    for (const [fn, deps] of effectDeps) {
      for (const dep of deps) {
        if (dep === _set) {
          // move to the end
          effectQueue.delete(fn);
          effectQueue.add(fn);
        }
      }
    }
    return _set(v);
  };
  return [get, set];
};
let effectTaskIsScheduled = false;

// TODO Option so the first run is deferred instead of immediate? This already
// happens outside of a root.
export const createDeferredEffect = (fn, value, options) => {
  let initial = true;
  createEffect(prev => {
    if (initial) {
      initial = false;
      currentEffect = fn;
      effectDeps.get(fn)?.clear(); // clear to track deps, or else it won't track new deps based on code branching
      fn(prev);
      return;
    }
    effectQueue.add(fn); // add, or move to the end, of the queue. TODO This is probably redundant now, but I haven't tested yet.

    // If we're currently running the queue, return because fn will run
    // again at the end of the queue iteration due to our overriden
    // createSignal moving it to the end.
    if (runningEffects) return;
    if (effectTaskIsScheduled) return;
    effectTaskIsScheduled = true;
    const owner = getOwner();
    queueMicrotask(() => {
      if (owner) runWithOwner(owner, runEffects);else runEffects();
    });
  }, value, options);
  getOwner() && onCleanup(() => {
    effectDeps.delete(fn);
    effectQueue.delete(fn);
  });
};
function runEffects() {
  runningEffects = true;
  for (const fn of effectQueue) {
    effectQueue.delete(fn); // TODO This is probably redundant now, but I haven't tested yet.
    createDeferredEffect(fn);
  }
  runningEffects = false;
  effectTaskIsScheduled = false;
}
//# sourceMappingURL=createDeferredEffect.js.map