import { Deferred } from "../templates/util/types";
import * as exportedPromises from "../templates";

export function getDeferred(): Deferred {
  const promiseNames = Object.keys(exportedPromises);
  if (promiseNames.length > 1) {
    throw new Error("We should only uncomment one export for the Promises.");
  }
  if (promiseNames.length === 0) {
    throw new Error(
      "Uncomment one of the exports in templates/{js,ts} to begin."
    );
  }
  const exportName = promiseNames[0];
  const P = (exportedPromises as any)[exportName] as any;
  const dfd = {} as Deferred;
  if (exportName === "MyPromise") {
    dfd.promise = new P((resolve: any, reject: any) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
  } else {
    dfd.promise = P((resolve: any, reject: any) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
  }
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
