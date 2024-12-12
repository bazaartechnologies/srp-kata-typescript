/** @type {import('ts-jest').JestConfigWithTsJest} **/

// test commit
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};