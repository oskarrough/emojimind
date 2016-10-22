import test from 'ava'
import emojimind from './src/emojimind'

const testPins = function (code, pattern, expectedBlacks, expectedWhites) {
	const pins = emojimind.getHints(code, pattern)
	return pins.blacks === expectedBlacks && pins.whites === expectedWhites
}

test('function export works', t => {
	t.is(typeof emojimind.getHints, 'function')
})

test('we get the correct amount of black and white pins', t => {
	t.true(testPins(
		[6, 3, 2, 2],
		[1, 1, 1, 1], 0, 0))
	t.true(testPins(
		[6, 3, 2, 2],
		[6, 2, 3, 2], 2, 2))
	t.true(testPins(
		[1, 2, 3, 4],
		[1, 2, 3, 4], 4, 0))
	t.true(testPins(
		[2, 2, 2, 2],
		[2, 2, 2, 3], 3, 0))
	t.true(testPins(
		[1, 2, 2, 3],
		[3, 1, 2, 4], 1, 2))
	t.true(testPins(
		[4, 3, 1, 1],
		[4, 2, 3, 5], 1, 1))
	t.true(testPins(
		[6, 4, 3, 4],
		[1, 6, 4, 6], 0, 2))
	t.true(testPins(
		[1, 2, 3, 4],
		[1, 1, 1, 1], 1, 0))
	t.true(testPins(
		[1, 2, 3, 4],
		[2, 2, 1, 1], 1, 1))
	t.true(testPins(
		[1, 2, 3, 4],
		[3, 3, 1, 4], 1, 2))
	t.true(testPins(
		[4, 3, 5, 6],
		[4, 5, 6, 4], 1, 2))
})

