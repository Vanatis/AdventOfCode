const fs = require('fs');
const rl = require('readline');

const operations = [
  "addr",
  "addi",
  "mulr",
  "muli",
  "banr",
  "bani",
  "borr",
  "bori",
  "setr",
  "seti",
  "gtir",
  "gtri",
  "gtrr",
  "eqir",
  "eqri",
  "eqrr"
];

function question1And2() {
  const readStream = fs.createReadStream('./day_16_input.txt');
  const lineReader = rl.createInterface(readStream);

  let registers = [0, 0, 0, 0];
  let numSamplesWithThreeOrMoreOpcodes = 0;
  let before = (after = null);
  let instruction = null; // instr = { opcode, A, B, C }

  let opcodes = {};
  let part2started = false;

  // regexes
  let regexBefore = /Before: \[(\d+), (\d+), (\d+), (\d+)\]/;
  let regexAfter = /After:  \[(\d+), (\d+), (\d+), (\d+)\]/;
  let regexInstr = /(\d+) (\d+) (\d+) (\d+)/;

  lineReader.on('line', (line) => {
    if ((match = regexBefore.exec(line))) {
      before = [match[1], match[2], match[3], match[4]].map(Number);
    }

    if ((match = regexAfter.exec(line))) {
      after = [match[1], match[2], match[3], match[4]].map(Number);
      let possibleOperations = getPossibleOperations(before, after, instruction);
      if (possibleOperations.length >= 3) {
        numSamplesWithThreeOrMoreOpcodes++;
      }

      opcodes[instruction.opcode] = opcodes[instruction.opcode] || [...operations];
      opcodes[instruction.opcode] = opcodes[instruction.opcode].filter(
        op => possibleOperations.indexOf(op) > -1
      );

      before = after = instruction = null; // reset current parser
    }

    if ((match = regexInstr.exec(line))) {
      instruction = {
        opcode: match[1],
        A: Number(match[2]),
        B: Number(match[3]),
        C: Number(match[4])
      };

      if (!before) {
        // we are not in a before-after sample, so we must execute the instruction against the current state
        // if it is the first instruction to execute, we need some deduction first to know for sure what  operation matches each opcode
        if (!part2started) {
          opcodes = opcodesDeduction(opcodes);
          part2started = true;
        }

        let op = opcodes[instruction.opcode];
        registers = callOperation(registers, op, instruction.A, instruction.B, instruction.C);
      }
    }
  });

  lineReader.on('close', () => {
    console.log("Question1:", numSamplesWithThreeOrMoreOpcodes);
    console.log("Question2:", registers[0]);
  });
}

function getPossibleOperations(before, after, {opcode, A, B, C }) {
  return operations.filter(op => {
    let opAfter = callOperation(before, op, A, B, C);
    let match = JSON.stringify(opAfter) == JSON.stringify(after);
    return match;
  });
}

function callOperation(state, operation, A, B, C) {
  let newState = [...state];

  switch (operation) {
    case "addr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] + state[B];
      break;
    case "addi":
      if (!isRegistry(A)) return;
      newState[C] = state[A] + B;
      break;
    case "mulr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] * state[B];
      break;
    case "muli":
      if (!isRegistry(A)) return;
      newState[C] = state[A] * B;
      break;
    case "banr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] & state[B];
      break;
    case "bani":
      if (!isRegistry(A)) return;
      newState[C] = state[A] & B;
      break;
    case "borr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] | state[B];
      break;
    case "bori":
      if (!isRegistry(A)) return;
      newState[C] = state[A] | B;
      break;
    case "setr":
      if (!isRegistry(A)) return;
      newState[C] = state[A];
      break;
    case "seti":
      newState[C] = A;
      break;
    case "gtir":
      if (!isRegistry(B)) return;
      newState[C] = A > state[B] ? 1 : 0;
      break;
    case "gtri":
      if (!isRegistry(A)) return;
      newState[C] = state[A] > B ? 1 : 0;
      break;
    case "gtrr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] > state[B] ? 1 : 0;
      break;
    case "eqir":
      if (!isRegistry(B)) return;
      newState[C] = A === state[B] ? 1 : 0;
      break;
    case "eqri":
      if (!isRegistry(A)) return;
      newState[C] = state[A] === B ? 1 : 0;
      break;
    case "eqrr":
      if (!isRegistry(A) || !isRegistry(B)) return;
      newState[C] = state[A] === state[B] ? 1 : 0;
      break;
    default:
      throw new Error("Unknown operation:" + operation);
  }
  return newState;
}

function isRegistry(n) {
  return n >= 0 && n <= 3;
}

function opcodesDeduction(opcodes) {
  while (Object.values(opcodes).find(l => l.length > 1)) {
    Object.keys(opcodes)
      .filter(opcode => opcodes[opcode].length === 1)
      .forEach(opcode => {
        let op = opcodes[opcode][0];
        Object.keys(opcodes)
          .filter(opcode2 => opcode2 !== opcode)
          .forEach(opcode2 => {
            opcodes[opcode2] = opcodes[opcode2].filter(op2 => op2 !== op);
          });
      });
  }

  Object.keys(opcodes).forEach(opcode => {
    opcodes[opcode] = opcodes[opcode][0];
  });

  return opcodes;
}

question1And2();
