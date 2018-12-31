const fs = require('fs');
const rl = require('readline');

const yHashOffset = 10000;

function question1And2() {
  const readStream = fs.createReadStream('./day_23_input.txt');
  const lineReader = rl.createInterface(readStream);

  const inputRegex = /^pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)$/;

  let nanobots = [];
  let minPos = [0, 0, 0];
  let maxPos = [0, 0, 0];

  lineReader.on('line', (line) => {
    const match = inputRegex.exec(line);
    if (match) {
      const botPos = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];

      for (let i = 0; i < 3; ++i) {
        if (maxPos[i] < botPos[i]) {
          maxPos[i] = botPos[i];
        }
        if (minPos[i] > botPos[i]) {
          minPos[i] = botPos[i];
        }
      }

      const range = parseInt(match[4]);
      nanobots.push([...botPos, range]);
    }
  });

  lineReader.on('close', () => {
    let sortedNanobots = nanobots.sort((a, b) => {
      return b[3] - a[3];
    });
    let maxNanobotsInRange = findNanobotsInRange(sortedNanobots, sortedNanobots[0]);
    let bestLocation = calculateSafestLocation(minPos, maxPos, nanobots);

    console.log("Question1:", maxNanobotsInRange);
    console.log("Question2:", calculateManhattanDistance(...bestLocation));
  });
}

function findNanobotsInRange(nanobots, nanobot) {
  const filteredNanobots = nanobots.filter(bot => {
    const [botX, botY, botZ, range] = bot;
    const [nanobotX, nanobotY, nanobotZ, nanobotRange] = nanobot;

    const distance = calculateManhattanDistance(botX, botY, botZ, nanobotX, nanobotY, nanobotZ);
    if (distance <= nanobotRange) {
      return bot;
    }

    return null;
  });

  return filteredNanobots.length;
}

function calculateSafestLocation(minPos, maxPos, nanobots) {
  let gridSize = maxPos[0] - minPos[0];
  let bestGrid;

  while (gridSize > 0) {
    let maxPosCount = 0;

    for (let x = minPos[0]; x < maxPos[0] + 1; x += gridSize) {
      for (let y = minPos[1]; y < maxPos[1] + 1; y += gridSize) {
        for (let z = minPos[2]; z < maxPos[2] + 1; z += gridSize) {
          let count = 0;
          for (const [botX, botY, botZ, range] of nanobots) {
            let distance = calculateManhattanDistance(x, y, z, botX, botY, botZ);
            if (distance - range < gridSize) {
              ++count;
            }
          }

          if (count > maxPosCount) {
            maxPosCount = count;
            bestGrid = [x, y, z];
          } else if (maxPosCount === count) {
            if (!bestGrid || calculateManhattanDistance(x, y, z) < calculateManhattanDistance(...bestGrid)) {
              bestGrid = [x, y, z];
            }
          }
        }
      }
    }

    for (let i = 0; i < 3; ++i) {
      minPos[i] = bestGrid[i] - gridSize;
      maxPos[i] = bestGrid[i] + gridSize;
    }

    gridSize = Math.floor(gridSize / 2);
  }

  return bestGrid;
}

function calculateManhattanDistance(ax, ay, az, bx = 0, by = 0, bz = 0) {
  return (Math.abs(ax - bx) + Math.abs(ay -  by) + Math.abs(az - bz));
}

question1And2();
