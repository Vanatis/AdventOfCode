const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_20_input.txt');
  const lineReader = rl.createInterface(readStream);

  let path;
  lineReader.on('line', (line) => {
    path = line.split("").slice(1, line.length - 1); // exclude first and last
  });

  lineReader.on('close', () => {
    let result = calculateLongestPath(path);

    console.log("Question1:", result["max"]);
    console.log("Question2:", result["count"]);
  });
}

class Map {
  constructor() {
    this.rows = {};
  }

  addNode(node) {
    this.set(node.x, node.y, node);
  }

  getRow(row) {
    return this.rows[row] || (this.rows[row] = {});
  }

  set(x, y, node) {
    this.getRow(y)[x] = node;
  }

  get(x, y) {
    return this.getRow(y)[x] || {x: x, y: y, distance: Number.POSITIVE_INFINITY};
  }
}

function calculateLongestPath(path) {
  let currentNode = {x: 0, y: 0, distance: 0};
  const stack = [currentNode];
  const map = new Map();

  path.map((step) => {
    switch (step) {
      case "N":
        currentNode = doStep(0, -1, map, currentNode);
        break;
      case "E":
        currentNode = doStep(1, 0, map, currentNode);
        break;
      case "S":
        currentNode = doStep(0, 1, map, currentNode);
        break;
      case "W":
        currentNode = doStep(-1, 0, map, currentNode);
        break;
      case "(":
        stack.push(currentNode);
        break;
      case ")":
        currentNode = stack.pop();
        break;
      case "|":
        currentNode = stack[stack.length - 1];
        break;
      default:
        break;
    }
  });

  const allDistances = [];

  console.log(map.rows);
  for (let row in map.rows) {
    for (let tile in map.rows[row]) {
      allDistances.push(map.rows[row][tile].distance);
    }
  }

  const numDistancesOverThousand = allDistances.filter(distance => distance >= 1000).length;
  const maxDistance = Math.max.apply(undefined, allDistances);

  return {max: maxDistance, count: numDistancesOverThousand};
}

function doStep(dx, dy, map, currentNode) {
  const node = map.get(currentNode.x + dx, currentNode.y + dy);
  node.distance = Math.min(node.distance, currentNode.distance + 1);
  currentNode = node;
  map.addNode(node);

  return currentNode;
}

question1();
