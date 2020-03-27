import { MyPromise } from "../src/MyPromise";
import { Deferred } from "../src/util/types";
import { deferred } from "../src/util/deferred";

const ERR = new Error("ERR");

describe("promise.then(onFulfilled, onRejected)", function() {
  it("2.1.1 - 2.1.3", () => {
    // Internal state rules, cannot be tested directly, only indirectly
    expect(1).toEqual(1);
  });

  it("2.2.1 - Both onFulfilled and onRejected are optional arguments", () => {
    let toResolve;
    const prom = new MyPromise((resolve) => {
      toResolve = resolve;
    });
    prom.then();
    toResolve();
  });

  describe("2.2.2: If onFulfilled is a function:", () => {
    it("2.2.2.1: must be called after promise is fulfilled, with promise’s value as its first argument.", () => {
      const onFulfilled = jest.fn();
      const onRejected = jest.fn();
      const prom = new MyPromise((resolve) => {
        resolve(1);
      });
      prom.then(onFulfilled, onRejected);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledWith(1);
        expect(onRejected).not.toBeCalled();
      });
    });

    it("2.2.2.1: must be called after promise is fulfilled, with promise’s value as its first argument (.then chained while still pending).", () => {
      const onFulfilled = jest.fn();
      const onRejected = jest.fn();
      let resolveFn;
      const prom = new MyPromise((resolve) => {
        resolveFn = resolve;
      });
      prom.then(onFulfilled, onRejected);
      resolveFn(2);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledWith(2);
        expect(onRejected).not.toBeCalled();
      });
    });

    it("2.2.2.2: must not be called before promise is fulfilled.", () => {
      let resolveFn;
      const prom = new MyPromise((resolve) => {
        resolveFn = resolve;
      });
      const onFulfilled = jest.fn();
      prom.then(onFulfilled);
      return delay().then(() => {
        expect(onFulfilled).not.toBeCalled();
        resolveFn(1);
      });
    });

    it("2.2.2.3: must not be called more than once.", () => {
      const onFulfilled = jest.fn();
      let resolveFn;
      const prom = new MyPromise((resolve) => {
        resolveFn = resolve;
      });
      resolveFn(1);
      resolveFn(2);
      prom.then(onFulfilled);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
      });
    });

    it("2.2.2.3: must not be called more than once (resolve after .then).", () => {
      const onFulfilled = jest.fn();
      let resolveFn;
      const prom = new MyPromise((resolve) => {
        resolveFn = resolve;
      });
      prom.then(onFulfilled);
      resolveFn(1);
      resolveFn(2);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
      });
    });
  });

  describe.skip("2.2.2: If onRejected is a function:", () => {
    it("2.2.2.1: must be called after promise is fulfilled, with promise’s value as its first argument.", () => {
      const onRejected = jest.fn();
      const prom = new MyPromise((resolve, reject) => {
        reject(ERR);
      });
      prom.then(null, onRejected);
      return delay().then(() => {
        expect(onRejected).toBeCalledWith(ERR);
      });
    });

    it("2.2.2.2: must not be called before promise is fulfilled.", () => {
      let rejectFn;
      const prom = new MyPromise((resolve, reject) => {
        rejectFn = reject;
      });
      const onRejected = jest.fn();
      prom.then(null, onRejected);
      return delay().then(() => {
        expect(onRejected).not.toBeCalled();
        rejectFn(ERR);
      });
    });

    it("2.2.2.3: must not be called more than once.", () => {
      const onRejected = jest.fn();
      let rejectFn;
      const prom = new MyPromise((resolve, reject) => {
        rejectFn = reject;
      });
      rejectFn(ERR);
      rejectFn(ERR);
      prom.then(null, onRejected);
      return delay().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(ERR);
      });
    });

    it("2.2.2.3: must not be called more than once (reject, resolve).", () => {
      const onRejected = jest.fn();
      let rejectFn;
      let resolveFn;
      const prom = new MyPromise((resolve, reject) => {
        resolveFn = resolve;
        rejectFn = reject;
      });
      rejectFn(ERR);
      resolveFn(1);
      prom.then(null, onRejected);
      return delay().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(ERR);
      });
    });
  });

  describe.skip("2.2.4: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.", () => {
    it("onFulfilled", () => {
      const onFulfilled = jest.fn();
      const prom = new MyPromise((resolve) => {
        resolve(1);
      });
      prom.then(onFulfilled);
      expect(onFulfilled).toBeCalledTimes(0);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
      });
    });

    it("onRejected", () => {
      const onRejected = jest.fn();
      const prom = new MyPromise((resolve, reject) => {
        reject(ERR);
      });
      prom.then(null, onRejected);
      expect(onRejected).toBeCalledTimes(0);
      return delay().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(ERR);
      });
    });
  });

  describe.skip("2.2.5: onFulfilled and onRejected must be called as functions (i.e. with no this value).", () => {
    it("onFulfilled", () => {
      expect.assertions(1);
      function onFulfilled() {
        expect(this).toBeUndefined();
      }
      let resolveFn;
      const prom = new MyPromise((resolve) => {
        resolveFn = resolve;
      });
      prom.then(onFulfilled);
      resolveFn(1);
      return delay();
    });

    it("onRejected", () => {
      expect.assertions(1);
      function onRejected() {
        expect(this).toBeUndefined();
      }
      let rejectFn;
      const prom = new MyPromise((resolve, reject) => {
        rejectFn = reject;
      });
      prom.then(null, onRejected);
      rejectFn(ERR);
      return delay();
    });
  });

  describe.skip("2.2.6: then may be called multiple times on the same promise.", () => {
    describe("2.2.6.1: onFulfilled", () => {
      it("all respective onFulfilled callbacks must execute in the order of their originating calls to then.", () => {
        let resolveFn;
        const prom = new MyPromise((resolve) => {
          resolveFn = resolve;
        });
        const calls = [];
        prom.then(function fn1() {
          calls.push("A");
        });
        prom.then(function fn2() {
          calls.push("B");
        });
        prom.then(function fn3() {
          calls.push("C");
        });
        resolveFn(1);
        return delay().then(() => {
          expect(calls).toEqual(["A", "B", "C"]);
        });
      });
    });

    describe("2.2.6.2: onRejected", () => {
      it("all respective onRejected callbacks must execute in the order of their originating calls to then.", () => {
        const calls = [];
        let rejectFn;
        const prom = new MyPromise((resolve, reject) => {
          rejectFn = reject;
        });
        prom.then(null, function fn1() {
          calls.push("A");
        });
        prom.then(null, function fn2() {
          calls.push("B");
        });
        prom.then(null, function fn3() {
          calls.push("C");
        });
        rejectFn(ERR);
        return delay().then(() => {
          expect(calls).toEqual(["A", "B", "C"]);
        });
      });
    });
  });

  describe.skip("2.2.2: If onFulfilled is a function (force async):", () => {
    it("2.2.2.1: must be called after promise is fulfilled, with promise’s value as its first argument.", () => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      setTimeout(() => {
        dfd.resolve(1);
      }, 10);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledWith(1);
      });
    });
  });

  describe.skip("2.2.3: If onRejected is a function (force async):", () => {
    it("2.2.3.1: must be called after promise is rejected, with promise’s reason as its first argument.", () => {
      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);
      setTimeout(() => {
        dfd.reject(ERR);
      }, 10);
      return delay().then(() => {
        expect(onRejected).toBeCalledWith(ERR);
      });
    });
  });

  describe.skip("2.2.6: then may be called multiple times on the same promise.", () => {
    describe("2.2.6.1: onFulfilled", () => {
      it("all respective onFulfilled callbacks must execute in the order of their originating calls to then.", () => {
        const calls = [];
        dfd.promise.then(function fn1() {
          calls.push("A");
        });
        dfd.promise.then(function fn2() {
          calls.push("B");
        });
        dfd.promise.then(function fn3() {
          calls.push("C");
        });
        setTimeout(() => {
          dfd.resolve(1);
        }, 10);
        return delay().then(() => {
          expect(calls).toEqual(["A", "B", "C"]);
        });
      });
    });

    describe("2.2.6.2: onFulfilled", () => {
      it("all respective onRejected callbacks must execute in the order of their originating calls to then.", () => {
        const calls = [];
        dfd.promise.then(null, function fn1() {
          calls.push("A");
        });
        dfd.promise.then(null, function fn2() {
          calls.push("B");
        });
        dfd.promise.then(null, function fn3() {
          calls.push("C");
        });
        setTimeout(() => {
          dfd.reject(ERR);
        }, 10);
        return delay().then(() => {
          expect(calls).toEqual(["A", "B", "C"]);
        });
      });
    });

    describe("2.2.6.1: onFulfilled", () => {
      it("all respective onFulfilled callbacks must execute in the order of their originating calls to then.", () => {
        const calls = [];
        dfd.promise.then(function fn1() {
          calls.push("A");
        });
        dfd.promise.then(function fn2() {
          calls.push("B");
        });
        dfd.promise.then(function fn3() {
          calls.push("C");
        });
        setTimeout(() => {
          dfd.resolve(1);
          setTimeout(() => {
            dfd.promise.then(() => {
              calls.push("D");
            });
          }, 5);
        }, 5);
        return delay().then(() => {
          expect(calls).toEqual(["A", "B", "C", "D"]);
        });
      });
    });
  });

  describe.skip("2.2.7: then must return a promise", () => {
    it("returns a promise", () => {
      const onFulfilled = jest.fn();
      const promise2 = dfd.promise.then(onFulfilled);
      expect(typeof promise2.then).toBe("function");
    });
  });

  describe.skip("2.2.7: then must return a promise, continued", () => {
    describe("2.2.7.1: If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).", () => {
      describe("2.3: The Promise Resolution Procedure", () => {
        promiseResolutionProcedure();
      });
    });

    describe("2.2.7.2: If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.", () => {
      it("onFulfilled", () => {
        expect.assertions(1);
        const p2 = dfd.promise.then(function() {
          throw ERR;
        });
        p2.then().then(null, function(val) {
          expect(val).toEqual(ERR);
        });
        dfd.resolve(1);
        return delay();
      });

      it("onRejected", () => {
        expect.assertions(1);
        const p2 = dfd.promise.then(null, function() {
          throw ERR;
        });
        p2.then().then(null, function(val) {
          expect(val).toEqual(ERR);
        });
        dfd.reject(1);
        return delay();
      });
    });

    it("2.2.7.3: If onFulfilled is not a function and promise1 is fulfilled, promise2 must be fulfilled with the same value as promise1.", () => {
      expect.assertions(1);
      const p2 = dfd.promise.then().then(function(v) {
        return v + 10;
      });
      p2.then().then(function(val) {
        expect(val).toEqual(20);
      });
      dfd.resolve(10);
      return delay();
    });

    it("2.2.7.4: If onRejected is not a function and promise1 is rejected, promise2 must be rejected with the same reason as promise1.", () => {
      expect.assertions(1);
      const p2 = dfd.promise.then();
      p2.then().then(null, function(val) {
        expect(val).toEqual(ERR);
      });
      dfd.reject(ERR);
      return delay();
    });
  });
});

function promiseResolutionProcedure() {
  it("2.3.4: If x is not an object or function, fulfill promise with x.", () => {
    expect.assertions(1);
    const promise2 = dfd.promise.then((i) => i + 1);
    promise2.then((v) => {
      expect(v).toEqual(2);
    });
    dfd.resolve(1);
    return delay();
  });

  describe("2.3.2: If x promise, adopt its state.", () => {
    it("assumes state", () => {
      expect.assertions(1);
      const promise2 = dfd.promise.then((x) => x);
      dfd.resolve(Promise.resolve(1));
      promise2.then((x) => {
        expect(x).toEqual(1);
      });
      return delay();
    });

    it("If x is pending, promise must remain pending until x is fulfilled or rejected.", () => {
      expect.assertions(1);
      const promise2 = dfd.promise.then();
      let toResolve;
      dfd.resolve(
        new Promise((resolve) => {
          toResolve = resolve;
        })
      );
      promise2.then((x) => {
        expect(x).toEqual(2);
      });
      setTimeout(() => {
        toResolve(2);
      }, 5);
      return delay();
    });

    it("If/when x is fulfilled, fulfill promise with the same value.", () => {
      expect.assertions(1);
      const promise2 = dfd.promise.then();
      let toResolve;
      dfd.resolve(
        new Promise((resolve) => {
          toResolve = resolve;
        })
      );
      promise2.then((x) => {
        expect(x).toEqual(1);
      });
      setTimeout(() => {
        toResolve(1);
      }, 5);
      return delay();
    });

    it("If/when x is rejected, reject promise with the same value.", () => {
      expect.assertions(1);
      const promise2 = dfd.promise.then();
      let toReject;
      dfd.resolve(
        new Promise((_, reject) => {
          toReject = reject;
        })
      );
      promise2.then(null, (x) => {
        expect(x).toEqual(ERR);
      });
      setTimeout(() => {
        toReject(ERR);
      }, 5);
      return delay();
    });
  });

  describe("2.3.3: Otherwise, if x is an object or function", () => {
    it("2.3.3.2: If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.", () => {
      const obj = {
        get then() {
          throw ERR;
        }
      };
      expect.assertions(1);
      const promise2 = dfd.promise.then();
      promise2.then(null, (v) => {
        expect(v).toEqual(ERR);
      });
      dfd.resolve(obj);
      return delay();
    });

    describe("2.3.3.3: If then is a function, call it with x as this, first argument resolvePromise, and second argument rejectPromise, where", () => {
      it("If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).", () => {
        expect.assertions(3);
        const promise2 = dfd.promise.then();
        const obj = {
          then(resolve) {
            expect(arguments.length).toEqual(2);
            expect(this).toEqual(obj);
            resolve(10);
          }
        };
        promise2.then((val) => {
          expect(val).toEqual(10);
        });
        dfd.resolve(obj);
        return delay();
      });

      it("If/when rejectPromise is called with a reason r, reject promise with r.", () => {
        expect.assertions(3);
        const promise2 = dfd.promise.then();
        const obj = {
          then(resolve, reject) {
            expect(arguments.length).toEqual(2);
            expect(this).toEqual(obj);
            reject(ERR);
          }
        };
        promise2.then(null, (val) => {
          expect(val).toEqual(ERR);
        });
        dfd.resolve(obj);
        return delay();
      });

      it("If both resolvePromise and rejectPromise are called, or multiple calls to the same argument are made, the first call takes precedence, and any further calls are ignored.", () => {
        expect.assertions(3);
        const promise2 = dfd.promise.then();
        const obj = {
          then(resolve, reject) {
            expect(arguments.length).toEqual(2);
            expect(this).toEqual(obj);
            resolve(10);
            reject(ERR);
          }
        };
        promise2.then(
          (val) => {
            expect(val).toEqual(10);
          },
          (err) => {
            throw new Error("Should not be called");
          }
        );
        dfd.resolve(obj);
        return delay();
      });
    });
  });

  it("2.3.1: If promise and x refer to the same object, reject promise with a TypeError as the reason.", () => {
    expect.assertions(1);
    const p = dfd.promise.then();
    dfd.resolve(p);
    p.then(null, function(val) {
      expect(val).toBeInstanceOf(TypeError);
    });
    return delay();
  });
}

// Implementation details to make the test suite work, don't worry too much about these.
let dfd: Deferred;
beforeEach(() => {
  clearTimeout(timer);
  dfd = deferred();
});

let timer;
// Timers aren't great, but they're the only thing we really have until we get to a
// certain point with the promise implementation
function delay() {
  return new Promise((resolve) => {
    timer = setTimeout(resolve, 20);
  });
}
