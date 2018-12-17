const fs = require('fs');
const rl = require('readline');

function question1() {
  const readStream = fs.createReadStream('./day_15_input.txt');
  const lineReader = rl.createInterface(readStream);

  let area = [];
  lineReader.on('line', (line) => {
    area.push(line.split(""));
  });

  lineReader.on('close', () => {
    console.log("Question1:", simulateBattle(area));
  });
}

function question2() {
  const readStream = fs.createReadStream('./day_15_input.txt');
  const lineReader = rl.createInterface(readStream);

  let area = [];
  lineReader.on('line', (line) => {
    area.push(line.split(""));
  });

  lineReader.on('close', () => {
    let outcome = null;
    let elfAttack = 4;
    while (outcome === null) {
      //Area gets manipulated during the simulateBattle to reflect the state.
      //By using JSON we preserve the original to reuse in later iterations.
      let originalArea = JSON.parse(JSON.stringify(area));
      outcome = simulateBattle(originalArea, elfAttack, 3, true);

      ++elfAttack;
    }
    console.log("Question2:", outcome);
  });
}

function simulateBattle(area, elfAttack = 3, goblinAttack = 3, bNoElfDeathsMode = false) {
  let players = initPlayers(area, elfAttack, goblinAttack);
  let numRounds = 0;
  let bIsFightingOver = false;
  let bElfDied = false;

  while (!bIsFightingOver) {
    players = players.sort((a, b) => a.position.y - b.position.y || a.position.x - b.position.x);

    players.map((player, index) => {
      if (player.alive) {
        //No enemies remaining
        if (players.filter(p => p.alive && p.type !== player.type).length === 0) {
          bIsFightingOver = true;
        } else {
          let enemyInRange = findEnemyToAttackInRange(player, players);
          let nextLocation = enemyInRange ? null : findNextLocation(player, players, area);

          //Move player if usefull and recheck enemies in range
          if (!enemyInRange && nextLocation) {
            area[player.position.y][player.position.x] = ".";
            player.position.x = nextLocation.x;
            player.position.y = nextLocation.y;
            area[player.position.y][player.position.x] = player.type;

            enemyInRange = findEnemyToAttackInRange(player, players);
          }

          if (enemyInRange) {
            enemyInRange.hp -= player.attack;
            if (enemyInRange.hp <= 0) {
              enemyInRange.alive = false;
              area[enemyInRange.position.y][enemyInRange.position.x] = ".";
              if (enemyInRange.type === "E" && bNoElfDeathsMode) {
                bIsFightingOver = true;
                bElfDied = true;
              }
            }
          }
        }
      }
    });
    ++numRounds;
  }

  if (bElfDied && bNoElfDeathsMode) {
    return null;
  }

  let collectiveHp = players.filter(player => player.alive)
    .map((player) => {
      return player.hp;
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  return (numRounds - 1)* collectiveHp;
}

function initPlayers(area, elfAttack, goblinAttack) {
  let players = [];
  area.map((row, rowIndex) => {
    row.map((tile, columnIndex) => {
      if (tile === "E" || tile === "G") {
        players.push({
          type: tile,
          hp: 200,
          attack: tile === "E" ? elfAttack : goblinAttack,
          alive: true,
          position: {x: columnIndex, y: rowIndex}
        });
      }
    });
  });

  return players;
}

function findEnemyToAttackInRange(player, allPlayers) {
  let bestTarget = null;

  allPlayers.filter(p => p.alive && p.type !== player.type)
    .filter(p =>
      (Math.abs(p.position.x - player.position.x) === 1 && Math.abs(p.position.y - player.position.y) === 0) ||
        (Math.abs(p.position.x - player.position.x) === 0 && Math.abs(p.position.y - player.position.y) === 1)
    )
    .map((enemy) => {
      if (bestTarget === null) {
        bestTarget = enemy;
      } else {
        bestTarget = bestTarget.hp > enemy.hp ? enemy : bestTarget;
      }
    });

  return bestTarget;
}

function findNextLocation(player, allPlayers, area) {
  //Find all free locations next to all living enemies
  let possibleLocations = {};

  allPlayers.filter(p => p.type !== player.type && p.alive)
    .map((p) => getAdjecents(p.position).filter(pos => area[pos.y][pos.x] === "."))
    .reduce((acc, curr) => acc.concat(...curr), [])
    .map((pos) => {
      possibleLocations[`${pos.x},${pos.y}`] = pos;
    });

  //Calculate path to each free location and determine best one
  let visited = {};
  visited[`${player.position.x},${player.position.y}`] = true;

  let paths = [[player.position]];
  while (true) {
    let newPaths = [];
    let targetPaths = [];

    paths.map((path) => {
      let adjecents = getAdjecents(path[path.length - 1]);

      adjecents.map((adjecent) => {
        const xy = `${adjecent.x},${adjecent.y}`;

        if (possibleLocations[xy]) {
          targetPaths.push([...path, adjecent, possibleLocations[xy]]);
        } else if (!visited[xy] && area[adjecent.y][adjecent.x] === ".") {
          newPaths.push([...path, adjecent]);
        }

        visited[xy] = true;
      });
    });

    //if targetpaths exists, sort then return
    if (targetPaths.length > 0) {
      targetPaths = targetPaths.sort((a, b) => a[a.length - 1].y - b[b.length - 1].y || a[a.length - 1].x - b[b.length - 1].x);
      return targetPaths[0][1];
    } else {
      paths = newPaths;
      if (paths.length === 0) {
        return null;
      }
    }
  }
}

function getAdjecents(position) {
  return [
    {x: position.x, y: position.y - 1},
    {x: position.x - 1, y: position.y},
    {x: position.x + 1, y: position.y},
    {x: position.x, y: position.y + 1},
  ];
}

question1();
question2();
