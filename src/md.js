#!/usr/bin/env node

const program_md = require('commander');
const inquirer  = require('./utils/inquirer');
// const inquirer = require('inquirer');
const CLI = require('clui'),
    Spinner = CLI.Spinner;

const converter = require('./utils/convert');

program_md
  .description('convert to markdown from the given file | url')
  .option("-c, --convert_mode <mode>", "Which convert mode to use", /^(file|url)$/i, 'url')
  // .option('--offline', 'convert from local json file')
  .on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ convert from file');
    console.log('    $ convert from url');
    console.log();
  });

function help () {
  program_md.parse(process.argv)
  if (program_md.args.length < 1) return program_md.help()
}
help()

// console.log(program_md.convert_mode, program_md.dir, program_md.offline, program_md.args)

const rawName = program_md.args[1]

if (program_md.convert_mode == 'file') {

} else {

}

const run = async () => {
  let sourceSchema = rawName;
  if (!rawName) {
    const urlPath = await inquirer.askSourceEndpoint();
    sourceSchema = urlPath.url_path;
  }
  let targetDir = program_md.dir || './docs'
  const status = new Spinner('Parse json and convert to markdown, please wait...');

  status.start();
  converter.toMd(program_md.convert_mode, sourceSchema, targetDir).then(()=>{
    status.stop();
    console.log('Convert Finish!');
  }).catch(err => {
    console.log(err);
  });
}

run();
