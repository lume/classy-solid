import { createRoot } from 'solid-js';
import { createSignalFunction } from '../signals/createSignalFunction.js';
import { createDeferredEffect } from './createDeferredEffect.js';
describe('classy-solid', () => {
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
});
//# sourceMappingURL=createDeferredEffect.test.js.map