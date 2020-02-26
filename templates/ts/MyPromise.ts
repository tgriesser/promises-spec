import { PromiseFn, OnFulfilledFn, OnRejectedFn } from "../util/types";

export class MyPromise {
  constructor(fn: PromiseFn) {
    fn(this._resolve, this._reject);
  }

  _resolve = (val: any) => {
    //
  };

  _reject = (val: any) => {
    //
  };

  then = (onFulfilled?: OnFulfilledFn, onRejected?: OnRejectedFn) => {
    //
  };
}
