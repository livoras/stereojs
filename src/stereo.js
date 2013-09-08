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