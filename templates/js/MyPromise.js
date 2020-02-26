class MyPromise {
  constructor(fn) {
    fn(this._resolve, this._reject);
  }

  _resolve = (val) => {
    //
  };

  _reject = (val) => {
    //
  };

  then(onFulfilled, onRejected) {
    //
  }
}

module.exports = MyPromise;
