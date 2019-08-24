const utils = require('../utils')
const cache = require('../cache')
const indexController = require('./index.controller')

// check cache in indexController for data before calling db
async function handleFormData() {
  const drivers = await indexController.handleDrivers()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
  }
}

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.query.team
  const formData = await handleFormData()
  // list of drivers
  const driversObj = formData.drivers
  // list of teams
  const teamsObj = formData.teams
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  const driver1Slug = teamData.drivers_scraped[0].name_slug
  const driver2Slug = teamData.drivers_scraped[1].name_slug
  // get driver flags from api
  const driverFlags = [
    JSON.parse(await utils.fetchData(`drivers/${driver1Slug}`))['flag_img_url'],
    JSON.parse(await utils.fetchData(`drivers/${driver2Slug}`))['flag_img_url']
  ]
  teamData['driverFlags'] = driverFlags
  console.log('flags', driverFlags)
  await ctx.render('team', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'team',
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
    teamData: teamData,
    driverFlags: driverFlags
  })
}
module.exports = {
  fetchTeam: fetchTeam
}
