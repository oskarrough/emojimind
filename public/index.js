/* global em, Vue */

// Returns a boolean if the object is emtpy
Vue.filter('isEmptyObject', value => em.isEmptyObject(value));

// Because our 'guess' array contains null values we need to filter them out before we can check the length.
Vue.filter('invalidGuess', (array, max) => {
  console.log(array, max);
  return array.filter(v => v).length !== max;
});

const SelectGuess = Vue.component('select-guess', {
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
});

const vm = new Vue({
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
			return this.code.length ? 'Give me a new code' : 'Start a new game';
		}
	},
	methods: {
		newGame() {
			this.code = em.createCode(this.symbols, this.codeLength);
			this.guesses = this.createGuesses();
			// this.tryTest();
		},
		tryTest() {
			this.code = ['6', '3', '2', '2'];
			this.guesses[0].guess = ['6', '2', '3', '2'];
			this.guesses[1].guess = ['3', '3', '6', '3'];
			this.guesses[2].guess = ['3', '3', '3', '6'];
			this.guesses[3].guess = ['3', '2', '3', '6'];
			this.guesses[4].guess = ['2', '1', '3', '6'];
			this.guesses[5].guess = ['3', '3', '3', '3'];
			this.guesses.map((guess, index) => this.tryGuess(index));
		},
		// Returns a data structure: [{guess: [null, null, null, null], pins: []}, ...]
		createGuesses() {
			let guesses = [];
			for (let i = 0; i < this.maxGuesses; i++) {
				let row = {
					guess: [],
					pins: {}
				};
				for (let k = 0; k < this.codeLength; k++) {
					row.guess.push(null);
				}
				guesses.push(row);
			}
			return guesses;
		},
		tryGuess(index, event) {
			event.preventDefault();
			const guess = this.guesses[index].guess;
			const hasTheRightLength = guess.filter(g => g).length === this.codeLength;
			if (!hasTheRightLength) {
				throw new Error(`Your guess isn't complete. Does it have ${this.codeLength} symbols?`);
			}
			const isLastGuess = index === this.guesses.length - 1;
			const pins = em.getHints(this.code, guess);
			console.log(pins);
			Vue.set(this.guesses[index], 'pins', pins);
			const win = pins.blacks === this.codeLength;
			if (win) {
				alert('Correct.');
				console.log('Correct.');
			} else {
				console.log('Wrong.');
				if (isLastGuess) {
					alert(`Mwa ha ha, you lose. I am the mastermind. Not you.`);
				}
			}
		}
	}
});
