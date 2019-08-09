const utils = require('../utils')
const cache = require('../cache')
const indexController = require('./index.controller')

async function fetchDriver(ctx, next) {
  const driverSlug = await ctx.query.driver
  // console.log('q', ctx.query.driver)
  console.log('DRIVER', cache)
  // console.log('driv', `drivers/${ctx.query.driver}`)
  const driverData = JSON.parse(
    await utils.fetchData(`drivers/${ctx.query.driver}`)
  )
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'driver',
    driverEnums: drivers,
    teamEnums: teams,
    method: 'GET',
    action: '/driver',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    selectName: 'driver',
    driverData: driverData
  })
}
module.exports = {
  fetchDriver: fetchDriver
}
