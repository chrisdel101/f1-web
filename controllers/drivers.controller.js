const utils = require('../utils')
const cache = require('../cache')
const urls = require('../urls')
const indexController = require('./index.controller')
const teamsController = require('./teams.controller')

function compileTemplateResObj(
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
// gets driver data and caches it
// takes a cache - acceess driversObj which has driversArr inside
async function handleDriversCache(cache, expiryTime, manualFetch = false) {
  try {
    if (!manualFetch) {
      // if drivers not in cache - add it and new timestamp
      if (!cache.hasOwnProperty('drivers')) {
        const fetchedDriversArr = JSON.parse(await utils.fetchData('drivers'))
        console.log('handleDriversCache() - NOT FROM CACHE 1')
        cache['drivers'] = {
          driversArr: fetchedDriversArr,
          timestamp: new Date().getTime()
        }
        return addDataToDriversObj(cache['drivers'])
        // if drivers exists but timestamp, older than 24 hours, fails - add it and new timestamp
      } else if (
        cache.hasOwnProperty('drivers') &&
        !utils.verifyTimeStamp(cache['drivers'].timestamp, expiryTime)
      ) {
        const fetchedDriversArr = JSON.parse(await utils.fetchData('drivers'))
        console.log('handleDriversCache() - NOT FROM CACHE 2')
        cache['drivers'] = {
          driversArr: fetchedDriversArr,
          timeStamp: new Date().getTime()
        }
        return addDataToDriversObj(cache['drivers'])
        // if drivers exists but timestamp pass - use cache
      } else if (
        cache.hasOwnProperty('drivers') &&
        utils.verifyTimeStamp(cache['drivers'].timestamp, expiryTime)
      ) {
        // if less than 24 hours old - time stamp passes-  get from cache
        console.log('handleDriversCache() - FROM CACHE')
        return addDataToDriversObj(cache['drivers'])
      }
    } else if (manualFetch) {
      console.log('manual fetch')
    }
  } catch (e) {
    console.log('A error in handleDriversCache', e)
  }
}
// add relevant data for form submission to the driver reponse obj
function addDataToDriversObj(driversObj) {
  try {
    driversObj.driverText = 'Choose a Driver'
    driversObj.selectName = 'driver'
    driversObj.driverAction = '/driver'
    return driversObj
  } catch (e) {
    console.error('An error in addDataToDriversObj', e)
  }
}
// check cache in indexController for data before calling db
async function handleCacheData() {
  const drivers = await indexController.handleDriversCache()
  const teams = await indexController.handleTeams()
  return {
    drivers,
    teams
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
    // console.log('Q', driverSlug)
    // pass form data from cache to template
    // const formData = await handleCacheData()
    // set data to vars
    const driversObj = module.exports.handleDriversCache(cache, 1440)
    const teamsObj = teamsController.handleTeamsCache(cache, 1440)
    // if slug exist - only on card
    if (driverSlug) {
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
        teamData,
        driversObj,
        teamsObj
      }
    } else {
      return {
        driversObj,
        teamsObj
      }
    }
    // console.log('dd', teamData)
  } catch (e) {
    console.error('An error in driverController.fetchDriverAPI()', e)
  }
}
// async function openMobileCard(ctx) {
//   return renderDriverCard(ctx)
// }
async function renderAllDriversList(ctx) {
  try {
    const { driversObj } = await fetchDriverAPI(ctx, null)
    console.log(driversObj)
    return await ctx.render('allDrivers', driversObj)
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
  const {
    driverData,
    teamData,
    driversObj,
    teamsObj
  } = await module.exports.fetchDriverAPI(ctx, 'page')
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
  return await Promise.resolve(driversObj).then(driversObj => {
    return Promise.resolve(teamsObj).then(teamsObj => {
      const options = module.exports.compileTemplateResObj(
        ctx,
        driversObj,
        teamsObj,
        driverData,
        teamData
      )
      return ctx.render('driverPage', options)
    })
  })
}
module.exports = {
  compileTemplateResObj,
  fetchDriverAPI,
  addDataToDriversObj,
  renderDriverTemplate,
  renderDriverCard,
  handleDriversCache,
  renderAllDriversList
}
