const { validateEnv, ValidationError } = require('../src/validator');

describe('Validator', () => {
    let originalEnv;

    beforeEach(() => {
        originalEnv = { ...process.env };
        process.env = {};
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    describe('Configuration Validation', () => {
        test('throws error for null config', () => {
            expect(() => validateEnv(null)).toThrow(ValidationError);
            expect(() => validateEnv(null)).toThrow('Invalid configuration object');
        });

        test('throws error for undefined config', () => {
            expect(() => validateEnv(undefined)).toThrow(ValidationError);
            expect(() => validateEnv(undefined)).toThrow('Invalid configuration object');
        });

        test('handles empty config object', () => {
            const result = validateEnv({});
            expect(result.success).toBe(true);
            expect(result.validatedEnv).toEqual({});
        });
    });

    describe('Basic Validation', () => {
        test('validates required variables', () => {
            process.env.PORT = '3000';
            process.env.API_URL = 'https://api.example.com';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number'
                    },
                    API_URL: {
                        type: 'url'
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.PORT).toBe(3000);
            expect(result.validatedEnv.API_URL).toBe('https://api.example.com');
        });

        test('throws error for missing required variables', () => {
            // Only set PORT, intentionally missing API_URL
            process.env.PORT = '3000';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number'
                    },
                    API_URL: {
                        type: 'url'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('API_URL is required');
        });
    });

    describe('Type Validation', () => {
        test('validates string type', () => {
            process.env.NAME = 'test-value';

            const config = {
                REQUIRED_VARIABLES: {
                    NAME: {
                        type: 'string'
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.NAME).toBe('test-value');
        });

        test('throws error for unknown type', () => {
            process.env.TEST = 'value';

            const config = {
                REQUIRED_VARIABLES: {
                    TEST: {
                        type: 'unknown-type'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('TEST: unsupported type: unknown-type');
        });

        test('throws error for invalid number type', () => {
            process.env.PORT = 'not-a-number';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('PORT: must be a number');
        });

        test('throws error for invalid URL type', () => {
            process.env.API_URL = 'not-a-url';

            const config = {
                REQUIRED_VARIABLES: {
                    API_URL: {
                        type: 'url'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('API_URL: must be a valid URL');
        });

        test('validates boolean type with true value', () => {
            process.env.DEBUG = 'true';

            const config = {
                REQUIRED_VARIABLES: {
                    DEBUG: {
                        type: 'boolean'
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.DEBUG).toBe(true);
        });

        test('validates boolean type with false value', () => {
            process.env.DEBUG = 'false';

            const config = {
                REQUIRED_VARIABLES: {
                    DEBUG: {
                        type: 'boolean'
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.DEBUG).toBe(false);
        });

        test('throws error for invalid boolean type', () => {
            process.env.DEBUG = 'not-a-boolean';

            const config = {
                REQUIRED_VARIABLES: {
                    DEBUG: {
                        type: 'boolean'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('DEBUG: must be a boolean (true/false)');
        });
    });

    describe('Optional Variables', () => {
        test('allows missing optional variables', () => {
            process.env.REQUIRED_VAR = 'value';
            // Intentionally not setting OPTIONAL_VAR

            const config = {
                REQUIRED_VARIABLES: {
                    REQUIRED_VAR: {
                        type: 'string'
                    },
                    OPTIONAL_VAR: {
                        type: 'string',
                        required: false
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.REQUIRED_VAR).toBe('value');
            expect(result.validatedEnv.OPTIONAL_VAR).toBeUndefined();
        });

        test('validates optional variables when present', () => {
            process.env.REQUIRED_VAR = 'value';
            process.env.OPTIONAL_VAR = '123';

            const config = {
                REQUIRED_VARIABLES: {
                    REQUIRED_VAR: {
                        type: 'string'
                    },
                    OPTIONAL_VAR: {
                        type: 'number',
                        required: false
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.REQUIRED_VAR).toBe('value');
            expect(result.validatedEnv.OPTIONAL_VAR).toBe(123);
        });

        test('validates type of optional variables when present', () => {
            process.env.REQUIRED_VAR = 'value';
            process.env.OPTIONAL_VAR = 'not-a-number';

            const config = {
                REQUIRED_VARIABLES: {
                    REQUIRED_VAR: {
                        type: 'string'
                    },
                    OPTIONAL_VAR: {
                        type: 'number',
                        required: false
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('OPTIONAL_VAR: must be a number');
        });
    });

    describe('Default Values', () => {
        test('uses default value when variable is missing', () => {
            // Don't set PORT in process.env
            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number',
                        default: 3000
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.PORT).toBe(3000);
        });

        test('uses environment value over default when present', () => {
            process.env.PORT = '8080';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number',
                        default: 3000
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.PORT).toBe(8080);
        });

        test('validates type of default value', () => {
            const config = {
                REQUIRED_VARIABLES: {
                    API_URL: {
                        type: 'url',
                        default: 'not-a-url'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('API_URL: must be a valid URL');
        });

        test('handles default boolean values', () => {
            const config = {
                REQUIRED_VARIABLES: {
                    DEBUG: {
                        type: 'boolean',
                        default: true
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.DEBUG).toBe(true);
        });
    });

    describe('Pattern Validation', () => {
        test('validates value against pattern', () => {
            process.env.USERNAME = 'john_doe123';

            const config = {
                REQUIRED_VARIABLES: {
                    USERNAME: {
                        type: 'string',
                        pattern: '^[a-z_][a-z0-9_]*$'
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.USERNAME).toBe('john_doe123');
        });

        test('throws error for value not matching pattern', () => {
            process.env.USERNAME = '123invalid';

            const config = {
                REQUIRED_VARIABLES: {
                    USERNAME: {
                        type: 'string',
                        pattern: '^[a-z_][a-z0-9_]*$'
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('USERNAME: must match pattern: ^[a-z_][a-z0-9_]*$');
        });
    });

    describe('Number Constraints', () => {
        test('validates number within min/max range', () => {
            process.env.PORT = '3000';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number',
                        min: 1024,
                        max: 65535
                    }
                }
            };

            const result = validateEnv(config);
            expect(result.success).toBe(true);
            expect(result.validatedEnv.PORT).toBe(3000);
        });

        test('throws error for number below minimum', () => {
            process.env.PORT = '80';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number',
                        min: 1024,
                        max: 65535
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('PORT: must be greater than or equal to 1024');
        });

        test('throws error for number above maximum', () => {
            process.env.PORT = '70000';

            const config = {
                REQUIRED_VARIABLES: {
                    PORT: {
                        type: 'number',
                        min: 1024,
                        max: 65535
                    }
                }
            };

            expect(() => validateEnv(config)).toThrow(ValidationError);
            expect(() => validateEnv(config)).toThrow('PORT: must be less than or equal to 65535');
        });
    });
});
