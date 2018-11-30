const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');

  const readStream = fs.createReadStream('./day_04_input.txt');
  const lineReader = rl.createInterface(readStream);

  let answer = 0;
  lineReader.on('line', (line) => {
    const datastring = line.toString();

    const wordArray = line.split(' ');
    const filteredArray = [...new Set(wordArray)];
    if (wordArray.length === filteredArray.length)
    {
      ++answer;
    }
  });

  lineReader.on('close', () => {
    console.log('Question 1:', answer);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  const readStream = fs.createReadStream('./day_04_input.txt');
  const lineReader = rl.createInterface(readStream);

  let answer = 0;
  lineReader.on('line', (line) => {
    const datastring = line.toString();

    const wordArray = line.split(' ');
    for (let i = 0; i < wordArray.length; ++i) {
      wordArray[i] = wordArray[i].toLowerCase().split('').sort().join('').trim();
    }
    const filteredArray = [...new Set(wordArray)];
    if (wordArray.length === filteredArray.length)
    {
      ++answer;
    }
  });

  lineReader.on('close', () => {
    console.log('Question 2:', answer);
    console.timeEnd('timer2');
  });
}

question1();
question2();
