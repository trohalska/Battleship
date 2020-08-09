'use strict'; 

let view = {
	displayMessage: function(message) {
		let msg = document.querySelector(`#messageArea`);
		msg.innerHTML = message;
	},
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	}
};

//------------------------- model of game behavior

let model = {
	boardSize: 10,
	numShips: 3,
	shipLength: 3,
	shipSunk: 0,

	ships: [
		{ location: ['10', '20', '30'], hits: ['', '', ''] },
		{ location: ['32', '33', '34'], hits: ['', '', ''] },
		{ location: ['95', '96', '97'], hits: ['', '', ''] }
	],

	fire: function(guess) {
		for (let i = 0; i < this.numShips; ++i) {
			let ship = this.ships[i]
			let index = ship.location.indexOf(guess);

			if (index >= 0) { // here's a hit
				ship.hits[index] = 'hit';
				view.displayHit(guess);
				view.displayMessage('HIT !!!');
				if (this.isSunk(ship)) {
					this.shipSunk++;
					view.displayMessage("You sunk my buttleship!");
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage('You missed!');
		return false;
	},

	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; ++i) {
			if (ship.hits[i] !== 'hit') {
				return false;
			}
		}
		return true;
	}
};

// view.displayMessage('msg 1');
// view.displayHit("35");
// view.displayMiss("37");


model.fire('23');
model.fire('20');
model.fire('63');
model.fire('99');
model.fire('34');


// console.log(model);
