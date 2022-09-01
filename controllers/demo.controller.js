const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')
const { errorHandler } = require('../utilities/errorManager')
const { catchErrors } = require('../errorHandlers')
const { buildTeamCard } = require('./teams.controller')
const { buildDriverCard } = require('./drivers.controller')
const { cardTypes } = require('../constants')
const utils = require('../utils')

// render demo page and select forms
exports.renderDemo = async (ctx) => {
  let data = {}
  const teamsNamesArr = await fetchTeams()
  const driverNamesArr = await fetchDrivers()
  catchErrors(errorHandler.renderDemoError(driverNamesArr, teamsNamesArr))

  if (ctx.query['demo-driver']) {
    data['driverCardData'] = await buildDriverCard(ctx.query['demo-driver'])
  } else if (ctx.query['demo-team']) {
    data['teamCardData'] = await buildTeamCard(ctx.query['demo-team'])
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
    // toggle params
    pageType: data?.['driverCardData'] ? cardTypes.DRIVER : cardTypes.TEAM,
    ENV: utils.ENV,
    toggleState: ctx?.state?.hideDemo,
    toggleNextEndpoint: data?.['driverCardData']
      ? utils.toggleNextEndpointDriver
      : utils.toggleNextEndpointTeam,
    toggleHideNav: utils.toggleHideNav,
    ctx: ctx,
  })
}
