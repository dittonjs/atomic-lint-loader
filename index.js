const execSync = require("child_process").execSync;
const _        = require("lodash");
const eslint   = require("eslint");
let engine = null;

function identifyChangedFilesInGit(){
  const gitOutput = execSync('git status').toString('utf8');
  const filesChanged = _.map(_.split(gitOutput, 'modified:').slice(1), (file) => {
    return _.trim(_.split(file, '\n')[0]);
  });
  return filesChanged;
}

function tagMessage(parts, messageObj){
  let severity = "";
  if(messageObj.severity === 2) {
    severity = 'Error: ';
  } else if(messageObj.severity === 1){
    severity = 'Warning: ';
  }
  const messageTop = `\n${severity}${messageObj.ruleId}\n`;
  const messageBody = `${messageObj.message}\n`;
  const lineNumbers = `Line ${messageObj.line}, col ${messageObj.column}\n`;
  const culprit = `${messageObj.source}\n`;
  return `${messageTop}${messageBody}${lineNumbers}${culprit}`;
};

function lintIfFileChanged(filePath, emitError, emitWarning){
  const filesChanged = identifyChangedFilesInGit();
  if(_.find(filesChanged, (file) => _.includes(filePath, file))){

    const lintResult = engine.executeOnFiles([filePath]);
    if(lintResult.errorCount > 0){
      _.each(lintResult.results[0].messages, (messageObj) => {
        const message = tagMessage `${messageObj}`;
        console.log(messageObj.severity);
        if(messageObj.severity === 2){
          emitError(message);
        } else if (messageObj === 1){
          emitWarning(message);
        }
      });
    }
  }
}

module.exports = function(input, map){
  if(map){
    this.callback(null, input, map);
    return;
  }
  engine === null && (engine = new eslint.CLIEngine({}));
  lintIfFileChanged(this.resourcePath, this.emitError, this.emitWarning);
  this.callback(null, input, map);
}
