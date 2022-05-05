const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')
const { errorHandler } = require('../utilities/errorManager')
const { catchErrors } = require('../errorHandlers')
const { makeTeamCard } = require('./teams.controller')
const { makeDriverCard } = require('./drivers.controller')
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
// render demo page and select forms
async function renderDemo(ctx) {
  let data = {}
  const teamsNamesArr = await fetchTeams()
  const driverNamesArr = await fetchDrivers()
  catchErrors(errorHandler.renderDemoError(driverNamesArr, teamsNamesArr))

  if (ctx.query['demo-driver']) {
    data['driverCardData'] = await makeDriverCard(ctx.query['demo-driver'])
  } else if (ctx.query['demo-team']) {
    data['teamCardData'] = await makeTeamCard(ctx.query['demo-team'])
  }
  data['demoFormData'] = [
    {
      formNameText: ctx.driverFormText,
      action: '/demo',
      method: 'GET',
      selectName: 'demo-driver',
      enum: driverNamesArr,
    },
    {
      formNameText: ctx.teamFormText,
      method: 'GET',
      action: '/demo',
      selectName: 'demo-team',
      enum: teamsNamesArr,
    },
  ]
  await ctx.render('demo', {
    demoFormData: data?.['demoFormData'],
    driverCardData: data?.['driverCardData'],
    teamCardData: data?.['teamCardData'],
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
