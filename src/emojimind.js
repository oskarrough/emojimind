import debug from './debug'

const em = {}

em.createCode = (symbols, length) => {
	let newCode = []
	for (let i = 0; i < length; i++) {
		const random = em.numberBetween(0, symbols.length)
		newCode.push(symbols[random])
	}
	return newCode
}

// Returns a random integer between min (included) and max (excluded)
em.numberBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min

// Copies an array
em.copyArray = array => array.map(arr => arr.slice())

// Checks whether an object is empty or not
em.isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object

// Takes two arrays and returns an object with counts of black and white pins.
// Example: getHints(['1', '2', '3', '4'], ['2', '1', '1', '4']) => {blacks: 1, whites: 1}
// A black is given for each symbol matching both symbol and position in the code.
// A white is given if it is the right symbol but in wrong position.

em.getHints = (answer, guess) => {
	var hints = {blacks: 0, whites: 0}
	var skiplist = []
	var skiplist2 = []

	// Check for black hints
	for (let codeIndex in code) {
		// eslint guard for-in rule
		if (!{}.hasOwnProperty.call(guess, codeIndex)) {
			continue
		}
		if (code[codeIndex] === guess[codeIndex]) {
			debug(`found black at ${codeIndex}`)
			hints.blacks++
			skiplist.push(codeIndex)
		}
	}

	debug(`skipping slots: [${skiplist}]`)

	for (let g in guess) {
		// eslint guard for-in rule
		if (!{}.hasOwnProperty.call(guess, g)) {
			continue
		}
		debug(`is ${guess[g]} from ${guess} a white in ${answer}?`)
		if (skiplist.includes(g)) {
			debug(`skiplist ${guess[g]} ${answer[g]}`)
			continue
		}
		for (let a in answer) {
			if (skiplist.includes(a) || skiplist2.includes(a)) {
				debug('- skiplist')
				continue
			}
			if (guess[g] === answer[a]) {
				debug(`- found a white`)
				skiplist2.push(a)
				hints.whites++
				break
			}
			debug(`- skip: no match`)
		}
	}
	return hints
}

export default em

