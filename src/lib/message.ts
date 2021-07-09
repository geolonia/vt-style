import chalk from "chalk";

const NOTICE = () => `[${chalk.cyan("notice")} ${new Date().toISOString()}]`;
const WARN = () => `[${chalk.yellow("warn")} ${new Date().toISOString()}]`;
const ERROR = () => `[${chalk.red("error")} ${new Date().toISOString()}]`

export const notice = (message: string) => process.stdout.write(`${NOTICE()} ${message}\n`);
export const warn = (message: string) => process.stdout.write(`${WARN()} ${message}\n`);
export const error = (message: string) => process.stdout.write(`${ERROR()} ${message}\n`)

export const help = () => `
  Usage
    $ vt-style ./style.yml --output ./style.json
    $ vt-style ./style.yml --output ./style.json --watch
    $ vt-style ./style.yml --output ./style.json --minify --watch

  Options
    --help, -h    Show the help.
    --watch, -w   Turn on watch mode. vt-style will continue to watch for changes in input source.
    --minify, -m  Turn on minify flag. vt-style will minify the output JSON.
`
