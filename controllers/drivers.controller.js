const utils = require('../utils')

async function fetchDriver(ctx, next) {
  const driverSlug = JSON.parse(await ctx.request.body.selectDriver).name_slug
  const drivers = JSON.parse(await utils.fetchData('drivers'))
  const driverData = JSON.parse(await utils.fetchData(`drivers/${driverSlug}`))
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
    separator: utils.addSeparator,
    routeName: 'driver',
    enums: drivers,
    method: 'GET',
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
