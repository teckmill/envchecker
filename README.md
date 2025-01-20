# EnvChecker

A powerful Node.js tool for validating environment variables against a predefined schema. Ensure your application's configuration is correct before startup.

## Features

✨ **Type Validation**: Validate numbers, strings, URLs, JSON objects, and arrays
🔒 **Security**: Mark sensitive variables to prevent logging
🎯 **Pattern Matching**: Use regex patterns to validate formats
📝 **Custom Validation**: Add your own validation functions
🔄 **Conditional Validation**: Require variables based on conditions
🎨 **Pretty Output**: Colorized CLI output for better readability

## Installation

```bash
npm install @envchecker/env-validator
```

## Quick Start

1. Install the package - it will automatically create a default `envchecker.config.js` file in your project root:

```javascript
// Default envchecker.config.js
module.exports = {
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
      pattern: '^postgres://'
    },
    API_KEY: {
      type: 'string',
      required: true,
      sensitive: true,
      minLength: 32
    }
  }
};
```

You can modify this file to match your project's requirements.

2. Use in your code:

```javascript
const { validateEnv } = require('@envchecker/env-validator');
const config = require('./envchecker.config.js');

try {
  validateEnv(config);
  console.log('Environment variables are valid!');
} catch (error) {
  console.error('Validation failed:', error.errors);
  process.exit(1);
}
```

3. Or use the CLI:

```bash
npx @envchecker/env-validator
```

## Configuration Options

### Variable Types

- **string**: Text values
  ```javascript
  NAME: { type: 'string', minLength: 1, maxLength: 100 }
  ```

- **number**: Numeric values
  ```javascript
  PORT: { type: 'number', min: 1024, max: 65535 }
  ```

- **boolean**: True/false values
  ```javascript
  DEBUG: { type: 'boolean' }
  ```

- **url**: URL strings
  ```javascript
  API_URL: { type: 'url', pattern: '^https://' }
  ```

- **json**: JSON objects with schema validation
  ```javascript
  CONFIG: {
    type: 'json',
    schema: {
      host: { type: 'string', required: true },
      port: { type: 'number', required: true }
    }
  }
  ```

- **array**: Array values
  ```javascript
  ALLOWED_IPS: { type: 'array' }
  ```

### Validation Options

- **required**: Make a variable mandatory
  ```javascript
  API_KEY: { type: 'string', required: true }
  ```

- **pattern**: Validate against a regex pattern
  ```javascript
  EMAIL: { type: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' }
  ```

- **sensitive**: Mark variables as sensitive to prevent logging
  ```javascript
  PASSWORD: { type: 'string', sensitive: true }
  ```

- **allowedValues**: Restrict to specific values
  ```javascript
  LOG_LEVEL: { type: 'string', allowedValues: ['debug', 'info', 'warn', 'error'] }
  ```

- **validate**: Custom validation function
  ```javascript
  VERSION: {
    type: 'string',
    validate: (value) => {
      if (!/^\d+\.\d+\.\d+$/.test(value)) {
        throw new Error('Must be a valid semantic version');
      }
    }
  }
  ```

### Conditional Validation

Require variables based on conditions:

```javascript
module.exports = {
  CONDITIONAL_VARIABLES: {
    SSL_CERT: {
      type: 'string',
      required: (env) => env.NODE_ENV === 'production'
    },
    REDIS_URL: {
      type: 'url',
      required: (env) => env.CACHE_ENABLED === 'true'
    }
  }
};
```

## CLI Usage

```bash
# Basic validation
npx @envchecker/env-validator

# With verbose output
npx @envchecker/env-validator --verbose

# Using custom config file
npx @envchecker/env-validator --config ./config/env.config.js
```

## Examples

Check out our [examples directory](./examples) for more detailed examples and use cases:
- Basic validation
- Advanced validation with conditional rules
- Custom validation functions
- Common configuration patterns

## Contributing

We welcome contributions! Please check out our [contributing guidelines](CONTRIBUTING.md) for details.

## License

MIT

## Support

- 📚 [Documentation](./examples)
- 🐛 [Issue Tracker](https://github.com/slrteck/envchecker/issues)
- 💬 [Discussions](https://github.com/slrteck/envchecker/discussions)
