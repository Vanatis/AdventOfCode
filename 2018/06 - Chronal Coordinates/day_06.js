const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_06_input.txt');
  const lineReader = rl.createInterface(readStream);

  const inputCoordinates = [];
  lineReader.on('line', (line) => {
    const coordinate = line.split(", ");
    inputCoordinates.push({x: parseInt(coordinate[0]), y: parseInt(coordinate[1])});
  });

  lineReader.on('close', () => {
    console.log(inputCoordinates);

    //Get min/max of x and y value to determine which coordinates are not infinite
    inputCoordinates.sort((a, b) => {
      return b.x - a.x;
    });
    const minX = inputCoordinates[inputCoordinates.length - 1].x;
    const maxX = inputCoordinates[0].x;

    console.log("minX:", minX);
    console.log("maxX:", maxX);

    inputCoordinates.sort((a, b) => {
      return b.y - a.y;
    });
    const minY = inputCoordinates[inputCoordinates.length - 1].y;
    const maxY = inputCoordinates[0].y;

    console.log("minY:", minY);
    console.log("maxY:", maxY);

    //for each point on the outside of the square grid, determine closest point.
    //If a inputCoordinate is closest, that inputCoordinate has an infinite area
    let finiteCoordinates = inputCoordinates;
    for (let i = minX; i < maxX; ++i) {
      //Top border
      let minDistance = calcManhattanDistance(inputCoordinate[0], {x: i, y: minY});
      for (let j = 1; j < inputCoordinate.length; ++j) {
        const currentDistance = calcManhattanDistance(inputCoordinate[j], {x: i, y: minY});
        if (minDistance > currentDistance) {
          minDistance == currentDistance;
        }
      }
    }


    console.log('Question 1:');
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_06_input.txt');
  const lineReader = rl.createInterface(readStream);

  lineReader.on('line', (line) => {
  });

  lineReader.on('close', () => {
    console.log('Question 2:');
  });
}

function calcManhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

question1();
//question2();
