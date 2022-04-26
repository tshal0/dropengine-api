import type { Config } from "@jest/types";
import mapper from "jest-module-name-mapper";
const mappings = {
  ...mapper(),
};
const config: Config.InitialOptions = {
  moduleNameMapper: mappings,

  // collectCoverageFrom: ["src/**/*.(t|j)s"],
  // coveragePathIgnorePatterns: ["src/console", "src/migration"],
  // coverageDirectory: "coverage",
  // coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  // collectCoverage: true,
  // reporters: ["default", "jest-junit"],

  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  globalSetup: "./src/.jest/globalSetup.ts",
  globalTeardown: "./src/.jest/globalTeardown.ts",
  setupFiles: ["./src/.jest/setup.ts"],
};

export default config;
