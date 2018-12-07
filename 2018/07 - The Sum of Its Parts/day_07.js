const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_07_input.txt');
  const lineReader = rl.createInterface(readStream);

  let instructions = [];
  for (i = 'A'.charCodeAt(0); i < 'Z'.charCodeAt(0); ++i) {
    instructions.push({stepId: String.fromCharCode(i), requiredSteps: [], bIsExecuted: false})
  }

  lineReader.on('line', (line) => {
    const splitLine = line.split(" ");
    const currentStepId = splitLine[7];
    const currentRequiredStep = splitLine[1];

    //Fill instructions
    let currentInstruction = instructions.find((instruction) => { return instruction["stepId"] === currentStepId});
    if (currentInstruction) {
      currentInstruction["requiredSteps"].push(currentRequiredStep);
    }
  });

  lineReader.on('close', () => {
    let executedInstructions = [];
    let nextSteps = getNextSteps(instructions, executedInstructions);

    console.log('Question 1:', executedInstructions.join(""));
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_07_input.txt');
  const lineReader = rl.createInterface(readStream);

  let instructions = [];
  for (i = 'A'.charCodeAt(0); i <= 'Z'.charCodeAt(0); ++i) {
    instructions.push({stepId: String.fromCharCode(i), requiredSteps: [], duration: (i - 4), bIsExecuted: false, bIsActive: false})
  }

  lineReader.on('line', (line) => {
    const splitLine = line.split(" ");
    const currentStepId = splitLine[7];
    const currentRequiredStep = splitLine[1];

    //Fill instructions
    let currentInstruction = instructions.find((instruction) => { return instruction["stepId"] === currentStepId});
    if (!currentInstruction) {
      instructions.push({stepId: currentStepId, requiredSteps: [currentRequiredStep] });
    } else {
      currentInstruction["requiredSteps"].push(currentRequiredStep);
    }
  });

  lineReader.on('close', () => {
    //Setup startStep
    const startStep = instructions.find((instruction) => {return instruction["requiredSteps"].length === 0});
    const numWorkers = 5;
    console.log('Question 2:', getTimeToRequired(instructions, numWorkers));
  });
}

function getNextSteps(instructions, executedInstructions) {
  let possibleTasks = instructions.filter((instruction) => {
    //Check if previousRequirements have been fulfilled
    let bPreviousInstructionsFinished = true;
    instruction["requiredSteps"].map((requiredStep) => {
      if (!executedInstructions.includes(requiredStep)) {
        bPreviousInstructionsFinished = false;
      }
    });
    return bPreviousInstructionsFinished && !instruction["bIsExecuted"];
  }).map((instruction) => {
    return instruction;
  });

  if (possibleTasks.length > 0) {
    possibleTasks.sort((a, b) => {
      return a["stepId"].charCodeAt(0) - b["stepId"].charCodeAt(0);
    });
    possibleTasks[0]["bIsExecuted"] = true;
    executedInstructions.push(possibleTasks[0]["stepId"]);
    getNextSteps(instructions, executedInstructions, possibleTasks[0]);
  } else {
    return executedInstructions;
  }
}

function getTimeToRequired(instructions, numWorkers) {
  //Add Timetable
  let time = 0;
  let executedInstructions = [];

  //initialize workers
  let workers = [];
  for (let i = 0; i < numWorkers; ++i) {
    workers.push({id: i, task: "", progress: 0});
  }

  //Execute tasks
  let bAllInstructionsExecuted = false;
  while (!bAllInstructionsExecuted) {
    //Get possible steps
    let possibleTasks = instructions.filter((instruction) => {
      //Check if previousRequirements have been fulfilled
      let bPreviousInstructionsFinished = true;
      instruction["requiredSteps"].map((requiredStep) => {
        if (!executedInstructions.includes(requiredStep)) {
          bPreviousInstructionsFinished = false;
        }
      });
      return bPreviousInstructionsFinished && !instruction["bIsActive"] && !instruction["bIsExecuted"];
    }).map((instruction) => {
      return instruction;
    });

    //Assign tasks to workers
    workers.map((worker) => {
      if (worker["task"] === "" && possibleTasks.length > 0) {
        worker["task"] = possibleTasks[0];
        worker["progress"] = 0;

        possibleTasks[0]["bIsActive"] = true;
        possibleTasks.splice(0, 1);
      }
    });

    //Update time
    ++time;
    workers.map((worker) => {
      if (worker["task"] !== "")
      {
        ++worker["progress"];
        if (worker["progress"] === worker["task"]["duration"]) {
          worker["task"]["bIsActive"] = false;
          worker["task"]["bIsExecuted"] = true;
          executedInstructions.push(worker["task"]["stepId"]);
          worker["task"] = "";
          worker["progress"] = 0;
        }
      }
    });

    //Check if all instructions are finished now
    bAllInstructionsExecuted = true;
    instructions.map((instruction) => {
      if (!instruction["bIsExecuted"]) { bAllInstructionsExecuted =  false;}
    })
  }

  return time;
}

question1();
question2();
