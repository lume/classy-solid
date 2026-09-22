import { createEffect, createRoot, createSignal, getOwner, runWithOwner } from 'solid-js';
import { createLazyMemo } from './createLazyMemo.js';
describe('classy-solid', () => {
  describe('createLazyMemo()', () => {
    it('does not run the computation until first read', () => {
      const [a] = createSignal(2);
      let runs = 0;
      const [double] = createLazyMemo(() => {
        runs++;
        return a() * 2;
      });
      expect(runs).toBe(0);
      expect(double()).toBe(4);
      expect(runs).toBe(1);
      expect(double()).toBe(4); // cached
      expect(runs).toBe(1);
    });
    it('recomputes when a dependency changes, and re-runs dependent effects', () => {
      const [a, setA] = createSignal(2);
      let runs = 0;
      let effectRuns = 0;
      let last = 0;
      const [double] = createLazyMemo(() => {
        runs++;
        return a() * 2;
      });
      createRoot(() => {
        createEffect(() => {
          effectRuns++;
          last = double();
        });
      });
      expect(runs).toBe(1);
      expect(effectRuns).toBe(1);
      expect(last).toBe(4);
      setA(5);
      expect(runs).toBe(2);
      expect(effectRuns).toBe(2);
      expect(last).toBe(10);
    });
    it('is not owned by the effect that first reads it (survives that effect re-running)', () => {
      // This is the bug an eagerly-created-at-first-read memo would have:
      // the reading effect owns the memo and disposes it before its own
      // re-run, so after the first update the memo is dead and the
      // effect never re-runs again.
      const [a, setA] = createSignal(1);
      const [trigger, setTrigger] = createSignal(0);
      let memoRuns = 0;
      let effectRuns = 0;
      let last = 0;

      // No owner at the call site.
      const [double] = createLazyMemo(() => {
        memoRuns++;
        return a() * 2;
      });
      createRoot(() => {
        createEffect(() => {
          trigger(); // something unrelated that re-runs this effect
          effectRuns++;
          last = double(); // first read happens here, INSIDE the effect
        });
      });
      expect(memoRuns).toBe(1);
      expect(effectRuns).toBe(1);
      setTrigger(1); // effect re-runs; would dispose the memo if it owned it
      expect(effectRuns).toBe(2);
      expect(memoRuns).toBe(1); // still cached, not recreated

      setA(2); // memo must still be alive and still notify the effect
      expect(memoRuns).toBe(2);
      expect(effectRuns).toBe(3);
      expect(last).toBe(4);
      setA(3);
      expect(memoRuns).toBe(3);
      expect(effectRuns).toBe(4);
      expect(last).toBe(6);
    });
    it('is owned by the owner at its call site; wrapping in runWithOwner pins it', () => {
      const [a, setA] = createSignal(1);
      let memoRuns = 0;
      let dispose;
      let double;
      createRoot(d => {
        dispose = d;
        const owner = getOwner()
        // Created under `owner` regardless of where it is first read.
        ;
        [double] = runWithOwner(owner, () => createLazyMemo(() => {
          memoRuns++;
          return a() * 2;
        }));
      });
      let effectRuns = 0;
      createRoot(() => {
        createEffect(() => {
          effectRuns++;
          double();
        });
      });
      expect(memoRuns).toBe(1);
      setA(2);
      expect(memoRuns).toBe(2);
      expect(effectRuns).toBe(2);
      dispose(); // disposes the memo (owned by the first root), not the effect
      setA(3);
      expect(memoRuns).toBe(2); // memo is dead
      expect(effectRuns).toBe(2); // and no longer notifies
    });
    it('supports a writable memo', () => {
      const [a, setA] = createSignal(1);
      let runs = 0;
      let effectRuns = 0;
      let last = 0;
      const [val, setVal] = createLazyMemo(() => {
        runs++;
        return a() * 10;
      }, undefined, {
        writable: true
      });
      expect(runs).toBe(0);
      createRoot(() => {
        createEffect(() => {
          effectRuns++;
          last = val();
        });
      });
      expect(runs).toBe(1);
      expect(last).toBe(10);
      setVal(99); // override
      expect(last).toBe(99);
      expect(effectRuns).toBe(2);
      expect(runs).toBe(1);
      setA(2); // dependency change resumes computation
      expect(last).toBe(20);
      expect(runs).toBe(2);
      expect(effectRuns).toBe(3);
    });
    it('passes the initial value as `prev` on the first run', () => {
      const [a, setA] = createSignal(1);
      const prevs = [];
      const [acc] = createLazyMemo(prev => {
        prevs.push(prev);
        return (prev ?? 0) + a();
      }, 100);
      expect(acc()).toBe(101);
      expect(prevs).toEqual([100]);
      setA(5);
      expect(acc()).toBe(106);
      expect(prevs).toEqual([100, 101]);

      // writable variant too
      const prevs2 = [];
      const [acc2] = createLazyMemo(prev => {
        prevs2.push(prev);
        return (prev ?? 0) + a();
      }, 7, {
        writable: true
      });
      expect(acc2()).toBe(12);
      expect(prevs2).toEqual([7]);
    });
    it('README example', () => {
      const logs = [];
      const [a, setA] = createSignal(2);
      const [double] = createLazyMemo(() => a() * 2); // nothing computed yet
      createRoot(() => {
        createEffect(() => logs.push(double()));
      });
      expect(logs).toEqual([4]);
      setA(5);
      expect(logs).toEqual([4, 10]);
    });
    it('passes MemoOptions (equals) through', () => {
      const [a, setA] = createSignal(1);
      let effectRuns = 0;

      // Custom equals that treats all even numbers as equal.
      const [evenish] = createLazyMemo(() => a(), undefined, {
        equals: (prev, next) => prev % 2 === next % 2
      });
      createRoot(() => {
        createEffect(() => {
          effectRuns++;
          evenish();
        });
      });
      expect(effectRuns).toBe(1);
      setA(3); // same parity → no notify
      expect(effectRuns).toBe(1);
      setA(4); // parity changed → notify
      expect(effectRuns).toBe(2);
    });
  });
});
//# sourceMappingURL=createLazyMemo.test.js.map