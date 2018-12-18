const fs = require('fs');
const rl = require('readline');

const CLAY = "#";
const WATER = "~";
const WATERFLOW = "|";

function question1And2() {
  const readStream = fs.createReadStream('./day_17_input.txt');
  const lineReader = rl.createInterface(readStream);

  let grid = [];

  lineReader.on("line", line => {
    let match = /([xy])=(\d+)(..)?(\d+)?, ([xy])=(\d+)(..)?(\d+)?/.exec(line);
    if (match) {
      let contents = {};

      let var1 = match[1];
      let start1 = match[2];
      let end1 = match[4];
      contents[var1] = {from: parseInt(start1), to: end1 !== undefined ? parseInt(end1) : parseInt(start1)};

      let var2 = match[5];
      let start2 = match[6];
      let end2 = match[8];
      contents[var2] = {from: parseInt(start2), to: end2 !== undefined ? parseInt(end2) : parseInt(start2)};

      for (let x = contents.x.from; x <= contents.x.to; ++x) {
        for (let y = contents.y.from; y <= contents.y.to; ++y) {
          grid.push({x: x, y: y});
        }
      }
    }
  });

  lineReader.on('close', () => {
    simulateWater(grid);
  });
}

function simulateWater(grid) {
  let data = {
    minY: grid.reduce((min, {y}) => (min === null || y < min ? y : min), null),
    maxY: grid.reduce((max, {y}) => (max === null || y > max ? y : max), null),
    filledByXY: grid.reduce((map, {x, y}) => {
      map[strXY({x, y})] = CLAY;
      return map;
    }, {})
  }

  let cursor = {x: 500, y: 0};
  flowWater(data, {...cursor});

  let numWaterAndFlow = Object.values(data.filledByXY).filter(contents => contents === WATER || contents === WATERFLOW).length;
  let numWater = Object.values(data.filledByXY).filter(contents => contents === WATER).length;
  console.log("Question1:", numWaterAndFlow);
  console.log("Question2:", numWater);

  return data;
}

function flowWater(data, cursor) {
  if (cursor.y >= data.maxY) {
    return;
  }

  let cursorDown = {...cursor, y: cursor.y + 1};
  let cursorLeft = {...cursor, x: cursor.x - 1};
  let cursorRight = {...cursor, x: cursor.x + 1};

  if (isEmpty(data, cursorDown)) {
    if (cursorDown.y >= data.minY) {
      fill(data, cursorDown, WATERFLOW);
    }
    flowWater(data, cursorDown);
  }

  if (isStale(data, cursorDown) && isEmpty(data, cursorLeft)) {
    fill(data, cursorLeft, WATERFLOW);
    flowWater(data, cursorLeft);
  }

  if (isStale(data, cursorDown) && isEmpty(data, cursorRight)) {
    fill(data, cursorRight, WATERFLOW);
    flowWater(data, cursorRight);
  }

  if (isStale(data, cursorDown) && hasWallLeft(data, cursor) && hasWallRight(data, cursor)) {
    fillLeft(data, cursor, WATER);
    fillRight(data, cursor, WATER);
    fill(data, cursor, WATER);
  }
}

function isEmpty(data, cursor) {
  return !getContents(data, cursor);
}

function isStale(data, cursor) {
  return [WATER, CLAY].indexOf(getContents(data, cursor)) > -1;
}

function isClay(data, cursor) {
  return getContents(data, cursor) === CLAY;
}

function hasWallLeft(data, cursor) {
  let offset = -1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isEmpty(data, cursorOffset)) return false;
    if (isClay(data, cursorOffset)) return true;
    offset--;
  }
}

function hasWallRight(data, cursor) {
  let offset = 1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isEmpty(data, cursorOffset)) return false;
    if (isClay(data, cursorOffset)) return true;
    offset++;
  }
}

function fillLeft(data, cursor, contents) {
  let offset = -1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isClay(data, cursorOffset)) return;
    fill(data, cursorOffset, contents);
    offset--;
  }
}

function fillRight(data, cursor, contents) {
  let offset = 1;
  while (true) {
    let cursorOffset = { ...cursor, x: cursor.x + offset };
    if (isClay(data, cursorOffset)) return;
    fill(data, cursorOffset, contents);
    offset++;
  }
}

function fill(data, cursor, contents) {
  data.filledByXY[strXY(cursor)] = contents;
}

function strXY({ x, y }) {
  return `${x},${y}`;
}

question1And2();
