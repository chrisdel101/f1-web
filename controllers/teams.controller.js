const utils = require('../utils')
const cache = require('../cache')
const indexController = require('./index.controller')

// check cache in indexController for data before calling db
async function handleFormData() {
  const drivers = await indexController.handleDrivers()
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
  console.log('CTX', ctx)
  // get query params from GET req
  let teamSlug
  if (render === 'page') {
    teamSlug = ctx.query.team
  } else if (render === 'card') {
    teamSlug = ctx.params.team_slug
  }
  // pass form data from cache to template
  const formData = await handleFormData()
  // set data to vars
  const allDriversObj = formData.drivers
  const allteamsObj = formData.teams
  // console.log(allDriversObj)
  // console.log(allteamsObj)
  // look up team by slug
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamSlug}`))
  // console.log({ driverData, teamData, allDriversObj, allteamsObj })
  return {
    teamData,
    allDriversObj,
    allteamsObj
  }
}
// use driver api data to rendercard only
async function renderTeamCard(ctx) {
  const { teamData, allDriversObj, allteamsObj } = await fetchDriverAPI(
    ctx,
    'card'
  )
  const teamUrl = `/team?team=${teamData.team_name_slug}`
  // add link to team to driver
  teamData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.logo_url
  // console.log('Driver Data', driverData)
  return await ctx.render('teamPage', {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    routeName: 'driverCard',
    driverData: driverData,
    teamData: teamData
  })
}
async function renderTeamTemplate(ctx, next) {
  // get data from form
  let teamName = ctx.query.team
  const formData = await handleFormData()
  // list of drivers
  const allDriversObj = formData.drivers
  // list of teams
  const allteamsObj = formData.teams
  let teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  teamData = await combineDriverDataOnTeam(teamData)
  console.log('Team Data', allteamsObj)

  await ctx.render('teamPage', {
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
    // +++ ---- +++
    routeName: 'team',
    teamData: teamData
  })
}
module.exports = {
  renderTeamTemplate,
  renderTeamCard,
  fetchTeamAPI,
  combineDriverDataOnTeam
}
