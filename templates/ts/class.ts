import { PromiseFn, Deferred, OnResolveFn, OnRejectFn } from "../util/types";
import { testClass } from "../util/test";

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

  then = (onFulfilled: OnResolveFn, onRejected: OnRejectFn) => {
    let deferred = {} as Deferred;
    deferred.promise = new MyPromise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    // TODO
    return deferred.promise;
  };
}

testClass(MyPromise);
