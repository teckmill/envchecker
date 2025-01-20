module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testMatch: [
        '**/tests/**/*.test.js',
        '**/__tests__/**/*.test.js'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/test-autofixer/src/__tests__/fixtures/'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    setupFilesAfterEnv: ['./jest.setup.js']
};
