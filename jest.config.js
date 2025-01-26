module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: [
        '**/__tests__/**/*.ts',       // Match test files
        '**/?(*.)+(spec|test).ts',    // Match test files
        '!**/__tests__/setup.ts',      // Exclude setup.ts from test matching
        '!**/__tests__/globalSetup.ts', // Exclude globalSetup.ts from test matching
        '!**/__tests__/globalTeardown.ts', // Exclude globalTeardown.ts from test matching
    ],
    // globalSetup: '<rootDir>/src/__tests__/globalSetup.ts',   // Correct path to globalSetup
    // globalTeardown: '<rootDir>/src/__tests__/globalTeardown.ts', // Correct path to globalTeardown

};