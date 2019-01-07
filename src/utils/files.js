const fs = require('fs');
const path = require('path');

module.exports = {
  getCurrentDirectoryBase : () => {
    return path.basename(process.cwd());
  },

  directoryExists : (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  },

  readJsonFile : (file) => {
    return new Promise((resolve, reject) => {
      const filePath = path.resolve(file);
      const readOptions = { flag: "r+", encoding: "utf8" };
      fs.readFile(filePath, readOptions, (err, data) => {
        if (err) { reject(err); }
        resolve(data);
      })
    });
  },

  writeMdFile : (file, data) => {
    const filePath = path.resolve(file);
    fs.writeFileSync(filePath, data);
  }
};
