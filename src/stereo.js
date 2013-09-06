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