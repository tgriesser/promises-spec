import { Deferred } from "../templates/util/types";
import { MyPromise } from "../templates/ts/MyPromise";
// import MyPromise from "../templates/js/MyPromise";

export function getDeferred(): Deferred {
  const dfd = {} as Deferred;
  dfd.promise = new MyPromise((resolve: any, reject: any) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

export function makeTestAdapter(fn = getDeferred) {
  return {
    resolve(value: any) {
      const dfd = fn();
      dfd.resolve(value);
      return dfd.promise;
    },
    reject(err: any) {
      const dfd = fn();
      dfd.reject(err);
      return dfd.promise;
    },
    deferred: fn
  };
}
