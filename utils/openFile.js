const fs = require("fs");


const openFile = (fileName, folderLocation) => {
  const filePath = folderLocation + fileName;
  fs.access(filePath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    require("child_process").exec("start " + filePath);
  });
};

module.exports = openFile;
