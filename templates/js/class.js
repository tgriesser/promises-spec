class MyPromise {
  constructor(fn) {
    this.then = this.then.bind(this);
    this._resolve = this._resolve.bind(this);
    this._reject = this._reject.bind(this);
    fn(this._resolve, this._reject);
  }

  _resolve(val) {
    // TODO
  }

  _reject(val) {
    // TODO
  }

  then(onFulfilled, onRejected) {
    let deferred = {};
    deferred.promise = new MyPromise((resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    // TODO
    return deferred.promise;
  }
}

module.exports = {};

// module.exports.MyPromise = MyPromise;
