const fs = require('fs');

function question1() {
  console.time('timer1');

  let numLoops = 0;
  fs.readFile('./day_06_input.txt', (err, data) => {
    const datastring = data.toString();
    let numberArray = datastring.replace('\n', '').split('\t');
    numberArray = numberArray.map((value) => {
      return parseInt(value);
    })

    let bInfiniteLoopDetected = false;
    let resultArray = [];
    resultArray.push(numberArray.toString());

    while (!bInfiniteLoopDetected) {
      const max = Math.max(...numberArray);
      const index = numberArray.indexOf(max);

      numberArray[index] = 0;
      ++numLoops;

      for (let i = 0; i < max; ++i) {
        const nextIndex = (index + i + 1) % numberArray.length;
        ++numberArray[nextIndex];
      }

      if (resultArray.includes(numberArray.toString())) {
        bInfiniteLoopDetected = true;
      }
      else {
        resultArray.push(numberArray.toString());
      }
    }
    console.log("Question 1:", numLoops);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  let arrayValue = 0;
  let resultArray = [];

  fs.readFile('./day_06_input.txt', (err, data) => {
    const datastring = data.toString();
    let numberArray = datastring.replace('\n', '').split('\t');
    numberArray = numberArray.map((value) => {
      return parseInt(value);
    })

    let bInfiniteLoopDetected = false;
    resultArray.push(numberArray.toString());

    while (!bInfiniteLoopDetected) {
      const max = Math.max(...numberArray);
      const index = numberArray.indexOf(max);

      numberArray[index] = 0;
      for (let i = 0; i < max; ++i) {
        const nextIndex = (index + i + 1) % numberArray.length;
        ++numberArray[nextIndex];
      }

      if (resultArray.includes(numberArray.toString())) {
        bInfiniteLoopDetected = true;
        arrayValue = numberArray.toString();
        resultArray.push(numberArray.toString());
      }
      else {
        resultArray.push(numberArray.toString());
      }
    }

    var indexes = [], i;
    for(i = 0; i < resultArray.length; ++i) {
      if (resultArray[i] === arrayValue) {
        indexes.push(i);
      }
    }
    
    console.log("Question 2:", indexes[1] - indexes[0]);
    console.timeEnd('timer2');
  });
}

question1();
question2();
