const fs = require('fs');
const rl = require('readline');

const yHashOffset = 10000;

function question1And2() {
  const readStream = fs.createReadStream('./day_22_input.txt');
  const lineReader = rl.createInterface(readStream);

  const depthRegex = /depth: (\d+)/;
  const targetRegex = /target: (\d+),(\d+)/;

  let depth;
  let target;

  lineReader.on('line', (line) => {
    let match = depthRegex.exec(line);
    if (match) {
      depth = parseInt(match[1]);
      return;
    }

    match = targetRegex.exec(line);
    if (match) {
      target = {
        x: parseInt(match[1]),
        y: parseInt(match[2])
      };
      return;
    }
  });

  lineReader.on('close', () => {
    const riskLevel = calculateRiskLevel(depth, target.x, target.y);
    console.log("Question1:", riskLevel);

    const shortestSaveTime = calculateShortestSaveTime(depth, target.x, target.y);
    console.log("Question2:", shortestSaveTime);
  });
}

function calculateRiskLevel(depth, targetX, targetY) {
  const width = targetX;
  const height = targetY;
  const map = generateMap(width, height, targetX, targetY, depth);

  let sum = 0;
  map.forEach((tile) => {
    sum += tile;
  });

  return sum;
}

function calculateShortestSaveTime(depth, targetX, targetY) {
  const width = 50 + (targetX + 1);
  const height = 5 + (targetY + 1);

  const map = generateMap(width, height, targetX, targetY, depth);

  const startX = 0;
  const startY = 0;
  const time = 0;
  let tool = 1; //[Nothing, Torch, ClimbingGear]
  let path = [[startX, startY, time, tool]];
  const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

  let timeMap = new Map();
  while (path.length > 0) {
    let [time, x, y, tool] = path.shift();
    let bestTime = timeMap.get(hash(x, y, tool)) || Number.MAX_SAFE_INTEGER;

    if (bestTime <= time) {
        continue;
    }

    if (targetX === x && targetY === y && tool === 1) {
        return time;
    }

    timeMap.set(hash(x, y, tool), time);
    for (let i = 0; i < 3; ++i) {
      if (i !== tool && i !== map.get(hash(x, y))) {
        let bestTime = timeMap.get(hash(x, y, i)) || Number.MAX_SAFE_INTEGER;
        if (bestTime > time + 7) {
          path.push([time + 7, x, y, i]);
        }
      }
    }

    for (let [directionX, directionY] of directions) {
      if (x + directionX < 0 || x + directionX >= width || y + directionY < 0 || y + directionY >= height) {
        continue;
      }

      let terrain = map.get(hash(x + directionX, y + directionY));
      if (terrain === tool) {
        continue;
      }
      let bestTime = timeMap.get(hash(x + directionX, y + directionY, tool)) || Number.MAX_SAFE_INTEGER;
      if (bestTime > time + 1) {
        path.push([time + 1, x + directionX, y + directionY, tool]);
      }
    }

    path.sort((a, b) => {
        let [timeA,,,] = a;
        let [timeB,,,] = b;
        return timeA - timeB;
    });

    let temp = new Map();
    for (let [time, x, y, t] of path) {
        if (!temp.get(hash(x, y, t))) {
            temp.set(hash(x, y, t), time);
        }
    }

    path = []
    for (let [key, v] of [...temp.entries()]) {
        let t = key % 10;
        key = Math.floor(key / 10);
        let y = key % yHashOffset;
        let x = Math.floor(key / yHashOffset);
        path.push([v, x, y, t])
    }
  }
}

function generateMap(width, height, targetX, targetY, depth) {
  let map = new Map();

  for (let x = 0; x <= width; ++x) {
    for (let y = 0; y <= height; ++y) {
      if (x + y === 0) {
          map.set(hash(x, y), (0 + depth) % 20183);
          continue;
      }
      if (x === targetX && y === targetY) {
          map.set(hash(x, y), (0 + depth) % 20183);
          continue;
      }
      if (y === 0) {
          map.set(hash(x, y), (x * 16807 + depth) % 20183)
          continue;
      }
      if (x === 0) {
          map.set(hash(x, y), (y * 48271 + depth) % 20183)
          continue;
      }
      if (!map.has(hash(x, y - 1)) || !map.has(hash(x - 1, y))) {
          return;
      }

      const geoIndex = map.get(hash(x - 1, y)) * map.get(hash(x, y - 1));
      map.set(hash(x, y), (geoIndex + depth) % 20183);
    }
  }

  for (let x = 0; x <= width; ++x) {
    for (let y = 0; y <= height; ++y) {
      const currentRisk = map.get(hash(x, y)) % 3;
      map.set(hash(x, y), currentRisk);
    }
  }

  return map;
}


function hash(x, y, tool) {
  return x * 10 * yHashOffset + y * 10 + (tool || 0);
}

question1And2();
