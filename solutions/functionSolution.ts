import { PromiseFn, Deferred, APlusPromise } from "../templates/util/types";
import { testFunction } from "../templates/util/test";

function myPromise(fn: PromiseFn): APlusPromise {
  let state = "pending";
  let value: any;

  // Keeps track of all .then calls in order, by pushing onto the array
  const stack: { onFulfilled: any; onRejected: any; deferred: Deferred }[] = [];

  function resolvePromise(deferred: Deferred, y: any) {
    let run = false;
    function resolve(val: any) {
      if (run) {
        return;
      }
      run = true;
      resolvePromise(deferred, val);
    }
    function reject(e: any) {
      if (run) {
        return;
      }
      run = true;
      deferred.reject(e);
    }
    try {
      const then = y ? y.then : null;
      if (
        typeof then === "function" &&
        (typeof y === "function" || typeof y === "object")
      ) {
        then.call(y, resolve, reject);
      } else {
        run = true;
        deferred.resolve(y);
      }
    } catch (e) {
      if (!run) {
        deferred.reject(e);
      }
    }
  }

  function resolve(val: any) {
    if (state !== "pending") return;
    state = "resolved";
    value = val;
    process.nextTick(flush);
  }

  function reject(err: any) {
    if (state !== "pending") return;
    state = "rejected";
    value = err;
    process.nextTick(flush);
  }

  function flush() {
    let thenCall;
    while ((thenCall = stack.shift())) {
      const toCall =
        state === "resolved" ? thenCall.onFulfilled : thenCall.onRejected;
      if (typeof toCall === "function") {
        try {
          const result = toCall.call(undefined, value);
          if (result === thenCall.deferred.promise) {
            throw new TypeError();
          }
          resolvePromise(thenCall.deferred, result);
        } catch (e) {
          thenCall.deferred.reject(e);
        }
      } else {
        if (state === "resolved") {
          thenCall.deferred.resolve(value);
        } else {
          thenCall.deferred.reject(value);
        }
      }
    }
  }

  fn(resolve, reject);

  return {
    then(onFulfilled, onRejected) {
      let deferred = {} as Deferred;
      deferred.promise = myPromise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      stack.push({ onFulfilled, onRejected, deferred });
      if (state !== "pending") {
        process.nextTick(flush);
      }
      return deferred.promise;
    }
  };
}

testFunction(myPromise);
