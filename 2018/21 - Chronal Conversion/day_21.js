const fs = require('fs');
const rl = require('readline');

const operations = {
  addr: (state, op1, op2, op3) => (state[op3] = state[op1] + state[op2]),
  addi: (state, op1, op2, op3) => (state[op3] = state[op1] + op2),
  mulr: (state, op1, op2, op3) => (state[op3] = state[op1] * state[op2]),
  muli: (state, op1, op2, op3) => (state[op3] = state[op1] * op2),
  banr: (state, op1, op2, op3) => (state[op3] = state[op1] & state[op2]),
  bani: (state, op1, op2, op3) => (state[op3] = state[op1] & op2),
  borr: (state, op1, op2, op3) => (state[op3] = state[op1] | state[op2]),
  bori: (state, op1, op2, op3) => (state[op3] = state[op1] | op2),
  setr: (state, op1, op2, op3) => (state[op3] = state[op1]),
  seti: (state, op1, op2, op3) => (state[op3] = op1),
  gtir: (state, op1, op2, op3) => (state[op3] = op1 > state[op2] ? 1 : 0),
  gtri: (state, op1, op2, op3) => (state[op3] = state[op1] > op2 ? 1 : 0),
  gtrr: (state, op1, op2, op3) => (state[op3] = state[op1] > state[op2] ? 1 : 0),
  eqir: (state, op1, op2, op3) => (state[op3] = op1 === state[op2] ? 1 : 0),
  eqri: (state, op1, op2, op3) => (state[op3] = state[op1] === op2 ? 1 : 0),
  eqrr: (state, op1, op2, op3) => (state[op3] = state[op1] === state[op2] ? 1 : 0)
};
function question1And2() {
  const readStream = fs.createReadStream('./day_21_input.txt');
  const lineReader = rl.createInterface(readStream);

  let regexIp = /#ip (\d+)/;
  let regexInstr = /([a-z]+) (\d+) (\d+) (\d+)/;

  let ipRegistry;
  const program = [];

  lineReader.on("line", line => {
    let match = regexInstr.exec(line);
    if (match) {
      let [opname, op1, op2, op3] = match.slice(1).map((t, idx) => (idx > 0 ? Number(t) : t));
      program.push({ opname, op1, op2, op3 });
      return;
    }

    match = regexIp.exec(line);
    if (match) {
      ipRegistry = Number(match[1]);
      return
    }
  });

  lineReader.on("close", () => {
    console.log("Note: Running this application may take between 30 seconds and 2 minutes. Please be patient until you get your answer");
    let answers = executeOperations(program, ipRegistry);
    console.log("Question 1:", answers.answer1);
    console.log("Question 2:", answers.answer2);
  });
}

function executeOperations(program, ipRegistry, initialState = [0, 0, 0, 0, 0, 0], initialIp = 0) {
  let targetRegisterHistory = [];

  let state = [...initialState];
  let ip = initialIp;
  let count = 0;

  // The only instruction that uses R0 is #28 (line 30) for me (eqrr 5 0 1)
  const registryZeroInstruction = 28;

  runLoop: while (ip < program.length) {
    state[ipRegistry] = ip;
    let instr = program[ip];

    // if R0 and R5 are equals, executes a "goto" that goes out of the program stack
    if (ip === registryZeroInstruction) {
      let targetRegisterValue = state[instr.op1];
      if (targetRegisterHistory.indexOf(targetRegisterValue) > -1) {
        break runLoop;
      }

      targetRegisterHistory.push(targetRegisterValue);
    }

    operations[instr.opname](state, instr.op1, instr.op2, instr.op3);

    ip = state[ipRegistry];
    ip++;
    count++;
  }

  // the first value at the target register is the answer for Part 1
  // the last non-repeated value at the target register is the answer for Part 2
  let answer1 = targetRegisterHistory[0];
  let answer2 = targetRegisterHistory[targetRegisterHistory.length - 1];

  return {answer1: answer1, answer2: answer2};
}

question1And2();
