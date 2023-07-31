import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { compilerOptions } from "./tsconfig.json";

const { ISOLATED_MODULES } = process.env;
const isolatedModules = ISOLATED_MODULES ? ISOLATED_MODULES === "true" : true;

const config: Config = {
  testTimeout: 30000,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.(e2e-)?spec\\.ts$",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFiles: ["<rootDir>/test/jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { isolatedModules }],
  },
};

export default config;
