const cacheController = require('./cache.controller')
const cache = require('../cache')
const utils = require('../utils')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')
const { fetchTeam, fetchTeams } = require('../clients/team.client')
const { urls, cardTypes } = require('../constants')

module.exports = {
  buildTeamCard,
  renderTeamCard,
  renderTeamPage,
  getDriversData,
  renderAllTeamsPage,
}
async function renderAllTeamsPage(ctx) {
  try {
    const teamNamesArr = await fetchTeams()
    // TODO send proper error
    if (!teamNamesArr || teamNamesArr.length >= 0) {
      // check backend and DB is running
      return (ctx.body = 'No teams data found')
    }
    console.log('Teams Obj', teamNamesArr)
    // loop over names and get each team
    const teamsDataArr = await Promise.all(
      teamNamesArr.map(async (team) => {
        return await fetchTeam(team.name_slug)
      })
    )
    return await ctx.render('allTeams', {
      teamsDataArr,
      cardSize: ctx.query.size === 'mini' ? 'mini' : 'full',
      urls,
      ENV: utils.ENV,
      toggleState: ctx?.query?.size === 'mini' ? false : true,
    })
  } catch (e) {
    console.error('Error in renderAllTeamsPage', e)
    // TODO add prod errors on page DEV only
    ctx.response.body = `Error in renderAllTeamsPage: ${e}`
  }
}
async function getDriversData(teamDataObj) {
  try {
    // get name slug
    const driver1Slug = teamDataObj.drivers_scraped[0].name_slug
    const driver2Slug = teamDataObj.drivers_scraped[1].name_slug
    // call api for driver data
    const driversDataArr = [
      JSON.parse(await utils.fetchEndpoint(`drivers/${driver1Slug}`)),
      JSON.parse(await utils.fetchEndpoint(`drivers/${driver2Slug}`)),
    ]
    // loop over drivers on team
    teamDataObj.drivers_scraped.forEach((driver) => {
      // match to correct fetched obj
      for (let i = 0; i < driversDataArr.length; i++) {
        // add fields to correct driver
        if (driver.name_slug === driversDataArr[i].name_slug) {
          driver['flag_img_url'] = driversDataArr[i]['flag_img_url']
          driver['api_call'] = `drivers/${driver.name_slug}`
          driver['page_url'] = `/demo/driver?demo-driver=${driver.name_slug}`
        }
      }
    })
    return teamDataObj
  } catch (e) {
    return 'Error in getDriversData', e
  }
}
// fetch single teams dataObj
async function buildTeamCard(name_slug) {
  const teamData = await fetchTeam(name_slug)
  catchErrors(errorHandler.queryTeamDataError(teamData))
  return {
    ...teamData,
    ...(await getDriversData(teamData)),
  }
}
// build card only - no nav, no toggle switch
// called dir with /api
async function renderTeamCard(ctx) {
  try {
    const teamCard = await buildTeamCard(ctx.params.name_slug)
    return await ctx.render('teamPage', {
      teamData: teamCard,
      noToggle: true,
      noNav: true,
      cardSize: ctx?.query?.size === 'mini' ? 'mini' : 'full',
    })
  } catch (e) {
    console.error('Error in renderTeamCard', e)
  }
}
// build card and show on page with nav header - same as renderTeamCard w/o showCardOnly
async function renderTeamPage(ctx) {
  try {
    const teamCard = await buildTeamCard(ctx.params.name_slug)
    return await ctx.render('teamPage', {
      teamData: teamCard,
      noNav: true ? ctx.query.noNav === 'true' : false,
      noToggle: true ? ctx.query.noNav === 'true' : false,
      pageType: cardTypes.DRIVER,
      urls: urls,
      ENV: utils.ENV,
      toggleState: ctx?.state?.hideDemo,
      toggleNextEndpoint: utils.toggleNextEndpointTeam,
      toggleHideNav: utils.toggleHideNav,
      ctx: ctx,
      cardSize: ctx?.query?.size === 'mini' ? 'mini' : 'full',
    })
  } catch (e) {
    console.error('Error in renderTeamCard', e)
  }
}
