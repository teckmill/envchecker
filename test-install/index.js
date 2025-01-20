require('dotenv').config();
const { validateEnv } = require('@envchecker/env-validator');

// Create a test .env file
require('fs').writeFileSync('.env', `
PORT=3000
NODE_ENV=development
DATABASE_URL=https://example.com/db
API_KEY=abcdef1234567890abcdef1234567890
`);

// Load and validate environment variables
try {
    const config = {
        REQUIRED_VARIABLES: {
            PORT: {
                type: 'number',
                required: true,
                min: 1024,
                max: 65535
            },
            NODE_ENV: {
                type: 'string',
                required: true,
                allowedValues: ['development', 'staging', 'production']
            },
            DATABASE_URL: {
                type: 'url',
                required: true,
                pattern: '^https?://'
            },
            API_KEY: {
                type: 'string',
                required: true,
                sensitive: true,
                minLength: 32
            }
        }
    };

    validateEnv(config);
    console.log(' Environment variables are valid!');
} catch (error) {
    console.error(' Validation failed:', error.errors);
    process.exit(1);
}
