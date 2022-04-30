const utils = require('../utils')
require('dotenv').config(
  '/Users/chrisdielschnieder/desktop/code_work/formula1/f1Web/.env'
)

async function fetchTeam(teamSlug) {
  return JSON.parse(await utils.fetchEndpoint(`teams/${teamSlug}`))
}

async function fetchTeams() {
  return JSON.parse(await utils.fetchEndpoint('teams'))
}

module.exports = {
  fetchTeam,
  fetchTeams,
}
