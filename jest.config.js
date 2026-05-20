module.exports = {
  testMatch: ['**/src/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { useESM: false }],
  },
}