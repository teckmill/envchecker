// Mock dotenv
const mockDotenv = {
    config: jest.fn(() => ({
        parsed: {},
        error: null
    }))
};

jest.mock('dotenv', () => mockDotenv);

// Mock fs module
jest.mock('fs', () => ({
    readFileSync: jest.fn(),
    existsSync: jest.fn()
}));

// Add any global test setup here
