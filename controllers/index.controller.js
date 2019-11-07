const utils = require('../utils')
const cache = require('../cache')
module.exports = {
  renderDemo,
  renderIndex,
  cache,
  handleDriversCache,
  handleTeamsCache,
  freshFetch
}
async function renderIndex(ctx, next) {
  const teamsObj = await handleTeamsCache()
  // console.log('ALL TEAMOBJ on index render', teamsObj)
  const driversObj = await handleDriversCache()
  // console.log('ALL DRIVEROBJ on index render', driversObj)

  await ctx.render('index', {
    title: ctx.title,
    subTitle: ctx.subTitle,
    description: `Subscribe to Formula 1 cards and we'll automatically send you updates of your favorite teams and drivers every race weekend.`,
    method: 'GET',
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamEnums: teamsObj.teamsArr
  })
}
async function renderDemo(ctx, next) {
  const teamsObj = await handleTeamsCache()
  // console.log('ALL TEAMOBJ on index render', teamsObj)
  const driversObj = await handleDriversCache()
  // console.log('ALL DRIVEROBJ on index render', driversObj)
  await ctx.render('demo', {
    title: ctx.title,
    method: 'GET',
    driverAction: driversObj.driverAction,
    teamAction: teamsObj.teamAction,
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    driverFormText: ctx.driverFormText,
    teamFormText: ctx.teamFormText,
    driverSelectName: driversObj.selectName,
    driverEnums: driversObj.driversArr,
    teamSelectName: teamsObj.selectName,
    teamEnums: teamsObj.teamsArr
  })
}
// gets driver data and caches it
async function handleDriversCache(driversCache, route, manualFetch = false) {
  try {
    // if not manual fetch get from cache
    if (!manualFetch) {
      if (driversCache[route]) {
        if (utils.verifyTimeStamp(timeStamp, 864000)) {
          console.log('driversC', driversCache)
        }
      }
      const driversArr = await utils.getData(cache, 'drivers')
      // console.log('ARR here', driversArr)
      console.log('from cache')
      cache.drivers = driversArr
      return {
        formText: 'Choose a Driver',
        driversArr: driversArr,
        selectName: 'driver',
        driverAction: '/driver'
      }
      // else get from DB
    } else {
      const driversArr = await utils.getData(null, 'drivers')
      // console.log('DB', driversArr)
      // add to cache
      cache.teams = driversArr
      // console.log('CA', driversArr)
      return {
        formText: 'Choose a Driver',
        driversArr: driversArr,
        selectName: 'driver',
        driverAction: '/driver'
      }
    }
  } catch (e) {
    console.log('A error in handleDriversCache', e)
  }
}
// / gets driver data and caches it
async function handleTeamsCache(manualFetch = false) {
  try {
    if (!manualFetch) {
      // extract just the names
      const teamsArr = await utils.getData(cache, 'teams')
      // add to cache
      cache.teams = teamsArr
      // console.log('CA', teamsArr)
      return {
        formText: 'Choose a Team',
        teamsArr: teamsArr,
        selectName: 'team',
        teamAction: '/team'
      }
    } else {
      const teamsArr = await utils.getData(null, 'teams')
      console.log('not from cache')
      // add to cache
      cache.teams = teamsArr
      // console.log('CA', teamsArr)
      return {
        formText: 'Choose a Team',
        teamsArr: teamsArr,
        selectName: 'team',
        teamAction: '/team'
      }
    }
  } catch (e) {
    console.log('A error in handleTeamsCache', e)
  }
}
// fetch from DB manually - skip cache
async function freshFetch() {
  console.log('reset')
  try {
    await module.exports.handleDriversCache(true)
    await module.exports.handleTeamsCache(true)
    console.log('freshFetch')
  } catch (e) {
    console.log('error in freshFetch', e)
  }
}
