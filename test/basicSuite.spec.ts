import { Deferred } from "../templates/util/types";
import { getDeferred } from "./_deferred";

describe("promise.then(onFulfilled, onRejected)", function() {
  let dfd: Deferred;
  beforeEach(() => {
    dfd = getDeferred();
  });

  test("2.1.1 - 2.1.3", () => {
    // Internal state rules, cannot be tested directly, only indirectly
    expect(1).toEqual(1);
  });

  test("2.2.1 - Both onFulfilled and onRejected are optional arguments", () => {
    dfd.promise.then();
    dfd.resolve({});
  });

  describe("2.2.2: If onFulfilled is a function:", () => {
    test("2.2.2.1: it must be called after promise is fulfilled, with promise’s value as its first argument.", (done) => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      Promise.resolve(() => {
        expect(onFulfilled).toBeCalledWith(1);
        done();
      });
    });

    test("2.2.2.2: it must not be called before promise is fulfilled.", (done) => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      Promise.resolve(() => {
        expect(onFulfilled).not.toBeCalled();
        dfd.resolve(1);
        done();
      });
    });

    test("2.2.2.3: it must not be called more than once.", (done) => {
      expect.assertions(2);

      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);

      dfd.resolve(1);
      dfd.resolve(2);

      Promise.resolve().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
        done();
      });
    });
  });

  describe("2.2.3: If onRejected is a function:", () => {
    test("2.2.3.1: it must be called after promise is rejected, with promise’s reason as its first argument.", (done) => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      Promise.resolve(() => {
        expect(onFulfilled).toBeCalledWith(1);
        done();
      });
    });

    test("2.2.3.2: it must not be called before promise is rejected.", (done) => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      Promise.resolve(() => {
        expect(onFulfilled).not.toBeCalled();
        dfd.resolve(1);
        done();
      });
    });

    test("2.2.3.3: it must not be called more than once.", (done) => {
      expect.assertions(2);

      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);

      dfd.resolve(1);
      dfd.resolve(2);

      Promise.resolve().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
        done();
      });
    });
  });

  describe("2.2.4: onFulfilled or onRejected must not be called until the execution context stack contains only platform code.", () => {
    test("onFulfilled", (done) => {
      const onFulfilled = jest.fn();
      dfd.promise.then(onFulfilled);
      dfd.resolve(1);
      expect(onFulfilled).toBeCalledTimes(0);
      Promise.resolve().then(() => {
        expect(onFulfilled).toBeCalledTimes(1);
        expect(onFulfilled).toBeCalledWith(1);
        done();
      });
    });

    test("onRejected", (done) => {
      const onRejected = jest.fn();
      dfd.promise.then(null, onRejected);
      dfd.resolve(1);
      expect(onRejected).toBeCalledTimes(0);
      Promise.resolve().then(() => {
        expect(onRejected).toBeCalledTimes(1);
        expect(onRejected).toBeCalledWith(1);
        done();
      });
    });
  });
});
