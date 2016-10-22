/* global window */

// var window = window || {}
let isDebug = true
let method

// Allow us to toggle debug statements
if (isDebug) {
	method = console.log.bind(window.console)
} else {
	method = function () {}
}

const debug = method
export default debug

