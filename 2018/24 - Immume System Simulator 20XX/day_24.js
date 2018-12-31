const fs = require('fs');
const rl = require('readline');

function question1And2() {
  const readStream = fs.createReadStream('./day_24_input.txt');
  const lineReader = rl.createInterface(readStream);

  const unitRegex = /^(\d+) units each with (\d+) hit points (\(.+\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)$/;
  const weaknessRegex = /weak to ([\w, ]+)/;
  const immunityRegex = /immune to ([\w, ]+)/;

  let immunitySquads = [];
  let infectionSquads = [];

  let bIsInfectionArmy = false;
  lineReader.on('line', (line) => {
    if (line ===  'Immune System:') {
      bIsInfectionArmy = false;
    }
    if (line === 'Infection:') {
      bIsInfectionArmy = true;
    }

    let match = unitRegex.exec(line);
    if (match) {
      let [units, hp, resistances, attack, type, initiative] = match.slice(1);
      let weaknesses = weaknessRegex.exec(resistances);
      if (weaknesses) {
        weaknesses = weaknesses[1].split(', ');
      } else {
        weaknesses = '';
      }

      let immunities = immunityRegex.exec(resistances);
      if (immunities) {
        immunities = immunities[1].split(', ');
      } else {
        immunities = '';
      }

      if (bIsInfectionArmy) {
        infectionSquads.push(new Squad(units, hp, attack, type, initiative, weaknesses, immunities));
      } else {
        immunitySquads.push(new Squad(units, hp, attack, type, initiative, weaknesses, immunities));
      }
    }
  });

  lineReader.on('close', () => {
    let originalImmunitySquads = JSON.parse(JSON.stringify(immunitySquads));
    let originalInfectionSquads = JSON.parse(JSON.stringify(infectionSquads));

    const battleResult = simulateBattle(originalImmunitySquads, originalInfectionSquads);
    console.log("Question1: \n\tWinner:", battleResult[0], "\n\tUnits remaining:", battleResult[1]);

    const battleResultWithBoost = simulateBattleWithBoost(immunitySquads, infectionSquads);
    console.log("Question2: \n\tBoost:", battleResultWithBoost[0], "\n\tUnits remaining:", battleResultWithBoost[1]);
  });
}

class Squad {
  constructor(units, hp, attack, type, initiative, weaknesses, immunities) {
    this.units = parseInt(units);
    this.hp = parseInt(hp);
    this.attack = parseInt(attack);
    this.type = type;
    this.initiative = parseInt(initiative);
    this.weaknesses = weaknesses;
    this.immunities = immunities;

    this.claimed = false;
    this.target = null;
    this.enemies = [];
  }
}

function simulateBattle(immunitySquads, infectionSquads, boost = 0) {
  if (boost > 0) {
    immunitySquads.map((squad) => {
      squad.attack += boost;
    });
  }

  let aliveImmunitySquads = immunitySquads.filter(isAlive);
  let aliveInfectionSquads = infectionSquads.filter(isAlive);
  while (aliveImmunitySquads.length > 0 && aliveInfectionSquads.length > 0) {
    //Reset turn info on both armies
    aliveImmunitySquads.map((squad) => {
      resetTurn(squad, aliveInfectionSquads);
    });

    aliveInfectionSquads.map((squad) => {
      resetTurn(squad, aliveImmunitySquads);
    })

    //Targetting phase
    const squadsTargetOrder = [...aliveImmunitySquads, ...aliveInfectionSquads]
      .sort((a, b) => {
        let aAttack = a.attack * a.units;
        let bAttack = b.attack * b.units;

        if (aAttack === bAttack) {
          return b.initiative - a.initiative;
        }
        return bAttack - aAttack;
      });

    squadsTargetOrder.map((squad) => {
      setTarget(squad);
    });

    //Attacking phase
    const squadsAttackOrder = squadsTargetOrder.sort((a, b) => {
      return b.initiative - a.initiative;
    });
    const killed = squadsAttackOrder.reduce(attackEnemy, 0);

    if (killed === 0) {
      return [0, 0];
    }

    aliveImmunitySquads = aliveImmunitySquads.filter(isAlive);
    aliveInfectionSquads = aliveInfectionSquads.filter(isAlive);
  }

  if (aliveImmunitySquads.length > 0) {
    const survivingSquadUnits = aliveImmunitySquads.reduce((sum, squad) => {
      return squad.units + sum;
    }, 0);
    return ["immune system", survivingSquadUnits];
  } else {
    const survivingSquadUnits = aliveInfectionSquads.reduce((sum, squad) => {
      return squad.units + sum;
    }, 0);
    return ["infection", survivingSquadUnits];
  }
}

function simulateBattleWithBoost(immunitySquads, infectionSquads) {
  let boost = 1;
  while (true) {
    let originalImmunitySquads = JSON.parse(JSON.stringify(immunitySquads));
    let originalInfectionSquads = JSON.parse(JSON.stringify(infectionSquads));
    const [winner, units] = simulateBattle(originalImmunitySquads, originalInfectionSquads, boost);
    if (winner === 'immune system') {
      return [boost, units];
    }
    ++boost;
  }
}

function attackEnemy(unitsKilled, attacker) {
  const target = attacker.target;
  if (attacker.units <= 0 || !target) {
    return unitsKilled;
  }

  const killed = Math.min(Math.floor(calculateAttackPower(attacker, target) / target.hp), target.units);
  target.units  = target.units - killed;
  return unitsKilled + killed;
}

function setTarget(attacker) {
  let targets = attacker.enemies.filter(enemy => !enemy.immunities.includes(attacker.type) && !enemy.claimed);
  targets = targets.sort((a, b) => {
    let aAttackPower = calculateAttackPower(attacker, a);
    let bAttackPower = calculateAttackPower(attacker, b);

    if (aAttackPower === bAttackPower) {
      let aAttack = a.attack * a.units;
      let bAttack = b.attack * b.units;

      if (aAttack === bAttack) {
        return b.initiative - a.initiative;
      }
      return bAttack - aAttack;
    }
    return bAttackPower - aAttackPower;
  });

  let target = targets[0];
  if (target) {
    target.claimed = true;
  }

  attacker.target = target;
  return attacker;
}

function calculateAttackPower(attacker, target) {
  const dmgMultiplier = target.weaknesses.includes(attacker.type) ? 2 : 1;
  return (attacker.attack * attacker.units * dmgMultiplier);
}

function isAlive(squad) {
  return squad.units > 0;
}

function resetTurn(squad, enemies) {
  squad.claimed = false;
  squad.target = null;
  squad.enemies = enemies;
}

question1And2();
