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
stereo.__storageKey__ = '__stereo_storage_key__'

stereo.init = function() {
	var that = this
	global.addEventListener('storage', function(event) {
		if (event.key === stereo.__storageKey__) {
			var eventInformation = JSON.parse(localStorage[event.key]) 
			that.emit(eventInformation.eventName, eventInformation.eventData)
		}
	}, false)
}

stereo.broadcast = function(eventName, eventData) {
	var that = this
	var sealEventInformation = JSON.stringify({
		eventName: eventName,
		eventData: eventData,
		timeStamp: Math.random()
	})
	localStorage[that.__storageKey__] = sealEventInformation
	return this
}

stereo.init()


global.stereo = stereo

})(window);