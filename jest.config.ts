import type { Config } from "@jest/types";
import mapper from "jest-module-name-mapper";
const mappings = {
  ...mapper(),
};
console.log("🚀 ~ file: jest.config.ts ~ line 4 ~ mappings", mappings);
const config: Config.InitialOptions = {
  moduleNameMapper: mappings,

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  coveragePathIgnorePatterns: ["node_modules", ".mock.ts", "jest.config.ts", "src/.jest"],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./coverage",
        filename: "report.html",
        openReport: true,
      },
    ],
    ["jest-junit", { outputDirectory: "results", outputName: "junit.xml" }],
  ],

  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },

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
