const fs = require('fs');

const puzzleInput = parseInt(fs.readFileSync('./day_03_input.txt').toString());
console.log(puzzleInput);

function question1() {
  console.time('timer1');
  const position = getGridPosition(puzzleInput);
  const stepsToCenter = Math.abs(position.x) + Math.abs(position.y);
  console.timeEnd('timer1');

  console.log('Question 1:', stepsToCenter);
}

function question2() {
  console.time('timer2');
  let ulamSpiral = [];
  let index = 0;
  let highestValue = 0;

  while (highestValue <= puzzleInput) {
    const position = getGridPosition(index + 1);
    const sumValue = getSumFromSurroundingGrid(ulamSpiral, position);
    ulamSpiral.push({x: position.x, y: position.y, sumValue});

    highestValue = sumValue;
    ++index;
  }
  console.timeEnd('timer2');

  console.log('Question 2:', highestValue);
}

function getGridPosition(index)
{
  let x = 0;
  let y = 0;
  if (index === 1) { return {x, y}; }

  const layer = Math.ceil((Math.sqrt(index) - 1) / 2);
  const sideLength = 2 * layer;
  const startNumNextLayer = Math.pow(sideLength + 1, 2);

  let segment = 1;
  while (!(index > startNumNextLayer - (sideLength * segment))) {++segment;}
  --segment;

  const offset = layer - (startNumNextLayer - index - (segment * sideLength));
  switch(segment){
    case 0: x = offset; y = -layer; break; //South
    case 1: x = -layer; y = -offset; break; //West
    case 2: x = -offset; y = layer; break; //North
    case 3: x = layer; y = offset; break; //East
  }

  return {x, y};
}

function getSumFromSurroundingGrid(ulamSpiral, position) {
  let sumArray = [];

  //All 8 surrounding tiles
  const r = ulamSpiral.find(tile => tile.x == position.x + 1 && tile.y == position.y);
  if (r != null) { sumArray.push(r.sumValue); }

  const rt = ulamSpiral.find(tile => tile.x == position.x + 1 && tile.y == position.y + 1);
  if (rt != null) { sumArray.push(rt.sumValue); }

  const t = ulamSpiral.find(tile => tile.x == position.x && tile.y == position.y + 1);
  if (t != null) { sumArray.push(t.sumValue); }

  const lt = ulamSpiral.find(tile => tile.x == position.x - 1 && tile.y == position.y + 1);
  if (lt != null) { sumArray.push(lt.sumValue); }

  const l = ulamSpiral.find(tile => tile.x == position.x - 1 && tile.y == position.y);
  if (l != null) { sumArray.push(l.sumValue); }

  const lb = ulamSpiral.find(tile => tile.x == position.x - 1 && tile.y == position.y - 1);
  if (lb != null) { sumArray.push(lb.sumValue); }

  const b = ulamSpiral.find(tile => tile.x == position.x && tile.y == position.y - 1);
  if (b != null) { sumArray.push(b.sumValue); }

  const rb = ulamSpiral.find(tile => tile.x == position.x + 1 && tile.y == position.y - 1);
  if (rb != null) { sumArray.push(rb.sumValue); }

  if (sumArray.length === 0) { return 1; }
  else { return sumArray.reduce((acc, value) => { return acc + value}, 0); }
}

question1();
question2();
