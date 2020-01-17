import { PromiseFn, Deferred, APlusPromise } from "./types";

// @ts-ignore
const promises = require("promises-aplus-tests");

export function testClass(P: { new (fn: PromiseFn): APlusPromise }) {
  test(() => {
    const dfd = {} as Deferred;
    dfd.promise = new P((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  });
}

export function testFunction(p: (fn: PromiseFn) => APlusPromise): void {
  test(() => {
    const dfd = {} as Deferred;
    dfd.promise = p((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  });
}

function test(deferred: () => Deferred) {
  const adapter = {
    resolve(value: any) {
      const dfd = deferred();
      dfd.resolve(value);
      return dfd.promise;
    },
    reject(err: any) {
      const dfd = deferred();
      dfd.reject(err);
      return dfd.promise;
    },
    deferred
  };
  promises(adapter, { bail: true, timeout: 1000 });
}
