import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  modulePaths: ["src"],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'tests/**/*.{.js,jsx}'
  ]
};

export default config;
