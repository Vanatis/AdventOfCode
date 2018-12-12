const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_12_input.txt');
  const lineReader = rl.createInterface(readStream);

  let startState = "";
  let numGenerations = 20;
  const patterns = [];

  console.time('timer1');
  lineReader.on('line', (line) => {
    const dataString = line.toString().trim("\n");
    if (dataString === "" ||dataString === "\n") {return;}

    if (dataString.startsWith("initial state:")) {
      startState = dataString.slice(15, dataString.length);
    } else {
      const patternData = dataString.match(/^((.|#){5}) => (.|#)$/);
      patterns.push({pattern: patternData[1], result: patternData[3]});
    }
  });

  lineReader.on('close', () => {
    const result = calcGenerations(numGenerations, startState, patterns);
    console.log("Question 1:", result);
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_12_input.txt');
  const lineReader = rl.createInterface(readStream);

  let startState = "";
  let numGenerations = 50000000000;
  const patterns = [];

  console.time('timer1');
  lineReader.on('line', (line) => {
    const dataString = line.toString().trim("\n");
    if (dataString === "" ||dataString === "\n") {return;}

    if (dataString.startsWith("initial state:")) {
      startState = dataString.slice(15, dataString.length);
    } else {
      const patternData = dataString.match(/^((.|#){5}) => (.|#)$/);
      patterns.push({pattern: patternData[1], result: patternData[3]});
    }
  });

  lineReader.on('close', () => {
    let convergence = findConvergencePoint(numGenerations, startState, patterns);

    let offset = 0;
    if (numGenerations > convergence["convergenceGen"]) {
      offset = (numGenerations - convergence["convergenceGen"]) * convergence["convergenceStep"];
      numGenerations = convergence["convergenceGen"];
    }

    const result = calcGenerations(numGenerations, startState, patterns);
    console.log("Question 2:", result + offset);
  });
}

function calcGenerations(numGenerations, startState, patterns) {
  let initialPotIndex = 0;
  let state = startState;
  let convergenceCount = 0;
  let sumPotIndices = 0;

  let previousValue = 0;
  let compareValue = 0;

  for (let gen = 1; gen <= numGenerations; gen++) {
    state = '....' + state + '....';
    initialPotIndex += 4;

    let nextState = state.replace(/\#/g, '.');

    patterns.map((pattern) => {
      for (let i = 0; i < state.length - 4; ++i) {
        if (state.substr(i, 5) === pattern["pattern"]) {
          nextState = nextState.substring(0, i + 2) + pattern["result"] + nextState.substring(i + 3);
        }
      }
    })

    sumPotIndices = nextState.split("").reduce((sum, currentValue, index) => {
      if (currentValue === '#') {
        sum += index - initialPotIndex;
      }
      return sum;
    }, 0);

    state = nextState;
  }

  return sumPotIndices;
}

function findConvergencePoint(numGenerations, startState, patterns) {
  let initialPotIndex = 0;
  let state = startState;
  let convergenceCount = 0;
  let sumPotIndices = 0;

  let previousValue = 0;
  let compareValue = 0;

  for (let gen = 1; gen <= 100000; gen++) {
    state = '....' + state + '....';
    initialPotIndex += 4;

    let nextState = state.replace(/\#/g, '.');

    patterns.map((pattern) => {
      for (let i = 0; i < state.length - 4; ++i) {
        if (state.substr(i, 5) === pattern["pattern"]) {
          nextState = nextState.substring(0, i + 2) + pattern["result"] + nextState.substring(i + 3);
        }
      }
    })

    let firstPlant = state.indexOf("#");
    let lastPlant = state.lastIndexOf("#");
    let plantSequence = state.substr(firstPlant, (lastPlant - firstPlant) + 1);

    let firstPlantNext = nextState.indexOf("#");
    let lastPlantNext = nextState.lastIndexOf("#");
    let plantSequenceNext = nextState.substr(firstPlantNext, (lastPlantNext - firstPlantNext) + 1);

    if (plantSequence === plantSequenceNext) {
      ++convergenceCount;
    } else {
      convergenceCount = 0;
      previousValue = nextState.split("").reduce((sum, currentValue, index) => {
        if (currentValue === '#') {
          sum += index - initialPotIndex;
        }
        return sum;
      }, 0);
    }

    if (convergenceCount >= 10) {
      sumPotIndices = nextState.split("").reduce((sum, currentValue, index) => {
        if (currentValue === '#') {
          sum += index - initialPotIndex;
        }
        return sum;
      }, 0);

      return {convergenceGen: gen - 10, convergenceStep: valuePerGen = (sumPotIndices - previousValue) / 10};
    }

    state = nextState;
  }

  return null;
}

question1();
question2();
