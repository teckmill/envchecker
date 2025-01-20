class ValidationError extends Error {
    constructor(errors) {
        super(Array.isArray(errors) ? errors[0] : errors);
        this.name = 'ValidationError';
        this.errors = Array.isArray(errors) ? errors : [errors];
    }
}

function validateEnv(config) {
    if (!config || typeof config !== 'object') {
        throw new ValidationError('Invalid configuration object');
    }

    const errors = [];
    const validatedEnv = {};

    if (!config.REQUIRED_VARIABLES) {
        return { success: true, validatedEnv };
    }

    for (const [key, options] of Object.entries(config.REQUIRED_VARIABLES)) {
        let value = process.env[key];

        if (!value) {
            if (options.default !== undefined) {
                value = String(options.default);
            } else if (options.required !== false) {
                errors.push(`${key} is required`);
                continue;
            } else {
                continue;
            }
        }

        try {
            let validatedValue = value;

            // Validate pattern first if specified
            if (options.pattern) {
                const regex = new RegExp(options.pattern);
                if (!regex.test(value)) {
                    throw new Error(`must match pattern: ${options.pattern}`);
                }
            }

            let num;
            const lowerValue = value.toLowerCase();

            switch (options.type) {
            case 'string':
                validatedValue = String(value);
                break;

            case 'number':
                num = Number(value);
                if (isNaN(num)) {
                    throw new Error('must be a number');
                }
                // Validate min/max if specified
                if (options.min !== undefined && num < options.min) {
                    throw new Error(`must be greater than or equal to ${options.min}`);
                }
                if (options.max !== undefined && num > options.max) {
                    throw new Error(`must be less than or equal to ${options.max}`);
                }
                validatedValue = num;
                break;

            case 'url':
                try {
                    new URL(value);
                } catch (error) {
                    throw new Error('must be a valid URL');
                }
                break;

            case 'boolean':
                if (lowerValue !== 'true' && lowerValue !== 'false') {
                    throw new Error('must be a boolean (true/false)');
                }
                validatedValue = lowerValue === 'true';
                break;

            default:
                throw new Error(`unsupported type: ${options.type}`);
            }

            validatedEnv[key] = validatedValue;
        } catch (error) {
            errors.push(`${key}: ${error.message}`);
        }
    }

    if (errors.length > 0) {
        throw new ValidationError(errors);
    }

    return {
        success: true,
        validatedEnv
    };
}

module.exports = {
    validateEnv,
    ValidationError
};
