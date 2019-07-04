var process = require("child_process");
const path = require("path");
//直接调用命令
var createDir = function() {
  //   process.exec("npm run p", function(error, stdout, stderr) {
  //     console.log(12312);

  //     if (error !== null) {
  //       console.log("exec error: " + error);
  //     }
  //   });
  process.spawn("npm.cmd", ["run", "p"], {
    stdio: "inherit",
    cwd: path.resolve(__dirname, "./")
  });
};
createDir();
