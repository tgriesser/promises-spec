// import MyPromise from '../templates/js/MyPromise'
import { MyPromise } from "../templates/ts/MyPromise";

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
      const prom = new MyPromise((resolve) => {
        resolve(1);
      });
      prom.then(onFulfilled);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledWith(1);
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

  describe("2.2.2: If onRejected is a function:", () => {
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
      prom.then(onRejected);
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
      prom.then(onRejected);
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
      prom.then(onRejected);
      return delay().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(ERR);
      });
    });
  });

  describe("2.2.4: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.", () => {
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

  describe("2.2.5: onFulfilled and onRejected must be called as functions (i.e. with no this value).", () => {
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

  describe("2.2.6: then may be called multiple times on the same promise.", () => {
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
});

// Timers aren't great, but they're the only thing we really have until we get to a
// certain point with the promise implementation
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 20));
}
