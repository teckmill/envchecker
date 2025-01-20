const { validateEnv } = require('@envchecker/env-validator');

// Load environment variables from .env file
require('dotenv').config();

// Define validation schema with advanced features
const config = {
    REQUIRED_VARIABLES: {
        DATABASE_URL: {
            type: 'url',
            required: true,
            pattern: '^postgres://',
            description: 'PostgreSQL database connection URL'
        },
        API_KEY: {
            type: 'string',
            required: true,
            sensitive: true,
            minLength: 32,
            description: 'API key for external service'
        },
        EMAIL_CONFIG: {
            type: 'json',
            required: true,
            schema: {
                host: { type: 'string', required: true },
                port: { type: 'number', required: true },
                secure: { type: 'boolean', required: true }
            },
            description: 'Email server configuration'
        },
        CORS_ORIGINS: {
            type: 'array',
            required: true,
            description: 'Allowed CORS origins'
        }
    },
    CONDITIONAL_VARIABLES: {
        SSL_CERT: {
            type: 'string',
            required: (env) => env.NODE_ENV === 'production',
            description: 'SSL certificate path (required in production)'
        },
        REDIS_URL: {
            type: 'url',
            pattern: '^redis://',
            required: (env) => env.CACHE_ENABLED === 'true',
            description: 'Redis URL (required if caching is enabled)'
        }
    }
};

// Example .env file content
require('fs').writeFileSync('.env', `
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
API_KEY=abcdef1234567890abcdef1234567890abcd
EMAIL_CONFIG={"host":"smtp.example.com","port":587,"secure":true}
CORS_ORIGINS=["https://app.example.com","https://admin.example.com"]
NODE_ENV=production
SSL_CERT=/path/to/cert.pem
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379
`);

// Validate environment variables
try {
    validateEnv(config);
    console.log('✅ Environment variables are valid!');
} catch (error) {
    console.error('❌ Validation failed:', error.errors);
    process.exit(1);
}
