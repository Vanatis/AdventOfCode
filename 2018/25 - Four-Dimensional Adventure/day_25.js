const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_25_input.txt');
  const lineReader = rl.createInterface(readStream);

  const inputRegex = /([-\d]*),([-\d]*),([-\d]*),([-\d]*)/;

  let matrixList = [];
  lineReader.on('line', (line) => {
    let match = inputRegex.exec(line);
    let matrix = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseInt(match[4])];
    matrixList.push(matrix);
  });

  lineReader.on('close', () => {
    let numConstellations = calculateNumberOfConstellations(matrixList);

    console.log("Question1:", numConstellations);
    console.log("Question2:");
  });
}

function calculateNumberOfConstellations(points) {
  const visited = points.map((point) => {
    return false
  });

  let count = 0;
  points.map((point, index) => {
    if (!visited[index]) {
      checkConstellations(index, points, visited);
      ++count;
    }
  });

  return count;
}

function checkConstellations(index, points, visited) {
  visited[index] = true;
  points.map((point, pointIndex) => {
    if (!visited[pointIndex] && calculateManhattanDistance(points[index], point) <= 3) {
      checkConstellations(pointIndex, points, visited);
    }
  });
}


function calculateManhattanDistance(a, b) {
  let distance = 0;
  for (let i = 0; i < a.length; ++i) {
    distance += Math.abs(a[i] - b[i]);
  }
  return distance;
}

question1();
