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
  const readStream = fs.createReadStream('./day_19_input.txt');
  const lineReader = rl.createInterface(readStream);

  let regexIp = /#ip (\d+)/;
  let regexInstruction = /([a-z]+) (\d+) (\d+) (\d+)/;

  let ipRegistry;
  const program = [];

  lineReader.on('line', (line) => {
    let match = regexInstruction.exec(line);
    if (match) {
      let [operation, op1, op2, op3] = match.slice(1).map((t, index) => (index > 0 ? parseInt(t) : t));
      program.push({operation, op1, op2, op3});
    } else if (match = regexIp.exec(line)) {
      ipRegistry = parseInt(match[1]);
    }
  });

  lineReader.on('close', () => {
    console.log("Question1:", executeOperations(program, ipRegistry));

    /*
    How to get the solution to part 2
      1. Run code for a few seconds - while printing out the results (see comment line in executeOperations)
      2. Find the value in register[5] when it's no longer changing. It is 10551331 in case of my input.
      3. Find the prime factorization values of that value. Helpful tool: https://www.wolframalpha.com/widgets/view.jsp?id=ccbaefcc48cd5f8ec9309165ea694eb2
      4. Your value should have 3 prime factors.. let's call them p1, p2 and p3.
      5. Calculate the result of the following formula:

        result = 1(=registry[0]) + p1 + p2 + p3 + (p1 * p2) + (p1 * p3) + (p2 * p3) + (p1 * p2 * p3)

        My case:
        result = 1 + 7 + 29 + 51977 + (7 * 29) + (7 * 51977) + (29 * 51977) + (7 * 29 * 51977) = 12474720
    */

    //Run this to log the register to find the value for part 2 -- ALso uncomment the console.Log in executeOperations.
    //console.log("Question2:", executeOperations(program, ipRegistry, iniitialState = [1, 0, 0, 0, 0, 0]));
  });
}

function executeOperations(program, ipRegistry, initialState = [0, 0, 0, 0, 0, 0], initialIp = 0) {
  let state = [...initialState];
  let ip = initialIp;
  let count = 0;

  while (ip < program.length) {
    state[ipRegistry] = ip;
    let instruction = program[ip];
    operations[instruction.operation](state, instruction.op1, instruction.op2, instruction.op3);
    ip = state[ipRegistry];
    ++ip;
    ++count;

    //console.log("ip=" + ip, instruction.operation, instruction.op1, instruction.op2, instruction.op3, state, count);
  }

  return state;
}

question1And2();
