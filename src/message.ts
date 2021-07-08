import chalk from "chalk";

const NOTICE = () => `[${chalk.cyan("notice")} ${new Date().toISOString()}]`;
const WARN = () => `[${chalk.yellow("warn")} ${new Date().toISOString()}]`;
const ERROR = () => `[${chalk.red("error")} ${new Date().toISOString()}]`

export const notice = (message: string) => process.stdout.write(`${NOTICE()} ${message}\n`);
export const warn = (message: string) => process.stdout.write(`${WARN()} ${message}\n`);
export const error = (message: string) => process.stdout.write(`${ERROR()} ${message}\n`)
