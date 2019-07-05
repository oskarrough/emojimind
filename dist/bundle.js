(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.emojimind = factory());
}(this, (function () { 'use strict';

/* global window */

var method = void 0;
var isDebug = true;

if (typeof window === 'undefined') {
	isDebug = false;
}

// Allow us to toggle debug statements
if (isDebug) {
	method = console.log.bind(window.console);
} else {
	method = function method() {};
}

var debug = method;

var em = {};

// Returns a random integer between min (included) and max (excluded)
em.numberBetween = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};

// Copies an array
em.copyArray = function (array) {
	return array.map(function (arr) {
		return arr.slice();
	});
};

// Checks whether an object is empty or not
em.isEmptyObject = function (obj) {
	return Object.keys(obj).length === 0 && obj.constructor === Object;
};

/**
 Creates a random code
 @param {String/Array} symbols - The symbols used to create the code
 @param {Integer} maxLength - The length of the code
 @return {Array} representing the code
 */
em.createCode = function (symbols, maxLength) {
	var newCode = [];
	for (var i = 0; i < maxLength; i++) {
		var random = em.numberBetween(0, symbols.length);
		newCode.push(symbols[random]);
	}
	return newCode;
};

/*
	A black is given for each symbol matching both symbol and position in the code.
	A white is given if it is the right symbol but in wrong position.

	Example:

	getHints(['1', '2', '3', '4'], ['2', '1', '1', '4'])
		=> {blacks: 1, whites: 1}

	@param {Array} code
	@param {Array} guess
	@return {Object} with the amount of black and white hints
	*/
em.getHints = function (code, guess) {
	var hints = { blacks: 0, whites: 0 };
	var skiplist = [];
	var skiplist2 = [];

	// Check for black hints
	for (var codeIndex in code) {
		// eslint guard for-in rule
		if (!{}.hasOwnProperty.call(guess, codeIndex)) {
			continue;
		}
		if (code[codeIndex] === guess[codeIndex]) {
			debug('found black at ' + codeIndex);
			hints.blacks++;
			skiplist.push(codeIndex);
		}
	}

	debug('skipping slots: [' + skiplist + ']');

	// Check for white hints
	for (var g in guess) {
		// eslint guard for-in rule
		if (!{}.hasOwnProperty.call(guess, g)) {
			continue;
		}
		debug('is ' + guess[g] + ' from ' + guess + ' a white in ' + code + '?');
		if (skiplist.includes(g)) {
			debug('skiplist ' + guess[g] + ' ' + code[g]);
			continue;
		}
		for (var a in code) {
			if (skiplist.includes(a) || skiplist2.includes(a)) {
				debug('- skiplist');
				continue;
			}
			if (guess[g] === code[a]) {
				debug('- found a white');
				skiplist2.push(a);
				hints.whites++;
				break;
			}
			debug('- skip: no match');
		}
	}
	return hints;
};

/* global window, Vue */
/* eslint no-alert:0 */

// Returns a boolean if the object is emtpy
Vue.filter('isEmptyObject', function (value) {
	return em.isEmptyObject(value);
});

// Because our 'guess' array contains null values we need to filter them out before we can check the length.
Vue.filter('invalidGuess', function (array, max) {
	return array.filter(function (v) {
		return v;
	}).length !== max;
});

Vue.component('select-guess', {
	props: ['guess', 'symbols', 'disabled'],
	template: '<ul class="SelectGuess">\n\t\t<li v-for="char in guess" track-by="$index">\n\t\t\t<select required v-model="char" :disabled="disabled">\n\t\t\t\t<option v-for="sym in symbols" track-by="$index" :value="sym">\n\t\t\t\t\t{{sym}}\n\t\t\t\t</option>\n\t\t\t</select>\n\t\t</li>\n\t</ul>'
});

var index = new Vue({
	el: '#emojimind',
	data: {
		symbols: ['1', '2', '3', '4', '5', '6'],
		codeLength: 4,
		maxGuesses: 10,
		showCode: false,
		code: [],
		guesses: []
	},
	init: function init() {
		this.code = [6, 3, 2, 2];
		// let hints = emojimind.getHints([6,3,2,2],[6,2,3,2])
	},

	computed: {
		buttonLabel: function buttonLabel() {
			return this.code.length ? 'Start over with a new code' : 'I am ready. Let me try';
		},
		totalPossibilities: function totalPossibilities() {
			return this.symbols.length * 1 * 2 * 3 * 4 * 5 * 6;
		}
	},
	methods: {
		newGame: function newGame() {
			console.log('new game');
			var code = em.createCode(this.symbols, this.codeLength);
			Vue.set(this, 'code', code);
			var guesses = this.createGuesses();
			Vue.set(this, 'guesses', guesses);
		},
		createGuesses: function createGuesses() {
			var guesses = [];
			for (var i = 0; i < this.maxGuesses; i++) {
				var row = {
					guess: [],
					pins: {}
				};
				for (var k = 0; k < this.codeLength; k++) {
					// We fill the array with null values to give it a length
					row.guess.push(null);
				}
				guesses.push(row);
			}
			return guesses;
		},
		tryGuess: function tryGuess(index, event) {
			event.preventDefault();
			var guess = this.guesses[index].guess;
			var hasTheRightLength = guess.filter(function (g) {
				return g;
			}).length === this.codeLength;
			if (!hasTheRightLength) {
				alert('Your guess isn\'t complete. Does it have ' + this.codeLength + ' symbols?');
				return;
			}
			var pins = em.getHints(this.code, guess);
			Vue.set(this.guesses[index], 'pins', pins);
			var isLastGuess = index === this.guesses.length - 1;
			this.checkIfWeWon(pins.blacks === this.codeLength, isLastGuess);
		},
		checkIfWeWon: function checkIfWeWon(winCondition, isLastGuess) {
			if (winCondition) {
				console.log('Correct.');
				window.alert('Correct.');
				return;
			}
			console.log('Wrong.');
			if (isLastGuess) {
				window.alert('Mwa ha ha, you lose. I am the mastermind. Not you.');
			}
		}
	}
});

return index;

})));
//# sourceMappingURL=bundle.js.map
