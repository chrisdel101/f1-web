const utils = require('../utils')
const cache = require('../cache')
module.exports = {
  render,
  cache,
  handleDrivers,
  handleTeams
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
    teamsEnums: teamsObj.teamsArr
  })
}
async function handleDrivers() {
  try {
    const driversArr = await utils.getSelectData(cache, 'drivers')
    // add to cache
    cache.drivers = driversArr
    return {
      driversArr: driversArr,
      selectName: 'driver',
      driverAction: '/driver'
    }
  } catch (e) {
    console.log('A error in handleDrivers', e)
  }
}
async function handleTeams() {
  try {
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
  } catch (e) {
    console.log('A error in handleTeams', e)
  }
}
