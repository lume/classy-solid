import { createMutable } from 'solid-js/store';
import { signalify } from './signalify.js';
import { testButterflyProps } from '../index.test.js';
import { createEffect, untrack } from 'solid-js';
describe('classy-solid', () => {
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
              obj.n;
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
          #wingSize = 2;
          get wingSize() {
            return this.#wingSize;
          }
          set wingSize(s) {
            this.#wingSize = s;
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
          #wingSize;
          get wingSize() {
            return this.#wingSize;
          }
          set wingSize(s) {
            this.#wingSize = s;
          }
          constructor() {
            this.colors = 3;
            this.#wingSize = 2;
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
});
//# sourceMappingURL=signalify.test.js.map