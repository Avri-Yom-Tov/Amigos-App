const fs = require('fs').promises;

const listFilesInDirectory = async (directoryPath) => {
  try {
    const fileNames = await fs.readdir(directoryPath);
    return fileNames;
  } catch (error) {
    throw error;
  }
};

module.exports = listFilesInDirectory;
