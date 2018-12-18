const fs = require('fs');
const rl = require('readline');

const OPEN = ".";
const LUMBERMILL = "#";
const TREES = "|";

function question1() {
  const readStream = fs.createReadStream('./day_18_input.txt');
  const lineReader = rl.createInterface(readStream);

  let area = [];
  let row = 0;
  lineReader.on('line', (line) => {
    let column = 0;

    const charArray = line.split("");
    let columnArray = charArray.map((char) => {
        let tile = new Tile(column, row, char);
        ++column;
        return tile;
    });
    ++row;

    area = area.concat(columnArray);
  });

  lineReader.on('close', () => {
    console.log("Question1:", simulateSettlement(area, 10));
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_18_input.txt');
  const lineReader = rl.createInterface(readStream);

  let area = [];
  let row = 0;
  lineReader.on('line', (line) => {
    let column = 0;

    const charArray = line.split("");
    let columnArray = charArray.map((char) => {
        let tile = new Tile(column, row, char);
        ++column;
        return tile;
    });
    ++row;

    area = area.concat(columnArray);
  });

  lineReader.on('close', () => {
    console.log("Question1:", simulateSettlement(area, 1000000000));
  });
}

function simulateSettlement(area, minutes) {
  let history = {};

  for (let i = 0; i < minutes; ++i) {
    area.map((tile) => {
      tile.updateSurroundingSpaces(area);
    });

    area.map((tile) => {
      tile.simulateMinute();
    });

    //Loop detection
    let stringArea = JSON.stringify(area);
    let previous = history[stringArea];
    if (previous) {
      let loopLength = i - previous;
      while (i < minutes - loopLength) {
        i += loopLength;
      }
    } else {
      history[stringArea] = i;
    }
  }

  let numLumberMills = area.filter(tile => tile.type == LUMBERMILL).length;
  let numTrees = area.filter(tile => tile.type == TREES).length;

  return numLumberMills * numTrees;
}

class Tile {
  constructor (x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.surroundingOpenSpaces = 0;
    this.surroundingLumberMills = 0;
    this.surroundingTrees = 0;
  }

  updateSurroundingSpaces(allTiles) {
    const surroundingTiles = allTiles.filter(tile => {
      return (tile.x >= this.x - 1 && tile.x <= this.x + 1)
        && (tile.y >= this.y - 1 && tile.y <= this.y + 1)
        && !(tile.x === this.x && tile.y === this.y);
    });

    this.surroundingOpenSpaces = surroundingTiles.filter(tile => tile.type === OPEN).length;
    this.surroundingLumberMills = surroundingTiles.filter(tile => tile.type === LUMBERMILL).length;
    this.surroundingTrees = surroundingTiles.filter(tile => tile.type === TREES).length;
  }

  simulateMinute() {
    switch(this.type) {
      case OPEN:
        if (this.surroundingTrees >= 3) {
          this.type = TREES;
        }
        break;
      case TREES:
        if (this.surroundingLumberMills >= 3) {
          this.type = LUMBERMILL;
        }
        break;
      case LUMBERMILL:
        if (this.surroundingLumberMills < 1 || this.surroundingTrees < 1) {
          this.type = OPEN;
        }
        break;
      default:
        break;
    }
  }

  print() {
    console.log(this.x, this.y, this.type, this.surroundingOpenSpaces, this.surroundingLumberMills, this.surroundingTrees);
  }
}

question1();
question2();
