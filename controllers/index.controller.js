const utils = require('../utils')
const cache = require('../cache')
module.exports = {
  render,
  cache
}
async function render(ctx, next) {
  const driversObj = await handleDrivers(ctx, next)
  // console.log('DRIVE', driversObj)
  const teamsObj = await handleTeams(ctx, next)

  await ctx.render('index', {
    title: ctx.title,
    method: 'POST',
    enctype: 'application/x-www-form-urlencoded',
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
async function handleDrivers(ctx, next) {
  try {
    const driversArr = JSON.parse(await utils.fetchData('drivers'))
    cache.drivers = driversArr
    // console.log('DRI cache', cache)
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
    const teamsArr = JSON.parse(await utils.fetchData('teams'))
    cache.teams = teamsArr
    // console.log(cache)
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
