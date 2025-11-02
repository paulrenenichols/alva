/**
 * @fileoverview Jest configuration for email-client library testing
 */

export default {
  displayName: 'email-client',
  preset: '../../jest.preset.js',
  setupFilesAfterEnv: ['../../jest.setup.ts'],
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/libs/email-client',
  testEnvironment: 'node',
  // Suppress console warnings/errors in test output to prevent CI failures
  silent: false,
};

