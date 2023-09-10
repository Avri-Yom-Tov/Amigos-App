const fs = require('fs').promises;

async function readFile(fullPath) {
  try {
    const data = await fs.readFile(fullPath, 'utf8');
    return data;
  } catch (err) {
    console.error('An error occurred:', err);
    throw err;
  }
}



module.exports = readFile;
