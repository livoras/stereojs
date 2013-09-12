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