const main = require('./main.controller')
console.log('d', main)
// const driversController = require('./drivers.controller')
const cache = require('../cache')
const utils = require('../utils')

// gets driver data and caches it
async function handleTeamsCache(cache, expiryTime, manualFetch = false) {
  try {
    if (!manualFetch) {
      // if drivers not in cache - add it
      if (!cache.hasOwnProperty('teams')) {
        const teamsArr = JSON.parse(await utils.fetchData('teams'))
        console.log('handleTeamsCache() - NOT FROM CACHE')
        cache['teams'] = {
          teamsArr: teamsArr,
          timestamp: new Date().getTime()
        }
        return this.addDataToTeamsObj(cache['teams'])
        // if drivers exists but timestamp, older than 24 hours, fails - add it
      } else if (
        cache.hasOwnProperty('teams') &&
        !utils.verifyTimeStamp(cache['teams'].timestamp, expiryTime)
      ) {
        const teamsArr = JSON.parse(await utils.fetchData('teams'))
        console.log('handleDriversCache() - NOT FROM CACHE')
        cache['teams'] = {
          teamsArr: teamsArr,
          timeStamp: new Date().getTime()
        }
        return this.addDataToTeamsObj(cache['teams'])
        // if drivers exists but timestamp pass - use cache
      } else if (
        cache.hasOwnProperty('teams') &&
        utils.verifyTimeStamp(cache['teams'].timestamp, expiryTime)
      ) {
        // if less than 24 hours old - time stamp passes-  get from cache
        console.log('handleTeamsCache() - FROM CACHE')
        return this.addDataToTeamsObj(cache['teams'])
      }
    } else if (manualFetch) {
      console.log('manual fetch')
    }
  } catch (e) {
    console.log('A error in handleTeamsCache', e)
  }
}
// add relevant data for form submission to the driver reponse obj
function addDataToTeamsObj(teamsObj) {
  try {
    teamsObj.teamText = 'Choose a Team'
    teamsObj.selectName = 'driver'
    teamsObj.teamAction = '/driver'
    return teamsObj
  } catch (e) {
    console.error('An error in addDataToTeamsObj', e)
  }
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
    console.log('CTX', driversController)
    // get query params from GET req
    let teamSlug
    if (render === 'page') {
      teamSlug = ctx.query.team
    } else if (render === 'card') {
      teamSlug = ctx.params.team_slug
    }
    // pass form data from cache to template
    const driversObj = driversController.handleDriversCache(cache, 1440)
    const teamsObj = module.exports.handleTeamsCache(cache, 1440)
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
module.exports = {
  addDataToTeamsObj,
  renderTeamTemplate,
  renderTeamCard,
  fetchTeamAPI,
  combineDriverDataOnTeam,
  handleTeamsCache
}
