import { makeAdapter } from "./_deferred";
const suite = require("promises-aplus-tests");

suite(makeAdapter(), { bail: true, timeout: 100 });
