const utils = require('../utils')
const cache = require('../cache')
const cacheController = require('./cache.controller')
// const teamsController = require('./teams.controller')

// const teamsController = require('./teams.controller')
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
    const teamsObj = await cacheController.handleTeamsCache(cache, 1440)
    // console.log('ALL TEAMOBJ on index render', teamsObj)
    const driversObj = await cacheController.handleDriversCache(cache, 1440)
    // console.log('ALL DRIVEROBJ on index render', driversObj)
    await ctx.render('demo', {
      title: ctx.title,
      method: 'GET',
      driverAction: driversObj.driverAction,
      teamAction: teamsObj.teamAction,
      buttonField: 'Submit',
      buttonType: 'submit',
      buttonValue: 'submit',
      driverFormText: ctx.driverText,
      teamText: ctx.teamText,
      driverText: driversObj.driverText,
      teamText: teamsObj.teamText,
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
    await module.exports.cacheController.handleDriversCache(true)
    await module.exports.cacheController.handleTeamsCache(true)
    console.log('freshFetch')
  } catch (e) {
    console.log('error in freshFetch', e)
  }
}
