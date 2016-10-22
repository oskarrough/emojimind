/* global window, Vue */
/* eslint no-alert:0 */

import em from './emojimind'

// Returns a boolean if the object is emtpy
Vue.filter('isEmptyObject', value => em.isEmptyObject(value))

// Because our 'guess' array contains null values we need to filter them out before we can check the length.
Vue.filter('invalidGuess', (array, max) => {
	return array.filter(v => v).length !== max
})

Vue.component('select-guess', {
	props: ['guess', 'symbols', 'disabled'],
	template: `<ul class="SelectGuess">
		<li v-for="char in guess" track-by="$index">
			<select v-model="char" :disabled="disabled">
				<option v-for="sym in symbols" track-by="$index" :value="sym">
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
			return this.code.length ? 'Give me a new code' : 'Start a new game'
		}
	},
	methods: {
		newGame() {
			this.code = em.createCode(this.symbols, this.codeLength)
			this.guesses = this.createGuesses()
		},
		createGuesses() {
			let guesses = []
			for (let i = 0; i < this.maxGuesses; i++) {
				let row = {
					guess: [],
					pins: {}
				}
				for (let k = 0; k < this.codeLength; k++) {
					// We fill the array with null values to give it a length
					row.guess.push(null)
				}
				guesses.push(row)
			}
			return guesses
		},
		tryGuess(index, event) {
			event.preventDefault()
			const guess = this.guesses[index].guess
			const hasTheRightLength = guess.filter(g => g).length === this.codeLength
			if (!hasTheRightLength) {
				throw new Error(`Your guess isn't complete. Does it have ${this.codeLength} symbols?`)
			}
			const pins = em.getHints(this.code, guess)
			Vue.set(this.guesses[index], 'pins', pins)
			const isLastGuess = index === this.guesses.length - 1
			this.checkIfWeWon(pins.blacks === this.codeLength, isLastGuess)
		},
		checkIfWeWon(winCondition, isLastGuess) {
			if (winCondition) {
				console.log('Correct.')
				window.alert('Correct.')
				return
			}
			console.log('Wrong.')
			if (isLastGuess) {
				window.alert(`Mwa ha ha, you lose. I am the mastermind. Not you.`)
			}
		}
	}
})
