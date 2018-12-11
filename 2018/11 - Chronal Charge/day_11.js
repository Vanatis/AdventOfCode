//My puzzle input = 5153;
const gridSerialNumber = 5153;

function question1() {
  let grid = []
  //Populate with power levels
  for (let x = 1; x <= 300; ++x) {
    grid[x] = [];

    for (let y = 1; y <= 300; ++y) {
      let rackId = x + 10;
      let powerLevel = y * rackId;
      powerLevel += gridSerialNumber;
      powerLevel *= rackId;
      powerLevel = Math.floor((powerLevel / 100) % 10);
      powerLevel -= 5;

      grid[x][y] = powerLevel;
    }
  }

  //Find most powerfull 3x3 grid.
  let maxPowerLevel = Number.MIN_SAFE_INTEGER;
  let clusterPosition = {};

  for (let x = 1; x <= 298; ++x) {
    for (let y = 1; y <= 298; ++y) {
      const clusterPowerLevel = sumPowerLevelCluster(grid, x, y, 3, 3);
      if (maxPowerLevel <= clusterPowerLevel) {
        maxPowerLevel = clusterPowerLevel;
        clusterPosition = {x: x, y: y};
      }
    }
  }

  console.log(clusterPosition);
  console.log(maxPowerLevel);
}

function question2() {
  let grid = []
  //Populate with power levels
  for (let x = 1; x <= 300; ++x) {
    grid[x] = [];

    for (let y = 1; y <= 300; ++y) {
      let rackId = x + 10;
      let powerLevel = y * rackId;
      powerLevel += gridSerialNumber;
      powerLevel *= rackId;
      powerLevel = Math.floor((powerLevel / 100) % 10);
      powerLevel -= 5;

      grid[x][y] = powerLevel;
    }
  }

  //Find most powerfull grid of any size
  let maxPowerLevel = Number.MIN_SAFE_INTEGER;
  let clusterPosition = {};

  for (let i = 1; i <= 300; ++i) {
    console.log("size:", i);
    for (let x = 1; x < 300 - i + 1; ++x) {
      for (let y = 1; y < 300 - i + 1; ++y) {
        const clusterPowerLevel = sumPowerLevelCluster(grid, x, y, i, i);
        if (maxPowerLevel <= clusterPowerLevel) {
          maxPowerLevel = clusterPowerLevel;
          clusterPosition = {x: x, y: y, size: i};

          console.log("clusterPos:", clusterPosition);
          console.log("maxPowerLevel:", maxPowerLevel);
          console.log("size:", i);
        }
      }
    }
  }

  console.log(clusterPosition);
  console.log(maxPowerLevel);
}

function sumPowerLevelCluster(grid, xPos, yPos, xSize, ySize) {
  let sumPowerLevels = 0;
  for (let x = xPos; x < xPos + xSize; ++x) {
    for (let y = yPos; y < yPos + ySize; ++y) {
      sumPowerLevels += grid[x][y];
    }
  }

  return sumPowerLevels;
}

question1();
question2();
