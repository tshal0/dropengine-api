import type { Config } from "@jest/types";
import mapper from "jest-module-name-mapper";
const mappings = {
  ...mapper(),
};
console.log("🚀 ~ file: jest.config.ts ~ line 4 ~ mappings", mappings);
const config: Config.InitialOptions = {
  moduleNameMapper: mappings,
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coveragePathIgnorePatterns: ["node_modules", ".mock.ts", "jest.config.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  reporters: ["default", "jest-junit"],

  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  globalSetup: "./e2e/.jest/globalSetup.ts",
  globalTeardown: "./e2e/.jest/globalTeardown.ts",
  setupFiles: ["./e2e/.jest/setup.ts"],
};

export default config;
