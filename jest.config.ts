import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1',
  //   '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
  // },
  coverageDirectory: '../coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
};

export default config;
