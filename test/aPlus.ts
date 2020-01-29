import { makeTestAdapter } from "./_deferred";
const suite = require("promises-aplus-tests");

suite(makeTestAdapter(), { timeout: 500 });
