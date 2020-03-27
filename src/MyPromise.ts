import { PromiseFn, OnFulfilledFn, OnRejectedFn } from "./util/types";

export class MyPromise {
  // Below, we'll implement a "Promise" class that has a "then" method, conforming to the
  // A+ spec https://promisesaplus.com/ as much as possible. You may any code (class properties, methods, etc.)
  // that will be helpful in implementing this behavior. The only thing you can't use is the built-in `Promise` class.

  constructor(fn: PromiseFn) {
    fn(this._resolve, this._reject);
  }

  _resolve = (val: any) => {
    // To Implement
  };

  _reject = (val: any) => {
    // To Implement
  };

  then = (onFulfilled?: OnFulfilledFn, onRejected?: OnRejectedFn) => {
    // To Implement
  };
}
