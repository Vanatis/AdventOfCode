const fs = require('fs');
const rl = require('readline');

function question1() {
  console.time('timer1');
  fs.readFile('./day_08_input.txt', (err, data) => {
    const datastring = data.toString().trim("\n");
    const numberArray = datastring.split(' ');

    const nodes = createNode(numberArray, 0);
    const sum = sumMetaData(nodes);

    console.timeEnd('timer1');
    console.log('Question 1:', sum);
  });
}

function question2() {
  console.time('timer2');
  fs.readFile('./day_08_input.txt', (err, data) => {
    const datastring = data.toString().trim("\n");
    const numberArray = datastring.split(' ');

    const nodes = createNode(numberArray, 0);
    const value = getValueOfNode(nodes);

    console.timeEnd('timer2');
    console.log('Question 2:', value);
  });
}

function createNode(numberArray, startIndex) {
  const numChildNodes = parseInt(numberArray[startIndex]);
  const numMetaDataEntries = parseInt(numberArray[startIndex + 1]);

  let children = [];
  let position = 2;
  for (let i = 0; i < numChildNodes; ++i) {
    const node = createNode(numberArray, startIndex + position);
    position += nodeLength(node);
    children.push(node);
  }

  let metaData = [];
  for (let i = 0; i < numMetaDataEntries; ++i) {
    metaData.push(parseInt(numberArray[startIndex + position + i]));
  }

  return {children: children, metaData: metaData};
}

function nodeLength(node) {
  let length = 0;

  node["children"].map((child) => {
    length += nodeLength(child);
  });

  return 2 + length + node["metaData"].length;
}

function sumMetaData(node) {
  let sum = 0;

  node["children"].map((childNode) => {
    sum += sumMetaData(childNode);
  });

  const currentLevelSum = node["metaData"].reduce((a, b)=> {
    return a + b;
  }, 0);

  return sum + currentLevelSum;
}


function getValueOfNode(node) {
  let value = 0;

  const children = node["children"];
  const metaData = node["metaData"];

  if (children.length) {
    metaData.forEach((index) => {
      const child = children[index - 1];

      if (child) {
        value += getValueOfNode(child);
      }
    });
  } else {
    value += metaData.reduce((a, b) => a + b, 0);
  }

  return value;
};

question1();
question2();
