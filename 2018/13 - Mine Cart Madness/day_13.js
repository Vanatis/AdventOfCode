const fs = require('fs');

function question1() {
  fs.readFile('./day_13_input.txt', (err, data) => {
    const datastring = data.toString();
    console.log("Question1:", findFirstCollision(datastring));
  });
}

function question2() {
  fs.readFile('./day_13_input.txt', (err, data) => {
    const datastring = data.toString();
    console.log("Question2:", findLastRemainingCartPosition(datastring));
  });
}

class MineCart {
  constructor (x, y, direction) {
    this.x = x;
    this.y = y;
    this.dx = direction === '<' ? -1 : direction === '>' ? 1 : 0;
    this.dy = direction === '^' ? -1 : direction === 'v' ? 1 : 0;
    this._behavior = 0;
    this._behaviors = [
      'left',
      'straight',
      'right',
    ];
  }

  move (nextSection) {
    this.x += this.dx;
    this.y += this.dy;

    if (/[/\\]/.test(nextSection)) {
      /* eslint-disable indent */
      const direction =
        nextSection === '\\' && this.dx !== 0 ? 'right' :
        nextSection === '/' && this.dx !== 0 ? 'left' :
        nextSection === '\\' && this.dy !== 0 ? 'left' :
        nextSection === '/' && this.dy !== 0 ? 'right' :
        null;
      /* eslint-enable indent */

      this.turn(direction);
    } else if (nextSection === '+') {
      const direction = this._behaviors[this._behavior];

      this._behavior = this._behavior + 1 === this._behaviors.length
        ? 0
        : this._behavior + 1;

      if (direction !== 'straight') {
        this.turn(direction);
      }
    }
  }

  turn (direction) {
    if (this.dx !== 0) {
      this.dy = this.dx * (direction === 'right' ? 1 : -1);
      this.dx = 0;
    } else if (this.dy !== 0) {
      this.dx = this.dy * (direction === 'right' ? -1 : 1);
      this.dy = 0;
    }
  }
}

function findFirstCollision(input) {
  const width = Math.max(...input.split('\n').map((line) => line.length));
  const tracks = input
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => line.padEnd(width, ' ').split(''));

  const carts = [];

  for (let y = 0; y < tracks.length; y++) {
    for (let x = 0; x < tracks[y].length; x++) {
      if (/[\^v<>]/.test(tracks[y][x])) {
        const marker = tracks[y][x];
        const cart = new MineCart(x, y, marker);

        tracks[y][x] = /[<>]/.test(marker) ? '-' : '|';
        carts.push(cart);
      }
    }
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const positions = [];

    //Sort carts
    carts.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      const nextSection = tracks[cart.y + cart.dy][cart.x + cart.dx];

      cart.move(nextSection);

      const cartPosition = `${cart.x},${cart.y}`;

      if (positions.includes(cartPosition)) {
        return cartPosition;
      }

      positions.push(cartPosition);
    }
  }
};

function findLastRemainingCartPosition(input) {
  const width = Math.max(...input.split('\n').map((line) => line.length));
  const tracks = input
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => line.padEnd(width, ' ').split(''));

  const carts = [];

  for (let y = 0; y < tracks.length; y++) {
    for (let x = 0; x < tracks[y].length; x++) {
      if (/[\^v<>]/.test(tracks[y][x])) {
        const marker = tracks[y][x];
        const cart = new MineCart(x, y, marker);

        tracks[y][x] = /[<>]/.test(marker) ? '-' : '|';
        carts.push(cart);
      }
    }
  }

  while (carts.length > 1) {
    const cartPositions = [];

    //Sort carts
    carts.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];
      const nextSection = tracks[cart.y + cart.dy][cart.x + cart.dx];

      cart.move(nextSection);

      const cartPosition = `${cart.x},${cart.y}`;

      if (cartPositions.includes(cartPosition)) {
        const x = cartPosition.split(",")[0];
        const y = cartPosition.split(",")[1];

        const crashedCarts = carts.filter(cart => cart.x === parseInt(x) && cart.y === parseInt(y));
        crashedCarts.map((crashedCart) => {
          const crashedCartIndex = carts.indexOf(crashedCart);
          carts.splice(crashedCartIndex, 1);
        });
      }

      cartPositions.push(cartPosition);
    }
  }

  //Move the cart once after the crash
  carts.map((cart) => {
    const nextSection = tracks[cart.y + cart.dy][cart.x + cart.dx];
    cart.move(nextSection);
  });
  return carts;
};

question1();
question2();
