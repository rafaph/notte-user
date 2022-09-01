module.exports = {
  extends: "@istanbuljs/nyc-config-typescript",
  all: true,
  "check-coverage": true,
  extension: [".ts"],
  include: ["src/**/*.ts"],
  reporter: ["text", "html"],
  statements: 75,
  branches: 56,
  functions: 62,
  lines: 74,
};
