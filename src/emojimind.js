import debug from './debug'

const em = {}

/**
 Creates a random code
 @param {String/Array} symbols - The symbols used to create the code
 @param {Integer} maxLength - The length of the code
 @return {Array} representing the code
 */
em.createCode = (symbols, maxLength) => {
	let newCode = []
	for (let i = 0; i < maxLength; i++) {
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
em.getHints = (code, guess) => {
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

	// Check for white hints
	for (let g in guess) {
		// eslint guard for-in rule
		if (!{}.hasOwnProperty.call(guess, g)) {
			continue
		}
		debug(`is ${guess[g]} from ${guess} a white in ${code}?`)
		if (skiplist.includes(g)) {
			debug(`skiplist ${guess[g]} ${code[g]}`)
			continue
		}
		for (let a in code) {
			if (skiplist.includes(a) || skiplist2.includes(a)) {
				debug('- skiplist')
				continue
			}
			if (guess[g] === code[a]) {
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

