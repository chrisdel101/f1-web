const utils = require('../utils')
const cache = require('../cache')
const driversController = require('./drivers.controller')
const teamsController = require('./teams.controller')
module.exports = {
  renderDemo,
  renderIndex,
  cache,
  freshFetch
}

async function renderIndex(ctx, next) {
  await ctx.render('index', {
    subTitle: ctx.subTitle
  })
}
async function renderDemo(ctx, next) {
  try {
    const teamsObj = await teamsController.handleTeamsCache(cache, 1440)
    // console.log('ALL TEAMOBJ on index render', teamsObj)
    const driversObj = await driversController.handleDriversCache(cache, 1440)
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
  } catch (e) {
    console.error('An error in renderDemo', e)
  }
}
// fetch from DB manually - skip cache
async function freshFetch() {
  console.log('reset')
  try {
    await module.exports.driversController.handleDriversCache(true)
    await module.exports.teamsController.handleTeamsCache(true)
    console.log('freshFetch')
  } catch (e) {
    console.log('error in freshFetch', e)
  }
}

// // gets driver data and caches it
// async function handleDriversCache(driversCache, route, manualFetch = false) {
//   try {
//     // if not manual fetch get from cache
//     if (!manualFetch) {
//       if (driversCache[route]) {
//         if (utils.verifyTimeStamp(timeStamp, 864000)) {
//           console.log('driversC', driversCache)
//         }
//       }
//       const driversArr = await utils.getData(cache, 'drivers')
//       // console.log('ARR here', driversArr)
//       console.log('from cache')
//       cache.drivers = driversArr
//       return {
//         formText: 'Choose a Driver',
//         driversArr: driversArr,
//         selectName: 'driver',
//         driverAction: '/driver'
//       }
//       // else get from DB
//     } else {
//       const driversArr = await utils.getData(null, 'drivers')
//       // console.log('DB', driversArr)
//       // add to cache
//       cache.teams = driversArr
//       // console.log('CA', driversArr)
//       return {
//         formText: 'Choose a Driver',
//         driversArr: driversArr,
//         selectName: 'driver',
//         driverAction: '/driver'
//       }
//     }
//   } catch (e) {
//     console.log('A error in handleDriversCache', e)
//   }
// }
// // / gets driver data and caches it
// async function handleTeamsCache(manualFetch = false) {
//   try {
//     if (!manualFetch) {
//       // extract just the names
//       const teamsArr = await utils.getData(cache, 'teams')
//       // add to cache
//       cache.teams = teamsArr
//       // console.log('CA', teamsArr)
//       return {
//         formText: 'Choose a Team',
//         teamsArr: teamsArr,
//         selectName: 'team',
//         teamAction: '/team'
//       }
//     } else {
//       const teamsArr = await utils.getData(null, 'teams')
//       console.log('not from cache')
//       // add to cache
//       cache.teams = teamsArr
//       // console.log('CA', teamsArr)
//       return {
//         formText: 'Choose a Team',
//         teamsArr: teamsArr,
//         selectName: 'team',
//         teamAction: '/team'
//       }
//     }
//   } catch (e) {
//     console.log('A error in handleTeamsCache', e)
//   }
// }
