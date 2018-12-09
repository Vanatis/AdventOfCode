const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');
  fs.readFile('./day_09_input.txt', (err, data) => {
    const dataString = data.toString().trim("\n");
    const inputData = dataString.match(/(\d+) players; last marble is worth (\d+) points/);

    const numPlayers = parseInt(inputData[1]);
    const numMarbles = parseInt(inputData[2]);

    const scores = {};
    for (let i = 1; i <= numPlayers; i += 1) {
        scores[i] = 0;
    }

    let currentPlayer = 1;
    let current = {
        value: 0,
    };
    current.next = current;
    current.prev = current;

    for (let i = 1; i <= numMarbles; ++i) {
        if (i % 23 === 0) {
            scores[currentPlayer] += i;

            //please ignore this ugly code
            current = current.prev.prev.prev.prev.prev.prev;
            scores[currentPlayer] += current.prev.value;
            current.prev.prev.next = current;
            current.prev = current.prev.prev;
        } else {
            current = addAfter(i, current.next);
        }
        currentPlayer = currentPlayer % numPlayers + 1;
    }
    const maxScore = Math.max(...Object.values(scores));

    console.timeEnd('timer1');
    console.log('Question 1:', maxScore);
  });
}

function question2() {
  console.time('timer2');
  fs.readFile('./day_09_input.txt', (err, data) => {
    const dataString = data.toString().trim("\n");
    const inputData = dataString.match(/(\d+) players; last marble is worth (\d+) points/);

    const numPlayers = parseInt(inputData[1]);
    const numMarbles = parseInt(inputData[2]);

    const scores = {};
    for (let i = 1; i <= numPlayers; i += 1) {
        scores[i] = 0;
    }

    let currentPlayer = 1;
    let current = {
        value: 0,
    };
    current.next = current;
    current.prev = current;

    for (let i = 1; i <= numMarbles * 100; ++i) {
        if (i % 23 === 0) {
            scores[currentPlayer] += i;

            //please ignore this ugly code
            current = current.prev.prev.prev.prev.prev.prev;
            scores[currentPlayer] += current.prev.value;
            current.prev.prev.next = current;
            current.prev = current.prev.prev;
        } else {
            current = addAfter(i, current.next);
        }
        currentPlayer = currentPlayer % numPlayers + 1;
    }
    const maxScore = Math.max(...Object.values(scores));

    console.timeEnd('timer2');
    console.log('Question 2:', maxScore);
  });
}

function addAfter (value, marble) {
    const toAdd = {
        value,
        prev: marble,
        next: marble.next,
    };
    marble.next.prev = toAdd;
    marble.next = toAdd;
    return toAdd;
};

question1();
question2();
