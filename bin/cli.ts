#!/bin/bun

import { Command  } from 'commander'
import VKClient from '../src/client'

const program = new Command()

program
    .version('0.0.1')
    .command('authentication')
    .description('Authentication command')
    .action(async (options) => {
        console.log(`[LOGIN] ${options.login}`)
    })




program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ boilerbot authentication');
    console.log('');
})


program.parse(process.argv)