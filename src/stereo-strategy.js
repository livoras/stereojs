stereo.id = guid()

stereo.isMaster = function() {
	log(stereoDataManager.get('masterId'))
	log(stereo.id)
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
	log('Master Died: ', 'slaves is ', stereoDataManager.get('slaves'))
	if (stereo.isMaster()) {
		error('Duplicated master')
	} else {
		var slaves = stereoDataManager.get('slaves')
		if (slaves[0] === stereo.id) {
			log('This tab wants to be a master')
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
	log(stereo.isMaster())

	if (stereo.isMaster()) {
		stereo.broadcast('master died')
		stereoDataManager.set('masterId', '')
	}

	log('Slaves when died', stereoDataManager.get('slaves'))

	// Busy waiting for locking localStorage
	while(stereoDataManager.hasLock()) ;

	removeSlaveFromSlaves(stereo.id)
}

function isFirstTab() {
	return getTabsCount() === 0
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
	log(masterCount)
	var slaves = stereoDataManager.get('slaves')
	return slaves.length + masterCount
}

stereo.d = stereoDataManager
