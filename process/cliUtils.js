const fs = require('fs');

const chalk = require('chalk');
const defaults = require('./experimentConfig');

const sharedJsContent = (experimentId, setVarFlag, clientName) => `module.exports = {
    ID: "${experimentId}",
    VARIATION: "${setVarFlag}",
    CLIENT: "${clientName}"
  };`;

const createFile = (location, content) => {
  fs.writeFile(location, content, (err) => {
    if (err) {
      console.error('ERROR', err);
    }
    //file written successfully
  });
};

const { ID, VARIATION, CLIENT } = defaults;

const coolColor = chalk.bold.black.bgGreenBright;

const runExpSchema = {
  properties: {
    clientName: {
      description: coolColor('clientName'),
      required: true,
      default: CLIENT
    },
    experimentId: {
      description: coolColor('experimentId'),
      require: false,
      default: ID
    },
    setVarFlag: {
      description: coolColor('setVarFlag'),
      require: true,
      default: VARIATION
    }
  }
};

const createExpSchema = {
  properties: {
    clientName: {
      description: coolColor('clientName'),
      required: true
    },
    experimentId: {
      description: coolColor('experimentId'),
      require: false
    },
    setVarFlag: {
      description: coolColor('setVarFlag'),
      require: true
    }
  }
};

module.exports = {
  sharedJsContent,
  createFile,
  runExpSchema,
  createExpSchema
};
