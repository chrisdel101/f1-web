const utils = require('../utils')
const cache = require('../cache')
const {
  urls,
  cardTypes,
  cardLayouts,
  cardSizes,
  pageTypes,
  cardFormats,
} = require('../constants')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeam } = require('../clients/team.client')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')
const debug = require('debug')
const log = debug('app:log')
const error = debug('app:error')

module.exports = {
  buildDriverCard,
  renderDriverCard,
  renderDriverPage,
  renderAllDriversPage,
  makeAllDriversObjs,
}
function setDefaultQueryParams(ctx) {
  return {
    // add layout margin when showing card
    prettyPage: ctx.query?.prettyPage === 'false' ? false : true,
    format: ctx.query?.format || cardFormats.WEB,
    cardSize: ctx.query?.size || cardSizes.FULL,
    layout: ctx.query['layout'] || cardLayouts.STATS,
    pageType: pageTypes?.DRIVER,
    noNav: true ? ctx.query?.noNav === 'true' : false,
    noToggle: true ? ctx.query?.noToggle === 'true' : false,
  }
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
    error('Error in makeAllDriversObjs', e)
  }
}
async function renderAllDriversPage(ctx) {
  try {
    const { cardSize, noNav, noToggle } =
    setDefaultQueryParams(ctx)

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
      cardSize: cardSize,
      urls,
      toggleSwitchState: cardSize === cardSizes.MINI ? false : true,
      noNav:noNav
    })
  } catch (e) {
    error('Error in renderAllDriversPage', e)
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
    error('Error in buildDriverCard', e)
  }
}
// build card only - no nav, no toggle switch
// called dir with /api
async function renderDriverCard(ctx) {
  try {
    const driverCard = await buildDriverCard(ctx.params.name_slug)
    return await ctx.render('driverPage', {
      driverData: driverCard,
      noNav: true,
      noToggle: true,
      cardSize: ctx?.query?.size === 'mini' ? 'mini' : 'full',
    })
  } catch (e) {
    error('Error in renderDriverCard', e)
  }
}
// build card and show on page with nav header - same as renderDriverCard w/o showCardOnly
async function renderDriverPage(ctx) {
  const { cardSize, noNav, noToggle, pageType, layout, format, prettyPage } =
    setDefaultQueryParams(ctx)
  try {
    const driverCard = await buildDriverCard(ctx.params.name_slug)
    return await ctx.render('driverPage', {
      driverData: driverCard,
      urls: urls,
      ENV: utils.ENV,
      toggleSwitchState: ctx?.state?.hideDemo,
      toggleNextEndpoint: utils.toggleNextEndpointDriver,
      toggleHideNav: utils.toggleHideNav,
      ctx: ctx,
      noNav: noNav,
      noToggle: noToggle,
      pageType: pageType,
      layout: layout,
      cardSize: cardSize,
      format: format,
      prettyPage: prettyPage
    })
  } catch (e) {
    error('Error in renderDriverPage', e)
  }
}
