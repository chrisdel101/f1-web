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
async function fetchDriverAPI(ctx, render) {
  // get query params from GET req
  let driverSlug
  if (render === 'page') {
    driverSlug = ctx.query.driver
  } else if (render === 'card') {
    driverSlug = ctx.params.driver_slug
  }
  // console.log('Q', driverSlug)
  // pass form data from cache to template
  const formData = await handleFormData()
  // set data to vars
  const driversObj = formData.drivers
  const teamsObj = formData.teams
  // query driver by slug
  const driverData = JSON.parse(await utils.fetchData(`drivers/${driverSlug}`))
  // look up drivers team by id
  const teamData = JSON.parse(
    await utils.fetchData(`teams/${driverData.team_id}`)
  )
  return {
    driverData,
    teamData,
    driversObj,
    teamsObj
  }
}
async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.query.team
  const formData = await handleFormData()
  // list of drivers
  const driversObj = formData.drivers
  // list of teams
  const teamsObj = formData.teams
  let teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  teamData = await combineDriverDataOnTeam(teamData)
  console.log('Team Data', teamData)

  // console.log('flags', driverFlags)
  await ctx.render('team', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'team',
    driverEnums: driversObj.driversArr,
    teamEnums: teamsObj.teamsArr,
    method: 'GET',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    teamAction: teamsObj.teamAction,
    teamSelectName: teamsObj.selectName,
    driverAction: driversObj.driverAction,
    driverSelectName: driversObj.selectName,
    teamData: teamData
  })
}
module.exports = {
  fetchTeam,
  combineDriverDataOnTeam
}
