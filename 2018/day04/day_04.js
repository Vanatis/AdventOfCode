const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_04_input.txt');
  const lineReader = rl.createInterface(readStream);

  let lines = [];
  lineReader.on('line', (line) => {
    lines.push(line.toString());
  });

  lineReader.on('close', () => {
    console.time('timer1');
    lines = lines.sort();

    let guards = [];
    let currentGuardId = 0;
    let currentGuardStartSleepMinute = 0;
    let currentGuardStartAwakeMinute = 0;
    lines.map((line) => {
      //Read GuardId
      if (line.includes("Guard")) {
        const id = line.match(/#\d+/g)
          .map((number) => {return parseInt(number.replace('#', ''))});
        currentGuardId = id[0];
      }
      //Read SleepStartTime
      else if (line.includes("falls asleep")) {
        const sleepTime = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)
          .map((date) => {return new Date(Date.parse(date));});
        currentGuardStartSleepMinute = sleepTime[0].getMinutes();
      }
      //Read awakeStartTime - Create GuardInfo Object
      else if (line.includes("wakes up")) {
        const awakeTime = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)
          .map((date) => {return new Date(Date.parse(date));});
        currentGuardStartAwakeMinute = awakeTime[0].getMinutes();

        let currentMinuteArrayIsAsleep = new Array(60).fill(0);
        for (let i = currentGuardStartSleepMinute; i < currentGuardStartAwakeMinute; ++i) {
          ++currentMinuteArrayIsAsleep[i];
        }

        //Create array which counts number of times asleep per minute
        let filteredGuards = guards.filter(guard => guard.id === currentGuardId);
        if (filteredGuards.length > 0) {
          filteredGuards[0].totalSleepMinutes += currentGuardStartAwakeMinute - currentGuardStartSleepMinute;
          filteredGuards[0].minuteArrayIsAsleep = filteredGuards[0].minuteArrayIsAsleep.map((num, index) => {return num + currentMinuteArrayIsAsleep[index];});
        } else {
          guards.push({id: currentGuardId, totalSleepMinutes: currentGuardStartAwakeMinute - currentGuardStartSleepMinute, minuteArrayIsAsleep: currentMinuteArrayIsAsleep});
        }
      }
      return line;
    });

    guards.sort((a, b) => {
      return b.totalSleepMinutes - a.totalSleepMinutes;
    });

    const mostSleepyGuard = guards[0];
    const mostSleptMinute = mostSleepyGuard.minuteArrayIsAsleep.indexOf(Math.max(...mostSleepyGuard.minuteArrayIsAsleep));

    console.log('Question 1:', mostSleepyGuard.id * mostSleptMinute);
    console.timeEnd('timer1');
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_04_input.txt');
  const lineReader = rl.createInterface(readStream);

  let lines = [];
  lineReader.on('line', (line) => {
    lines.push(line.toString());
  });

  lineReader.on('close', () => {
    console.time('timer2');
    lines = lines.sort();

    let guards = [];
    let currentGuardId = 0;
    let currentGuardStartSleepMinute = 0;
    let currentGuardStartAwakeMinute = 0;
    lines.map((line) => {
      //Read GuardId
      if (line.includes("Guard")) {
        const id = line.match(/#\d+/g)
          .map((number) => {return parseInt(number.replace('#', ''))});
        currentGuardId = id[0];
      }
      //Read SleepStartTime
      else if (line.includes("falls asleep")) {
        const sleepTime = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)
          .map((date) => {return new Date(Date.parse(date));});
        currentGuardStartSleepMinute = sleepTime[0].getMinutes();
      }
      //Read awakeStartTime - Create GuardInfo Object
      else if (line.includes("wakes up")) {
        const awakeTime = line.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)
          .map((date) => {return new Date(Date.parse(date));});
        currentGuardStartAwakeMinute = awakeTime[0].getMinutes();

        //Create array which counts number of times asleep per minute
        let currentMinuteArrayIsAsleep = new Array(60).fill(0);
        for (let i = currentGuardStartSleepMinute; i < currentGuardStartAwakeMinute; ++i) {
          ++currentMinuteArrayIsAsleep[i];
        }

        let filteredGuards = guards.filter(guard => guard.id === currentGuardId);
        if (filteredGuards.length > 0) {
          filteredGuards[0].minuteArrayIsAsleep = filteredGuards[0].minuteArrayIsAsleep.map((num, index) => {return num + currentMinuteArrayIsAsleep[index];});
        } else {
          guards.push({id: currentGuardId, minuteArrayIsAsleep: currentMinuteArrayIsAsleep});
        }
      }
      return line;
    });

    guards.sort((a, b) => {
      const aMostSleptMinute = Math.max(...a.minuteArrayIsAsleep);
      const bMostSleptMinute = Math.max(...b.minuteArrayIsAsleep);
      return bMostSleptMinute - aMostSleptMinute;
    });

    const mostSleepyGuard = guards[0];
    const mostSleptMinute = mostSleepyGuard.minuteArrayIsAsleep.indexOf(Math.max(...mostSleepyGuard.minuteArrayIsAsleep));

    console.log('Question 2:', mostSleepyGuard.id * mostSleptMinute);
    console.timeEnd('timer2');
  });
}

question1();
question2();
