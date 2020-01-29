import { Deferred } from "../templates/util/types";
import { getDeferred } from "./_deferred";

const ERR = new Error("ERR");

describe("promise.then(onFulfilled, onRejected)", function() {
  let dfd: Deferred;
  beforeEach(() => {
    dfd = getDeferred();
  });

  it("2.1.1 - 2.1.3", () => {
    // Internal state rules, cannot be tested directly, only indirectly
    expect(1).toEqual(1);
  });

  it("2.2.1 - Both onFulfilled and onRejected are optional arguments", () => {
    dfd.promise.then();
    dfd.resolve({});
  });

  describe("2.2.2: If onFulfilled is a function:", () => {
    it("2.2.2.1: must be called after promise is fulfilled, with promise’s value as its first argument.", () => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledWith(1);
      });
    });

    it("2.2.2.2: must not be called before promise is fulfilled.", () => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      return delay().then(() => {
        expect(onFulfilled).not.toBeCalled();
        dfd.resolve(1);
      });
    });

    it("2.2.2.3: must not be called more than once.", () => {
      expect.assertions(2);

      const onFulfilled = jest.fn();

      dfd.resolve(1);
      dfd.resolve(2);

      dfd.promise.then(onFulfilled);

      return delay().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
      });
    });
  });

  describe("2.2.3: If onRejected is a function:", () => {
    it("2.2.3.1: must be called after promise is rejected, with promise’s reason as its first argument.", () => {
      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);
      dfd.reject(ERR);
      return delay().then(() => {
        expect(onRejected).toBeCalledWith(ERR);
      });
    });

    it("2.2.3.2: must not be called before promise is rejected.", () => {
      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);
      return delay().then(() => {
        expect(onRejected).not.toBeCalled();
        dfd.reject(ERR);
      });
    });

    it("2.2.3.3: must not be called more than once.", () => {
      expect.assertions(2);

      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);

      dfd.reject(ERR);
      dfd.reject(2);

      return delay().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(ERR);
      });
    });
  });

  describe("2.2.4: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.", () => {
    it("onFulfilled", () => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      expect(onFulfilled).toBeCalledTimes(0);
      return delay().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
      });
    });

    it("onRejected", () => {
      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);
      dfd.reject(ERR);
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
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      return delay();
    });

    it("onRejected", () => {
      expect.assertions(1);
      function onRejected() {
        expect(this).toBeUndefined();
      }
      dfd.promise.then(null, onRejected);
      dfd.reject(ERR);
      return delay();
    });
  });

  describe("2.2.6: then may be called multiple times on the same promise.", () => {
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
        dfd.resolve(1);
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
        dfd.reject(ERR);
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
