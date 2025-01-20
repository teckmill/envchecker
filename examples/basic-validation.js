const { validateEnv } = require('@envchecker/env-validator');

// Load environment variables from .env file
require('dotenv').config();

// Define validation schema
const config = {
    REQUIRED_VARIABLES: {
        PORT: {
            type: 'number',
            required: true,
            min: 1024,
            max: 65535,
            description: 'Port number for the server'
        },
        NODE_ENV: {
            type: 'string',
            required: true,
            allowedValues: ['development', 'staging', 'production'],
            description: 'Current environment'
        }
    }
};

// Validate environment variables
try {
    validateEnv(config);
    console.log('✅ Environment variables are valid!');
} catch (error) {
    console.error('❌ Validation failed:', error.errors);
    process.exit(1);
}
