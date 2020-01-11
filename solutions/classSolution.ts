import {
  Deferred,
  PromiseFn,
  OnResolveFn,
  OnRejectFn
} from "../templates/util/types";
import { testClass } from "../templates/util/test";

type ThenCall = { onFulfilled?: any; onRejected?: any; deferred: Deferred };

export class MyPromise {
  _state: "pending" | "rejected" | "resolved";
  _stack: ThenCall[];
  _value: any;

  constructor(fn: PromiseFn) {
    this._state = "pending";
    this._stack = [];
    this.then = this.then.bind(this);
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
    this._flush = this._flush.bind(this);
    this._value = undefined;
    fn(this._resolve, this._reject);
  }

  _resolve(val: any) {
    if (this._state !== "pending") {
      return;
    }
    this._state = "resolved";
    process.nextTick(() => {
      this._value = val;
      this._flush();
    });
  }

  _reject(val: any) {
    if (this._state !== "pending") {
      return;
    }
    this._state = "rejected";
    process.nextTick(() => {
      this._value = val;
      this._flush();
    });
  }

  _flush() {
    let current;
    while ((current = this._stack.shift())) {
      const toCall =
        this._state === "resolved" ? current.onFulfilled : current.onRejected;
      if (typeof toCall === "function") {
        try {
          let resultValue = toCall.call(undefined, this._value);
          if (resultValue === current.deferred.promise) {
            throw new TypeError();
          }
          resolvePromise(current.deferred, resultValue);
        } catch (e) {
          current.deferred.reject(e);
        }
      } else {
        if (this._state === "resolved") {
          current.deferred.resolve(this._value);
        } else {
          current.deferred.reject(this._value);
        }
      }
    }
  }

  then(onFulfilled: OnResolveFn, onRejected: OnRejectFn) {
    const deferred = {} as Deferred;
    deferred.promise = new MyPromise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    this._stack.push({ onFulfilled, onRejected, deferred: deferred });
    if (this._state !== "pending") {
      process.nextTick(this._flush);
    }
    return deferred.promise;
  }
}

function resolvePromise(deferred: Deferred, value: any) {
  let hasRun = false;
  function onComplete(val: any) {
    if (hasRun) {
      return;
    }
    hasRun = true;
    resolvePromise(deferred, val);
  }
  function onError(val: any) {
    if (hasRun) {
      return;
    }
    hasRun = true;
    deferred.reject(val);
  }
  try {
    const then = value ? value.then : undefined;
    if (
      typeof then === "function" &&
      (typeof value === "object" || typeof value === "function")
    ) {
      then.call(value, onComplete, onError);
    } else {
      hasRun = true;
      deferred.resolve(value);
    }
  } catch (e) {
    if (!hasRun) {
      deferred.reject(e);
    }
  }
}

testClass(MyPromise);
