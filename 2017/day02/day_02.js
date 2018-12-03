const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');

  const readStream = fs.createReadStream('./day_02_input.txt');
  const lineReader = rl.createInterface(readStream);

  let answer = 0;
  lineReader.on('line', (line) => {
    const datastring = line.toString();
    const numberArray = line.split('\t');
    let min = Math.min(...numberArray);
    let max = Math.max(...numberArray);
    answer += (max - min);
  });

  lineReader.on('close', () => {
    console.log('Question 1:', answer);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  const readStream = fs.createReadStream('./day_02_input.txt');
  const lineReader = rl.createInterface(readStream);

  let answer = 0;
  lineReader.on('line', (line) => {
    const datastring = line.toString();
    const numberArray = line.split('\t');

    /*Foreach to loop and see if values are divisable*/
    let divisionValue = 0;
    numberArray.forEach((number1, index1) => {
      numberArray.forEach((number2, index2) => {
        if (index1 === index2) {}
        else if (number1 % number2 === 0) {
          divisionValue = number1 / number2;
        }
      });
    });
    answer += divisionValue;
  });

  lineReader.on('close', () => {
    console.log('Question 2:', answer);
    console.timeEnd('timer2');
  });
}

question1();
question2();
