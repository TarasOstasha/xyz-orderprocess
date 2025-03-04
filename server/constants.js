const path = require('path');

const CONSTANTS = {
  PRIORITY: ['High', 'Medium', 'Low'],
  STATIC_PATH: path.join(__dirname, process.env.STATIC_FOLDER),
};

console.log('Resolved STATIC_PATH =>', CONSTANTS.STATIC_PATH);

module.exports = CONSTANTS;
