/* global window */

let method
let isDebug = true

if (typeof window == 'undefined') {
	isDebug = false
}

// Allow us to toggle debug statements
if (isDebug) {
	method = console.log.bind(window.console)
} else {
	method = function () {}
}

const debug = method

export default debug

