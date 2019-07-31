const utils = require('../utils')
module.exports = {
  render
}
async function render(ctx, next) {
  const driversObj = await handleDrivers(ctx, next)
  const teamsObj = await handleTeams(ctx, next)
  console.log('TEMA', teamsObj)

  await ctx.render('index', {
    title: ctx.title,
    method: 'POST',
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    enctype: 'application/x-www-form-urlencoded',
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
    // console.log(driversArr)
    return {
      driversArr: driversArr,
      selectName: 'selectDriver',
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
    // console.log(teamsaArr)
    return {
      teamsArr: teamsArr,
      selectName: 'selectTeam',
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
