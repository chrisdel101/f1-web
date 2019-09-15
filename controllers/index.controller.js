const utils = require('../utils')
const cache = require('../cache')
module.exports = {
  render,
  cache,
  handleDrivers,
  handleTeams,
  resetCache
}
async function render(ctx, next) {
  const teamsObj = await handleTeams()
  console.log('TEAMOBJ', teamsObj)
  const driversObj = await handleDrivers()
  // console.log('DRIVEOBJ', driversObj)

  await ctx.render('index', {
    title: ctx.title,
    method: 'GET',
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamEnums: teamsObj.teamsArr
  })
}
// gets driver data and caches it
async function handleDrivers(manualFetch = false) {
  try {
    if (!manualFetch) {
      const driversArr = await utils.getSelectData(cache, 'drivers')
      // add to cache
      cache.drivers = driversArr
      return {
        driversArr: driversArr,
        selectName: 'driver',
        driverAction: '/driver'
      }
    } else {
    }
  } catch (e) {
    console.log('A error in handleDrivers', e)
  }
}
// / gets driver data and caches it
async function handleTeams(manualFetch = false) {
  try {
    if (!manualFetch) {
      // extract just the names
      const teamsArr = await utils.getSelectData(cache, 'teams')
      // add to cache
      cache.teams = teamsArr
      // console.log('CA', teamsArr)
      return {
        teamsArr: teamsArr,
        selectName: 'team',
        teamAction: '/team'
      }
    } else {
    }
  } catch (e) {
    console.log('A error in handleTeams', e)
  }
}
// reset the cache manually
async function resetCache() {
  try {
    await module.exports.handleDrivers(true)
    await module.exports.handleTeams(true)
    console.log('Cache reset')
  } catch (e) {
    console.log('error in resetCache', e)
  }
}
