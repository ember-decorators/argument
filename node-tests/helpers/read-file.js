const fs = require('fs');
const path = require('path');

function readFile(relativePath) {
  const fullPath = path.resolve(__dirname, '../../', relativePath);

  return new Promise((resolve, reject) => {
    fs.readFile(fullPath, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        const body = buffer.toString();
        resolve(body);
      }
    });
  });
}

module.exports = readFile;
