const cacheController = require('./cache.controller')
const cache = require('../cache')
const utils = require('../utils')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')
const { fetchTeam } = require('../clients/team.client')
module.exports = {
  makeTeamCard,
  renderTeamCard,
  fetchTeamAPI,
  fetchTeamsAPI,
  getDriversData,
  renderAllTeamsList,
  makeAllTeamsObjs,
}
// takes slug, calls API and combines props
async function makeAllTeamsObjs(ctx, teamSlug, size = 'full') {
  try {
    // add size to options for css class styles
    if (ctx.query && ctx.query.size === 'mini') {
      size = 'mini'
    }
    const teamData = await fetchTeam(teamSlug)
    const options = {
      full_team_name: teamData.full_team_name,
      main_image: teamData.main_image,
      team_name_slug: teamData.team_name_slug,
      url_name_slug: teamData.url_name_slug,
      size,
    }
    return options
  } catch (e) {
    console.error('Error in makeAllTeamsObjs', e)
  }
}
// calls all drivers, fetchs makeAllDriversObjs, and renders tmplt
async function renderAllTeamsList(ctx) {
  try {
    // must have module.exports to work in tests
    const { teamsObj } = await module.exports.fetchTeamsAPI()
    console.log('Teams Obj', teamsObj)
    // allDriversObj contain partial info for allDriversPage
    const allTeamObjs = async () => {
      const promises = teamsObj.teamsArr.map(async (team) => {
        return await fetchTeam(team.teamSlug)
      })
      return Promise.all(promises)
    }
    // needs to have key name to work in template

    const teamsArr = await allTeamObjs()
    const teamsArrObj = {
      teamsArr,
      cardSize: ctx.query === 'mini' ? 'mini' : 'full',
    }
    return await ctx.render('allTeams', teamsArrObj)
  } catch (e) {
    console.error('Error in renderAllTeamsList', e)
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
    console.log('driversDataArr', driversDataArr)
    // loop over drivers on team
    teamDataObj.drivers_scraped.forEach((driver) => {
      // console.log('driver', driver)
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
async function fetchTeamAPI(ctx, render, teamSlug = undefined) {
  try {
    // console.log('render', ctx.query,)
    // get query params from GET req
    if (render === 'page') {
      teamSlug = ctx.query.team
    } else if (render === 'card') {
      teamSlug = ctx.params.team_slug
    }
    if (!teamSlug) {
      throw new ReferenceError('fetchTeamAPI must have teamSlug')
    }
    // query team by slug
    const teamData = JSON.parse(await utils.fetchEndpoint(`teams/${teamSlug}`))
    if (teamData) return { teamData }
    else throw Error('fetchTeamAPI teamSlug is not valid. Check teamSlug.')
  } catch (e) {
    console.error('Error in fetchTeamAPI', e)
  }
}
// fetchs the driver info from the api to use in render func
async function fetchTeamsAPI() {
  try {
    const teamsObj = await cacheController.handleTeamsCache(cache, 1440)
    console.log('TEAM', teamsObj)
    const driversObj = await cacheController.handleDriversCache(cache, 1440)

    return {
      teamsObj,
      driversObj,
    }
  } catch (e) {
    console.error('An error in teamsController.fetchDriversAPI()', e)
  }
}
async function makeTeamCard(name_slug) {
  const teamData = await fetchTeam(name_slug)
  catchErrors(errorHandler.queryTeamDataError(teamData))
  return {
    ...teamData,
    ...(await getDriversData(teamData)),
  }
}
// use driver api data to rendercard only
async function renderTeamCard(ctx) {
  try {
    const teamCard = await makeTeamCard(ctx.params.name_slug)
    return await ctx.render('teamPage', {
      teamData: teamCard,
    })
  } catch (e) {
    console.error('Error in renderTeamCard', e)
  }
}
