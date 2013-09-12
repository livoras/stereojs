function extend () {
	var target = arguments[0]
	for (var i = arguments.length - 1; i > 0; i--) {
		var obj = arguments[i] 
		for (var key in obj) {
			if(obj.hasOwnProperty(key)) {
				target[key] = obj[key]
			}
		}
	}
	return target
}

// To judge if a obj is `undefine`
// the underscore's way
// http://stackoverflow.com/questions/13463955/isundefined-implementation
function isUndefined (obj) { 
	return obj == void 0 
} 

function isDefined(obj) {
	return obj !== void 0 
}


var REPLACE_OBJ_STR_RE = /(?:^\[object\s+)|(?:\]$)/g
function type (obj) {
	return toString(obj).replace(REPLACE_OBJ_STR_RE, '')
}

// From SeaJS
// https://seajs.github.com/SeaJS
function isType(type) {
	return function(obj) {
		return toString(obj) === "[object " + type + "]"
	}
}
var isObject = isType("Object")
var isString = isType("String")
var isArray = Array.isArray || isType("Array")
var isFunction = isType("Function")

function guid () {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random() * 16|0, v = c == 'x' ? r : (r&0x3|0x8)
		return v.toString(16)
	}).toUpperCase()
}


function addEvent (eventName, fn) {
	if (window.attachEvent) {
		window.attachEvent('on' + eventName, fn)
	} else if (window.addEventListener) {
		window.addEventListener(eventName, fn, false)
	}
}

function removeEvent(eventName, fn) {
	if (window.detachEvent) {
		window.detachEvent('on' + eventName, fn)
	} else if (window.addEventListener) {
		window.removeEventListener(eventName, fn)
	}
}

function each (list, fn) {
	for (var i = 0, len = list.length; i < len; i++) {
		fn(list[i], i)
	}
}
function delay (arguments) {
	var i = 0
	while(i < 1000000000) {
		i++
	}
}
