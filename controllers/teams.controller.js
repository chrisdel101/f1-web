const utils = require('../utils')

async function fetchTeam(ctx, next) {
  let driverName = ctx.request.body.selectTeam
  console.log(driverName)
  const drivers = JSON.parse(await utils.fetchData('teams'))
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
  fetchTeam: fetchTeam
}
