
const runShellCommand = (location = "C:\\Works\\amigos-team", script = "", closeAfterCompletion = false) => {
  let runAt = `start cmd /${ closeAfterCompletion ? "c" : "k"} "cd /d ${location} && "`
  const totalCommand = `${runAt}${script}`;
  console.log(totalCommand);
  const childProcess = require("child_process").spawn(totalCommand, [], {
    shell: true,
  });
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);
};

module.exports = runShellCommand;
