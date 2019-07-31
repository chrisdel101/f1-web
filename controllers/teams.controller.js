const utils = require('../utils')

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.request.body.selectTeam
  // capitalize
  teamName = utils.capitalize(teamName)
  teamName = utils.teamShortener(teamName)
  teamName = utils.addSeparator(teamName, '-', ' ')
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  // console.log(teamsData)
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
