const promises = require("promises-aplus-tests");

type Deferred = {
  promise: PromiseLike<any>;
  resolve: (val) => PromiseLike<any>;
  reject: (val) => PromiseLike<any>;
};

export function testClass(P) {
  test(() => {
    const dfd = {} as Deferred;
    dfd.promise = new P((resolve, reject) => {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  });
}

export function testFunction(p) {
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
    resolve(value) {
      const dfd = deferred();
      dfd.resolve(value);
      return dfd.promise;
    },
    reject(err) {
      const dfd = deferred();
      dfd.reject(err);
      return dfd.promise;
    },
    deferred
  };
  promises(adapter, err => {});
}
