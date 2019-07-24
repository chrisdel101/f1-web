const utils = require('../utils')
module.exports = {
  render
}
async function render(ctx, next) {
  const driversObj = await handleDrivers(ctx, next)
  const teamsObj = await handleTeams(ctx, next)
  // console.log('teams', teamsObj)
  await ctx.render('index', {
    title: ctx.title,
    method: 'POST',
    action: '/driver',
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
    return {
      driversArr: driversArr,
      selectName: 'selectDriver'
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
    const teams = JSON.parse(await utils.fetchData('teams')).map(
      obj => obj.name
    )
    console.log('t', teams)
    return {
      teamsArr: teams,
      selectName: 'selectTeam'
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
