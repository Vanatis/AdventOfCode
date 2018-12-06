const fs = require('fs');

function question1() {
  console.time('timer1');
  let answer = 0;
  fs.readFile('./day_01_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('\n');

    answer = numberArray.reduce((acc, currentValue) => {
      if (currentValue === '') {return acc;}
      return (acc + parseInt(currentValue));
    }, 0);
    console.timeEnd('timer1');
    console.log('Question 1:', answer);
  });
}

function question2() {
  console.time('timer2');

  let answer = 0;
  fs.readFile('./day_01_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('\n');

    let bDuplicateFound = false;
    let answer = 0;
    let frequencyArray = [0];
    while (!bDuplicateFound) {
      for (let i = 0; i < numberArray.length; ++i) {
        if (numberArray[i] !== '') {
          let newFrequency = frequencyArray[frequencyArray.length - 1] + parseInt(numberArray[i]);
          if (frequencyArray.includes(newFrequency)) {
            answer = newFrequency;
            bDuplicateFound = true;
            break;
          }
          frequencyArray.push(newFrequency);
        }
      }
    }
    console.timeEnd('timer2');
    console.log('Question 2:', answer);
  });
}

question1();
question2();
