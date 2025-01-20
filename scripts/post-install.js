#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Get the project root directory (where node_modules is)
const projectRoot = path.resolve(process.cwd());

// Default config content
const configContent = `// EnvChecker Configuration
// This file was automatically created during package installation.
// Modify it to match your project's requirements.

module.exports = {
  REQUIRED_VARIABLES: {
    PORT: {
      type: 'number',
      required: true,
      min: 1024,
      max: 65535,
      description: 'Server port number'
    },
    NODE_ENV: {
      type: 'string',
      required: true,
      allowedValues: ['development', 'staging', 'production'],
      description: 'Current environment'
    },
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
    }
  },
  
  // Uncomment to add conditional variables
  /*
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
  */
};
`;

const configPath = path.join(projectRoot, 'envchecker.config.js');

// Create config file if it doesn't exist
if (!fs.existsSync(configPath)) {
    try {
        fs.writeFileSync(configPath, configContent);
        console.log(chalk.green('✨ Created default envchecker.config.js'));
        console.log(chalk.cyan('📝 You can modify this file to match your project\'s requirements.'));
        console.log(chalk.yellow('💡 Tip: Add descriptions to your variables for better error messages!'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to create config file:'), error.message);
    }
} else {
    console.log(chalk.yellow('ℹ️ envchecker.config.js already exists, skipping creation.'));
    console.log(chalk.cyan('📝 Check out our examples at https://github.com/slrteck/envchecker/tree/main/examples'));
}

// Create example .env file
const envPath = path.join(projectRoot, '.env.example');
const envContent = `# Example environment variables for your application
# Copy this file to .env and update the values

PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://user:pass@localhost:5432/mydb
API_KEY=your-api-key-here-min-32-chars-long

# Optional variables (uncomment if needed)
# SSL_CERT=/path/to/cert.pem
# CACHE_ENABLED=true
# REDIS_URL=redis://localhost:6379
`;

if (!fs.existsSync(envPath)) {
    try {
        fs.writeFileSync(envPath, envContent);
        console.log(chalk.green('✨ Created .env.example file'));
        console.log(chalk.cyan('📝 Copy .env.example to .env and update the values.'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to create .env.example:'), error.message);
    }
}

console.log(chalk.green('\n🎉 EnvChecker setup complete!'));
console.log(chalk.cyan('📚 Read the docs at: https://github.com/slrteck/envchecker#readme'));
