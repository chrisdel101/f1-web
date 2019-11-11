const utils = require('../utils')
const cache = require('../cache')
const urls = require('../urls')
const cacheController = require('./cache.controller')
// console.log(mainController)

module.exports = {
  compileDriverTemplateResObj,
  fetchDriverAPI,
  fetchDriversAPI,
  renderDriverTemplate,
  renderDriverCard,
  renderAllDriversList
}
function compileDriverTemplateResObj(
  ctx,
  driversObj,
  teamsObj,
  driverData,
  teamData
) {
  // call team endpoint
  // console.log(driversObj)
  const teamUrl = `/team?team=${driverData.team_name_slug}`
  // add link to team to driver
  driverData['teamUrl'] = teamUrl
  driverData['logo_url'] = teamData.logo_url

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
    allData: { ...driverData, ...teamData }
  }
}

// fetchs the driver info from the api to use in render func
async function fetchDriverAPI(ctx, render) {
  try {
    // get query params from GET req
    let driverSlug
    // get the input params diff depending on type
    if (render === 'page') {
      driverSlug = ctx.query.driver
    } else if (render === 'card') {
      driverSlug = ctx.params.driver_slug
    }
    if (!driverSlug) {
      throw new ReferenceError('fetchDriverAPI must have driver_slug')
    }
    // query driver by slug
    const driverData = JSON.parse(
      await utils.fetchData(`drivers/${driverSlug}`)
    )
    // look up drivers team by id
    // console.log('dd', `teams/${driverData.team_id}`)
    const teamData = JSON.parse(
      await utils.fetchData(`teams/${driverData.team_id}`)
    )
    return {
      driverData,
      teamData
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
      teamsObj
    }
  } catch (e) {
    console.error('An error in driverController.fetchDriversAPI()', e)
  }
}

async function renderAllDriversList(ctx) {
  try {
    // must have module.exports to work in tests
    const driversObj = await module.exports.fetchDriversAPI()
    return ctx.render('allDrivers', driversObj)
  } catch (e) {
    console.error('Error in renderAllDriversList', e)
  }
}
// use driver api data to rendercard only
async function renderDriverCard(ctx) {
  try {
    const urlParts = ctx.path.split('/')
    const { driverData, teamData, driversObj, teamsObj } = await fetchDriverAPI(
      ctx,
      'card'
    )

    const teamUrl = `/team?team=${driverData.team_name_slug}`
    // add link to team to driver
    driverData['teamUrl'] = teamUrl
    driverData['logo_url'] = teamData.logo_url
    console.log('Driver Data', driverData)
    return await ctx.render('driverPage', {
      //  +++ index params +++
      urls: ctx.urls,
      method: 'GET',
      addClass: 'driver-card-page',
      routeName: 'driverCard',
      driverData: driverData,
      teamData: teamData
    })
  } catch (e) {
    console.error('An error in renderDriverCard', e)
  }
}
// use driver api data to render full template
async function renderDriverTemplate(ctx) {
  // console.log(ctx)
  const { driverData, teamData } = await module.exports.fetchDriverAPI(
    ctx,
    'page'
  )
  const { driversObj, teamsObj } = await module.exports.fetchDriversAPI()
  // console.log(driverData)
  if (!driverData) {
    throw new ReferenceError('renderDriverTemplate.driverData() is undefined')
  } else if (!teamData) {
    throw new ReferenceError('renderDriverTemplate.teamData() is undefined')
  } else if (!driversObj) {
    throw new ReferenceError('renderDriverTemplate.driversObj() is undefined')
  } else if (!teamsObj) {
    throw new ReferenceError('renderDriverTemplate.teamsObj() is undefined')
  } // console.log(driverData)
  // resolve inner promises given by fetchDriverAPI()
  // return await Promise.resolve(driversObj).then(driversObj => {
  //   return Promise.resolve(teamsObj).then(teamsObj => {
  //     const options = module.exports.compileDriverTemplateResObj(
  //       ctx,
  //       driversObj,
  //       teamsObj,
  //       driverData,
  //       teamData
  //     )
  // driversObj = await Promise.resolve(driversObj)
  // console.log(driversObj)
  // return
  // teamsObj = await Promise.resolve(teamsObj)
  // console.log(teamsObj)
  // console.log(driversObj)
  // console.log(teamsObj)
  const options = module.exports.compileDriverTemplateResObj(
    ctx,
    driversObj,
    teamsObj,
    driverData,
    teamData
  )
  return await ctx.render('driverPage', options)
  // })
  // })
}
