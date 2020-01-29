import {
  PromiseFn,
  Deferred,
  OnFulfilledFn,
  OnRejectedFn
} from "../util/types";

class MyPromise {
  constructor(fn: PromiseFn) {
    fn(this._resolve, this._reject);
  }

  _resolve = (val: any) => {
    // TODO
  };

  _reject = (val: any) => {
    // TODO
  };

  then = (onFulfilled?: OnFulfilledFn, onRejected?: OnRejectedFn) => {
    let deferred = {} as Deferred;
    deferred.promise = new MyPromise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    // TODO
    return deferred.promise;
  };
}

// export { MyPromise };
