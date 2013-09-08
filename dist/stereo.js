(function(global) {


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

function events (obj) {
	if(!isEventObj(obj)) {
		obj.events = {}
		extend(obj, eventsObj)
	}
	return obj
}

var eventsObj = {}

eventsObj.on = function(eventName, handler) {
	var events = this.events || (this.events = {})

	if (events[eventName]) {
		events[eventName].push(handler)
	} else {
		events[eventName] = [handler]
	}
}

eventsObj.off = function(eventName, handler) {
	var events = this.events || (this.events = {})

	if (events[eventName] && handler) {
		var handlers = events[eventName]
		if (handlers) {
			for(var i = 0, len = handlers.length; i < len; i++) {
				if (handlers[i] == handler) {
					handlers.splice(i, 1)
				}
			}
		}
	}
}

eventsObj.emit = function(eventName) {
	var events = this.events || (this.events = {})
	var args = Array.prototype.slice.call(arguments, 1)

	if(events[eventName]) {
		var handlers = events[eventName]
		if (handlers) {
			for(var i = 0, len = handlers.length; i < len; i++) {
				var handler = handlers[i]
				handler.apply(handler, args)
			}
		}
	}
}

function isEventObj (obj) {
	return obj.emit && obj.on && obj.off && obj.events
}


var stereo = events({})
var timeStamp
var isIE = !!global.attachEvent

stereo.__storageKey__ = '__stereo_storage_key__'

stereo.init = function() {
	var that = this

	if (global.addEventListener) {
		global.addEventListener('storage', emitEvent, false)

	// For IE 8 compatibility
	// http://jsfiddle.net/rodneyrehm/bAhJL/	
	} else if(isIE) {
		global.document.attachEvent('onstorage', emitEvent)
	}

}

stereo.broadcast = function(eventName, eventData) {
	var that = this
	timeStamp = (+new Date) + Math.random()

	var sealEventInformation = JSON.stringify({
		eventName: eventName,
		eventData: eventData,
		timeStamp: timeStamp 
	})

	localStorage[that.__storageKey__] = sealEventInformation

	return this
}

function emitEvent(event) {

	// IE(No matter which version) Browsers 
	// will execute this tab event's callback function before the other tab setting localStorage value.
	// So, here to defer the `emit` function, after the other tab setting localStorage value.
	// It's something like dirty code...
	if (isIE) {
		setTimeout(emit, 1)
	} else {
		emit()
	}

	function emit () {
		var eventInformation = JSON.parse(localStorage[stereo.__storageKey__]) 
		var newTimeStamp = eventInformation.timeStamp
		var isChanged = (newTimeStamp !== timeStamp)

		if (isChanged) {
			stereo.emit(eventInformation.eventName, eventInformation.eventData)
			timeStamp = newTimeStamp
		} 
	}
}

stereo.init()


global.stereo = stereo

})(window);