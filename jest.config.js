/// <reference types="jest" />
const path = require("path");

/**
 * @type {jest.DefaultOptions}
 */
module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      tsConfig: path.join(__dirname, "tsconfig.json"),
      diagnostics: false
    }
  },
  verbose: true,
  testTimeout: 100
};
