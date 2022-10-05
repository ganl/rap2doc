#!/usr/bin/env node

require("babel-register");

const program     = require('commander');
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');

program
  .name('rap2doc')
  .version('1.1.1')
  .usage('<command> [options]')
  .option('-D, --dir <path>', 'set the docs output path')
  .command('md')
  // .alias('markdown')
  // .command('html')
  .argument('<input>', 'json file')

/**
 * Help.
 */

program.on('--help', () => {
  console.log('  Examples:')
  console.log()
  console.log(chalk.gray('    # create a new project with an official template'))
  console.log('    $ vue init webpack my-project')
  console.log()
  console.log(chalk.gray('    # create a new project straight from a github template'))
  console.log('    $ vue init username/repo my-project')
  console.log()
})

program.parse(process.argv); //开始解析用户输入的命令
console.log(program.args)
if (program.args[0] === 'md' || program.args[0] === 'html') {
  clear();
  console.log(
    chalk.yellow(
      figlet.textSync('RAP2DOC', { horizontalLayout: 'full' })
    )
  );
  require( './' + program.args[0] + '.js' ) // 根据不同的命令转到不同的命令处理文件
} else {
  return program.help()
}
