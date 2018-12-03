const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');

  const readStream = fs.createReadStream('./day_03_input.txt');
  const lineReader = rl.createInterface(readStream);

  let fabric = new Array(1000);
  for (let i = 0; i < fabric.length; ++i) {
    fabric[i] = new Array(1000);
    fabric[i].fill(0, 0);
  }

  lineReader.on('line', (line) => {
    const datastring = line.toString();
    const splitstring = datastring.split(' ');

    const claimId = parseInt(splitstring[0].replace('#', ''));

    const offsets = splitstring[2].replace(':', '').split(',');
    const offsetX = parseInt(offsets[0]);
    const offsetY = parseInt(offsets[1]);

    const size = splitstring[3].split('x');
    const width = parseInt(size[0]);
    const height = parseInt(size[1]);

    for (let i = 0; i < width; ++i) {
      for (let j = 0; j < height; ++j) {
        if (fabric[offsetX + i][offsetY + j] === 0) {
          fabric[offsetX + i][offsetY + j] = claimId;
        } else {
          fabric[offsetX + i][offsetY + j] = 'X';
        }
      }
    }
  });

  lineReader.on('close', () => {
    let overlappingSquares = 0;
    for (let i = 0; i < fabric.length; ++i) {
      for (let j = 0; j < fabric[i].length; ++j) {
        if (fabric[i][j] === 'X') {
          ++overlappingSquares;
        }
      }
    }

    console.log('Question 1:', overlappingSquares);
    console.timeEnd('timer1');
  });
}

function question2() {
  console.time('timer2');

  const readStream = fs.createReadStream('./day_03_input.txt');
  const lineReader = rl.createInterface(readStream);

  let boxArray = [];

  lineReader.on('line', (line) => {
    const datastring = line.toString();
    const splitstring = datastring.split(' ');

    const claimId = parseInt(splitstring[0].replace('#', ''));

    const offsets = splitstring[2].replace(':', '').split(',');
    const offsetX = parseInt(offsets[0]);
    const offsetY = parseInt(offsets[1]);

    const size = splitstring[3].split('x');
    const width = parseInt(size[0]);
    const height = parseInt(size[1]);

    boxArray.push({id: claimId, x: offsetX + 1, y: offsetY + 1, width: width, height: height});
  });

  lineReader.on('close', () => {
    let claimId = 0;
    for (let i = 0; i < boxArray.length; ++i) {
      let bDoesBoxCollide = false;
      for (let j = 0; j < boxArray.length; ++j) {
        //ignore self-collision
        if (j !== i)
        {
          if (doesCollide(boxArray[i], boxArray[j])) {
            bDoesBoxCollide = true;
          }
        }
      }

      if (!bDoesBoxCollide) {
        claimId = boxArray[i].id;
        break;
      }
    }

    console.log('Question 2:', claimId);
    console.timeEnd('timer2');
  });
}

function doesCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

question1();
question2();
