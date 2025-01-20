// Increase timeout for all tests
jest.setTimeout(10000);

// Add custom matchers if needed
expect.extend({
    toBeValidationError(received, expected) {
        const pass = received.message === expected;
        if (pass) {
            return {
                message: () => `expected ${received} not to be ValidationError with message "${expected}"`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected ${received} to be ValidationError with message "${expected}"`,
                pass: false,
            };
        }
    },
});
