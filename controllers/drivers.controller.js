const utils = require('../utils')
const cache = require('../cache')
const indexController = require('./index.controller')

async function handleFormData() {
  const drivers = await indexController.handleDrivers()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
  }
}
async function fetchDriver(ctx, next) {
  const driverSlug = ctx.query.driver
  const formData = await handleFormData()
  const driversObj = formData.drivers
  const teamsObj = formData.teams
  console.log('driv', driversObj.selectName)
  const driverData = JSON.parse(
    await utils.fetchData(`drivers/${ctx.query.driver}`)
  )
  console.log(driversObj)
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'driver',
    driverEnums: driversObj.driversArr,
    teamEnums: teamsObj.teamsArr,
    method: 'GET',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    teamAction: teamsObj.teamAction,
    teamSelectName: teamsObj.selectName,
    driverAction: driversObj.driverAction,
    driverSelectName: driversObj.selectName,
    driverData: driverData
  })
}
module.exports = {
  fetchDriver: fetchDriver
}
