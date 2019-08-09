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

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.query.team
  const formData = await handleFormData()
  const driversObj = formData.drivers
  const teamsObj = formData.teams
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  console.log('TD', teamData)
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
    teamData: teamData
  })
}
module.exports = {
  fetchTeam: fetchTeam
}
