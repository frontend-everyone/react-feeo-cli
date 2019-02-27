#!/usr/bin/env node
const fs = require("fs");
const program = require("commander");
const download = require("download-git-repo");
const handlebars = require("handlebars");
const inquirer = require("inquirer");
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");
const fetch = require("node-fetch");
program
  .version("1.0.2", "-v, --version")
  .command("init <name>")
  .action(async name => {
    const versionList = [];
    const versionFetch = ora("Get version number...");
    versionFetch.start();
    try {
      const responseVersion = await fetch(
        "https://api.github.com/repos/frontend-everyone/react-feeo/branches"
      )
        .then(response => response.json())
        .then(response => response)
        .catch(err => {
          console.log(err);
        });
      responseVersion.forEach(data => versionList.push(data.name));
      versionFetch.succeed("version get Success");
    } catch (error) {
      console.log(error);
      versionFetch.fail("version get failure, please try again");
      return;
    }

    if (!fs.existsSync(name)) {
      inquirer
        .prompt([
          {
            type: "list",
            name: "versionList",
            message: "select react version?",
            choices: versionList
          },
          {
            type: "list",
            name: "pxToRem",
            message: "px to rem (Y/N)",
            choices: ["YES", "NO"]
          },
          {
            type: "list",
            name: "token",
            message: "token verify (Y/N)",
            choices: ["YES", "NO"]
          }
        ])
        .then(answers => {
          const spinner = ora("Downloading template...");
          spinner.start();
          download(
            "github:frontend-everyone/react-feeo#" + answers.versionList,
            name,
            { clone: true },
            err => {
              if (err) {
                spinner.fail();
                console.log(symbols.error, chalk.red(err));
              } else {
                spinner.succeed();
                const fileName = `${name}/package.json`;
                const fileName1 = `${name}/config/site.config.json`;
                const meta = {
                  name,
                  pxToRem: answers.pxToRem.toUpperCase() === "YES" ? 1 : "",
                  token: answers.token.toUpperCase() === "YES" ? 1 : ""
                };
                const fsWrite = function(fileName) {
                  const content = fs.readFileSync(fileName).toString();
                  const result = handlebars.compile(content)(meta);
                  fs.writeFileSync(fileName, result);
                };
                if (fs.existsSync(fileName)) {
                  fsWrite(fileName);
                }
                if (fs.existsSync(fileName1)) {
                  fsWrite(fileName1);
                }
                console.log(symbols.success, chalk.green("Success"));
              }
            }
          );
        });
    } else {
      // Error prompt item already exists to avoid overwriting the original item
      console.log(symbols.error, chalk.red("The project already exists"));
    }
  });
program.parse(process.argv);
