#!usr/bin/env node

import meow from 'meow'
import path from 'path'
import process from 'process'
import fs from 'fs/promises'
import chokidar from "chokidar";
import chalk from 'chalk'
import { VTStyleCore } from './vt-style'
import { notice, warn, error } from './message'

const cli = meow(`
  Usage
    $ vt-style <input> --output <output>

  Options
    --watch, -w  Turn on watch mode. vt-style will continue to watch for changes in input source.
`, {
  flags: {
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

const convert = async (input: string, output: string) => {
  const vtStyle = new VTStyleCore(await fs.readFile(input, 'utf-8'))
  vtStyle.transpile()
  const json = vtStyle.toText()
  if (json !== null) {
    return fs.writeFile(output, json)
  } else {
    throw new Error('Invalid export')
  }
}

const main = async () => {
  if (cli.flags.watch) {
    if (!(await fs.stat(inputYamlFilePath).catch(() => false))) {
      error(`${consoleVar.input} not found.`);
      process.exit(1)
    }
    chokidar.watch(inputYamlFilePath)
      .on('add', () => notice(`Started watching ${inputYamlFilePath}.`))
      .on('change', async () => {
        try {
          await convert(inputYamlFilePath, outputJsonFilePath)
          notice(`${consoleVar.output} has been generated.`);
        } catch (err) {
          warn(`Failed to convert ${consoleVar.input}.`);
          console.error(err)
        }
      })
  } else {
    try {
      await convert(inputYamlFilePath, outputJsonFilePath)
      process.exit(0)
    } catch (err) {
      error(`Failed to convert ${consoleVar.input}.`);
      console.error(err)
      process.exit(2)
    }
  }
}
main()
