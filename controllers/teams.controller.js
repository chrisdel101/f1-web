const cacheController = require('./cache.controller')
const cache = require('../cache')
const utils = require('../utils')
module.exports = {
  renderTeamTemplate,
  renderTeamCard,
  fetchTeamAPI,
  combineDriverDataOnTeam
}

// check cache in indexController for data before calling db
async function handleFormData() {
  const drivers = await indexController.handleDriversCache()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
  }
}
async function combineDriverDataOnTeam(teamDataObj) {
  try {
    // get name slug
    const driver1Slug = teamDataObj.drivers_scraped[0].name_slug
    const driver2Slug = teamDataObj.drivers_scraped[1].name_slug
    // call api for driver data
    const driversDataArr = [
      JSON.parse(await utils.fetchData(`drivers/${driver1Slug}`)),
      JSON.parse(await utils.fetchData(`drivers/${driver2Slug}`))
    ]
    // console.log(driversDataArr)
    // console.log(teamDataObj)
    driversDataArr.forEach(driver => {
      if (driver.name_slug == 1) {
      }
    })
    // loop over drivers on team
    teamDataObj.drivers_scraped.forEach(driver => {
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
async function fetchTeamAPI(ctx, render) {
  try {
    console.log('cacheC', cacheController)
    // get query params from GET req
    let teamSlug
    if (render === 'page') {
      teamSlug = ctx.query.team
    } else if (render === 'card') {
      teamSlug = ctx.params.team_slug
    }
    // pass form data from cache to template
    const driversObj = cacheController.handleDriversCache(cache, 1440)
    const teamsObj = cacheController.handleTeamsCache(cache, 1440)
    // if slug exist - this is only on card
    if (teamSlug) {
      // query driver by slug
      const teamData = JSON.parse(await utils.fetchData(`drivers/${teamSlug}`))
      // look up drivers team by id
      return {
        teamData,
        driversObj,
        teamsObj
      }
      // else on template
    } else {
      return {
        driversObj,
        teamsObj
      }
    }
  } catch (e) {
    console.error('Error in fetchTeamAPI', e)
  }
}

// use driver api data to rendercard only
async function renderTeamCard(ctx) {
  let { teamData, allDriversObj, allteamsObj } = await fetchTeamAPI(ctx, 'card')
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
    teamData: teamData
  })
}
// use team api data to render full template
async function renderTeamTemplate(ctx, next) {
  let { teamData, allDriversObj, allteamsObj } = await fetchTeamAPI(ctx, 'page')
  // get data from form
  let teamName = ctx.query.team
  // add driver data to team obj
  teamData = await combineDriverDataOnTeam(teamData)
  // console.log('Team Data', allteamsObj)
  await ctx.render('teamPage', {
    //  +++ index params +++
    urls: ctx.urls,
    title: ctx.title,
    driverEnums: allDriversObj.driversArr,
    driverAction: allDriversObj.driverAction,
    teamEnums: allteamsObj.teamsArr,
    method: 'GET',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    teamAction: allteamsObj.teamAction,
    teamSelectName: allteamsObj.selectName,
    driverSelectName: allDriversObj.selectName,
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    // +++ mixin data  +++
    routeName: 'team',
    teamData: teamData
  })
}
