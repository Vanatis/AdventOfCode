const fs = require('fs');

function question1() {
  console.time('timer1');
  let answer = 0;
  fs.readFile('./day_01_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('');

    answer = numberArray.reduce((acc, currentValue, index) => {
      let nextValue = 0;
      if (index === numberArray.length - 2) {
        nextValue = numberArray[0];
      }
      else {
        nextValue = numberArray[index + 1];
      }

      if (currentValue === nextValue)
      {
        acc += parseInt(currentValue);
      }

      return (acc);
    }, 0);
    console.log(answer);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  let answer = 0;
  fs.readFile('./day_01_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('');
    const length = numberArray.length - 1;
    let nextIndex = length / 2;

    answer = numberArray.reduce((acc, currentValue, index) => {
      let nextValue = numberArray[nextIndex];
      if (currentValue === nextValue) {
        acc += parseInt(currentValue);
      }

      ++nextIndex;
      if (nextIndex > length - 1) {
        nextIndex -= length;
      }
      return (acc);
    }, 0);
    console.log(answer);
    console.timeEnd('timer2');
  });
}

question1();
question2();
