const cache = require('../cache')
const utils = require('../utils')

exports.addDataToDriversObj = driversObj => {
  try {
    driversObj.driverText = 'Choose a Driver'
    driversObj.selectName = 'driver'
    driversObj.driverAction = '/driver'
    return driversObj
  } catch (e) {
    console.error('An error in addDataToDriversObj', e)
  }
}
exports.addDataToTeamsObj = teamsObj => {
  try {
    teamsObj.teamText = 'Choose a Team'
    teamsObj.selectName = 'team'
    teamsObj.teamAction = '/team'
    return teamsObj
  } catch (e) {
    console.error('An error in addDataToTeamsObj', e)
  }
}

// / gets driver data and caches it
exports.handleTeamsCache = async (cache, expiryTime, manualFetch = false) => {
  try {
    if (!manualFetch) {
      // if drivers not in cache - add it
      if (!cache.hasOwnProperty('teams')) {
        const teamsArr = JSON.parse(await utils.fetchData('teams'))
        console.log('handleTeamsCache() - NOT FROM CACHE')
        cache['teams'] = {
          teamsArr: teamsArr,
          timestamp: new Date().getTime()
        }
        return this.addDataToTeamsObj(cache['teams'])
        // if drivers exists but timestamp, older than 24 hours, fails - add it
      } else if (
        cache.hasOwnProperty('teams') &&
        !utils.verifyTimeStamp(cache['teams'].timestamp, expiryTime)
      ) {
        const teamsArr = JSON.parse(await utils.fetchData('teams'))
        console.log('handleDriversCache() - NOT FROM CACHE')
        cache['teams'] = {
          teamsArr: teamsArr,
          timeStamp: new Date().getTime()
        }
        return this.addDataToTeamsObj(cache['teams'])
        // if drivers exists but timestamp pass - use cache
      } else if (
        cache.hasOwnProperty('teams') &&
        utils.verifyTimeStamp(cache['teams'].timestamp, expiryTime)
      ) {
        // if less than 24 hours old - time stamp passes-  get from cache
        console.log('handleTeamsCache() - FROM CACHE')
        return this.addDataToTeamsObj(cache['teams'])
      }
    } else if (manualFetch) {
      console.log('manual fetch')
    }
  } catch (e) {
    console.log('A error in handleTeamsCache', e)
  }
}

// gets driver data and caches it
// takes a cache - acceess driversObj which has driversArr inside
exports.handleDriversCache = async (cache, expiryTime, manualFetch = false) => {
  try {
    if (!manualFetch) {
      // if drivers not in cache - add it and new timestamp
      if (!cache.hasOwnProperty('drivers')) {
        const fetchedDriversArr = JSON.parse(await utils.fetchData('drivers'))
        console.log('handleDriversCache() - NOT FROM CACHE 1')
        cache['drivers'] = {
          driversArr: fetchedDriversArr,
          timestamp: new Date().getTime()
        }
        return this.addDataToDriversObj(cache['drivers'])
        // if drivers exists but timestamp, older than 24 hours, fails - add it and new timestamp
      } else if (
        cache.hasOwnProperty('drivers') &&
        !utils.verifyTimeStamp(cache['drivers'].timestamp, expiryTime)
      ) {
        const fetchedDriversArr = JSON.parse(await utils.fetchData('drivers'))
        console.log('handleDriversCache() - NOT FROM CACHE 2')
        cache['drivers'] = {
          driversArr: fetchedDriversArr,
          timeStamp: new Date().getTime()
        }
        return this.addDataToDriversObj(cache['drivers'])
        // if drivers exists but timestamp pass - use cache
      } else if (
        cache.hasOwnProperty('drivers') &&
        utils.verifyTimeStamp(cache['drivers'].timestamp, expiryTime)
      ) {
        // if less than 24 hours old - time stamp passes-  get from cache
        console.log('handleDriversCache() - FROM CACHE')
        return this.addDataToDriversObj(cache['drivers'])
      }
    } else if (manualFetch) {
      console.log('manual fetch')
    }
  } catch (e) {
    console.log('A error in handleDriversCache', e)
  }
}
