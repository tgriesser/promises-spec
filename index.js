const Q = require("q");
const when = require("when");
const Bluebird = require("bluebird");
const test = require("./test");

// Implementing Promises A+
// https://promisesaplus.com/

// Some examples of test suites

// test.testClass(Promise);

// test.testClass(Bluebird);

// test.testFunction(when.promise);

// test.testFunction(Q.Promise);

// -------------------------
// https://promisesaplus.com/
//
// You can implement this in either style, functionally or using Classes:
// -------------------------

// Functional Boilerplate:

// /**
//  * @param {Parameters<typeof when.promise>[0]} fn
//  */
// function myPromise(fn) {
//   function resolve() {}
//   function reject() {}
//   fn(resolve, reject);
//   return {
//     then() {}
//   };
// }

// test.testFunction(myPromise);

// Class Boilerplate:

// class MyPromise {
//   /**
//    * @param {ConstructorParameters<typeof Bluebird>[0]} fn
//    */
//   constructor(fn) {
//     this._resolve.bind(this);
//     this._reject.bind(this);
//     fn(this._resolve, this._reject);
//   }
//   _resolve() {}
//   _reject() {}
//   then() {}
// }

// test.testClass(MyPromise);
