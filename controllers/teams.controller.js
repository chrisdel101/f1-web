const utils = require('../utils')

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.request.body.team
  // console.log('team', teamName)
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  await ctx.render('team', {
    title: ctx.title,
    teamData: teamData,
    capitalize: utils.capitalize,
    separator: utils.addSeparator
  })
}
module.exports = {
  fetchTeam: fetchTeam
}
