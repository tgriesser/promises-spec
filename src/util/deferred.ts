import { Deferred } from "./types";
import { MyPromise } from "../MyPromise";

export function deferred(): Deferred {
  const dfd = {} as Deferred;
  dfd.promise = new MyPromise((resolve: any, reject: any) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
