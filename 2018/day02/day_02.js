const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');

  const readStream = fs.createReadStream('./day_02_input.txt');
  const lineReader = rl.createInterface(readStream);

  let numLineTwice = 0;
  let numLineThrice = 0;

  lineReader.on('line', (line) => {
    const datastring = line.toString();
    const sortedDatastring = datastring.split('').sort();

    let previousChar = 'a';
    let numChainedChars = 0;
    let bContainsTwice = false;
    let bContainsThrice = false;

    //loop over all chars of the line and look for twice/thrice duplicates
    sortedDatastring.map((currentChar) => {
      if (previousChar === currentChar) {
        ++numChainedChars;
      } else {
        if (numChainedChars === 2) {bContainsTwice = true;}
        if (numChainedChars === 3) {bContainsThrice = true;}

        previousChar = currentChar;
        numChainedChars = 1;
      }
    });

    if (bContainsTwice) {++numLineTwice;}
    if (bContainsThrice) {++numLineThrice;}
  });

  lineReader.on('close', () => {
    console.log('Question 1:', numLineTwice * numLineThrice);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  const readStream = fs.createReadStream('./day_02_input.txt');
  const lineReader = rl.createInterface(readStream);
  let lineArray = [];

  lineReader.on('line', (line) => {
    const datastring = line.toString();
    lineArray.push(datastring);
  });

  lineReader.on('close', () => {
    console.log('Question 2:', getCorrectBoxIds(lineArray));
    console.timeEnd('timer2');
  });
}

function getCorrectBoxIds(lineArray) {
  for (let i = 0; i < lineArray.length; ++i)
  {
    const firstString = lineArray[i];
    for (let j = i + 1; j < lineArray.length; ++j) {
      const secondString = lineArray[j];

      if (firstString.length === secondString.length)
      {
        let commonLetters = '';
        for (let k = 0; k < firstString.length; ++k) {
          if (firstString[k] === secondString[k]) {
            commonLetters += firstString[k];
          }
        }

        //Answer found
        if (commonLetters.length === firstString.length - 1) {
          return commonLetters;
        }
      }
    }
  }
}

question1();
question2();
