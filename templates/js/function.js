const test = require("../util/test");

function myPromise(fn) {
  function resolve(val) {
    // TODO
  }

  function reject(val) {
    // TODO
  }

  fn(resolve, reject);

  return {
    then(onFulfilled, onRejected) {
      let deferred = {};
      deferred.promise = myPromise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      // TODO
      return deferred.promise;
    }
  };
}

test.testFunction(myPromise);
