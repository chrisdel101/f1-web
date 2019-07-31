const utils = require('../utils')

async function fetchDriver(ctx, next) {
  let driverName = utils.hyphenate(ctx.request.body.selectDriver)
  const drivers = JSON.parse(await utils.fetchData('drivers'))
  const driverData = JSON.parse(await utils.fetchData(`drivers/${driverName}`))
  console.log(driverData)
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
