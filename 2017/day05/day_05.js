const fs = require('fs');

function question1() {
  console.time('timer1');
  let answer = 0;
  fs.readFile('./day_05_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('\n');

    let  steps = 0;
    let index = 0;

    while (index <= numberArray.length) {
      let previousIndex = index;
      index += parseInt(numberArray[previousIndex]);
      ++numberArray[previousIndex];
      ++steps;
    }
    --steps;

    console.log('Question 1:', steps);
    console.timeEnd('timer1');
  });
}
function question2() {
  console.time('timer2');

  let answer = 0;
  fs.readFile('./day_05_input.txt', (err, data) => {
    const datastring = data.toString();
    const numberArray = datastring.split('\n');

    let  steps = 0;
    let index = 0;

    while (index <= numberArray.length) {
      let previousIndex = index;
      index += parseInt(numberArray[previousIndex]);
      if (numberArray[previousIndex] >= 3) {
        --numberArray[previousIndex];
      } else {
        ++numberArray[previousIndex];
      }
      ++steps;
    }
    --steps;

    console.log('Question 2:',steps);
    console.timeEnd('timer2');
  });
}

question1();
question2();
