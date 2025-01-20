#!/usr/bin/env node

const path = require('path');
const chalk = require('chalk');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { validateEnv } = require('../src/validator');

const argv = yargs(hideBin(process.argv))
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .option('config', {
        alias: 'c',
        type: 'string',
        description: 'Path to config file'
    })
    .help()
    .argv;

async function run() {
    try {
        // Try to load the config file
        const configPath = argv.config 
            ? path.resolve(process.cwd(), argv.config)
            : path.resolve(process.cwd(), 'envchecker.config.js');
        
        const config = require(configPath);

        // Validate environment variables
        const result = validateEnv(config);

        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
            console.log(chalk.yellow('\n⚠️  Warnings:'));
            result.warnings.forEach(warning => {
                console.log(chalk.yellow(`- ${warning}`));
            });
        }

        // Success output
        console.log(chalk.green('\n✅ All required environment variables are set.'));
        
        if (argv.verbose) {
            console.log('\nValidated Environment Variables:');
            for (const [key, value] of Object.entries(result.validatedEnv)) {
                const schema = config.REQUIRED_VARIABLES[key];
                if (schema && schema.sensitive) {
                    console.log(chalk.cyan(`${key}: ******* (sensitive)`));
                } else {
                    console.log(chalk.cyan(`${key}: ${value}`));
                }
            }
        }
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error(chalk.red('❌ Could not find envchecker.config.js in the current directory'));
            process.exit(1);
        }

        if (error.errors) {
            console.error(chalk.red('\n❌ Missing or invalid environment variables:'));
            error.errors.forEach(err => {
                console.error(chalk.red(`- ${err}`));
            });
            process.exit(1);
        }

        console.error(chalk.red('An unexpected error occurred:'), error);
        process.exit(1);
    }
}

run();
