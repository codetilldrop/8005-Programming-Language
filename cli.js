#!/usr/bin/env node

const fs = require('fs');
const panda = require('./panda');
const filename = process.argv[2];

const readlineSync = require('readline-sync');

function prompt(toCompile) {
  var answer = readlineSync.question('> ');
  toCompile.push(answer.trim());

  if (answer.trim() == "quit;") {
    toCompile.pop();
    console.log(panda.mainCompile(toCompile.join(" ")));
  } else {
    var codeState = panda.mainCompile(toCompile.join(" "))
    if (codeState instanceof Error) {
      console.error(codeState);
      toCompile.pop();
    }
    prompt(toCompile);
  }
}

if (!filename) {
  var emptyArray = new Array();
  prompt(emptyArray);
  process.exit(1);
}

fs.readFile(filename, (err, data) => {
  if (err) {
    console.error('an error while trying to read the file.\n' + err);
    process.exit(1);
  }

  const fileDataToCompileNewlines = data.toString();
  const fileDataToCompile = fileDataToCompileNewlines.replace(/\n|\r/g, " ").trim();

  const machineCode = panda.mainCompile(fileDataToCompile);

  if (machineCode instanceof Error) {
    console.error(machineCode);
  } else {
    console.log(machineCode);
  }
});

