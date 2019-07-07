/* global Vue */
/* eslint no-alert:0 */

import em from './emojimind.js'

// Returns a boolean if the object is emtpy
Vue.filter('isEmptyObject', value => em.isEmptyObject(value))

// Because our 'guess' array contains null values we need to filter them out before we can check the length.
Vue.filter('invalidGuess', (array, max) => {
	return array.filter(v => v).length !== max
})

Vue.component('select-guess', {
	props: ['guess', 'symbols', 'disabled'],
	template: `
	<ul class="SelectGuess">
		<li v-for="(char, index) in guess" :key="index">
			<select v-model="guess[index]" :disabled="disabled" required>
				<option v-for="(sym, indx) in symbols" :value="sym" :key="indx">
					{{sym}}
				</option>
			</select>
		</li>
	</ul>`
})

export default new Vue({
	el: '#emojimind',
	data: {
		symbols: ['1', '2', '3', '4', '5', '6'],
		codeLength: 4,
		maxGuesses: 10,
		showCode: false,
		code: [],
		guesses: []
	},
	computed: {
		buttonLabel() {
			return this.code.length > 0
				? 'Reset game'
				: 'I am ready. Let me try'
		},
		totalPossibilities() {
			return Number(this.symbols.length) * 1 * 2 * 3 * 4 * 5 * 6
		}
	},
	created() {
		this.newGame()
	},
	methods: {
		newGame() {
			console.log('new game')
			this.code = em.createCode(this.symbols, this.codeLength)
			this.guesses = this.createGuesses()
			this.showCode = false // reset this option, in case
		},
		createGuesses() {
			const guesses = []

			for (let i = 0; i < this.maxGuesses; i++) {
				const row = {
					guess: [],
					pins: {}
				}

				for (let k = 0; k < this.codeLength; k++) {
					// We fill the array with null values to give it a length
					row.guess.push(false)
				}

				guesses.push(row)
			}

			return guesses
		},
		tryGuess(index, event) {
			event.preventDefault()
			const {guess} = this.guesses[index]
			const hasTheRightLength = guess.filter(g => g).length === this.codeLength
			if (!hasTheRightLength) {
				window.alert(
					`Your guess isn't complete. Does it have ${this.codeLength} symbols?`
				)
				return
			}
				console.log(this.guesses[index])
			const pins = em.getHints(this.code, guess)
			Vue.set(this.guesses[index], 'pins', pins)
				console.log(this.guesses[index])
			const isLastGuess = index === this.guesses.length - 1
			this.checkIfWeWon(pins.blacks === this.codeLength, isLastGuess)
		},
		checkIfWeWon(winCondition, isLastGuess) {
			if (winCondition) {
				console.log('Correct.')
				window.alert('Correct.')
				return true
			}

			console.log('Wrong.')
			window.alert('Wrong.')

			if (isLastGuess) {
				window.alert('Mwa ha ha, you lose. I am the mastermind. Not you.')
			}

			return false
		}
	}
})
