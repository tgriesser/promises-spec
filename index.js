require("ts-node/register/transpile-only");
const suite = require("promises-aplus-tests");
const { makeTestAdapter } = require("./test/_deferred");

/**
 * Promises A+
 *
 * Promises are an essential part of Node/async JavaScript programming, and we often take for-granted the
 * existence of Promises. Did you know, that Promises didn't exist "officially" in JavaScript until 2015,
 * and in 2013, they were still considered controversial in Node compared to using callbacks?
 *
 * The "Promises A+" specification, an interoperable standard for working with Promises in JavaScript,
 * is actually quite small. It only defines the behavior of a single function, "then"
 *
 * https://promisesaplus.com/
 *
 * In this exercise we're going to look at the spec and try to work through implementing our own
 * simple Promise implementation which passes some of the requirements of a Promise implementation.
 */

testClass(require("bluebird"));

// testClass(Promise);

function testClass(PromiseClass) {
  suite(
    makeTestAdapter(() => {
      const dfd = {};
      dfd.promise = new PromiseClass((resolve, reject) => {
        dfd.resolve = resolve;
        dfd.reject = reject;
      });
      return dfd;
    }),
    { bail: true }
  );
}
