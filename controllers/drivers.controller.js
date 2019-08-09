const utils = require('../utils')
const cache = require('../cache')

async function fetchDriver(ctx, next) {
  const driverSlug = await ctx.request.body
  console.log('DRIVER', cache)
  // console.log('driv', driverSlug)
  const drivers = JSON.parse(await utils.fetchData('drivers'))
  const driverData = JSON.parse(
    await utils.fetchData(`drivers/${driverSlug.driver}`)
  )
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'driver',
    enums: drivers,
    method: 'POST',
    action: '/driver',
    enctype: 'application/x-www-form-urlencoded',
    buttonField: 'Submit',
    buttonType: 'submit',
    buttonValue: 'submit',
    selectName: 'selectDriver',
    driverData: driverData
  })
}
module.exports = {
  fetchDriver: fetchDriver
}
