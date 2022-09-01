const utils = require('../utils')
const cache = require('../cache')
const { urls } = require('../constants')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeam } = require('../clients/team.client')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')
const { exit } = require('browser-sync')

module.exports = {
  buildDriverCard,
  renderDriverCard,
  renderDriverPage,
  renderAllDriversPage,
  makeAllDriversObjs,
}
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
async function renderAllDriversPage(ctx) {
  try {
    const driverNamesArr = await fetchDrivers()
    // loop over names and get each driver
    const driversDataArr = await Promise.all(
      driverNamesArr.map(async (driver) => {
        return await fetchDriver(driver.name_slug)
      })
    )
    return await ctx.render('allDrivers', {
      driversDataArr,
      ENV: utils.ENV,
      cardSize: ctx?.query?.size === 'mini' ? 'mini' : 'full',
      urls,
      toggleState: ctx?.query?.size === 'mini' ? false : true,
    })
  } catch (e) {
    console.error('Error in renderAllDriversPage', e)
    // TODO add prod errors on page DEV only
    ctx.response.body = `Error in renderAllDriversPage: ${e}`
  }
}
// collects data and builds obj used for making driver card
async function buildDriverCard(name_slug) {
  try {
    const driverData = await fetchDriver(name_slug)
    const teamData = await fetchTeam(driverData.team_id)
    return {
      ...driverData,
      teamUrl: `/demo/?demo-team=${driverData.team_name_slug}`,
      logo_url: teamData.main_logo_url,
    }
  } catch (e) {
    console.error('Error in buildDriverCard', e)
  }
}
// build card only
async function renderDriverCard(ctx) {
  try {
    const driverCard = await buildDriverCard(ctx.params.name_slug)
    return await ctx.render('driverPage', {
      driverData: driverCard,
      noNav: true,
    })
  } catch (e) {
    console.error('Error in renderDriverCard', e)
  }
}
// build card and show on page with nav header - same as renderDriverCard w/o showCardOnly
async function renderDriverPage(ctx) {
  try {
    const driverCard = await buildDriverCard(ctx.params.name_slug)
    return await ctx.render('driverPage', {
      driverData: driverCard,
      noNav: true ? ctx.query.noNav === 'true' : false,
    })
  } catch (e) {
    console.error('Error in renderDriverPage', e)
  }
}
