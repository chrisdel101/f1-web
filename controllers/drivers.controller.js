const utils = require('../utils')
const cache = require('../cache')
const { urls } = require('../constants')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeam } = require('../clients/team.client')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')

module.exports = {
  makeDriverCard,
  renderDriverCard,
  renderDriverCardPage,
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
      cardSize: ctx?.query?.size === 'mini' ? 'mini' : 'full',
      urls,
      locals: ctx.state,
      toggleState: ctx?.query?.size === 'mini' ? false : true,
    })
  } catch (e) {
    console.error('Error in renderAllDriversPage', e)
    // TODO add prod errors on page DEV only
    ctx.response.body = `Error in renderAllDriversPage: ${e}`
  }
}
async function makeDriverCard(name_slug) {
  try {
    const driverData = await fetchDriver(name_slug)
    const teamData = await fetchTeam(driverData.team_id)
    return {
      ...driverData,
      teamUrl: `/demo/?demo-team=${driverData.team_name_slug}`,
      logo_url: teamData.main_logo_url,
    }
  } catch (e) {
    console.error('Error in makeDriverCard', e)
  }
}
// renders just the card html for sending
async function renderDriverCard(ctx) {
  try {
    const driverCard = await makeDriverCard(ctx.params.name_slug)
    console.log('renderDriverCard func', driverCard)
    return await ctx.render('driverCard', {
      driverData: driverCard,
    })
  } catch (e) {
    console.error('Error in renderDriverCard', e)
  }
}
async function renderDriverCardPage(ctx) {
  try {
    const driverCard = await makeDriverCard(ctx.params.name_slug)
    // console.log('renderDriverCard func', driverCard)
    return await ctx.render('driverPage', {
      driverData: driverCard,
    })
  } catch (e) {
    console.error('Error in renderDriverCard', e)
  }
}
