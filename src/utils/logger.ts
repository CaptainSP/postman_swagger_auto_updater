import chalk from 'chalk';

export class Logger {
  static info(message: string): void {
    console.log(chalk.blue('ℹ'), message);
  }

  static success(message: string): void {
    console.log(chalk.green('✓'), message);
  }

  static error(message: string, error?: any): void {
    console.log(chalk.red('✗'), message);
    if (error) {
      console.error(chalk.red(error.message || error));
    }
  }

  static warn(message: string): void {
    console.log(chalk.yellow('⚠'), message);
  }

  static log(message: string): void {
    console.log(message);
  }

  static separator(): void {
    console.log(chalk.gray('─'.repeat(50)));
  }
}

