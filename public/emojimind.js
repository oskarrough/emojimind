const em = {};

em.createCode = (symbols, length) => {
	let newCode = [];
	for (let i = 0; i < length; i++) {
		const random = em.numberBetween(0, symbols.length);
		newCode.push(symbols[random]);
	}
	return newCode;
};

// Returns a random integer between min (included) and max (excluded)
em.numberBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// Copies an array
em.copyArray = array => array.map(arr => arr.slice());

// Checks whether an object is empty or not
em.isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

// Takes two arrays and returns an object with counts of black and white pins.
// Example: getHints(['1', '2', '3', '4'], ['2', '1', '1', '4']) => {blacks: 1, whites: 1}
// A black is given for each symbol matching both symbol and position in the code.
// A white is given if it is the right symbol but in wrong position.

em.getHints = (answer, guess, debug) => {
	var hints = {blacks: 0, whites: 0};
	var skiplist = [];
	var skiplist2 = [];

	for (let slot in answer) {
		if (answer[slot] === guess[slot]) {
			hints.blacks++;
			skiplist.push(slot);
		}
	}

	if (debug) console.log(`skipping slots: [${skiplist}]`);

	for (let g in guess) {
		if (debug) console.log(`is ${guess[g]} from ${guess} a white in ${answer}?`);
		if (skiplist.includes(g)) {
			if (debug) console.log(`skiplist ${guess[g]} ${answer[g]}`);
			continue;
		}
		for (let a in answer) {
			if (skiplist.includes(a) || skiplist2.includes(a)) {
				if (debug) console.log('- skiplist');
				continue;
			}
			if (guess[g] === answer[a]) {
				if (debug) console.log(`- found a white`);
				skiplist2.push(a);
				hints.whites++;
				break;
			} else {
				if (debug) console.log(`- skip: no match`);
			}
		}
	}
	return hints;
};

module.exports = em;
