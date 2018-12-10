const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_10_input.txt');
  const lineReader = rl.createInterface(readStream);

  const stars = [];

  console.time('timer1');
  lineReader.on('line', (line) => {
    const dataString = line.toString().trim("\n");
    if (dataString === "\n") { return; }

    const lineData = dataString.match(/position=<( *-?\d+), ( *-?\d+)> velocity=<( *-?\d+), ( *-?\d+)>/);

    const star = {
      position: {
        x: parseInt(lineData[1]),
        y: parseInt(lineData[2])
      },
      velocity: {
        x: parseInt(lineData[3]),
        y: parseInt(lineData[4])
      }
    };
    stars.push(star);
  });

  lineReader.on('close', () => {
    let bHasFoundConvergence = false;
    let time = 0;
    while(!bHasFoundConvergence) {
      let minX = Number.MAX_SAFE_INTEGER;
      let maxX = Number.MIN_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxY = Number.MIN_SAFE_INTEGER;

      const newPositions = stars.map((star) => {
        const newX = star["position"]["x"] + (star["velocity"]["x"] * time);
        const newY = star["position"]["y"] + (star["velocity"]["y"] * time);

        minX = newX < minX ? newX : minX;
        maxX = newX > maxX ? newX : maxX;
        minY = newY < minY ? newY : minY;
        maxY = newY > maxY ? newY : maxY;

        return {x: newX, y: newY};
      });

      if (maxX - minX <= 100 && maxY - minY <= 10)
      {
        let grid = new Array(maxX - minX + 1);
        for (var i = 0; i < grid.length; ++i) {
          grid[i] = new Array(maxY - minY + 1);
        }

        newPositions.map((position) => {
          grid[position["x"] - minX][position["y"] - minY] = '#';
        });

        let logString = "";
        for (let y = 0; y < maxY - minY + 1; ++y) {
          for (let x = 0; x < maxX - minX + 1; ++x) {
            logString += (grid[x][y] === undefined) ? "." : grid[x][y];
          }
          logString += "\n";
        }
        bHasFoundConvergence = true;
        console.timeEnd('timer1');
        console.log('Question 1:');
        console.log("-----------------------------------------------------------");
        console.log(logString);
        console.log("-----------------------------------------------------------");
      }
      ++time;
    }
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_10_input.txt');
  const lineReader = rl.createInterface(readStream);

  const stars = [];

  console.time('timer2');
  lineReader.on('line', (line) => {
    const dataString = line.toString().trim("\n");
    if (dataString === "\n") { return; }

    const lineData = dataString.match(/position=<( *-?\d+), ( *-?\d+)> velocity=<( *-?\d+), ( *-?\d+)>/);

    const star = {
      position: {
        x: parseInt(lineData[1]),
        y: parseInt(lineData[2])
      },
      velocity: {
        x: parseInt(lineData[3]),
        y: parseInt(lineData[4])
      }
    };
    stars.push(star);
  });

  lineReader.on('close', () => {
    let bHasFoundConvergence = false;
    let time = 0;
    while(!bHasFoundConvergence) {
      let minX = Number.MAX_SAFE_INTEGER;
      let maxX = Number.MIN_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxY = Number.MIN_SAFE_INTEGER;

      const newPositions = stars.map((star) => {
        const newX = star["position"]["x"] + (star["velocity"]["x"] * time);
        const newY = star["position"]["y"] + (star["velocity"]["y"] * time);

        minX = newX < minX ? newX : minX;
        maxX = newX > maxX ? newX : maxX;
        minY = newY < minY ? newY : minY;
        maxY = newY > maxY ? newY : maxY;

        return {x: newX, y: newY};
      });

      if (maxX - minX <= 100 && maxY - minY <= 10)
      {
        bHasFoundConvergence = true;
        console.timeEnd('timer2');
        console.log('Question 2:', time, "seconds");
      }
      ++time;
    }
  });
}

question1();
question2();
