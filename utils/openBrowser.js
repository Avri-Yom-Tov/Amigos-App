const { shell } = require("electron");

function openBrowser(url = "") {
  shell.openExternal(url);
}

module.exports = openBrowser;
