#!/usr/bin/env node
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'pxToRem',
                    message: 'px to rem (Y/N)'
                },
                {
                    name: 'token',
                    message: 'token verify (Y/N)'
                }
            ]).then((answers) => {
                const spinner = ora('正在下载模板...');
                spinner.start();
                download('github:frontend-everyone/react-feeo', name, {clone: true}, (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const fileName1 = `${name}/config/site.config.json`;
                        const meta = {
                            name,
                            pxToRem: answers.pxToRem.toUpperCase() === 'Y' ? 1 : "" ,
                            token: answers.token.toUpperCase() === 'Y' ? 1 : ""
                        };
                        const fsWrite = function(fileName){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        };
                        if(fs.existsSync(fileName)){
                            fsWrite(fileName)
                        }
                        if(fs.existsSync(fileName1)){
                            fsWrite(fileName1)
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })
program.parse(process.argv);