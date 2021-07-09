#!usr/bin/env node

import meow from 'meow'
import path from 'path'
import process from 'process'
import fs from 'fs/promises'
import chokidar from "chokidar";
import chalk from 'chalk'
import { Transpiler } from '.'
import { notice, warn, error, help } from './lib/message'

const cli = meow(help(), {
  flags: {
    help: {
      alias: 'h'
    },
    version: {
      alias: 'v'
    },
    output: {
      type: 'string',
      alias: 'o',
      isRequired: true,
    },
    watch: {
      type: 'boolean',
      alias: 'w',
      isRequired: false,
      default: false,
    },
    minify: {
      type: 'boolean',
      alias: 'm',
      isRequired: false,
      default: false,
    }
  }
})


const inputYamlFilePath = path.resolve(process.cwd(), cli.input[0])
const outputJsonFilePath = path.resolve(process.cwd(), cli.flags.output)
const consoleVar = {
  input: chalk.green(inputYamlFilePath),
  output: chalk.green(outputJsonFilePath),
}

const convert = async (input: string, output: string, options: Partial<VT.Options>) => {
  const transpiler = new Transpiler(await fs.readFile(input, 'utf-8'), options)
  const json = transpiler.transpile().toText()
  if (json !== null) {
    return fs.writeFile(output, json)
  } else {
    throw new Error('Invalid export')
  }
}

const main = async () => {

  const options = {
    minify: cli.flags.minify,
  }

  if (cli.flags.watch) {
    if (!(await fs.stat(inputYamlFilePath).catch(() => false))) {
      error(`${consoleVar.input} not found.`);
      process.exit(1)
    }
    chokidar.watch(inputYamlFilePath)
      .on('add', () => notice(`Started watching ${inputYamlFilePath}.`))
      .on('change', async () => {
        try {
          await convert(inputYamlFilePath, outputJsonFilePath, options)
          notice(`${consoleVar.output} has been generated.`);
        } catch (err) {
          warn(`Failed to convert ${consoleVar.input}.`);
          console.error(err)
        }
      })
  } else {
    try {
      await convert(inputYamlFilePath, outputJsonFilePath, options)
      process.exit(0)
    } catch (err) {
      error(`Failed to convert ${consoleVar.input}.`);
      console.error(err)
      process.exit(2)
    }
  }
}

main()
