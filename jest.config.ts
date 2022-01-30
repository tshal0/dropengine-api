import type { Config } from '@jest/types';
import mapper from 'jest-module-name-mapper';
const config: Config.InitialOptions = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: {
    ...mapper(),
  },
  modulePaths: ['src'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['src/console', 'src/migration'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  rootDir: './',

  // collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  json: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.build.json',
    },
  },
  setupFiles: ['./jest-setup-file.ts'],
};

export default config;
