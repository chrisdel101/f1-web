const utils = require('../utils')

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.request.body.selectTeam
  // capitalize
  teamName = utils.capitalize(teamName)
  teamName = utils.teamShortener(teamName)
  teamName = utils.addSeparator(teamName, '-', ' ')
  const teamsData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  // console.log(teamsData)
  return teamsData
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
