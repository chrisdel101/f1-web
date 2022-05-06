const utils = require('../utils')
const cache = require('../cache')
const cacheController = require('./cache.controller')
const { fetchDriver, fetchDrivers } = require('../clients/driver.client')
const { fetchTeams, fetchTeam } = require('../clients/team.client')
const { catchErrors } = require('../errorHandlers')
const { errorHandler } = require('../utilities/errorManager')

module.exports = {
  makeDriverCard,
  renderDriverCard,
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
      cardSize: ctx.query === 'mini' ? 'mini' : 'full',
    })
  } catch (e) {
    console.error('Error in renderAllDriversPage', e)
  }
}
// function createDriverDemoCard(ctx, driverData, teamData) {
//   return {
//     ...driverData,
//     teamUrl: `/demo/team?demo-team=${driverData.team_name_slug}`,
//     logo_url: teamData.main_logo_url,
//   }
// }
async function makeDriverCard(name_slug) {
  try {
    const driverData = await fetchDriver(name_slug)
    const teamData = await fetchTeam(driverData.team_id)
    // catchErrors(errorHandler.makeDriverCardError(driverData, teamData))
    return {
      ...driverData,
      teamUrl: `/demo/?demo-team=${driverData.team_name_slug}`,
      logo_url: teamData.main_logo_url,
    }
  } catch (e) {
    console.error('Error in makeDriverCard', e)
  }
}
async function renderDriverCard(ctx) {
  console.log('CTX params', ctx.params)
  try {
    // catchErrors(errorHandler.renderDriverCardError('hello'))
    const driverData = await makeDriverCard(ctx.params.name_slug)
    console.log('Driver Data', driverData)
    return await ctx.render('driverPage', {
      driverData,
    })
  } catch (e) {
    console.error('Error in renderDriverCard', e)
  }
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
