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
