module.exports = {
  timeout: 30000,
  extension: ["ts"],
  spec: ["test/**/*.spec.ts"],
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
    "chai/register-expect.js",
    "test/setup.ts",
  ],
};
