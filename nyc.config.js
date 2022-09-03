module.exports = {
  extends: "@istanbuljs/nyc-config-typescript",
  all: true,
  "check-coverage": true,
  extension: [".ts"],
  include: ["src/**/*.ts"],
  reporter: ["text", "html"],
  statements: 97,
  branches: 83,
  functions: 100,
  lines: 97,
};
