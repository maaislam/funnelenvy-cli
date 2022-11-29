/*eslint-disable func-names */
/*eslint-disable consistent-return */
/*eslint-disable no-shadow */
/*eslint-disable no-use-before-define */
/*eslint-disable object-curly-newline */
/*eslint-disable prefer-arrow-callback */
/*eslint-disable no-undef */

const path = require('path');
const { exec } = require('child_process');
const prompt = require('prompt');

const { sharedJsContent, createFile, runExpSchema } = require('./cliUtils');

prompt.start();

prompt.get(runExpSchema, (err, result) => {
  if (err) {
    return onErr(err);
  }
  const { clientName, experimentId, setVarFlag } = result;

  const expPath = path.resolve(
    __dirname,
    `../clients/${clientName}/${experimentId}/src/lib/shared/shared.js`
  );

  const cliPath = path.resolve(__dirname, '../process/experimentConfig.js');
  const content = sharedJsContent(experimentId, setVarFlag, clientName);

  createFile(expPath, content);
  createFile(cliPath, content); //makes it easier to make code pack

  exec(`npm run configpath -- cn=${clientName} en=${experimentId}`);
});

function onErr(err) {
  console.log(err);
  return 1;
}
