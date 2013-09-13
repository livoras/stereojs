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
