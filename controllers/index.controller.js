const utils = require('../utils')
const cache = require('../cache')
module.exports = {
  render,
  cache
}
async function render(ctx, next) {
  const teamsObj = await handleTeams(ctx, next)
  console.log('TEAMOBJ', teamsObj)
  const driversObj = await handleDrivers(ctx, next)
  console.log('DRIVEOBJ', driversObj)

  // await ctx.render('index', {
  //   title: ctx.title,
  //   method: 'GET',
  //   enctype: 'application/x-www-form-urlencoded',
  //   driverAction: driversObj.driverAction,
  //   teamAction: teamsObj.teamAction,
  //   buttonField: 'Submit',
  //   buttonType: 'submit',
  //   buttonValue: 'submit',
  //   driverSelectName: driversObj.selectName,
  //   driverEnums: driversObj.driversArr,
  //   teamSelectName: teamsObj.selectName,
  //   teamsEnums: teamsObj.teamsArr
  // })
}
async function handleDrivers(ctx, next) {
  try {
    const driversArr = await utils.getSelectData(cache, 'drivers')
    cache.drivers = driversArr
    return {
      driversArr: driversArr,
      selectName: 'driver',
      driverAction: '/driver'
    }
  } catch {
    const error = {
      message: 'Internal Server Error',
      status: 500,
      detail: 'Could not parse driver information.',
      stack: new Error().stack
    }
    await ctx.render('error', error)
  }
}
async function handleTeams(ctx, next) {
  try {
    // extract just the names
    const teamsArr = await utils.getSelectData(cache, 'teams')
    cache.teams = teamsArr
    // console.log('CA', teamsArr)
    return {
      teamsArr: teamsArr,
      selectName: 'team',
      teamAction: '/team'
    }
  } catch {
    const error = {
      message: 'Internal Server Error',
      status: 500,
      detail: 'Could not parse driver information.',
      stack: new Error().stack
    }
    await ctx.render('error', error)
  }
}
