import { deferred } from "../src/util/deferred";

export function makeTestAdapter(fn = deferred) {
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
