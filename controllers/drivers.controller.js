const utils = require('../utils')
const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')

module.exports = {
  createDriverDemoCard,
  fetchDriver,
  fetchDrivers,
  compileDriverTemplateResObj,
  fetchDriverAPI,
  fetchDriversAPI,
  renderDriverTemplate,
  renderDriverCard,
  renderAllDriversList,
  makeAllDriversObjs,
}
//TODO
//get array post
// send post to webhook - recieved
// close webhook send post with sender_ID to add to res obj
//ask user next question on msgr
function compileDriverTemplateResObj(
  ctx,
  driversObj,
  teamsObj,
  driverData,
  teamData
) {
  // call team endpoint
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.main_logo_url
  // console.log('driverData', driverData)
  return {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    title: ctx.title,
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamEnums: teamsObj.teamsArr,
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    // +++ mixin data  +++
    routeName: 'driver',
    driverData: driverData,
    teamData: teamData,
    allData: { ...driverData, ...teamData },
  }
}
// fetchs the driver info from the api to use in render func
async function fetchDriverAPI(ctx, render, driverSlug = undefined) {
  try {
    // get the input params diff depending on type
    if (render === 'page') {
      // get query params from GET req
      driverSlug = ctx.query.driver
    } else if (render === 'card') {
      driverSlug = ctx.params.driver_slug
    }
    // TODO - add to error message page
    if (!driverSlug) {
      throw new ReferenceError('fetchDriverAPI must have driver_slug')
    }
    // query driver by slug
    const driverData = JSON.parse(
      await utils.fetchEndpoint(`drivers/${driverSlug}`)
    )
    console.log('SLUG', driverSlug)
    if (!driverData) {
      // happens if DB offline
      console.error(
        'fetchDriverAPI: No Drivers found. Incorrect slug or DB is empty'
      )
      return
    }
    // look up drivers team by id
    let teamData = JSON.parse(
      await utils.fetchEndpoint(`teams/${driverData.team_id}`)
    )
    // if id fails try slug
    if (!teamData) {
      teamData = JSON.parse(
        await utils.fetchEndpoint(`teams/${driverData.team_name_slug}`)
      )
      // if slug fails return undefined
      if (!teamData) {
        // happens if team table empty API
        console.error(
          'fetchDriverAPI: no Teams found. Incorrect slug/id or DB is empty'
        )
        return
      }
    }

    return {
      driverData,
      teamData,
    }
  } catch (e) {
    console.error('An error in driverController.fetchDriverAPI()', e)
  }
}
// fetchs the driver info from the api to use in render func
async function fetchDriversAPI() {
  try {
    const driversObj = await cacheController.handleDriversCache(cache, 1440)
    const teamsObj = await cacheController.handleTeamsCache(cache, 1440)
    return {
      driversObj,
      teamsObj,
    }
  } catch (e) {
    console.error('An error in driverController.fetchDriversAPI()', e)
  }
}
// takes slug, calls API and combines props
async function makeAllDriversObjs(ctx, driverSlug, size = 'full') {
  try {
    // add size to options for css class styles
    if (ctx.query.size === 'mini') {
      size = 'mini'
    }
    const { driverData } = await module.exports.fetchDriverAPI(
      ctx,
      null,
      driverSlug
    )
    const options = {
      driver_name: driverData.driver_name,
      flag_img_url: driverData.flag_img_url,
      main_image: driverData.main_image,
      name_slug: driverData.name_slug,
      size,
      sender_ID: ctx.query.id,
    }
    return options
  } catch (e) {
    console.error('Error in makeAllDriversObjs', e)
  }
}
// calls all drivers, fetchs makeAllDriversObjs, and renders tmplt
async function renderAllDriversList(ctx) {
  try {
    // must have module.exports to work in tests
    const { driversObj } = await module.exports.fetchDriversAPI()
    console.log('FETCH', driversObj)
    // allDriversObj contain partial info for allDriversPage
    const allDriverObjs = async () => {
      const promises = driversObj.driversArr.map(async (driver) => {
        return await module.exports.makeAllDriversObjs(ctx, driver.name_slug)
      })
      return Promise.all(promises)
    }
    const driversArr = await allDriverObjs()
    // needs to have key name to work in template
    const driversArrObj = {
      driversArr,
      size: driversArr[0].size,
      sender_ID: driversArr.sender_ID,
    }
    return await ctx.render('allDrivers', driversArrObj)
  } catch (e) {
    console.error('Error in renderAllDriversList', e)
  }
}
function createDriverDemoCard(ctx, driverData, teamData) {
  return {
    ...driverData,
    teamUrl: `/demo/team?demo-team=${driverData.team_name_slug}`,
    logo_url: teamData.main_logo_url,
  }
}
async function renderDriverCard(ctx) {
  const driverData = fetchDriver()
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.main_logo_url
  // console.log('Driver Data', driverData)
  return await ctx.render('driverPage', {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    addClass: 'driver-card-page',
    routeName: 'driverCard',
    driverData: driverData,
    teamData: teamData,
  })
}
// use driver api data to render full template
async function renderDriverTemplate(ctx) {
  console.log('XXX', ctx.title)
  if (!ctx.query['demo-driver']) {
    return (ctx.body = 'No Driver Query')
  }
  const driverData = await fetchDriver(ctx.query['demo-driver'])
  const driversArr = await fetchDrivers()
  const teamData = await fetchTeam(driverData.team_id)
  const teamsNames = await fetchTeams()
  console.log('driversArr', driversArr)
  // console.log('driversObj', driversObj)
  if (!driverData || !teamData || !driversArr?.length || !teamsNames?.length) {
    throw new ReferenceError('renderDriverTemplate data is missing')
  }
  // call team endpoint
  const teamUrl = `/team/${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.main_logo_url

  let options = {
    //  +++ index params +++
    urls: ctx.urls,
    method: 'GET',
    title: ctx.title,
    driverAction: '/driver',
    teamAction: '/team',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverSelectName: 'driver',
    driverEnums: driversArr,
    teamSelectName: 'team',
    teamEnums: teamsNames,
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    // +++ mixin data  +++
    routeName: 'driver',
    driverData: driverData,
    teamData: teamData,
    allData: { ...driverData, ...teamData },
  }
  console.log('options', options)
  return await ctx.render('driverPage', options)
}
