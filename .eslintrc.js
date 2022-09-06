module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
    },
  },
  env: {
    node: true,
    mocha: true,
  },
  rules: {
    "@typescript-eslint/require-await": "off",
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        patterns: [".*"],
      },
    ],
    "import/order": [
      "error",
      {
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: "@/**",
            group: "external",
            position: "after",
          },
          {
            pattern: "@test/**",
            group: "external",
            position: "after",
          },
        ],
        "newlines-between": "always",
      },
    ],
  },
  ignorePatterns: [".eslintrc.js", "scripts", "nyc.config.js", "dist"],
};
