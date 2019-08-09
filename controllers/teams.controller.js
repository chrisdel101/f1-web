const utils = require('../utils')

async function fetchTeam(ctx, next) {
  // get data from form
  let teamName = ctx.query.team
  const teamData = JSON.parse(await utils.fetchData(`teams/${teamName}`))
  // console.log('team', teamName)
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
