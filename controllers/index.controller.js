const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')
const { indexControllerErrors } = require('../utilities/errorManager')
const { catchErrors } = require('../errorHandlers')
const { createDriverDemoCard } = require('./drivers.controller')
const { createTeamDemoCard } = require('./teams.controller')
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
  catchErrors(
    indexControllerErrors.renderDemoError(ctx, driverNamesArr, teamsNamesArr)
  )
  if (ctx.query['demo-driver']) {
    const driverData = await fetchDriver(ctx.query['demo-driver'])
    const teamData = await fetchTeam(driverData.team_id)
    catchErrors(
      indexControllerErrors.queryDriverDataError(ctx, driverData, teamData)
    )
    data['driverCardData'] = createDriverDemoCard(ctx, driverData, teamData)
  } else if (ctx.query['demo-team']) {
    const teamData = await fetchTeam(ctx.query['demo-team'])
    catchErrors(indexControllerErrors.queryTeamDataError(ctx, teamData))
    data['teamCardData'] = await createTeamDemoCard(ctx, teamData)
  }
  data['demoFormData'] = [
    {
      formNameText: ctx.driverFormText,
      action: '/demo/driver',
      method: 'GET',
      selectName: 'demo-driver',
      enum: driverNamesArr,
    },
    {
      formNameText: ctx.teamFormText,
      method: 'GET',
      action: '/demo/team',
      selectName: 'demo-team',
      enum: teamsNamesArr,
    },
  ]
  await ctx.render('demo', { data })
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
