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
    //Get min/max of x and y value to determine which coordinates are not infinite

    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = Number.MIN_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxY = Number.MIN_SAFE_INTEGER;

    inputCoordinates.map((coordinate) => {
      minX = minX < coordinate.x ? minX : coordinate.x;
      minY = minY < coordinate.y ? minY : coordinate.y;
      maxX = maxX > coordinate.x ? maxX : coordinate.x;
      maxY = maxY > coordinate.y ? maxY : coordinate.y;
    });

    //for each point on the outside of the square grid, determine closest point.
    //If a inputCoordinate is closest, that inputCoordinate has an infinite area
    let finiteIndices = checkInfinites(inputCoordinates, minX, maxX, minY, maxY);
    let surfaceAreas = calcSurfaceAreas(inputCoordinates, minX, maxX, minY, maxY);

    let filteredAreas = surfaceAreas.map((area) => {
      if (finiteIndices.includes(area["index"])) {
        return area;
      }
    })
    filteredAreas.sort((a,b) => {
      return b.size - a.size;
    });

    console.log('Question 1:', filteredAreas[0]["size"]);
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

function checkInfinites(inputCoordinates, minX, maxX, minY, maxY) {
  //Horizontal edges
  let infiniteIndices = [];

  for (let x = minX - 1; x <= maxX + 1; ++x) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;
    let maxDistance = Number.MAX_SAFE_INTEGER;
    let maxIndex = -1;

    for (let i = 0; i < inputCoordinates.length; ++i) {
      let curMinDistance = calcManhattanDistance(inputCoordinates[i], {x: x, y: minY});
      if (minDistance > curMinDistance) {
        minDistance = curMinDistance;
        minIndex = i;
      }

      let curMaxDistance = calcManhattanDistance(inputCoordinates[i], {x: x, y: maxY})
      if (maxDistance > curMaxDistance) {
        maxDistance = curMaxDistance;
        maxIndex = i;
      }
    }
    if (minIndex !== -1 && !infiniteIndices.includes(minIndex)) { infiniteIndices.push(minIndex); }
    if (maxIndex !== -1 && !infiniteIndices.includes(maxIndex)) { infiniteIndices.push(maxIndex); }
  }

  //Vertical edges
  for (let y = minY - 1; y <= maxY + 1; ++y) {
    let minDistance = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;
    let maxDistance = Number.MAX_SAFE_INTEGER;
    let maxIndex = -1;

    for (let i = 0; i < inputCoordinates.length; ++i) {
      let curMinDistance = calcManhattanDistance(inputCoordinates[i], {x: minY, y: y});
      if (minDistance > curMinDistance) {
        minDistance = curMinDistance;
        minIndex = i;
      }

      let curMaxDistance = calcManhattanDistance(inputCoordinates[i], {x: maxY, y: y})
      if (maxDistance > curMaxDistance) {
        maxDistance = curMaxDistance;
        maxIndex = i;
      }
    }

    if (minIndex !== -1 && !infiniteIndices.includes(minIndex)) { infiniteIndices.push(minIndex); }
    if (maxIndex !== -1 && !infiniteIndices.includes(maxIndex)) { infiniteIndices.push(maxIndex); }
  }

  let finiteCoordinates = [];
  inputCoordinates.map((coordinate, index) => {
    if (!infiniteIndices.includes(index)) {
        finiteCoordinates.push(index);
      }
    return coordinate;
  });
  return finiteCoordinates;
}

function calcSurfaceAreas(inputCoordinates, minX, maxX, minY, maxY) {
  let surfaceAreas = [];

  for (let x = minX; x <= maxX; ++x) {
    for (let y = minY; y <= maxY; ++y) {
      let shortestDistance = Number.MAX_SAFE_INTEGER;
      let index = -1;
      let bMultipleShortestDistances = false;

      for (let i = 0; i < inputCoordinates.length; ++i) {
        const currentDistance = calcManhattanDistance(inputCoordinates[i], {x: x, y: y});
        if (shortestDistance > currentDistance) {
          shortestDistance = currentDistance;
          index = i;
          bMultipleShortestDistances = false;
        } else if (shortestDistance === currentDistance) {
          index = -1;
          bMultipleShortestDistances = true;
        }
      }

      //Check if surfaceAreas already contains entry for current index. if not then add, if yes then increment
      if (!bMultipleShortestDistances) {
        let currentSurfaceArea = surfaceAreas.find((obj) => { return obj["index"] === index});
        if (!currentSurfaceArea) {
          surfaceAreas.push({index: index, size: 1});
        } else {
          ++currentSurfaceArea["size"];
        }
      }
    }
  }

  return surfaceAreas;
}

question1();
//question2();
