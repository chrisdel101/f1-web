const cacheController = require('./cache.controller')
const cache = require('../cache')
const utils = require('../utils')
module.exports = {
  renderTeamTemplate,
  renderTeamCard,
  fetchTeamAPI,
  fetchTeamsAPI,
  combineDriverDataOnTeam,
  compileTeamTemplateResObj
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
// fetch single teams dataObj
async function fetchTeamAPI(ctx, render) {
  try {
    // get query params from GET req
    let teamSlug
    if (render === 'page') {
      teamSlug = ctx.query.team
    } else if (render === 'card') {
      teamSlug = ctx.params.team_slug
    }
    if (!teamSlug) {
      throw new ReferenceError('fetchTeamAPI must have teamSlug')
    }
    // query team by slug
    const teamData = JSON.parse(await utils.fetchData(`teams/${teamSlug}`))
    return {
      teamData
    }
  } catch (e) {
    console.error('Error in fetchTeamAPI', e)
  }
}
// fetchs the driver info from the api to use in render func
async function fetchTeamsAPI() {
  try {
    const teamsObj = await cacheController.handleTeamsCache(cache, 1440)
    return {
      teamsObj
    }
  } catch (e) {
    console.error('An error in driverController.fetchDriversAPI()', e)
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
async function compileTeamTemplateResObj(ctx, driversObj, teamsObj, teamData) {
  let teamName = ctx.query.team
  // add driver data to team obj
  teamData = await combineDriverDataOnTeam(teamData)
  // console.log(teamsObj)
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
    teamData: teamData
  }
}
async function renderTeamTemplate(ctx) {
  // console.log(ctx)
  const { teamData, driversObj, teamsObj } = await module.exports.fetchTeamAPI(
    ctx,
    'page'
  )

  if (!teamData) {
    throw new ReferenceError('renderDriverTemplate.teamData() is undefined')
  } else if (!driversObj) {
    throw new ReferenceError('renderDriverTemplate.driversObj() is undefined')
  } else if (!teamsObj) {
    throw new ReferenceError('renderDriverTemplate.teamsObj() is undefined')
  }
  // resolve inner promises given by fetchDriverAPI()
  return await Promise.resolve(teamsObj).then(teamsObj => {
    // console.log('teams Obj', teamsObj)
    return Promise.resolve(driversObj).then(driversObj => {
      return Promise.resolve(
        module.exports.compileTeamTemplateResObj(
          ctx,
          driversObj,
          teamsObj,
          teamData
        )
      ).then(options => {
        return ctx.render('teamPage', options)
      })
    })
  })
}
