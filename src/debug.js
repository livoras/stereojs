function log () {
	var isDebug = configuration.debug
	if (isDebug) {
		Array.prototype.unshift.call(arguments, 'StereoJS Debug Log: ')
		console.log.apply(console, arguments)
	}
}

function error () {
	var isDebug = configuration.debug
	if (isDebug) {
		console.log(arguments)
		Array.prototype.unshift.call(arguments, 'StereoJS Debug Log: ')
		console.error.apply(console, arguments)
	}
}

function dir () {
	var isDebug = configuration.debug
	if (isDebug) {
		Array.prototype.unshift.call(arguments, 'StereoJS Debug Log: ')
		console.dir.apply(console, arguments)
	}
}

function warn () {
	var isDebug = configuration.debug
	if (isDebug) {
		Array.prototype.unshift.call(arguments, 'StereoJS Debug Log: ')
		console.warn.apply(console, arguments)
	}
}