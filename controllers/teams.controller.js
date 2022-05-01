const cacheController = require('./cache.controller')
const cache = require('../cache')
const utils = require('../utils')
module.exports = {
  createTeamCard,
  renderTeamTemplate,
  renderTeamCard,
  fetchTeamAPI,
  fetchTeamsAPI,
  combineDriverDataOnTeam,
  compileTeamTemplateResObj,
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
    const { teamData } = await module.exports.fetchTeamAPI(ctx, null, teamSlug)
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
        return await module.exports.makeAllTeamsObjs(ctx, team.name_slug)
      })
      return Promise.all(promises)
    }
    // needs to have key name to work in template
    const teamsArr = await allTeamObjs()
    const teamsArrObj = {
      teamsArr,
      // take size from first arr ite,
      size: teamsArr[0].size,
    }
    return await ctx.render('allTeams', teamsArrObj)
  } catch (e) {
    console.error('Error in renderAllTeamsList', e)
  }
}
async function combineDriverDataOnTeam(teamDataObj) {
  try {
    console.log('teamDataObj!!', teamDataObj)
    return
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
          driver['page_url'] = `/driver?driver=${driver.name_slug}`
        }
      }
    })
    return teamDataObj
  } catch (e) {
    return 'Error in combineDriverDataOnTeam', e
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
async function createTeamCard(ctx, teamData) {
  return {
    ...teamData,
    teamUrl: `/team?team=${teamData.team_name_slug}`,
    ...combineDriverDataOnTeam(teamData),
  }
}
// use driver api data to rendercard only
async function renderTeamCard(ctx) {
  let { teamData } = await fetchTeamAPI(ctx, 'card')
  console.log('teamData', teamData)
  const teamUrl = `/team?team=${teamData.team_name_slug}`
  // add link to team to driver
  teamData['teamUrl'] = teamUrl
  // add driver data to team obj
  teamData = await combineDriverDataOnTeam(teamData)
  // console.log('Team Data', teamData)
  return await ctx.render('teamPage', {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    addClass: 'team-card-page',
    routeName: 'teamCard',
    teamData: teamData,
  })
}

async function compileTeamTemplateResObj(ctx, driversObj, teamsObj, teamData) {
  // add driver data to team obj
  teamData = await combineDriverDataOnTeam(teamData)
  console.log('XXXXteamData', teamData)
  return {
    //  +++ index params +++
    urls: ctx.urls,
    title: ctx.title,
    driverEnums: driversObj.driversArr,
    driverAction: driversObj.driverAction,
    teamEnums: teamsObj.teamsArr,
    method: 'GET',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    teamAction: teamsObj.teamAction,
    teamSelectName: teamsObj.selectName,
    driverSelectName: driversObj.selectName,
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    // +++ mixin data  +++
    routeName: 'team',
    teamData: teamData,
  }
}
async function renderTeamTemplate(ctx) {
  // console.log(ctx)
  const { teamData } = await module.exports.fetchTeamAPI(ctx, 'page')
  const { driversObj, teamsObj } = await module.exports.fetchTeamsAPI()
  console.log('TEAMDATS', teamData)
  if (!teamData) {
    throw new ReferenceError('renderDriverTemplate.teamData() is undefined')
  } else if (!driversObj) {
    throw new ReferenceError('renderDriverTemplate.driversObj() is undefined')
  } else if (!teamsObj) {
    throw new ReferenceError('renderDriverTemplate.teamsObj() is undefined')
  }

  const options = await module.exports.compileTeamTemplateResObj(
    ctx,
    driversObj,
    teamsObj,
    teamData
  )
  // console.log('options', options)
  return await ctx.render('teamPage', options)
}
