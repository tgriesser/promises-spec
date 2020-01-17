require("ts-node/register/transpile-only");

const test = require("./templates/util/test");

const Q = require("q");
const when = require("when");
const Bluebird = require("bluebird");

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
 * simple Promise implementation which passes as much of the test suite as we can get through in the
 * allotted time.
 *
 * Here are a few examples of existing promise libraries running against the test suite,
 * uncomment them one at a time and run run `yarn test` or `npm run test` to see then in action.
 */

// test.testClass(Bluebird);

// test.testFunction(when.promise);

// test.testClass(Promise);

// test.testFunction(Q.Promise);

/**
 * Now we're going to attempt to implement the spec for ourselves.
 *
 * Before getting started, take a minute to read through the spec a bit, it's a quick read. We'll
 * look to break it down and implement it step-by-step
 *
 * https://promisesaplus.com/
 *
 * You can implement this in whatever style you'd like, using functions or using classes, TypeScript
 * or JavaScript. If you're not sure, we'd recommend  using functions because the implementation will
 * be smaller/simpler but won't hold it against you if you'd feel more comfortable using a class.
 *
 * We use a mix of classes & functions as it makes sense in the Cypress Services codebase.
 *
 * We've gotten you started with a little boilerplate if you'd like - comment out one of the files
 * you'd like to work in and proceed there.
 */

// require("./templates/ts/function");
// require("./templates/js/function");

// require("./templates/ts/class");
// require("./templates/js/class");
