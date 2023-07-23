import type { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  testTimeout: 30000,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.(e2e-)?spec\\.ts$",
  preset: "ts-jest",
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFiles: ["<rootDir>/test/jest.setup.ts"],
};

export default config;
