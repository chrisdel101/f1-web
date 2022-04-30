const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')
const { indexControllerErrors } = require('../utilities/errorManager')
const { catchErrors } = require('../errorHandlers')
module.exports = {
  renderDemo,
  renderIndex,
  cache,
  freshFetch,
}

async function renderIndex(ctx) {
  await ctx.render('index', {
    subTitle: ctx.subTitle2,
  })
}
async function renderDemo(ctx) {
  const teamsNamesArr = await fetchTeams()
  const driverNamesArr = await fetchDrivers()
  catchErrors(
    indexControllerErrors.renderDemoError(ctx, driverNamesArr, teamsNamesArr)
  )
  await ctx.render('demo', {
    title: ctx.title,
    method: 'GET',
    driverAction: '/driver',
    teamAction: '/team',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverFormText: ctx.driverText,
    teamText: ctx.teamText,
    driverSelectName: 'driver',
    driverEnums: driverNamesArr,
    teamSelectName: 'team',
    teamEnums: teamsNamesArr,
  })
}
// fetch from DB manually - skip cache
async function freshFetch() {
  console.log('reset')
  try {
    await module.exports.cacheController.handleDriversCache(true)
    await module.exports.cacheController.handleTeamsCache(true)
    console.log('freshFetch')
  } catch (e) {
    console.log('error in freshFetch', e)
  }
}
