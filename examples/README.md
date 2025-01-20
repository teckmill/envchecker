# EnvChecker Examples

This directory contains example configurations and use cases for the `@envchecker/env-validator` package.

## Basic Validation
[`basic-validation.js`](./basic-validation.js) demonstrates simple environment variable validation:
- Number validation with min/max values
- String validation with allowed values
- Required field validation

## Advanced Validation
[`advanced-validation.js`](./advanced-validation.js) shows more complex validation scenarios:
- URL validation with pattern matching
- JSON schema validation
- Array validation
- Conditional validation based on other environment variables
- Sensitive value handling

## Custom Validation
[`custom-validation.js`](./custom-validation.js) illustrates how to create custom validation rules:
- Semantic version validation
- Cron expression validation
- Rate limit format validation

## Running the Examples

1. Install dependencies:
```bash
npm install @envchecker/env-validator dotenv
```

2. Run any example:
```bash
node basic-validation.js
node advanced-validation.js
node custom-validation.js
```

## Common Use Cases

### API Configuration
```javascript
const config = {
  REQUIRED_VARIABLES: {
    API_PORT: { type: 'number', min: 1024, max: 65535 },
    API_KEY: { type: 'string', sensitive: true, minLength: 32 },
    ALLOWED_ORIGINS: { type: 'array' }
  }
};
```

### Database Configuration
```javascript
const config = {
  REQUIRED_VARIABLES: {
    DB_HOST: { type: 'string' },
    DB_PORT: { type: 'number' },
    DB_NAME: { type: 'string' },
    DB_USER: { type: 'string' },
    DB_PASS: { type: 'string', sensitive: true }
  }
};
```

### Email Configuration
```javascript
const config = {
  REQUIRED_VARIABLES: {
    SMTP_CONFIG: {
      type: 'json',
      schema: {
        host: { type: 'string', required: true },
        port: { type: 'number', required: true },
        secure: { type: 'boolean', required: true },
        auth: {
          user: { type: 'string', required: true },
          pass: { type: 'string', required: true }
        }
      }
    }
  }
};
```

### Production-Only Requirements
```javascript
const config = {
  CONDITIONAL_VARIABLES: {
    SSL_CERT: {
      type: 'string',
      required: (env) => env.NODE_ENV === 'production'
    },
    SSL_KEY: {
      type: 'string',
      required: (env) => env.NODE_ENV === 'production'
    }
  }
};
```
