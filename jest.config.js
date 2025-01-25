module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    globalSetup: '<rootDir>/src/__tests__/setup.ts',
    globalTeardown: '<rootDir>/src/__tests__/setup.ts',
};