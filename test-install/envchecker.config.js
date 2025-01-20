module.exports = {
    REQUIRED_VARIABLES: {
    // Basic configuration
        PORT: { 
            type: 'number',
            min: 1024,
            max: 65535,
            default: 3000
        },
    
        // Allowed values
        NODE_ENV: { 
            type: 'string',
            allowed: ['development', 'production']
        },
    
        // Pattern matching
        DATABASE_URL: { 
            type: 'string',
            pattern: '^(postgres|mysql):\/\/.*$'
        },
    
        // Sensitive value detection
        API_KEY: {
            type: 'string',
            sensitive: true,
            minLength: 32,
            checkEncoded: true,
            checkEntropy: true
        },
    
        // JSON validation
        EMAIL_CONFIG: {
            type: 'json',
            validate: (value) => {
                const config = JSON.parse(value);
                return config.host ? true : 'Missing host field';
            }
        },
    
        // Dependencies
        REDIS_PASSWORD: {
            type: 'string',
            dependencies: {
                REDIS_HOST: 'required',
                REDIS_PORT: (value, portValue) => 
                    portValue === '6379' || 'Non-standard Redis port requires authentication'
            }
        },
    
        // Format validation
        VERSION: {
            type: 'string',
            format: 'semver'
        }
    }
};
