const utils = require('../utils')
const json = require('../test.json')

async function fetchDriver(ctx, next) {
  let driverName = driverHyphenName(ctx.request.body.selectDriver)
  const drivers = JSON.parse(await utils.fetchData('drivers'))
  const driverData = JSON.parse(await utils.fetchData(`drivers/${driverName}`))
  await ctx.render('driver', {
    urls: ctx.urls,
    title: ctx.title,
    capitalize: utils.capitalize,
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
// make into format for image string
function driverHyphenName(name) {
  name = name.replace(',', ' ')
  let names = name.split(' ')
  return `${names[0]}-${names[1]}`.toLowerCase()
}
module.exports = {
  fetchDriver: fetchDriver
}
