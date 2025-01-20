module.exports = {
    REQUIRED_VARIABLES: {
        PORT: { 
            type: 'number',
            min: 1024,
            max: 65535,
            default: 3000,
            validate: (value) => {
                const reserved = [3306, 5432, 27017]; // Common DB ports
                return !reserved.includes(Number(value)) || 'Port is reserved for common databases';
            }
        },
        NODE_ENV: { 
            type: 'string', 
            allowed: ['development', 'production'],
            validate: (value) => {
                if (value === 'production') {
                    // In production, ensure certain security variables are set
                    return process.env.JWT_SECRET && process.env.API_KEY 
                        ? true 
                        : 'Production environment requires JWT_SECRET and API_KEY';
                }
                return true;
            }
        },
        DATABASE_URL: { 
            type: 'string',
            pattern: '^(postgres|postgresql|mysql|mongodb):\/\/.*$',
            validate: (value) => {
                try {
                    const url = new URL(value);
                    if (!url.username || !url.password) {
                        return 'Database URL must include credentials';
                    }
                    return true;
                } catch {
                    return 'Invalid database URL format';
                }
            }
        },
        API_KEY: {
            type: 'string',
            sensitive: true,
            minLength: 32,
            maxLength: 64
        },
        EMAIL_CONFIG: {
            type: 'json',
            validate: (value) => {
                try {
                    const config = JSON.parse(value);
                    const required = ['host', 'port', 'user', 'password'];
                    const missing = required.filter(key => !(key in config));
                    return missing.length === 0 ? true : `Missing required fields: ${missing.join(', ')}`;
                } catch {
                    return 'Must be valid JSON with email configuration';
                }
            }
        },
        CORS_ORIGINS: {
            type: 'string',
            validate: (value) => {
                const origins = value.split(',').map(o => o.trim());
                const validUrl = /^https?:\/\/[\w-]+(\.[\w-]+)+$/;
                const invalid = origins.filter(o => !validUrl.test(o));
                return invalid.length === 0 ? true : `Invalid URLs: ${invalid.join(', ')}`;
            }
        },
        LOG_LEVEL: {
            type: 'string',
            allowed: ['error', 'warn', 'info', 'debug', 'trace'],
            default: 'info'
        },
        CACHE_TTL: {
            type: 'number',
            min: 0,
            max: 86400,
            default: 3600,
            validate: (value) => Number(value) % 60 === 0 || 'Must be in minutes (multiple of 60)'
        },
        ADMIN_EMAIL: {
            type: 'email',
            pattern: '^[\\w.-]+@(company\\.com|org\\.com)$',
            validate: (value) => {
                // Additional domain-specific validation
                const [local, domain] = value.split('@');
                if (local.length < 3) return 'Username too short';
                if (!['company.com', 'org.com'].includes(domain)) {
                    return 'Must use company email domain';
                }
                return true;
            }
        },
        WEBHOOK_URL: {
            type: 'url',
            validate: (value) => {
                const url = new URL(value);
                return url.protocol === 'https:' || 'Webhook URL must use HTTPS';
            }
        },
        DEBUG: { 
            type: 'boolean', 
            default: false 
        },
    },
};
