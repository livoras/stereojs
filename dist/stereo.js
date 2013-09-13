(function(global) {

var configuration = {
	debug: true
}


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


var stereoDataManager = {}
var _storageDataKey_ = stereoDataManager._storageDataKey_ = '__stereo_storage_data_key__'

var stereoDefaultData = {
	masterId: '',
	isLocked: false,
	slaves: []
}


stereoDataManager.init = function() {
	var stereoDataStr = localStorage[_storageDataKey_]

	if (!stereoDataStr) {
		localStorage[_storageDataKey_] = JSON.stringify(stereoDefaultData)
	}

}

stereoDataManager.get = function(key) {
	var stereoData = JSON.parse(localStorage[_storageDataKey_])

	return stereoData[key]
}

stereoDataManager.set = function(key, value) {
	var stereoData = JSON.parse(localStorage[_storageDataKey_])
	stereoData[key] = value
	localStorage[_storageDataKey_] = JSON.stringify(stereoData)
}

stereoDataManager.clear = function() {
	localStorage[_storageDataKey_] = JSON.stringify(stereoDefaultData)
}

stereoDataManager.lock = function() {
	stereoDataManager.set('isLocked', true)
}

stereoDataManager.unlock = function() {
	stereoDataManager.set('isLocked', false)
}

stereoDataManager.hasLock = function() {
	return stereoDataManager.get('isLocked')
}

stereoDataManager.init()

var stereo = events({})
var timeStamp
var isIE = !!global.attachEvent

stereo.__storageEventKey__ = '__stereo_storage_event_key__'

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
	// Here, `isAllowedToBroadcast` can be rewritten to adapt different broadcast strategy
	var isAllowed = stereo.isAllowedToBroadcast(eventName)

	if (!isAllowed) {
		return false
	}

	var that = this
	timeStamp = (+new Date) + Math.random()

	var sealEventInformation = JSON.stringify({
		eventName: eventName,
		eventData: eventData,
		timeStamp: timeStamp 
	})

	localStorage[that.__storageEventKey__] = sealEventInformation

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
		var eventInformation = JSON.parse(localStorage[stereo.__storageEventKey__]) 
		var newTimeStamp = eventInformation.timeStamp
		var isChanged = (newTimeStamp !== timeStamp)

		if (isChanged) {
			stereo.emit(eventInformation.eventName, eventInformation.eventData)
			timeStamp = newTimeStamp
		} 
	}
}

stereo.config = function(config) {
	extend(configuration, config)
}

stereo.init()


stereo.id = guid()

log('ID: ', stereo.id)

stereo.isMaster = function() {
	return stereoDataManager.get('masterId') === stereo.id
}

stereo.makeMeMaster = function() {
	removeSlaveFromSlaves(stereo.id)
	stereoDataManager.set('masterId', stereo.id)
	stereo.broadcast('master born')
	stereo.emit('master born')
}

stereo.makeMeSlave = function() {
	if(stereo.isMaster()) {
		stereo.broadcast('master died')
	}

	var slaves = stereoDataManager.get('slaves')

	for(var i = 0, len = slaves.length; i < len; i++) {
		if (slaves[i] === stereo.id) return
	}

	slaves.push(stereo.id)
	stereoDataManager.set('slaves', slaves)
}

stereo.isAllowedToBroadcast = function(eventName) {
	return true
}

makeThisTabBirth()

addEvent('beforeunload', makeThisTabDie)

stereo.on('master died', function() {
	if (stereo.isMaster()) {
		error('Duplicated master')
	} else {
		var slaves = stereoDataManager.get('slaves')
		if (slaves[0] === stereo.id) {
			log('This is tab is a candidate')
			stereo.makeMeMaster()
		}
	}
})

function makeThisTabBirth(arguments) {
	stereo.broadcast('tab born')

	if(isFirstTab()) {
		stereo.makeMeMaster()
	} else {
		stereo.makeMeSlave()
	}

}

function makeThisTabDie() {
	stereo.broadcast('tab died')

	if (stereo.isMaster()) {
		stereo.broadcast('master died')
		stereoDataManager.set('masterId', '')
	}

	// Busy waiting for locked localStorage
	while(stereoDataManager.hasLock())
		;

	removeSlaveFromSlaves(stereo.id)
}

function isFirstTab() {
	return !!!stereoDataManager.get('masterId')
}

function hasSlaves () {
	return !!stereoDataManager.get('slaves').length
}

function removeSlaveFromSlaves(id) {

	stereoDataManager.lock()

	var slaves = stereoDataManager.get('slaves')
	each(slaves, function(slaveId, i) {
		if (slaveId === id) {
			slaves.splice(i, 1)
		}
	})
	stereoDataManager.set('slaves', slaves)

	stereoDataManager.unlock()
}

function getTabsCount() {
	var masterCount = !!stereoDataManager.get('masterId') ? 1 : 0
	var slaves = stereoDataManager.get('slaves')
	return slaves.length + masterCount
}

stereo.d = stereoDataManager

log('masterID:', stereoDataManager.get('masterId'))
log('tabs Count', getTabsCount())

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


global.stereo = stereo

})(window);