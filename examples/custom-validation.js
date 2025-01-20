const { validateEnv } = require('@envchecker/env-validator');

// Load environment variables from .env file
require('dotenv').config();

// Define custom validation functions
const isValidSemver = (value) => /^\d+\.\d+\.\d+$/.test(value);
const isValidCron = (value) => {
    const parts = value.split(' ');
    return parts.length === 5 && parts.every(part => /^[\d,\-\*\/]+$/.test(part));
};

// Define validation schema with custom validation
const config = {
    REQUIRED_VARIABLES: {
        VERSION: {
            type: 'string',
            required: true,
            validate: (value) => {
                if (!isValidSemver(value)) {
                    throw new Error('Must be a valid semantic version (e.g., 1.0.0)');
                }
            },
            description: 'Application version'
        },
        BACKUP_SCHEDULE: {
            type: 'string',
            required: true,
            validate: (value) => {
                if (!isValidCron(value)) {
                    throw new Error('Must be a valid cron expression');
                }
            },
            description: 'Backup schedule in cron format'
        },
        RATE_LIMIT: {
            type: 'string',
            required: true,
            validate: (value) => {
                const [limit, period] = value.split('/');
                if (!limit || !period || isNaN(limit) || !['second', 'minute', 'hour'].includes(period)) {
                    throw new Error('Must be in format: number/(second|minute|hour)');
                }
            },
            description: 'API rate limit'
        }
    }
};

// Example .env file content
require('fs').writeFileSync('.env', `
VERSION=1.2.3
BACKUP_SCHEDULE=0 0 * * *
RATE_LIMIT=100/minute
`);

// Validate environment variables
try {
    validateEnv(config);
    console.log('✅ Environment variables are valid!');
} catch (error) {
    console.error('❌ Validation failed:', error.errors);
    process.exit(1);
}
