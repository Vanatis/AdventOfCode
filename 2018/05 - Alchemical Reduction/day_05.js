const fs = require('fs');
const rl = require('readline');

function question1() {
    fs.readFile('./day_05_input.txt', (err, data) => {
      console.time('timer1');
      let datastring = data.toString().trim();

      for (let i = 0; i < datastring.length - 1; ++i) {
        const firstChar = datastring[i].charCodeAt();
        const secondChar = datastring[i + 1].charCodeAt();

        if (Math.abs(firstChar - secondChar) == 32) {
          const part1 = datastring.substring(0, i);
          const part2 = datastring.substring(i + 2, datastring.length);
          datastring = part1 + part2;
          i = -1;
        }
      }

      console.timeEnd('timer1');
      console.log('Question 1:', datastring.length);
    });
}

function question2() {
  console.time('timer2');
  fs.readFile('./day_05_input.txt', (err, data) => {
    const datastring = data.toString().trim();

    let minLength = datastring.length;
    for (let i = 97; i <= 122; i++) {
      const char = String.fromCharCode(i);
      let reducedString = datastring.replace(new RegExp(char, 'g'), '').replace(new RegExp(char.toUpperCase(), 'g'), '');

      for (let j = 0; j < reducedString.length - 1; ++j) {
        const firstChar = reducedString[j].charCodeAt();
        const secondChar = reducedString[j + 1].charCodeAt();
        if (Math.abs(firstChar - secondChar) == 32) {
          const part1 = reducedString.substring(0, j);
          const part2 = reducedString.substring(j + 2, reducedString.length);
          reducedString = part1 + part2;
          j = -1;
        }
      }

      if (reducedString.length < minLength) {
        minLength = reducedString.length;
      }
    }

    console.timeEnd('timer2');
    console.log('Question 2:', minLength);
  });
}

question1();
question2();
