'use strict'; 

let view = {
	displayHelloMessage: function() {
		let msg = document.querySelector('#messageArea');
		msg.innerHTML = 'You have to destroy ' + model.numShips + ' * '
										+ model.shipLength + '-deck battleships.';
	},
	displayMessage: function(message) {
		let msg = document.querySelector('#messageArea');
		msg.innerHTML = message;
		document.querySelector('.panel').style.background = '#a0d2eb';
	},
	displayHitMessage: function(message) {
		let msg = document.querySelector('#messageArea');
		msg.innerHTML = message;
		document.querySelector('.panel').style.background = '#ff6666';
	},
	displayWinMessage: function(message) {
		let msg = document.querySelector('#messageArea');
		msg.innerHTML = message;
		document.querySelector('.panel').style.background = '#59b300';
	},
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	},
	displayWinColor: function() {
		document.querySelectorAll('td').forEach(cell => {
			if (!cell.getAttribute('class')) {
				cell.setAttribute('class', 'miss');
			}
		});
	}
};

//------------------------- model of game behavior

let model = {
	boardSize: 10,
	numShips: 5,
	shipLength: 3,
	shipSunk: 0,
	ships: [],

	fire: function(guess) {
		for (let i = 0; i < this.numShips; ++i) {
			let ship = this.ships[i]
			let index = ship.location.indexOf(guess);

			if (index >= 0) {
				ship.hits[index] = 'hit';
				view.displayHit(guess);
				view.displayHitMessage('It\'s a HIT !!!');
				if (this.isSunk(ship)) {
					this.shipSunk++;
					view.displayWinMessage('You sunk buttleship!');
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
	},
	//------------------------- autocreation ships
	generateShipsLocation: function() {
		let location;

		for (let i = 0; i < this.numShips; ++i) {
			this.ships[i] = { location: ['0', '0', '0'], hits: ['', '', ''] };
		}

		for (let i = 0; i < this.numShips; ++i) {
			do {
				location = this.generateShip();
			} while (this.collision(location));
			this.ships[i].location = location;
			// console.log(location);
		}
	},
	generateShip: function() {
		let direction = Math.floor(Math.random() * 2),
				col, row, newShipLocations = [];

		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		for (let i = 0; i < this.shipLength; ++i) {
			if (direction === 1) {
				newShipLocations.push(row + '' + (col + i));
			} else {
				newShipLocations.push((row + i) + '' + col);
			}
		}
		return newShipLocations;
	},
	collision: function(location) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < location.length; j++) {
				if (ship.location.indexOf(location[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};
//------------------------- controller of entered data
let controller = {
	guesses: 0,
	processGuess: function(guess) {
		let location = parseGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipSunk === model.numShips) {
				view.displayWinMessage('WIN!!! You sank ' + model.numShips 
					+ ' buttleships using ' + this.guesses + ' shots.');
				view.displayWinColor();
			}
		}
	}
}

let parseGuess = (guess) => {
	let col, row,
			alp = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

	if (guess !== null 
			&& (/^[a-j][0-9]$/i.exec(guess) || /^[a-j]10$/i.exec(guess))) {
		col = alp.indexOf(guess.charAt(0).toUpperCase());
		row = String(guess.charAt(1) - 1);
		if (guess.length === 3)
			row = '9';
		return row + col;
	} else {
		alert('You entered wrong coordinates. Try again!');
		return null;
	}
}
//------------------------- get entered data
let init = () => {
	document.querySelector('#button').onclick = handleFireButton;
	document.getElementById('input').onkeypress = handleKeyPress;
	document.querySelector('#reset').onclick = handleResetButton;

	view.displayHelloMessage();
	model.generateShipsLocation();
}

let handleFireButton = () => {
	let input = document.querySelector('#input');
	controller.processGuess(input.value);
	input.value = "";
}

let handleKeyPress = (e) => {
	let button = document.getElementById('button');
	if (e.keyCode === 13) {
		button.click();
		return false;
	}
}
//------------------------- reset
let handleResetButton = () => {
	for (let i = 0; i < model.numShips; ++i) {
		for (let j = 0; j < model.shipLength; ++j){
			model.ships[i].hits[j] = '';
			model.ships[i].location[j] = '0';
		}
	}

	view.displayHelloMessage();
	model.generateShipsLocation();
	
	document.querySelectorAll('td').forEach(cell => {
		if (cell.getAttribute('class')) {
			cell.removeAttribute('class');
		}
	});
}

window.onload = init;
